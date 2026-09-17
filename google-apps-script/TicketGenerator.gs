const TICKETS_SHEET = "Tickets";

const TICKET_FOLDER_ID =
  "12OsVQUrAuNzHbqvzjGDnDVzCMLMPNLaL";

const TICKET_HEADERS = [
  "ticketId",
  "orderId",
  "customerName",
  "email",
  "ticketType",
  "qrToken",
  "pdfFileId",
  "status",
];


/**
 * ============================================
 * GENERATE ALL TICKETS FOR ONE ORDER
 * ============================================
 *
 * One order creates:
 *
 * - One Ticket row per individual ticket
 * - One QR code per individual ticket
 * - One PDF file for the entire order
 * - One PDF page per individual ticket
 *
 * Example:
 *
 * 10 paid + 2 free
 * = 12 Ticket rows
 * = 12 QR codes
 * = 1 PDF
 * = 12 pages
 */
function generateTicketsForOrder(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const order = getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus !== "VERIFIED") {
    throw new Error(
      "Payment must be verified before generating tickets."
    );
  }

  if (order.ticketStatus === "GENERATED") {
    throw new Error(
      "Tickets have already been generated for this order."
    );
  }

  const quantity = Number(order.quantity);

  if (!quantity || quantity < 1) {
    throw new Error(
      "This order does not contain any tickets."
    );
  }

  const customerName =
    `${order.firstName} ${order.lastName}`.trim();

  /*
   * Prevent two admins from accidentally generating
   * the same order simultaneously.
   */
  const lock = LockService.getScriptLock();

  lock.waitLock(30000);

  try {
    /*
     * Check again after obtaining the lock.
     */
    const freshOrder = getOrderById(orderId);

    if (!freshOrder) {
      throw new Error("Order not found.");
    }

    if (freshOrder.ticketStatus === "GENERATED") {
      throw new Error(
        "Tickets have already been generated for this order."
      );
    }

    /*
     * ============================================
     * STEP 1
     * Generate all individual ticket IDs first.
     * ============================================
     */

    const tickets = [];

    for (let i = 1; i <= quantity; i++) {
      const ticketId = generateTicketId();

      tickets.push({
        ticketId: ticketId,

        orderId: orderId,

        customerName: customerName,

        email: freshOrder.email,

        ticketType: freshOrder.ticketType,

        ticketNumber: i,

        totalTickets: quantity,

        /*
         * QR currently contains the Ticket ID itself.
         */
        qrToken: ticketId,
      });
    }


    /*
     * ============================================
     * STEP 2
     * Generate ONE multi-page PDF.
     * ============================================
     */

    const pdfFileId =
      generateOrderTicketPdf({
        orderId: orderId,
        customerName: customerName,
        email: freshOrder.email,
        ticketType: freshOrder.ticketType,
        tickets: tickets,
      });


    /*
     * ============================================
     * STEP 3
     * Save individual tickets to Tickets sheet.
     *
     * All tickets reference the SAME PDF.
     * ============================================
     */

    const ticketSheet = getTicketsSheet();

    const ticketRows = tickets.map(function(ticket) {
      return [
        ticket.ticketId,
        ticket.orderId,
        ticket.customerName,
        ticket.email,
        ticket.ticketType,
        ticket.qrToken,
        pdfFileId,
        "GENERATED",
      ];
    });

    /*
     * Write all rows in one operation instead
     * of appendRow() inside a loop.
     */
    if (ticketRows.length > 0) {
      ticketSheet
        .getRange(
          ticketSheet.getLastRow() + 1,
          1,
          ticketRows.length,
          TICKET_HEADERS.length
        )
        .setValues(ticketRows);
    }


    /*
     * ============================================
     * STEP 4
     * Mark order as GENERATED.
     *
     * ticketStatus = column M = 13
     * ============================================
     */

    const ordersSheet = getOrdersSheet();

    ordersSheet
      .getRange(freshOrder.rowNumber, 13)
      .setValue("GENERATED");


    /*
     * ============================================
     * RESPONSE
     * ============================================
     */

    return jsonResponse({
      success: true,

      message:
        `${tickets.length} ticket(s) generated successfully in one PDF.`,

      orderId: orderId,

      pdfFileId: pdfFileId,

      totalTickets: tickets.length,

      generatedTickets:
        tickets.map(function(ticket) {
          return {
            ticketId: ticket.ticketId,
            pdfFileId: pdfFileId,
          };
        }),
    });

  } finally {
    lock.releaseLock();
  }
}


/**
 * ============================================
 * GENERATE ONE PDF FOR AN ENTIRE ORDER
 * ============================================
 *
 * Each ticket receives its own page.
 */
function generateOrderTicketPdf(order) {
  const folder =
    DriveApp.getFolderById(TICKET_FOLDER_ID);


  /*
   * ============================================
   * CREATE TEMPORARY GOOGLE DOC
   * ============================================
   */

  const document = DocumentApp.create(
    `${order.orderId}_TICKETS_TEMP`
  );

  const body = document.getBody();

  body.clear();


  /*
   * ============================================
   * PAGE SETUP
   * ============================================
   */

  body.setMarginTop(28);
  body.setMarginBottom(28);
  body.setMarginLeft(36);
  body.setMarginRight(36);


  /*
   * ============================================
   * CREATE EACH TICKET PAGE
   * ============================================
   */

  order.tickets.forEach(
    function(ticket, index) {

      appendTicketPage(
        body,
        ticket
      );


      /*
       * Add page break except after final ticket.
       */
      if (
        index <
        order.tickets.length - 1
      ) {
        body.appendPageBreak();
      }
    }
  );


  /*
   * ============================================
   * SAVE GOOGLE DOC
   * ============================================
   */

  document.saveAndClose();


  /*
   * ============================================
   * CONVERT TO PDF
   * ============================================
   */

  const tempFile =
    DriveApp.getFileById(
      document.getId()
    );


  /*
   * Clean filename.
   *
   * Example:
   *
   * PS001-20260917-ABC123_Tickets.pdf
   */
  const pdfName =
    `${order.orderId}_Tickets.pdf`;


  const pdfBlob =
    tempFile
      .getAs(MimeType.PDF)
      .setName(pdfName);


  /*
   * ============================================
   * SAVE PDF TO TICKET FOLDER
   * ============================================
   */

  const pdfFile =
    folder.createFile(pdfBlob);


  /*
   * Delete temporary Google Doc.
   */
  tempFile.setTrashed(true);


  return pdfFile.getId();
}


/**
 * ============================================
 * BUILD ONE INDIVIDUAL TICKET PAGE
 * ============================================
 */
function appendTicketPage(body, ticket) {

  /*
   * ============================================
   * HEADER
   * ============================================
   */

  const presenter =
    body.appendParagraph(
      "ROCK*WELL PH PRESENTS:"
    );

  presenter.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  presenter
    .editAsText()
    .setBold(true)
    .setFontSize(8)
    .setForegroundColor("#DC2626");


  /*
   * PUBLIC SECRET 001
   */
  const eventTitle =
    body.appendParagraph(
      "PUBLIC SECRET 001"
    );

  eventTitle.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  eventTitle
    .editAsText()
    .setBold(true)
    .setFontSize(26)
    .setForegroundColor("#111111");


  /*
   * ADMISSION TICKET
   */
  const admission =
    body.appendParagraph(
      "ADMISSION TICKET"
    );

  admission.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  admission
    .editAsText()
    .setBold(true)
    .setFontSize(9)
    .setForegroundColor("#666666");


  body.appendParagraph("");

  body.appendHorizontalRule();

  body.appendParagraph("");


  /*
   * ============================================
   * TICKET HOLDER
   * ============================================
   */

  const holderParagraph =
    body.appendParagraph("");

  holderParagraph
    .appendText("TICKET HOLDER: ")
    .setBold(true)
    .setFontSize(8)
    .setForegroundColor("#777777");

  holderParagraph
    .appendText(
      ticket.customerName.toUpperCase()
    )
    .setBold(true)
    .setFontSize(16)
    .setForegroundColor("#000000");


  body.appendParagraph("");


  /*
   * ============================================
   * TICKET TYPE + NUMBER
   * ============================================
   */

  const infoTable =
    body.appendTable([
      [
        "TICKET TYPE",
        "TICKET",
      ],
      [
        ticket.ticketType.toUpperCase(),
        `${ticket.ticketNumber} / ${ticket.totalTickets}`,
      ],
    ]);


  infoTable.setBorderWidth(0);


  /*
   * Header styling
   */
  const headerRow =
    infoTable.getRow(0);

  for (
    let i = 0;
    i < headerRow.getNumCells();
    i++
  ) {
    headerRow
      .getCell(i)
      .editAsText()
      .setBold(true)
      .setFontSize(7)
      .setForegroundColor("#888888");
  }


  /*
   * Value styling
   */
  const valueRow =
    infoTable.getRow(1);

  valueRow
    .getCell(0)
    .editAsText()
    .setBold(true)
    .setFontSize(12)
    .setForegroundColor("#DC2626");

  valueRow
    .getCell(1)
    .editAsText()
    .setBold(true)
    .setFontSize(12)
    .setForegroundColor("#111111");


  body.appendParagraph("");

  body.appendHorizontalRule();

  body.appendParagraph("");


  /*
   * ============================================
   * EVENT DATE & TIME
   * ============================================
   */

  const dateLabel =
    body.appendParagraph(
      "DATE & TIME"
    );

  dateLabel
    .editAsText()
    .setBold(true)
    .setFontSize(7)
    .setForegroundColor("#888888");


  const eventDate =
    body.appendParagraph(
      "OCTOBER 15, 2026 9:00PM"
    );

  eventDate
    .editAsText()
    .setBold(true)
    .setFontSize(13)
    .setForegroundColor("#111111");


  body.appendParagraph("");


  /*
   * ============================================
   * VENUE
   * ============================================
   */

  const venueLabel =
    body.appendParagraph(
      "VENUE"
    );

  venueLabel
    .editAsText()
    .setBold(true)
    .setFontSize(7)
    .setForegroundColor("#888888");


  const venue =
  body.appendParagraph(
    "HYDRO SUPERCLUB"
  );

venue
  .editAsText()
  .setBold(true)
  .setFontSize(13)
  .setForegroundColor("#111111");


body.appendParagraph("");


/*
 * ============================================
 * COMPLIMENTARY COCKTAIL
 * ============================================
 */

const cocktailBox =
  body.appendTable([
    ["✦  INCLUDES 1 FREE COCKTAIL"]
  ]);

cocktailBox.setBorderWidth(1);
cocktailBox.setBorderColor("#DC2626");

const cocktailCell =
  cocktailBox
    .getRow(0)
    .getCell(0);

cocktailCell.setBackgroundColor(
  "#FDF2F2"
);

cocktailCell.setPaddingTop(8);
cocktailCell.setPaddingBottom(8);
cocktailCell.setPaddingLeft(12);
cocktailCell.setPaddingRight(12);

cocktailCell
  .editAsText()
  .setBold(true)
  .setFontSize(10)
  .setForegroundColor("#DC2626");


body.appendParagraph("");

body.appendHorizontalRule();

body.appendParagraph("");


  /*
   * ============================================
   * QR CODE
   * ============================================
   *
   * QR contains ONLY:
   *
   * PS001-TKT-xxxxxxxx
   *
   * Scanning it therefore displays the
   * Ticket ID for manual verification.
   */

  const qrBlob =
    generateQrCodeBlob(
      ticket.ticketId
    );


  const qrParagraph =
    body.appendParagraph("");

  qrParagraph.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );


  const qrImage =
    qrParagraph.appendInlineImage(
      qrBlob
    );

  qrImage.setWidth(165);
  qrImage.setHeight(165);


  /*
   * ============================================
   * TICKET ID
   * ============================================
   */

  const ticketIdParagraph =
    body.appendParagraph(
      ticket.ticketId
    );

  ticketIdParagraph.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  ticketIdParagraph
    .editAsText()
    .setBold(true)
    .setFontSize(9)
    .setForegroundColor("#111111");


  /*
   * QR instruction
   */
  const scanText =
    body.appendParagraph(
      "SCAN QR CODE TO VIEW TICKET ID"
    );

  scanText.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  scanText
    .editAsText()
    .setFontSize(7)
    .setForegroundColor("#999999");


  body.appendParagraph("");

  body.appendHorizontalRule();


  /*
   * ============================================
   * FOOTER
   * ============================================
   */

  const orderText =
    body.appendParagraph(
      `ORDER ${ticket.orderId}`
    );

  orderText.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  orderText
    .editAsText()
    .setFontSize(7)
    .setForegroundColor("#999999");


  const footer =
    body.appendParagraph(
      "THIS TICKET IS VALID FOR ONE ENTRY ONLY"
    );

  footer.setAlignment(
    DocumentApp.HorizontalAlignment.CENTER
  );

  footer
    .editAsText()
    .setBold(true)
    .setFontSize(7)
    .setForegroundColor("#DC2626");
}


/**
 * ============================================
 * GET / CREATE TICKETS SHEET
 * ============================================
 */
function getTicketsSheet() {
  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  let sheet =
    spreadsheet.getSheetByName(
      TICKETS_SHEET
    );

  if (!sheet) {
    sheet =
      spreadsheet.insertSheet(
        TICKETS_SHEET
      );
  }


  const existingHeaders =
    sheet
      .getRange(
        1,
        1,
        1,
        TICKET_HEADERS.length
      )
      .getValues()[0];


  const headersMatch =
    TICKET_HEADERS.every(
      function(header, index) {
        return (
          existingHeaders[index] ===
          header
        );
      }
    );


  if (!headersMatch) {
    sheet
      .getRange(
        1,
        1,
        1,
        TICKET_HEADERS.length
      )
      .setValues([
        TICKET_HEADERS
      ]);
  }


  return sheet;
}


/**
 * ============================================
 * GENERATE UNIQUE TICKET ID
 * ============================================
 */
function generateTicketId() {
  const timestamp =
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMddHHmmss"
    );


  const random =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


  return (
    `PS001-TKT-${timestamp}-${random}`
  );
}


/**
 * ============================================
 * GENERATE QR CODE
 * ============================================
 *
 * The QR contains the Ticket ID itself.
 */
function generateQrCodeBlob(ticketId) {

  const qrUrl =
    "https://quickchart.io/qr" +
    "?text=" +
    encodeURIComponent(ticketId) +
    "&size=300" +
    "&margin=2";


  const response =
    UrlFetchApp.fetch(qrUrl);


  if (
    response.getResponseCode() !== 200
  ) {
    throw new Error(
      "Unable to generate QR code."
    );
  }


  return response
    .getBlob()
    .setName(
      `${ticketId}_QR.png`
    );
}

/**
 * ============================================
 * SEND ORDER TICKET VIA EMAIL
 * ============================================
 *
 * Manually triggered by an authenticated admin.
 *
 * - Order must be VERIFIED
 * - Tickets must already be GENERATED
 * - One PDF is attached
 * - Can be called again to resend
 */
function sendTicketEmail(orderId) {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }


  /*
   * ============================================
   * GET ORDER
   * ============================================
   */

  const order =
    getOrderById(orderId);


  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  if (
    order.paymentStatus !== "VERIFIED"
  ) {
    throw new Error(
      "Payment must be verified before sending tickets."
    );
  }


  if (
    order.ticketStatus !== "GENERATED"
  ) {
    throw new Error(
      "Tickets must be generated before sending."
    );
  }


  if (!order.email) {
    throw new Error(
      "Customer email address is missing."
    );
  }


  /*
   * ============================================
   * FIND PDF
   * ============================================
   */

  const pdfFileId =
    getOrderTicketPdfFileId(
      orderId
    );


  if (!pdfFileId) {
    throw new Error(
      "Ticket PDF could not be found."
    );
  }


  const pdfFile =
    DriveApp.getFileById(
      pdfFileId
    );


  /*
   * ============================================
   * EMAIL
   * ============================================
   */

  const customerName =
    `${order.firstName} ${order.lastName}`.trim();


  const subject =
    "Your Public Secret 001 Ticket";


  const plainBody =
`Hi ${customerName},

Your ticket for Public Secret 001 is attached to this email.

EVENT
Public Secret 001

DATE & TIME
October 15, 2026
9:00 PM

VENUE
Hydro Superclub

Your PDF contains all tickets included in your order.

Please present your ticket upon entry.

Each ticket includes 1 free cocktail.

Order ID:
${orderId}

See you at Public Secret 001!

Rock*Well PH`;


  const htmlBody =
    `
    <div style="
      background:#050505;
      color:#ffffff;
      padding:32px;
      font-family:Arial,Helvetica,sans-serif;
    ">

      <div style="
        max-width:600px;
        margin:0 auto;
      ">

        <p style="
          color:#dc2626;
          font-size:11px;
          font-weight:700;
          letter-spacing:3px;
          text-transform:uppercase;
          margin-bottom:24px;
        ">
          ROCK*WELL PH PRESENTS
        </p>


        <h1 style="
          margin:0;
          font-size:36px;
          line-height:1;
          text-transform:uppercase;
        ">
          PUBLIC SECRET 001
        </h1>


        <p style="
          margin-top:8px;
          color:#888888;
          font-size:12px;
          letter-spacing:2px;
          text-transform:uppercase;
        ">
          Admission Ticket
        </p>


        <div style="
          height:1px;
          background:#262626;
          margin:32px 0;
        "></div>


        <p style="
          color:#cccccc;
          font-size:15px;
          line-height:1.7;
        ">
          Hi <strong style="color:#ffffff;">
            ${escapeHtml(customerName)}
          </strong>,
        </p>


        <p style="
          color:#cccccc;
          font-size:15px;
          line-height:1.7;
        ">
          Your ticket for
          <strong style="color:#ffffff;">
            Public Secret 001
          </strong>
          is attached to this email.
        </p>


        <div style="
          border-left:3px solid #dc2626;
          background:#111111;
          padding:20px;
          margin:28px 0;
        ">

          <p style="
            margin:0 0 14px;
            color:#777777;
            font-size:10px;
            font-weight:bold;
            letter-spacing:2px;
          ">
            DATE & TIME
          </p>

          <p style="
            margin:0;
            font-size:16px;
            font-weight:bold;
          ">
            OCTOBER 15, 2026 — 9:00 PM
          </p>


          <p style="
            margin:24px 0 14px;
            color:#777777;
            font-size:10px;
            font-weight:bold;
            letter-spacing:2px;
          ">
            VENUE
          </p>

          <p style="
            margin:0;
            font-size:16px;
            font-weight:bold;
          ">
            HYDRO SUPERCLUB
          </p>

        </div>


        <p style="
          color:#cccccc;
          font-size:14px;
          line-height:1.7;
        ">
          Your attached PDF contains all
          <strong style="color:#ffffff;">
            ${Number(order.quantity)}
            ticket(s)
          </strong>
          included in your order.
        </p>


        <p style="
          color:#dc2626;
          font-size:14px;
          font-weight:bold;
        ">
          Each ticket includes 1 free cocktail.
        </p>


        <p style="
          margin-top:28px;
          color:#888888;
          font-size:12px;
          line-height:1.6;
        ">
          Please present your ticket upon entry.
          Each QR code represents one individual
          admission ticket.
        </p>


        <div style="
          height:1px;
          background:#262626;
          margin:32px 0;
        "></div>


        <p style="
          color:#555555;
          font-size:10px;
          letter-spacing:1px;
        ">
          ORDER ${escapeHtml(orderId)}
        </p>


        <p style="
          margin-top:24px;
          font-size:14px;
          font-weight:bold;
        ">
          See you at Public Secret 001.
        </p>


        <p style="
          color:#888888;
          font-size:12px;
        ">
          Rock*Well PH
        </p>

      </div>

    </div>
    `;


  GmailApp.sendEmail(
    order.email,
    subject,
    plainBody,
    {
      htmlBody: htmlBody,

      attachments: [
        pdfFile.getBlob()
      ],

      name:
        "Public Secret 001",
    }
  );


  /*
   * ============================================
   * UPDATE EMAIL TRACKING
   *
   * P = emailSentAt
   * Q = emailSendCount
   * ============================================
   */

  const ordersSheet =
    getOrdersSheet();


  const currentSendCount =
    Number(
      ordersSheet
        .getRange(
          order.rowNumber,
          17
        )
        .getValue()
    ) || 0;


  const sentAt =
    new Date();


  ordersSheet
    .getRange(
      order.rowNumber,
      16
    )
    .setValue(sentAt);


  ordersSheet
    .getRange(
      order.rowNumber,
      17
    )
    .setValue(
      currentSendCount + 1
    );


  return jsonResponse({
    success: true,

    message:
      currentSendCount > 0
        ? "Ticket email resent successfully."
        : "Ticket email sent successfully.",

    orderId: orderId,

    email: order.email,

    emailSentAt:
      sentAt.toISOString(),

    emailSendCount:
      currentSendCount + 1,
  });
}

/**
 * Find the single PDF belonging to an order.
 *
 * Every ticket row belonging to the same
 * order references the same PDF file.
 */
function getOrderTicketPdfFileId(
  orderId
) {
  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );


  const sheet =
    spreadsheet.getSheetByName(
      TICKETS_SHEET
    );


  if (
    !sheet ||
    sheet.getLastRow() <= 1
  ) {
    return null;
  }


  const rows =
    sheet
      .getRange(
        2,
        1,
        sheet.getLastRow() - 1,
        TICKET_HEADERS.length
      )
      .getValues();


  for (
    let i = 0;
    i < rows.length;
    i++
  ) {
    const rowOrderId =
      rows[i][1];

    const pdfFileId =
      rows[i][6];


    if (
      String(rowOrderId) ===
        String(orderId) &&
      pdfFileId
    ) {
      return pdfFileId;
    }
  }


  return null;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/**
 * ============================================
 * AUTHORIZATION HELPER
 * ============================================
 */
function authorizeTicketGenerator() {
  const doc =
    DocumentApp.create(
      "Public Secret 001 Authorization Test"
    );


  Logger.log(
    doc.getId()
  );


  doc.saveAndClose();


  DriveApp
    .getFileById(
      doc.getId()
    )
    .setTrashed(true);
}

function authorizeTicketEmail() {
  GmailApp.getAliases();
}