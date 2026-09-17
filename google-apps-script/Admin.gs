const EVENT_CAPACITY = 800;


/**
 * Returns dashboard statistics.
 */
function getAdminDashboard() {
  const sheet = getOrdersSheet();

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return jsonResponse({
      success: true,
      dashboard: {
        maxCapacity: EVENT_CAPACITY,
        ticketsLeft: EVENT_CAPACITY,
        paidTickets: 0,
        freeTickets: 0,
        pendingOrders: 0,
        totalTickets: 0,
        totalAmount: 0,
      },
    });
  }

  const rows = sheet
    .getRange(2, 1, lastRow - 1, ORDER_HEADERS.length)
    .getValues();

  let paidTickets = 0;
  let freeTickets = 0;
  let pendingOrders = 0;
  let totalTickets = 0;
  let totalAmount = 0;

  rows.forEach((row) => {
    const order = rowToOrder(row);

    /*
     * Capacity counts every issued/reserved ticket,
     * including promotional free tickets.
     */
    totalTickets += Number(order.quantity) || 0;

    paidTickets += Number(order.paidTickets) || 0;
    freeTickets += Number(order.freeTickets) || 0;
    totalAmount += Number(order.totalAmount) || 0;

    if (order.paymentStatus === "PENDING") {
      pendingOrders++;
    }
  });

  return jsonResponse({
    success: true,

    dashboard: {
      maxCapacity: EVENT_CAPACITY,

      ticketsLeft: Math.max(
        EVENT_CAPACITY - totalTickets,
        0
      ),

      paidTickets,
      freeTickets,
      pendingOrders,
      totalTickets,
      totalAmount,
    },
  });
}


/**
 * Returns all orders.
 *
 * Generated orders also include the PDF file ID
 * from the Tickets sheet.
 */
function getAdminOrders() {
  const sheet = getOrdersSheet();

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return jsonResponse({
      success: true,
      orders: [],
    });
  }

  const rows = sheet
    .getRange(
      2,
      1,
      lastRow - 1,
      ORDER_HEADERS.length
    )
    .getValues();

  /*
   * Map:
   *
   * orderId -> pdfFileId
   *
   * Since every ticket belonging to the same order
   * now uses the same PDF, we only need one file ID
   * per order.
   */
  const ticketPdfMap = getTicketPdfMap();

  const orders = rows
    .map((row) => {
      const order = rowToOrder(row);

      return {
        ...order,

        ticketPdfFileId:
          ticketPdfMap[order.orderId] || "",
      };
    })
    .reverse();

  return jsonResponse({
    success: true,
    orders,
  });
}

/**
 * Returns a map of:
 *
 * orderId -> pdfFileId
 *
 * Example:
 *
 * {
 *   "PS001-ORDER-123": "1AbCdEf...",
 *   "PS001-ORDER-456": "9XyZ..."
 * }
 */
function getTicketPdfMap() {
  const spreadsheet =
    SpreadsheetApp.openById(
      SPREADSHEET_ID
    );

  const ticketSheet =
    spreadsheet.getSheetByName(
      TICKETS_SHEET
    );

  /*
   * Tickets sheet does not exist yet
   * or contains headers only.
   */
  if (
    !ticketSheet ||
    ticketSheet.getLastRow() <= 1
  ) {
    return {};
  }

  const rows = ticketSheet
    .getRange(
      2,
      1,
      ticketSheet.getLastRow() - 1,
      TICKET_HEADERS.length
    )
    .getValues();

  const pdfMap = {};

  rows.forEach((row) => {
    /*
     * Tickets columns:
     *
     * A ticketId
     * B orderId
     * C customerName
     * D email
     * E ticketType
     * F qrToken
     * G pdfFileId
     * H status
     */

    const orderId = row[1];
    const pdfFileId = row[6];

    if (
      orderId &&
      pdfFileId &&
      !pdfMap[orderId]
    ) {
      pdfMap[orderId] =
        pdfFileId;
    }
  });

  return pdfMap;
}


/**
 * Convert sheet row into a clean JS object.
 */
function rowToOrder(row) {
  return {
    orderId: row[0],
    firstName: row[1],
    lastName: row[2],
    email: row[3],
    contactNumber: row[4],
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

    receiptFileId:
      row[11],

    ticketStatus:
      row[12],

    createdAt:
      row[13],

    submissionId:
      row[14],

    emailSentAt:
      row[15] || "",

    emailSendCount:
      Number(row[16]) || 0,
  };
}


/**
 * Verify payment for an order.
 */
function verifyOrder(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const sheet = getOrdersSheet();

  const rowNumber = findOrderRow(orderId);

  if (!rowNumber) {
    throw new Error("Order not found.");
  }

  /*
   * paymentStatus = column K = 11
   */
  sheet
    .getRange(rowNumber, 11)
    .setValue("VERIFIED");

  return jsonResponse({
    success: true,
    message: "Payment verified successfully.",
    orderId,
    paymentStatus: "VERIFIED",
  });
}


/**
 * Find order row by orderId.
 */
function findOrderRow(orderId) {
  const sheet = getOrdersSheet();

  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return null;
  }

  const orderIds = sheet
    .getRange(2, 1, lastRow - 1, 1)
    .getValues()
    .flat();

  const index = orderIds.findIndex(
    (value) => String(value) === String(orderId)
  );

  if (index === -1) {
    return null;
  }

  return index + 2;
}


/**
 * Get a single order.
 */
function getOrderById(orderId) {
  const sheet = getOrdersSheet();

  const rowNumber = findOrderRow(orderId);

  if (!rowNumber) {
    return null;
  }

  const row = sheet
    .getRange(
      rowNumber,
      1,
      1,
      ORDER_HEADERS.length
    )
    .getValues()[0];

  return {
    rowNumber,
    ...rowToOrder(row),
  };
}