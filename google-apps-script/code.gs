const SPREADSHEET_ID = "1zHtyVKbB8AH1rdpYhtk1MY31KukJbZHmxDtHybUH5gY";
const RECEIPTS_FOLDER_ID = "18swBIIM13IZprwerEjv8rc-S4GGDn0og";

const ORDERS_SHEET = "Orders";

const ORDER_HEADERS = [
  "orderId",
  "firstName",
  "lastName",
  "email",
  "contactNumber",
  "ticketType",
  "paidTickets",
  "quantity",
  "freeTickets",
  "totalAmount",
  "paymentStatus",
  "receiptFileId",
  "ticketStatus",
  "createdAt",
  "submissionId",
];

function doGet(e) {
  try {
    const action =
      e &&
      e.parameter &&
      e.parameter.action
        ? e.parameter.action
        : "health";

    const token =
      e &&
      e.parameter &&
      e.parameter.token
        ? e.parameter.token
        : "";


    switch (action) {

      // PUBLIC
      case "health":
        return jsonResponse({
          success: true,
          message:
            "Public Secret 001 API is running.",
        });


      // AUTH
      case "adminSession":
        return adminSession(token);


      // PROTECTED ADMIN
      case "adminDashboard":
        requireAdmin(token);
        return getAdminDashboard();


      case "adminOrders":
        requireAdmin(token);
        return getAdminOrders();


      case "getTicket":
        requireAdmin(token);

        return getTicketForCheckIn(
          e.parameter.ticketId
        );


      default:
        return jsonResponse({
          success: false,
          message: "Unknown action.",
        });
    }

  } catch (error) {
    console.error(error);

    return jsonResponse({
      success: false,
      message:
        error.message || "Request failed.",
    });
  }
}


function doPost(e) {
  try {
    if (
      !e ||
      !e.postData ||
      !e.postData.contents
    ) {
      return jsonResponse({
        success: false,
        message:
          "No request data received.",
      });
    }

    const data =
      JSON.parse(e.postData.contents);

    const action =
      data.action || "createOrder";


    switch (action) {

      // =========================
      // PUBLIC
      // =========================

      case "createOrder":
        return createOrder(data);


      case "adminLogin":
        return adminLogin(
          data.username,
          data.password
        );


      // =========================
      // PROTECTED ADMIN
      // =========================

      case "adminLogout":
        requireAdmin(data.token);

        return adminLogout(
          data.token
        );


      case "verifyOrder":
        requireAdmin(data.token);

        return verifyOrder(
          data.orderId
        );


      case "generateTickets":
        requireAdmin(data.token);

        return generateTicketsForOrder(
          data.orderId
        );


      case "checkInTicket":
        requireAdmin(data.token);

        return checkInTicket(
          data.ticketId
        );


      default:
        return jsonResponse({
          success: false,
          message: "Unknown action.",
        });
    }

  } catch (error) {
    console.error(error);

    return jsonResponse({
      success: false,
      message:
        error.message || "Request failed.",
    });
  }
}

/**
 * Create Order
 */
/**
 * Create Order
 *
 * Uses submissionId + ScriptLock to prevent
 * accidental duplicate orders.
 */
function createOrder(data) {
  validateRequest(data);

  if (!data.submissionId) {
    throw new Error(
      "Submission ID is required."
    );
  }


  /*
   * Only one createOrder request can enter
   * this critical section at a time.
   */
  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);


  try {

    /*
     * ==========================================
     * DUPLICATE CHECK
     * ==========================================
     *
     * If this checkout was already processed,
     * return the existing order instead of
     * creating another row / receipt.
     */

    const existingOrder =
      findOrderBySubmissionId(
        data.submissionId
      );


    if (existingOrder) {
      return jsonResponse({
        success: true,
        duplicate: true,

        message:
          "Order already submitted.",

        order: existingOrder,
      });
    }


    /*
     * ==========================================
     * CALCULATE ORDER
     * ==========================================
     */

    const paidTickets =
      Number(data.quantity);

    const freeTickets =
      Math.floor(
        paidTickets / 5
      );

    const quantity =
      paidTickets +
      freeTickets;

    const totalAmount =
      paidTickets * 555;


    const ticketType =
      paidTickets >= 5
        ? "Bundled"
        : "Standard";


    /*
     * ==========================================
     * CREATE ORDER ID
     * ==========================================
     */

    const orderId =
      generateOrderId();


    /*
     * ==========================================
     * SAVE RECEIPT
     * ==========================================
     *
     * Important:
     *
     * We only upload the receipt AFTER
     * confirming submissionId does not exist.
     */

    const receiptFileId =
      saveReceiptToDrive(
        data.receipt,
        orderId,
        data.firstName,
        data.lastName
      );


    /*
     * ==========================================
     * SAVE ORDER
     * ==========================================
     */

    const sheet =
      getOrdersSheet();


    sheet.appendRow([
      orderId,
      data.firstName,
      data.lastName,
      data.email,
      data.contactNumber,
      ticketType,
      paidTickets,
      quantity,
      freeTickets,
      totalAmount,
      "PENDING",
      receiptFileId,
      "NOT_GENERATED",
      new Date(),

      // Column O
      data.submissionId,
    ]);


    /*
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return jsonResponse({
      success: true,
      duplicate: false,

      message:
        "Order submitted successfully.",

      order: {
        orderId,
        ticketType,
        paidTickets,
        freeTickets,
        quantity,
        totalAmount,
        paymentStatus:
          "PENDING",
        ticketStatus:
          "NOT_GENERATED",
      },
    });


  } finally {

    /*
     * Always release the lock even if
     * something fails.
     */
    lock.releaseLock();
  }
}

/**
 * Find an existing order using its
 * checkout submission ID.
 *
 * submissionId = Orders column O
 */
function findOrderBySubmissionId(
  submissionId
) {
  if (!submissionId) {
    return null;
  }


  const sheet =
    getOrdersSheet();


  const lastRow =
    sheet.getLastRow();


  if (lastRow <= 1) {
    return null;
  }


  /*
   * Column O = 15 = submissionId
   */
  const submissionIds =
    sheet
      .getRange(
        2,
        15,
        lastRow - 1,
        1
      )
      .getValues()
      .flat();


  const index =
    submissionIds.findIndex(
      (value) =>
        String(value) ===
        String(submissionId)
    );


  if (index === -1) {
    return null;
  }


  /*
   * +2 because:
   *
   * index starts at 0
   * row 1 contains headers
   */
  const rowNumber =
    index + 2;


  const row =
    sheet
      .getRange(
        rowNumber,
        1,
        1,
        ORDER_HEADERS.length
      )
      .getValues()[0];


  return {
    orderId: row[0],

    ticketType: row[5],

    paidTickets:
      Number(row[6]) || 0,

    quantity:
      Number(row[7]) || 0,

    freeTickets:
      Number(row[8]) || 0,

    totalAmount:
      Number(row[9]) || 0,

    paymentStatus:
      row[10],

    ticketStatus:
      row[12],
  };
}


/**
 * Validate incoming order data.
 */
function validateRequest(data) {

  if (
    !data.submissionId ||
    typeof data.submissionId !== "string"
  ) {
    throw new Error(
      "Invalid submission ID."
    );
  }
  
  if (!data.firstName) {
    throw new Error("First name is required.");
  }

  if (!data.lastName) {
    throw new Error("Last name is required.");
  }

  if (!data.email) {
    throw new Error("Email is required.");
  }

  if (!data.contactNumber) {
    throw new Error("Contact number is required.");
  }

  if (!data.quantity) {
    throw new Error("Ticket quantity is required.");
  }

  const quantity = Number(data.quantity);

  if (!Number.isInteger(quantity)) {
    throw new Error("Ticket quantity must be a whole number.");
  }

  if (quantity < 1 || quantity > 10) {
    throw new Error("You can purchase between 1 and 10 tickets.");
  }

  if (
    !data.receipt ||
    !data.receipt.base64 ||
    !data.receipt.fileName ||
    !data.receipt.mimeType
  ) {
    throw new Error("Payment receipt is required.");
  }
}


/**
 * Get or create Orders sheet and ensure headers exist.
 */
function getOrdersSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = spreadsheet.getSheetByName(ORDERS_SHEET);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(ORDERS_SHEET);
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, ORDER_HEADERS.length)
    .getValues()[0];

  const headersMatch = ORDER_HEADERS.every(
    (header, index) => existingHeaders[index] === header
  );

  if (!headersMatch) {
    sheet
      .getRange(1, 1, 1, ORDER_HEADERS.length)
      .setValues([ORDER_HEADERS]);
  }

  return sheet;
}


/**
 * Save uploaded receipt to Google Drive.
 */
function saveReceiptToDrive(
  receipt,
  orderId,
  firstName,
  lastName
) {
  const folder = DriveApp.getFolderById(RECEIPTS_FOLDER_ID);

  const bytes = Utilities.base64Decode(receipt.base64);

  const extension = getFileExtension(
    receipt.fileName,
    receipt.mimeType
  );

  const safeFirstName = sanitizeFileName(firstName);
  const safeLastName = sanitizeFileName(lastName);

  const fileName =
    `${orderId}_${safeFirstName}_${safeLastName}_receipt${extension}`;

  const blob = Utilities.newBlob(
    bytes,
    receipt.mimeType,
    fileName
  );

  const file = folder.createFile(blob);

  return file.getId();
}


/**
 * Generate a unique order ID.
 */
function generateOrderId() {
  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyyMMdd-HHmmss"
  );

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `PS001-${timestamp}-${randomPart}`;
}


/**
 * Get file extension.
 */
function getFileExtension(fileName, mimeType) {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot !== -1) {
    return fileName.substring(lastDot);
  }

  const mimeExtensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
  };

  return mimeExtensions[mimeType] || "";
}


/**
 * Make filename safe.
 */
function sanitizeFileName(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 50);
}


/**
 * JSON response.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}