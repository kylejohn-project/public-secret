function getTicketForCheckIn(ticketId) {
  if (!ticketId) throw new Error('Ticket ID is required.');
  const ticket = findTicketById(ticketId);
  return jsonResponse({ success: true, found: !!ticket, ticket: ticket || null });
}

function normalizeCheckInText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function getCheckInTicketRows() {
  const sheet = getTicketsSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  const rows = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  return rows.map((row, index) => ({
    rowNumber: index + 2,
    ticketId: String(row[0] || ''),
    orderId: String(row[1] || ''),
    customerName: String(row[2] || ''),
    email: String(row[3] || ''),
    ticketType: String(row[4] || ''),
    status: String(row[7] || ''),
    checkedInAt: row[8] instanceof Date ? row[8].toISOString() : (row[8] || null),
  }));
}

function searchTicketsForCheckIn(query) {
  const normalized = normalizeCheckInText(query);
  if (normalized.length < 2) throw new Error('Enter at least 2 characters to search.');
  const matching = getCheckInTicketRows().filter(ticket =>
    normalizeCheckInText(ticket.customerName).includes(normalized) ||
    normalizeCheckInText(ticket.ticketId).includes(normalized)
  );
  return jsonResponse({ success: true, tickets: matching.slice(0, 150), totalMatches: matching.length });
}

function checkInTicketsBulk(ticketIds) {
  if (!Array.isArray(ticketIds) || !ticketIds.length) {
    throw new Error('Select at least one ticket.');
  }
  if (ticketIds.length > 100) throw new Error('Maximum 100 tickets per check-in.');
  const ids = ticketIds.map(id => String(id || '').trim().toUpperCase());
  if (ids.some(id => !id) || new Set(ids).size !== ids.length) {
    throw new Error('Ticket IDs must be unique and non-empty.');
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getTicketsSheet();
    const allTickets = getCheckInTicketRows();
    const byId = new Map(allTickets.map(t => [t.ticketId.trim().toUpperCase(), t]));
    const results = [];
    const now = new Date();
    for (const id of ids) {
      const ticket = byId.get(id);
      if (!ticket) {
        results.push({ ticketId: id, success: false, message: 'Ticket not found.' });
      } else if (ticket.status !== 'GENERATED') {
        results.push({ ticketId: id, success: false, message: ticket.status === 'CHECKED_IN' ? 'Already checked in.' : 'Ticket is not valid for check-in.' });
      } else {
        sheet.getRange(ticket.rowNumber, 8, 1, 2).setValues([['CHECKED_IN', now]]);
        results.push({ ticketId: id, success: true, status: 'CHECKED_IN', checkedInAt: now.toISOString() });
      }
    }
    SpreadsheetApp.flush();
    return jsonResponse({ success: true, results, checkedInCount: results.filter(r => r.success).length, failedCount: results.filter(r => !r.success).length });
  } finally {
    lock.releaseLock();
  }
}

function checkInTicket(ticketId) {
  if (!ticketId) throw new Error('Ticket ID is required.');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ticket = findTicketById(ticketId);
    if (!ticket) return jsonResponse({ success: false, message: 'Ticket not found.' });
    if (ticket.status !== 'GENERATED') {
      return jsonResponse({ success: false, message: ticket.status === 'CHECKED_IN' ? 'This ticket has already been checked in.' : 'This ticket is not valid for check-in.', ticket });
    }
    const checkedInAt = new Date();
    getTicketsSheet().getRange(ticket.rowNumber, 8, 1, 2).setValues([['CHECKED_IN', checkedInAt]]);
    SpreadsheetApp.flush();
    return jsonResponse({ success: true, message: 'Ticket checked in successfully.', ticket: { ...ticket, status: 'CHECKED_IN', checkedInAt: checkedInAt.toISOString() } });
  } finally {
    lock.releaseLock();
  }
}

function findTicketById(ticketId) {
  const normalized = String(ticketId || '').trim().toUpperCase();
  return getCheckInTicketRows().find(t => t.ticketId.trim().toUpperCase() === normalized) || null;
}
