function getTicketForCheckIn(ticketId) {
  if (!ticketId) {
    throw new Error(
      "Ticket ID is required."
    );
  }

  const ticket =
    findTicketById(ticketId);

  if (!ticket) {
    return jsonResponse({
      success: true,
      found: false,
    });
  }

  return jsonResponse({
    success: true,
    found: true,
    ticket: ticket,
  });
}


function checkInTicket(ticketId) {
  if (!ticketId) {
    throw new Error(
      "Ticket ID is required."
    );
  }

  const ticket =
    findTicketById(ticketId);

  if (!ticket) {
    return jsonResponse({
      success: false,
      message: "Ticket not found.",
    });
  }

  if (ticket.status === "CHECKED_IN") {
    return jsonResponse({
      success: false,
      message:
        "This ticket has already been checked in.",
      ticket: ticket,
    });
  }

  if (ticket.status !== "GENERATED") {
    return jsonResponse({
      success: false,
      message:
        "This ticket is not valid for check-in.",
    });
  }

  const sheet =
    getTicketsSheet();

  const checkedInAt =
    new Date();

  // H = status
  sheet
    .getRange(ticket.rowNumber, 8)
    .setValue("CHECKED_IN");

  // I = checkedInAt
  sheet
    .getRange(ticket.rowNumber, 9)
    .setValue(checkedInAt);


  return jsonResponse({
    success: true,

    message:
      "Ticket checked in successfully.",

    ticket: {
      ...ticket,
      status: "CHECKED_IN",
      checkedInAt:
        checkedInAt.toISOString(),
    },
  });
}


function findTicketById(ticketId) {
  const sheet =
    getTicketsSheet();

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {
    return null;
  }

  const rows =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        TICKET_HEADERS.length
      )
      .getValues();


  const normalizedTicketId =
    String(ticketId)
      .trim()
      .toUpperCase();


  for (
    let index = 0;
    index < rows.length;
    index++
  ) {
    const row = rows[index];

    if (
      String(row[0])
        .trim()
        .toUpperCase() ===
      normalizedTicketId
    ) {
      return {
        rowNumber: index + 2,

        ticketId: row[0],
        orderId: row[1],
        customerName: row[2],
        email: row[3],
        ticketType: row[4],
        qrToken: row[5],
        pdfFileId: row[6],
        status: row[7],
        checkedInAt: row[8] || null,
      };
    }
  }

  return null;
}