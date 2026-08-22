/* SPORTIVO V65 integrated workflows */
(function () {
  const MAX_PLAYERS = 6;

  function fullName(person) {
    if (!person) return '—';
    return [person.first, person.middle, person.last].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }

  function migrateState() {
    const s = load();
    let changed = false;
    if (!Array.isArray(s.warnings)) { s.warnings = []; changed = true; }
    if (!Array.isArray(s.emergencyCancellationRequests)) { s.emergencyCancellationRequests = []; changed = true; }
    if (!Array.isArray(s.bookingRescheduleRequests)) { s.bookingRescheduleRequests = []; changed = true; }
    if (!Array.isArray(s.courtAvailability)) { s.courtAvailability = []; changed = true; }
    if (!Array.isArray(s.coachAvailability)) { s.coachAvailability = []; changed = true; }
    if (!Array.isArray(s.payments)) { s.payments = []; changed = true; }
    if (!Array.isArray(s.invoices)) { s.invoices = []; changed = true; }

    s.courts.forEach(c => {
      if (c.maxPlayers !== MAX_PLAYERS) { c.maxPlayers = Math.min(Number(c.maxPlayers || MAX_PLAYERS), MAX_PLAYERS); changed = true; }
      if (c.capacity !== c.maxPlayers) { c.capacity = c.maxPlayers; changed = true; }
      if (!c.includedPlayers || c.includedPlayers > c.maxPlayers) { c.includedPlayers = Math.min(4, c.maxPlayers); changed = true; }
      if (!c.operatingHours) { c.operatingHours = { open: '08:00', close: '20:00' }; changed = true; }
    });

    s.bookings.forEach((b, i) => {
      if (!Array.isArray(b.playerNames)) {
        const owner = s.users.find(u => u.id === b.userId);
        const count = Math.min(Number(b.players || 2), MAX_PLAYERS);
        const sample = ['John Mayer', 'Abdul Aman', 'Maya Santos', 'Carlo Reyes', 'Anne Lim'];
        b.playerNames = [{ first: owner?.first || 'Juan', middle: owner?.middle || '', last: owner?.last || 'Cruz', role: 'Booker' }];
        for (let n = 1; n < count; n++) {
          const [first, last] = sample[(i + n - 1) % sample.length].split(' ');
          b.playerNames.push({ first, middle: '', last, role: 'Visitor' });
        }
        b.players = b.playerNames.length; changed = true;
      }
      if (!b.paymentStatus) { b.paymentStatus = 'Unpaid'; changed = true; }
      if (!b.paymentMethod) { b.paymentMethod = 'Walk-in / On-site'; changed = true; }
      if (typeof b.rescheduleCount !== 'number') { b.rescheduleCount = 0; changed = true; }
      if (!b.preInvoiceId) { b.preInvoiceId = 'PRE-' + b.id.replace('BK-', ''); changed = true; }
      if (!b.finalInvoiceId) { b.finalInvoiceId = 'FIN-' + b.id.replace('BK-', ''); changed = true; }
    });
    if (changed) save(s);
  }

  migrateState();

  window.sportivoBellSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>`;

  const oldTraining = window.traineeTraining;
  if (typeof oldTraining === 'function') {
    window.traineeTraining = function (state, user) {
      return oldTraining(state, user).replace(/\+ Enroll to Another Sport/g, '+ Enroll Program');
    };
  }

  function hoursUntil(date, time) {
    const target = new Date(`${date}T${time}:00`);
    return (target - Date.now()) / 36e5;
  }

  function playerNamesHtml(booking) {
    return (booking.playerNames || []).map((p, i) => `
      <div class="player-row">
        <span class="player-index">${i + 1}</span>
        <div><strong>${fullName(p)}</strong><small>${p.role || 'Visitor'}</small></div>
      </div>`).join('');
  }

  function invoiceAmount(state, booking) {
    const court = state.courts.find(c => c.id === booking.court);
    const players = (booking.playerNames || []).length || Number(booking.players || 1);
    const included = Number(court?.includedPlayers || 4);
    const extra = Math.max(0, players - included);
    const base = Number(court?.baseRate || 0);
    const extraFee = Number(court?.additionalPlayerFee || 0);
    return { base, extra, extraFee, total: base + (extra * extraFee) };
  }

  window.bookingsPage = function (state, user) {
    const mine = state.bookings.filter(b => b.userId === user.id);
    const rows = mine.map(b => {
      const court = state.courts.find(c => c.id === b.court);
      const names = (b.playerNames || []).map(p => fullName(p));
      const compact = names.length <= 3 ? names.join('<br>') : `${names.slice(0, 2).join('<br>')}<br><span class="muted small">+${names.length - 2} more</span>`;
      return `<tr>
        <td><b>${b.id}</b></td>
        <td><b>${court?.name || b.court}</b><br><span class="muted small">${court?.sport || '—'}</span></td>
        <td>${fmtDate(b.date)}<br>${time12(b.time)}</td>
        <td>${compact || '—'}</td>
        <td>${statusBadge(b.status)}</td>
        <td>${statusBadge(b.paymentStatus || 'Unpaid')}</td>
        <td><button class="btn btn-light btn-sm" onclick="openBookingDetailsV65('${b.id}')">View Details</button></td>
      </tr>`;
    });
    return head('My Bookings') +
      stats([
        ['Active', mine.filter(b => ['Pending', 'Confirmed', 'In Use'].includes(b.status)).length],
        ['Paid', mine.filter(b => b.paymentStatus === 'Paid').length],
        ['Completed', mine.filter(b => b.status === 'Completed').length]
      ]) + `<br>${table(['Booking', 'Court / Type', 'Appointment', 'Players / Visitors', 'Status', 'Payment', 'Actions'], rows)}`;
  };

  window.openBookingDetailsV65 = function (id) {
    const s = load(), u = currentUser(s), b = s.bookings.find(x => x.id === id && x.userId === u.id); if (!b) return;
    const court = s.courts.find(c => c.id === b.court); const amount = invoiceAmount(s, b); const h = hoursUntil(b.date, b.time);
    const warning = s.warnings.find(w => w.userId === u.id && w.status === 'Active' && (!w.bookingId || w.bookingId === b.id));
    const canManage = ['Confirmed', 'Pending'].includes(b.status);
    const confirmed = b.status === 'Confirmed';
    const finalReady = b.status === 'Completed';
    let actions = '';
    if (b.status === 'Pending') actions = `<button class="btn btn-light" onclick="cancelBookingV65('${b.id}')" style="color: #e5484d; border-color: rgba(229, 72, 77, 0.25); background: #fff;">Cancel Booking</button>`;
    if (confirmed) {
      if (h >= Number(s.settings.cancelHours || 6)) {
        actions += `<button class="btn btn-dark" onclick="requestRescheduleV65('${b.id}')" ${b.rescheduleCount >= 1 ? 'disabled' : ''}>Reschedule Booking</button><button class="btn btn-light" onclick="cancelBookingV65('${b.id}')" style="color: #e5484d; border-color: rgba(229, 72, 77, 0.25); background: #fff;">Cancel Booking</button>`;
      } else {
        actions += `<button class="btn btn-dark" onclick="emergencyCancelV65('${b.id}')">Emergency Cancellation</button>`;
      }
    }
    if (warning && warning.appealStatus !== 'Under Review') actions += `<button class="btn btn-light" onclick="openWarningAppealV65('${warning.id}')" style="color: var(--sportivo-purple); border-color: rgba(149, 140, 232, 0.25); background: #fff;">Apply Appeal</button>`;
    modal(`<div class="booking-detail-modal">
      <div class="section-heading-row"><div><span class="eyebrow">BOOKING DETAILS</span><h3>${b.id}</h3></div>${statusBadge(b.status)}</div>
      <div class="booking-detail-grid">
        <div class="info-row"><span>Sport</span><strong>${court?.sport || '—'}</strong></div>
        <div class="info-row"><span>Court</span><strong>${court?.name || b.court}</strong></div>
        <div class="info-row"><span>Date</span><strong>${fmtDate(b.date)}</strong></div>
        <div class="info-row"><span>Time</span><strong>${time12(b.time)}</strong></div>
        <div class="info-row"><span>Duration</span><strong>${Number(b.duration || 60) / 60} hour(s)</strong></div>
        <div class="info-row"><span>Payment</span><strong>${b.paymentStatus || 'Unpaid'} · Walk-in / On-site</strong></div>
      </div>
      <div class="booking-detail-section"><h4>Players / Visitors</h4><div class="player-list">${playerNamesHtml(b)}</div></div>
      <div class="booking-detail-section"><h4>Invoices</h4><div class="invoice-list">
        <div class="invoice-card"><strong>Pre-Invoice</strong><p class="muted">Estimated charges before court use.</p><b>₱${amount.total.toFixed(2)}</b><button class="btn btn-cream btn-sm full" onclick="showInvoiceV65('${b.id}','pre')">View Pre-Invoice</button></div>
        <div class="invoice-card"><strong>Final Invoice</strong><p class="muted">${finalReady ? 'Final charges after court use.' : 'Available after the booking is completed.'}</p>${finalReady ? `<b>₱${Number(b.finalTotal ?? amount.total).toFixed(2)}</b><button class="btn btn-sage btn-sm full" onclick="showInvoiceV65('${b.id}','final')">View Final Invoice</button>` : `<b>—</b><button class="btn btn-light btn-sm full" disabled>View Final Invoice</button>`}</div>
      </div></div>
      ${warning ? `<div class="booking-detail-section"><h4>Active Warning</h4><div class="notice"><b>${warning.type || 'Account Warning'}</b><br>${warning.reason || ''}</div></div>` : ''}
      ${canManage || warning ? `<div class="booking-detail-section"><h4>Manage Booking</h4><div class="booking-detail-actions">${actions || '<span class="muted">No actions available.</span>'}</div></div>` : ''}
      <br><button class="btn btn-dark full" onclick="closeModal()">Close</button>
    </div>`);
  };

  window.showInvoiceV65 = function (id, type) {
    const s = load(), b = s.bookings.find(x => x.id === id), u = s.users.find(x => x.id === b?.userId); if (!b) return;
    const court = s.courts.find(c => c.id === b.court), a = invoiceAmount(s, b), final = type === 'final';
    modal(`<span class="eyebrow">${final ? 'FINAL' : 'PRE'}-INVOICE</span><h3>${final ? b.finalInvoiceId : b.preInvoiceId}</h3>
      <div class="info-row"><span>Customer</span><strong>${fullName(u)}</strong></div><div class="info-row"><span>Booking</span><strong>${b.id}</strong></div><div class="info-row"><span>Court</span><strong>${court?.name || b.court}</strong></div><div class="info-row"><span>Schedule</span><strong>${fmtDate(b.date)} · ${time12(b.time)}</strong></div>
      <div class="booking-detail-section"><h4>Players / Visitors</h4>${playerNamesHtml(b)}</div>
      <div class="booking-detail-section"><div class="info-row"><span>Base Court Fee</span><strong>₱${a.base.toFixed(2)}</strong></div><div class="info-row"><span>Additional Players</span><strong>${a.extra} × ₱${a.extraFee.toFixed(2)}</strong></div><div class="info-row"><span>${final ? 'Final' : 'Estimated'} Total</span><strong>₱${Number(final ? (b.finalTotal ?? a.total) : a.total).toFixed(2)}</strong></div><div class="info-row"><span>Payment</span><strong>${b.paymentStatus || 'Unpaid'} · Walk-in / On-site</strong></div></div>
      ${final ? '' : '<p class="muted small">This document shows the estimated booking charges. Payment will be collected on-site.</p>'}
      <button class="btn btn-light full" onclick="closeModal()">Close</button>`);
  };

  window.cancelBookingV65 = function (id) {
    const s = load(), u = currentUser(s), b = s.bookings.find(x => x.id === id && x.userId === u.id); if (!b) return;
    if (hoursUntil(b.date, b.time) < Number(s.settings.cancelHours || 6)) { return emergencyCancelV65(id) }
    modal(`<h3>Cancel Booking</h3><p class="muted">${b.id} · ${fmtDate(b.date)} · ${time12(b.time)}</p><form onsubmit="confirmCancelV65(event,'${id}')"><div class="field"><label>Reason *</label><select name="reason" required><option value="">Select reason</option><option>Schedule Conflict</option><option>Personal Reason</option><option>Health Reason</option><option>Transportation Issue</option><option>Other</option></select></div><div class="field"><label>Additional Notes</label><textarea name="notes" rows="3"></textarea></div><div class="notice">Once cancelled, the reserved court and time slot will be released and made available to other users.</div><div class="actions"><button class="btn btn-light" type="button" onclick="closeModal()">Keep Booking</button><button class="btn btn-dark">Confirm Cancellation</button></div></form>`)
  };
  window.confirmCancelV65 = function (e, id) { e.preventDefault(); const s = load(), u = currentUser(s), b = s.bookings.find(x => x.id === id && x.userId === u.id); if (!b) return; const f = new FormData(e.target); b.status = 'Cancelled'; b.cancelReason = f.get('reason'); b.cancelNotes = f.get('notes'); b.cancelledAt = new Date().toISOString(); log(s, fullName(u), `Cancelled booking ${id}`, 'Bookings'); notify(s, u.id, 'Booking Cancelled', `${id} was cancelled. The court slot is now available.`); save(s); closeModal(); toast('Booking cancelled. Court slot released.'); location.reload() };

  window.emergencyCancelV65 = function (id) {
    const s = load(), u = currentUser(s), b = s.bookings.find(x => x.id === id && x.userId === u.id); if (!b) return;
    modal(`<h3>Emergency Cancellation Request</h3><p class="muted">The standard cancellation period has passed. Submit an emergency request for Admin review.</p><form onsubmit="submitEmergencyCancelV65(event,'${id}')"><div class="field"><label>Emergency Reason *</label><select name="reason" required><option value="">Select reason</option><option>Medical Emergency</option><option>Family Emergency</option><option>Accident</option><option>Severe Weather / Travel Emergency</option><option>Unexpected Work / School Emergency</option><option>Other</option></select></div><div class="field"><label>Explanation *</label><textarea name="explanation" rows="4" required></textarea></div><div class="field"><label>Supporting Evidence (optional)</label><input name="evidence" type="file"></div><div class="actions"><button class="btn btn-light" type="button" onclick="closeModal()">Keep Booking</button><button class="btn btn-dark">Submit Emergency Request</button></div></form>`)
  };
  window.submitEmergencyCancelV65 = function (e, id) { e.preventDefault(); const s = load(), u = currentUser(s); if (s.emergencyCancellationRequests.some(r => r.bookingId === id && r.status === 'Pending Review')) return toast('An emergency request is already pending.'); const f = new FormData(e.target); s.emergencyCancellationRequests.unshift({ id: uid('EC'), bookingId: id, userId: u.id, reason: f.get('reason'), explanation: f.get('explanation'), status: 'Pending Review', createdAt: new Date().toISOString() }); notify(s, 'A-1001', 'Emergency Cancellation Request', `${fullName(u)} submitted an emergency cancellation request for ${id}.`); log(s, fullName(u), `Submitted emergency cancellation for ${id}`, 'Bookings'); save(s); closeModal(); toast('Emergency cancellation request submitted for Admin review.') };

  window.requestRescheduleV65 = function (id) {
    const s = load(), u = currentUser(s), b = s.bookings.find(x => x.id === id && x.userId === u.id); if (!b) return; if (b.rescheduleCount >= 1) return toast('This booking has already used its reschedule.'); if (hoursUntil(b.date, b.time) < Number(s.settings.rescheduleHours || 6)) return toast('Reschedule requests must be submitted at least 6 hours before the booking.');
    const courts = s.courts.filter(c => c.status === 'Available').map(c => `<option value="${c.id}">${c.name} · ${c.sport}</option>`).join('');
    modal(`<h3>Reschedule Booking</h3><div class="notice"><b>Current:</b> ${fmtDate(b.date)} · ${time12(b.time)} · ${s.courts.find(c => c.id === b.court)?.name || b.court}</div><form onsubmit="submitBookingRescheduleV65(event,'${id}')"><div class="form-grid-3"><div class="field"><label>New Date *</label><input name="date" type="date" min="${today()}" required></div><div class="field"><label>New Time *</label><input name="time" type="time" required></div><div class="field"><label>New Court *</label><select name="court" required><option value="">Select court</option>${courts}</select></div></div><div class="field"><label>Reason *</label><select name="reason" required><option>Schedule Conflict</option><option>Personal Emergency</option><option>Work / School</option><option>Transportation</option><option>Other</option></select></div><div class="field"><label>Additional Notes</label><textarea name="notes" rows="3"></textarea></div><div class="actions"><button class="btn btn-light" type="button" onclick="closeModal()">Back</button><button class="btn btn-dark">Submit Reschedule Request</button></div></form>`)
  };
  window.submitBookingRescheduleV65 = function (e, id) { e.preventDefault(); const s = load(), u = currentUser(s), b = s.bookings.find(x => x.id === id); const f = new FormData(e.target); if (s.bookingRescheduleRequests.some(r => r.bookingId === id && r.status === 'Pending Admin Review')) return toast('A reschedule request is already pending.'); const err = conflict(s, f.get('court'), f.get('date'), f.get('time'), b.duration, id); if (err) return toast(err); s.bookingRescheduleRequests.unshift({ id: uid('BR'), bookingId: id, userId: u.id, current: { date: b.date, time: b.time, court: b.court }, requested: { date: f.get('date'), time: f.get('time'), court: f.get('court') }, reason: f.get('reason'), notes: f.get('notes'), status: 'Pending Admin Review', createdAt: new Date().toISOString() }); notify(s, 'A-1001', 'Booking Reschedule Request', `${fullName(u)} requested to reschedule ${id}.`); save(s); closeModal(); toast('Reschedule request submitted. Original reservation remains active.') };

  window.openWarningAppealV65 = function (warningId) {
    const s = load(), u = currentUser(s), w = s.warnings.find(x => x.id === warningId && x.userId === u.id && x.status === 'Active'); if (!w) return;
    modal(`<h3>Submit Appeal</h3><div class="notice"><b>${w.type || 'Warning'}</b><br>${w.reason || ''}</div><form onsubmit="submitWarningAppealV65(event,'${warningId}')"><div class="field"><label>Appeal Reason *</label><select name="reason" required><option>Incorrect Warning</option><option>Emergency</option><option>Check-in Issue</option><option>Booking Record Error</option><option>Other</option></select></div><div class="field"><label>Explanation *</label><textarea name="explanation" rows="4" required></textarea></div><div class="field"><label>Supporting Evidence</label><input type="file"></div><button class="btn btn-dark full">Submit Appeal</button></form>`)
  };
  window.submitWarningAppealV65 = function (e, warningId) { e.preventDefault(); const s = load(), u = currentUser(s), w = s.warnings.find(x => x.id === warningId); if (!w) return; const f = new FormData(e.target); s.appeals.unshift({ id: uid('AP'), warningId, bookingId: w.bookingId || '', userId: u.id, reason: f.get('reason'), explanation: f.get('explanation'), date: today(), status: 'For Review' }); w.appealStatus = 'Under Review'; notify(s, 'A-1001', 'New Appeal', `${fullName(u)} submitted an appeal for warning ${warningId}.`); save(s); closeModal(); toast('Appeal submitted for Admin review.') };

  // Professional booking guide markup replaces colored icon-heavy legacy guide.
  window.sportivoBookingGuideV65 = function (s) {
    return `<aside class="card booking-guide-card"><span class="eyebrow">BOOKING GUIDE</span><h3>Before you reserve</h3>
      <div class="booking-policy-item"><div class="booking-policy-number">01</div><div><h4>Admin approval first</h4><p>Your selected slot stays Pending until an Admin confirms the reservation.</p></div></div>
      <div class="booking-policy-item"><div class="booking-policy-number">02</div><div><h4>Cancel ahead of time</h4><p>Cancel at least <b>${s.settings.cancelHours} hours</b> before your appointment. Eligible cancellations are processed immediately and the slot is released.</p></div></div>
      <div class="booking-policy-item"><div class="booking-policy-number">03</div><div><h4>Emergency cancellation</h4><p>If the standard cancellation period has passed, submit an Emergency Cancellation request for Admin review.</p></div></div>
      <div class="booking-policy-item"><div class="booking-policy-number">04</div><div><h4>One reschedule</h4><p>You may request one schedule change at least <b>${s.settings.rescheduleHours} hours</b> before your booking. Admin confirmation is required.</p></div></div>
      <div class="booking-policy-item"><div class="booking-policy-number">05</div><div><h4>Check in on time</h4><p>After <b>${s.settings.graceMinutes} minutes</b> without check-in, the reservation may be marked No-Show.</p></div></div>
      <div class="booking-policy-note">Court availability is finalized only after booking or reschedule confirmation.</div></aside>`;
  };

  // Patch rendered Book a Court page after app's existing renderer without changing its timetable logic.
  const oldBookingPage = window.bookingPage;
  if (typeof oldBookingPage === 'function') {
    window.bookingPage = function (state, user) {
      let html = oldBookingPage(state, user);
      // Replace old policy card if recognizable.
      const guideStart = html.indexOf('<aside class="card booking-guide');
      if (guideStart >= 0) {
        let depth = 0, end = -1; const re = /<\/?aside\b[^>]*>/g; re.lastIndex = guideStart; let m;
        while ((m = re.exec(html))) { if (m[0].startsWith('</')) depth--; else depth++; if (depth === 0) { end = re.lastIndex; break; } }
        if (end > guideStart) html = html.slice(0, guideStart) + sportivoBookingGuideV65(state) + html.slice(end);
      }
      return html;
    };
  }

  // Fill booker/visitor names into legacy booking submission where possible.
  const oldSaveBooking = window.saveBooking;
  if (typeof oldSaveBooking === 'function') {
    window.saveBooking = function () { return oldSaveBooking.apply(this, arguments); };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const bell = document.getElementById('bellButton'); if (bell) bell.innerHTML = window.sportivoBellSvg;
  });
})();

/* Additional V65 portal integrations */
(function () {
  function fullNameV65(p) { return [p?.first, p?.middle, p?.last].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || '—' }

  // Replace Book a Court form while preserving the existing calendar/timetable logic.
  window.bookingPage = function (s, u) {
    const selectedDate = plusDays(1), emergency = emergencyInfo(u), age = calcAge(u.dob);
    return head('Book a Court') + `
      <section class="card booking-user-card"><h3>Booker Information</h3><div class="form-grid-3">
        <div class="field"><label>First Name</label><input value="${u.first || ''}" readonly></div>
        <div class="field"><label>Middle Name</label><input value="${u.middle || ''}" readonly></div>
        <div class="field"><label>Last Name</label><input value="${u.last || ''}" readonly></div>
        <div class="field"><label>Email</label><input value="${u.email || ''}" readonly></div>
        <div class="field"><label>Mobile</label><input value="${u.mobile || ''}" readonly></div>
        <div class="field"><label>Emergency Contact</label><input value="${emergency.name ? `${emergency.name} · ${emergency.mobile || ''}` : 'Not provided'}" readonly></div>
        ${age < 18 ? `<div class="field"><label>Guardian</label><input value="${u.guardian?.name || 'Required guardian information'}" readonly></div>` : ''}
      </div></section>

      <section class="booking-calendar-layout">
        <article class="card mini-calendar-card"><div class="calendar-heading"><div><span class="eyebrow-mini">COURT AVAILABILITY</span><h3 id="bookingMonthLabel"></h3></div><div class="calendar-nav"><button class="icon-btn" id="prevBookingMonth" type="button">‹</button><button class="icon-btn" id="nextBookingMonth" type="button">›</button></div></div><div class="calendar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div id="bookingMiniCalendar" class="mini-calendar"></div><div class="calendar-legends"><span><i class="legend-dot available"></i>Available</span><span><i class="legend-dot busy"></i>Partially Booked</span><span><i class="legend-dot full"></i>Fully Booked</span><span><i class="legend-dot selected"></i>Selected</span></div></article>
        <article class="card availability-summary-card"><span class="eyebrow-mini">SELECTED DAY</span><h3 id="selectedBookingDate">${fmtDate(selectedDate)}</h3><div class="field"><label>Sport / Court Type</label><select id="courtTypeFilter"><option value="">All Sports</option><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select></div><div id="availableTimeSummary">${availableTimeSummary(s, selectedDate, '')}</div></article>
      </section>

      <section class="card timetable-card"><div class="timetable-heading"><div><span class="eyebrow-mini">DAILY TIMETABLE</span><h3>Courts & Time Slots</h3></div><span class="muted small">Click an available slot to fill the booking form.</span></div><div id="timeTable">${timeGrid(s, selectedDate, '')}</div></section>

      <section class="booking-layout">
        <form id="bookingForm" class="card">
          <h3>Appointment Information</h3>
          <div class="form-grid-3">
            <div class="field"><label>Date *</label><input name="date" id="bDate" type="date" min="${today()}" required></div>
            <div class="field"><label>Time *</label><input name="time" id="bTime" type="time" required></div>
            <div class="field"><label>Court *</label><select name="court" id="bCourt" required><option value="">Select a court</option>${s.courts.map(c => `<option value="${c.id}">${c.name} · ${c.sport}</option>`).join('')}</select></div>
          </div>
          <div class="form-grid-3">
            <div class="field"><label>Duration *</label><select name="duration" id="bDuration"><option value="60">1 Hour</option><option value="120">2 Hours</option><option value="180">3 Hours</option></select></div>
            <div class="field"><label>Purpose *</label><select name="purpose"><option>Casual Play</option><option>Practice</option><option>Friendly Match</option><option>Other</option></select></div>
            <div class="field"><label>Players</label><input id="bPlayers" name="players" value="1" type="number" min="1" max="6" readonly></div>
          </div>
          <div class="field" style="margin-top:14px;margin-bottom:14px">
            <label>Player Names (comma-separated)</label>
            <input type="text" id="playerNamesInput" name="playerNamesText" value="${u.first || ''} ${u.last || ''}" placeholder="e.g. ${u.first || ''} ${u.last || ''}, John Mayer">
          </div>
          <div id="bookingPriceSummary" class="booking-price-summary"></div>
          <div class="field"><label>Notes</label><textarea name="notes" placeholder="Optional appointment notes"></textarea></div>
          <button class="btn btn-dark full">Submit Booking Request</button>
        </form>
        ${sportivoBookingGuideV65(s)}
      </section>`;
  };

  const oldBindBookingV65 = window.bindBooking;
  window.bindBooking = function () {
    oldBindBookingV65();
    const playerInput = document.getElementById('playerNamesInput'), num = document.getElementById('bPlayers');
    if (!playerInput) return;
    const sync = () => {
      const val = playerInput.value;
      const names = val.split(',').map(x => x.trim()).filter(Boolean);
      const n = Math.max(1, names.length);
      if (num) num.value = n;
      refreshBookingPrice();
    };
    playerInput.addEventListener('input', sync);
    sync();
  };

  window.submitBooking = function (e) {
    e.preventDefault(); const s = load(), u = currentUser(s), block = canBook(s, u); if (block) return toast(block); const fd = new FormData(e.target), c = s.courts.find(x => x.id === fd.get('court')), duration = Number(fd.get('duration')); if (!c) return toast('Select a court from the timetable.'); const conflictMessage = conflict(s, c.id, fd.get('date'), fd.get('time'), duration); if (conflictMessage) return toast(conflictMessage);
    const val = document.getElementById('playerNamesInput')?.value || '';
    const names = val.split(',').map(x => x.trim()).filter(Boolean);
    if (names.length === 0) {
      names.push(`${u.first} ${u.last}`);
    }
    if (names.length > 6) return toast('Maximum 6 players per booking.');
    const playerNames = names.map((name, i) => {
      const parts = name.split(/\s+/);
      const last = parts.length > 1 ? parts.pop() : '';
      const first = parts.join(' ');
      const isBooker = i === 0 || (first.toLowerCase() === u.first.toLowerCase() && last.toLowerCase() === u.last.toLowerCase());
      return { first, middle: '', last, role: isBooker ? 'Booker' : 'Player' };
    });
    const includedPlayers = Number(c.includedPlayers || 4), baseRate = Number(c.baseRate || 350), additionalPlayerFee = Number(c.additionalPlayerFee || 75), extraPlayers = Math.max(0, playerNames.length - includedPlayers), estimatedAmount = (baseRate * (duration / 60)) + (extraPlayers * additionalPlayerFee);
    const booking = { id: uid('BK'), userId: u.id, court: c.id, date: fd.get('date'), time: fd.get('time'), duration, purpose: fd.get('purpose'), players: playerNames.length, playerNames, includedPlayers, extraPlayers, baseRate, additionalPlayerFee, estimatedAmount, notes: fd.get('notes'), status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: 'Walk-in / On-site', createdAt: new Date().toISOString(), attendanceConfirmed: false, rescheduleCount: 0, checkedIn: false }; booking.preInvoiceId = 'PRE-' + booking.id.replace('BK-', ''); booking.finalInvoiceId = 'FIN-' + booking.id.replace('BK-', ''); s.bookings.push(booking); notify(s, u.id, 'Booking Submitted', `${booking.id} is pending Admin review.`); notify(s, 'A-1001', 'New Court Booking', `${fullNameV65(u)} submitted ${booking.id}.`); log(s, fullNameV65(u), `Submitted ${booking.id}`, 'Bookings'); save(s); toast('Booking request submitted for Admin review.'); go('bookings');
  };

  // Coach: activity log + checklist attendance + visible Add Training Plan button.
  const previousRenderCoach = window.renderCoach;
  window.renderCoach = function (route, state, coach) {
    if (route === 'coach-logs') {
      const mine = state.logs.filter(l => String(l.actor || '').includes(coach.first) || String(l.actor || '') === userName(coach));
      const rows = mine.map(l => `<tr><td>${fmtDate(l.date)}<br><span class="muted small">${l.time || ''}</span></td><td>${l.module}</td><td>${l.action}</td></tr>`);
      return head('Activity Log') + stats([['Recorded Activities', mine.length], ['Today', mine.filter(l => l.date === today()).length], ['Modules', new Set(mine.map(l => l.module)).size]]) + `<br>${table(['Date / Time', 'Module', 'Activity'], rows)}`;
    }
    if (route === 'coach-attendance') {
      const sessions = state.sessions.filter(x => x.coachId === coach.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      const first = sessions[0], group = state.groups.find(g => g.id === first?.groupId), trainees = (group?.trainees || []).map(id => state.users.find(u => u.id === id)).filter(Boolean);
      return head('Attendance') + `<section class="card"><div class="field"><label>Training Session</label><select id="attendanceSessionV65">${sessions.map(x => `<option value="${x.id}">${x.id} · ${fmtDate(x.date)} · ${time12(x.time)} · ${state.groups.find(g => g.id === x.groupId)?.sport || ''}</option>`).join('')}</select></div><div id="attendanceListV65">${attendanceChecklistV65(state, first?.id, coach.id)}</div></section>`;
    }
    let html = previousRenderCoach(route, state, coach);
    if (route === 'coach-plans') {
      html = html.replace(/<\/div>\s*<\/div>/, `</div><button class="btn btn-dark" onclick="openNewTrainingPlanV65()">+ Add Training Plan</button></div>`);
    }
    return html;
  };

  window.attendanceChecklistV65 = function (state, sessionId, coachId) {
    const session = state.sessions.find(s => s.id === sessionId && s.coachId === coachId); if (!session) return '<p class="muted">No training session selected.</p>'; const group = state.groups.find(g => g.id === session.groupId), trainees = (group?.trainees || []).map(id => state.users.find(u => u.id === id)).filter(Boolean);
    return `<div class="notice"><b>${group?.sport || 'Training'} · ${group?.name || ''}</b><br>${fmtDate(session.date)} · ${time12(session.time)} · ${state.courts.find(c => c.id === session.court)?.name || session.court}</div><div class="section-heading-row"><h3>Check Attendance</h3><button class="btn btn-light btn-sm" type="button" onclick="markAllPresentV65()">Mark All Present</button></div><form id="attendanceChecklistFormV65" onsubmit="saveAttendanceChecklistV65(event,'${session.id}')"><div class="player-list">${trainees.map((t, i) => `<div class="player-row"><span class="player-index">${i + 1}</span><div><strong>${fullNameV65(t)}</strong><small>${t.id}</small></div><div><label><input type="checkbox" name="present_${t.id}" checked> Present</label><select name="status_${t.id}"><option>Present</option><option>Late</option><option>Absent</option><option>Excused</option></select><input name="remarks_${t.id}" placeholder="Remark (optional)"></div></div>`).join('') || '<p class="muted">No trainees assigned.</p>'}</div><br><button class="btn btn-dark">Save Attendance</button></form>`;
  };
  window.markAllPresentV65 = function () { document.querySelectorAll('#attendanceChecklistFormV65 input[type=checkbox]').forEach(x => x.checked = true); document.querySelectorAll('#attendanceChecklistFormV65 select').forEach(x => x.value = 'Present') };
  window.saveAttendanceChecklistV65 = function (e, sessionId) { e.preventDefault(); const s = load(), coach = currentUser(s), session = s.sessions.find(x => x.id === sessionId), group = s.groups.find(g => g.id === session?.groupId); (group?.trainees || []).forEach(id => { const status = e.target.elements[`status_${id}`]?.value || 'Present', remarks = e.target.elements[`remarks_${id}`]?.value || ''; let rec = s.attendance.find(a => a.sessionId === sessionId && a.traineeId === id); if (rec) { rec.status = status; rec.remarks = remarks; rec.date = session.date } else s.attendance.push({ id: uid('AT'), traineeId: id, sessionId, date: session.date, status, remarks, recordedBy: coach.id }) }); log(s, fullNameV65(coach), `Recorded attendance for ${sessionId}`, 'Attendance'); save(s); toast('Attendance saved.'); };

  window.openNewTrainingPlanV65 = function () {
    const s = load(), coach = currentUser(s), groups = s.groups.filter(g => g.coachId === coach.id), pairs = []; groups.forEach(g => (g.trainees || []).forEach(tid => pairs.push({ tid, gid: g.id, label: `${fullNameV65(s.users.find(u => u.id === tid))} · ${g.sport} · ${g.name}` }))); if (!pairs.length) return toast('No assigned trainees are available.'); modal(`<h3>Add Training Plan</h3><form onsubmit="saveNewTrainingPlanV65(event)"><div class="field"><label>Trainee / Sport *</label><select name="pair">${pairs.map(p => `<option value="${p.tid}|${p.gid}">${p.label}</option>`).join('')}</select></div><div class="field"><label>Main Objective *</label><input name="goal" required></div><div class="field"><label>Goals & Development Priorities *</label><select name="priority"><option>Technique</option><option>Consistency</option><option>Agility</option><option>Strength</option><option>Endurance</option><option>Tactical Awareness</option><option>Competition Preparation</option><option>Other</option></select></div><div class="field"><label>Session Structure *</label><select name="structure"><option>Fundamentals + Drills + Application</option><option>Technique + Conditioning + Match Play</option><option>Skill Stations + Game Application</option><option>Other</option></select></div><div class="field"><label>Milestones & Evaluation *</label><select name="milestone"><option>Weekly Skill Check</option><option>Mid-cycle Assessment</option><option>End-cycle Assessment</option><option>Other</option></select></div><div class="field"><label>Safety, Equipment & Coach Notes *</label><select name="notes"><option>Standard Equipment and Safety Reminders</option><option>Modified Training Load</option><option>Bring Personal Equipment</option><option>Other</option></select></div><button class="btn btn-dark full">Save Training Plan</button></form>`)
  };
  window.saveNewTrainingPlanV65 = function (e) { e.preventDefault(); const s = load(), coach = currentUser(s), f = new FormData(e.target), [traineeId, groupId] = String(f.get('pair')).split('|'); s.trainingPlans.push({ id: uid('TP'), traineeId, groupId, coachId: coach.id, status: 'Active', phase: 'Skill Development', level: s.groups.find(g => g.id === groupId)?.level || 'Beginner', goal: f.get('goal'), weeklyFocus: f.get('priority'), technicalFocus: f.get('priority'), sessionStructure: f.get('structure'), evaluationCriteria: f.get('milestone'), notes: f.get('notes'), programDuration: '4 weeks', sessionsPerWeek: 2, sessionDuration: '60 minutes', reviewDate: plusDays(28), updatedAt: new Date().toISOString() }); notify(s, traineeId, 'Training Plan Created', `Coach ${fullNameV65(coach)} created a training plan for you.`); log(s, fullNameV65(coach), 'Created training plan', 'Training Plans'); save(s); closeModal(); toast('Training plan saved and reflected in trainee account.') };

  // Bind checklist session switching after shell render.
  const oldBindModule = window.bindModule;
  window.bindModule = function (u, r) { oldBindModule(u, r); if (r === 'coach-attendance') { document.getElementById('attendanceSessionV65')?.addEventListener('change', e => { const s = load(); document.getElementById('attendanceListV65').innerHTML = attendanceChecklistV65(s, e.target.value, u.id) }) } };

  // Admin user management: self-registration only, no + Add User.
  if (typeof window.adminUsersView === 'function') {
    const oldAdminUsers = window.adminUsersView;
    window.adminUsersView = function (state) { return oldAdminUsers(state).replace(/<button class="btn btn-dark" onclick="adminAddUser\(\)">\+ Add User<\/button>/, '') };
  }

  // Court management helper actions added to existing cards.
  window.manageCourtAvailabilityV65 = function (courtId) {
    const s = load(), court = s.courts.find(c => c.id === courtId); if (!court) return; const blocks = s.courtAvailability.filter(b => b.courtId === courtId); modal(`<h3>Manage Availability · ${court.name}</h3><form onsubmit="saveCourtBlockV65(event,'${courtId}')"><div class="form-grid-3"><div class="field"><label>Date *</label><input name="date" type="date" min="${today()}" required></div><div class="field"><label>Start Time *</label><input name="start" type="time" required></div><div class="field"><label>End Time *</label><input name="end" type="time" required></div><div class="field"><label>Status *</label><select name="status"><option>Unavailable</option><option>Maintenance</option><option>Blocked</option><option>Available</option></select></div></div><div class="field"><label>Reason / Notes</label><input name="notes"></div><button class="btn btn-dark">Add Availability Block</button></form><div class="booking-detail-section"><h4>Existing Blocks</h4>${blocks.map(b => `<div class="info-row"><span>${fmtDate(b.date)} · ${time12(b.start)}–${time12(b.end)}</span><strong>${b.status}</strong></div>`).join('') || '<p class="muted">No blocks configured.</p>'}</div>`)
  };
  window.saveCourtBlockV65 = function (e, courtId) { e.preventDefault(); const s = load(), admin = currentUser(s), f = new FormData(e.target); s.courtAvailability.push({ id: uid('CA'), courtId, date: f.get('date'), start: f.get('start'), end: f.get('end'), status: f.get('status'), notes: f.get('notes') }); log(s, fullNameV65(admin), `Updated court availability for ${courtId}`, 'Court Management'); save(s); closeModal(); toast('Court availability updated.') };

  // Extend slotState to honor admin court availability blocks without changing landing/public timetable code.
  const oldSlotState = window.slotState;
  window.slotState = function (s, court, date, time) { const block = (s.courtAvailability || []).find(b => b.courtId === court.id && b.date === date && overlap(time, 60, b.start, Math.max(1, (Number(b.end.slice(0, 2)) * 60 + Number(b.end.slice(3, 5))) - (Number(b.start.slice(0, 2)) * 60 + Number(b.start.slice(3, 5))))) && b.status !== 'Available'); if (block) return { cls: 'maintenance', text: block.status }; return oldSlotState(s, court, date, time) };

  // Admin booking operations: walk-in payment, emergency cancellation and reschedule review.
  window.recordWalkInPaymentV65 = function (id) { const s = load(), b = s.bookings.find(x => x.id === id); if (!b) return; const due = Number(b.estimatedAmount || 0); modal(`<h3>Record Walk-in Payment</h3><div class="info-row"><span>Booking</span><strong>${id}</strong></div><div class="info-row"><span>Amount Due</span><strong>₱${due.toFixed(2)}</strong></div><form onsubmit="saveWalkInPaymentV65(event,'${id}')"><div class="field"><label>Amount Received *</label><input name="amount" type="number" min="0" step="0.01" value="${due}" required></div><div class="field"><label>Date Paid *</label><input name="date" type="date" value="${today()}" required></div><div class="field"><label>Official Receipt / Reference No.</label><input name="receipt"></div><div class="field"><label>Notes</label><textarea name="notes"></textarea></div><button class="btn btn-dark full">Confirm Payment</button></form>`) };
  window.saveWalkInPaymentV65 = function (e, id) { e.preventDefault(); const s = load(), admin = currentUser(s), b = s.bookings.find(x => x.id === id), f = new FormData(e.target), amount = Number(f.get('amount')); b.amountPaid = amount; b.paymentStatus = amount >= Number(b.estimatedAmount || 0) ? 'Paid' : 'Partially Paid'; b.paymentMethod = 'Walk-in / On-site'; b.receiptNo = f.get('receipt'); s.payments.push({ id: uid('PAY'), bookingId: id, amount, date: f.get('date'), receivedBy: admin.id, receiptNo: f.get('receipt'), notes: f.get('notes') }); log(s, fullNameV65(admin), `Recorded walk-in payment for ${id}`, 'Payments'); save(s); closeModal(); toast('Walk-in payment recorded.') };

  window.reviewEmergencyCancellationV65 = function (reqId) { const s = load(), r = s.emergencyCancellationRequests.find(x => x.id === reqId), b = s.bookings.find(x => x.id === r?.bookingId), u = s.users.find(x => x.id === r?.userId); if (!r) return; modal(`<h3>Emergency Cancellation Review</h3><div class="info-row"><span>User</span><strong>${fullNameV65(u)}</strong></div><div class="info-row"><span>Booking</span><strong>${r.bookingId}</strong></div><div class="info-row"><span>Reason</span><strong>${r.reason}</strong></div><p>${r.explanation}</p><div class="field"><label>Admin Remarks *</label><textarea id="emergencyRemarksV65" required></textarea></div><div class="actions"><button class="btn btn-light" onclick="decideEmergencyCancellationV65('${reqId}','Rejected')">Reject</button><button class="btn btn-dark" onclick="decideEmergencyCancellationV65('${reqId}','Approved')">Approve Emergency Cancellation</button></div>`) };
  window.decideEmergencyCancellationV65 = function (reqId, decision) { const remarks = document.getElementById('emergencyRemarksV65')?.value.trim(); if (!remarks) return toast('Admin remarks are required.'); const s = load(), admin = currentUser(s), r = s.emergencyCancellationRequests.find(x => x.id === reqId), b = s.bookings.find(x => x.id === r.bookingId); r.status = decision; r.adminRemarks = remarks; r.decidedAt = new Date().toISOString(); if (decision === 'Approved') { b.status = 'Cancelled'; b.cancellationType = 'Emergency'; } notify(s, r.userId, `Emergency Cancellation ${decision}`, decision === 'Approved' ? `${r.bookingId} has been cancelled and the court slot released.` : `Your emergency cancellation request for ${r.bookingId} was rejected. ${remarks}`); log(s, fullNameV65(admin), `${decision} emergency cancellation ${reqId}`, 'Bookings'); save(s); closeModal(); toast(`Emergency request ${decision.toLowerCase()}.`) };

  window.reviewBookingRescheduleV65 = function (reqId) { const s = load(), r = s.bookingRescheduleRequests.find(x => x.id === reqId), b = s.bookings.find(x => x.id === r?.bookingId), u = s.users.find(x => x.id === r?.userId), court = s.courts.find(c => c.id === r?.requested?.court); if (!r) return; const err = conflict(s, r.requested.court, r.requested.date, r.requested.time, b.duration, b.id); modal(`<h3>Booking Reschedule Review</h3><div class="grid grid-2"><div class="notice"><b>Current Reservation</b><br>${fmtDate(r.current.date)} · ${time12(r.current.time)} · ${s.courts.find(c => c.id === r.current.court)?.name || r.current.court}</div><div class="notice"><b>Requested Reservation</b><br>${fmtDate(r.requested.date)} · ${time12(r.requested.time)} · ${court?.name || r.requested.court}</div></div><div class="notice">Availability: <b>${err ? 'Conflict — ' + err : 'Available'}</b></div><div class="field"><label>Admin Remarks</label><textarea id="rescheduleRemarksV65"></textarea></div><div class="actions"><button class="btn btn-light" onclick="decideBookingRescheduleV65('${reqId}','Rejected')">Reject</button><button class="btn btn-dark" ${err ? 'disabled' : ''} onclick="decideBookingRescheduleV65('${reqId}','Approved')">Approve Reschedule</button></div>`) };
  window.decideBookingRescheduleV65 = function (reqId, decision) { const s = load(), admin = currentUser(s), r = s.bookingRescheduleRequests.find(x => x.id === reqId), b = s.bookings.find(x => x.id === r.bookingId); r.status = decision; r.adminRemarks = document.getElementById('rescheduleRemarksV65')?.value || ''; if (decision === 'Approved') { b.date = r.requested.date; b.time = r.requested.time; b.court = r.requested.court; b.rescheduleCount = (b.rescheduleCount || 0) + 1; } notify(s, r.userId, `Booking Reschedule ${decision}`, decision === 'Approved' ? `${r.bookingId} was moved to ${fmtDate(b.date)} at ${time12(b.time)}.` : `Your reschedule request for ${r.bookingId} was rejected.`); log(s, fullNameV65(admin), `${decision} reschedule ${reqId}`, 'Bookings'); save(s); closeModal(); toast(`Reschedule ${decision.toLowerCase()}.`) };

  if (typeof window.adminBookingsView === 'function') {
    window.adminBookingsView = function (state) {
      const rows = state.bookings.map(b => { const u = state.users.find(x => x.id === b.userId), c = state.courts.find(x => x.id === b.court); return `<tr><td><b>${b.id}</b></td><td>${fullNameV65(u)}</td><td>${c?.name || b.court}<br><span class="muted small">${c?.sport || ''}</span></td><td>${fmtDate(b.date)}<br>${time12(b.time)}</td><td>${(b.playerNames || []).map(p => fullNameV65(p)).join('<br>') || b.players}</td><td>${statusBadge(b.status)}</td><td>${statusBadge(b.paymentStatus || 'Unpaid')}</td><td><button class="btn btn-light btn-sm" onclick="adminBookingDetailsV65('${b.id}')">View Details</button></td></tr>` }); const pendingEC = (state.emergencyCancellationRequests || []).filter(r => r.status === 'Pending Review'), pendingRS = (state.bookingRescheduleRequests || []).filter(r => r.status === 'Pending Admin Review'); return head('Court Bookings') + stats([['Pending Bookings', state.bookings.filter(b => b.status === 'Pending').length], ['Confirmed', state.bookings.filter(b => b.status === 'Confirmed').length], ['Emergency Reviews', pendingEC.length], ['Reschedule Reviews', pendingRS.length]]) + `<br>${table(['Booking', 'Customer', 'Court / Sport', 'Appointment', 'Players', 'Status', 'Payment', 'Action'], rows)}${pendingEC.length ? `<br><section class="card"><h3>Emergency Cancellation Requests</h3>${table(['Request', 'Booking', 'Reason', 'Status', 'Action'], pendingEC.map(r => `<tr><td>${r.id}</td><td>${r.bookingId}</td><td>${r.reason}</td><td>${r.status}</td><td><button class="btn btn-light btn-sm" onclick="reviewEmergencyCancellationV65('${r.id}')">Review</button></td></tr>`))}</section>` : ''}${pendingRS.length ? `<br><section class="card"><h3>Reschedule Requests</h3>${table(['Request', 'Booking', 'Reason', 'Status', 'Action'], pendingRS.map(r => `<tr><td>${r.id}</td><td>${r.bookingId}</td><td>${r.reason}</td><td>${r.status}</td><td><button class="btn btn-light btn-sm" onclick="reviewBookingRescheduleV65('${r.id}')">Review</button></td></tr>`))}</section>` : ''}`;
    };
  }
  window.adminBookingDetailsV65 = function (id) { const s = load(), b = s.bookings.find(x => x.id === id), u = s.users.find(x => x.id === b?.userId), c = s.courts.find(x => x.id === b?.court); if (!b) return; modal(`<h3>${id} · Booking Details</h3><div class="info-row"><span>Customer</span><strong>${fullNameV65(u)}</strong></div><div class="info-row"><span>Court</span><strong>${c?.name || b.court}</strong></div><div class="info-row"><span>Appointment</span><strong>${fmtDate(b.date)} · ${time12(b.time)}</strong></div><div class="booking-detail-section"><h4>Players</h4>${(b.playerNames || []).map((p, i) => `<div class="info-row"><span>${i + 1}</span><strong>${fullNameV65(p)}</strong></div>`).join('')}</div><div class="booking-detail-section"><h4>Actions</h4><div class="booking-detail-actions">${b.status === 'Pending' ? `<button class="btn btn-dark" onclick="confirmBooking('${id}')">Approve Booking</button><button class="btn btn-light" onclick="rejectBooking('${id}')">Reject</button>` : ''}${b.status === 'Confirmed' ? `<button class="btn btn-light" onclick="recordWalkInPaymentV65('${id}')">Record Payment</button><button class="btn btn-dark" onclick="checkInV65('${id}')">Check In</button>` : ''}${b.status === 'In Use' ? `<button class="btn btn-dark" onclick="completeCourtUseV65('${id}')">Complete Court Use</button>` : ''}</div></div><button class="btn btn-light full" onclick="closeModal()">Close</button>`) };
  window.checkInV65 = function (id) { const s = load(), admin = currentUser(s), b = s.bookings.find(x => x.id === id); b.checkedIn = true; b.checkInTime = new Date().toISOString(); b.status = 'In Use'; log(s, fullNameV65(admin), `Checked in ${id}`, 'Bookings'); save(s); closeModal(); toast('Booking checked in. Court is now in use.') };
  window.completeCourtUseV65 = function (id) { modal(`<h3>Complete Court Use</h3><form onsubmit="saveCompleteCourtUseV65(event,'${id}')"><div class="field"><label>Additional Charges</label><input name="additional" type="number" min="0" step="0.01" value="0"></div><div class="field"><label>Adjustments</label><input name="adjustments" type="number" step="0.01" value="0"></div><div class="field"><label>Notes</label><textarea name="notes"></textarea></div><button class="btn btn-dark full">Complete Booking</button></form>`) };
  window.saveCompleteCourtUseV65 = function (e, id) { e.preventDefault(); const s = load(), admin = currentUser(s), b = s.bookings.find(x => x.id === id), f = new FormData(e.target), base = Number(b.estimatedAmount || 0); b.additionalCharges = Number(f.get('additional') || 0); b.adjustments = Number(f.get('adjustments') || 0); b.finalTotal = base + b.additionalCharges + b.adjustments; b.status = 'Completed'; b.completedAt = new Date().toISOString(); b.finalNotes = f.get('notes'); log(s, fullNameV65(admin), `Completed court use ${id}`, 'Bookings'); notify(s, b.userId, 'Court Booking Completed', `${id} is completed. Your Final Invoice is now available.`); save(s); closeModal(); toast('Court use completed. Final Invoice generated.') };

  // Court management cards get availability control, and coach management gets availability control.
  if (typeof window.adminCourtsView === 'function') {
    const oldCourtsView = window.adminCourtsView; window.adminCourtsView = function (state) { let html = oldCourtsView(state); state.courts.forEach(c => { html = html.replace(`onclick="adminEditCourtFull('${c.id}')"`, `onclick="adminEditCourtFull('${c.id}')"`); }); return html.replace(/<button class="btn btn-light btn-sm" onclick="adminEditCourtFull\('([^']+)'\)">Manage<\/button>/g, (m, id) => `${m} <button class="btn btn-light btn-sm" onclick="manageCourtAvailabilityV65('${id}')">Availability</button>`) };
  }

  window.manageCoachAvailabilityV65 = function (coachId) { const s = load(), coach = s.users.find(u => u.id === coachId), items = s.coachAvailability.filter(a => a.coachId === coachId); modal(`<h3>Coach Availability · ${fullNameV65(coach)}</h3><form onsubmit="saveCoachAvailabilityV65(event,'${coachId}')"><div class="form-grid-3"><div class="field"><label>Date *</label><input name="date" type="date" required></div><div class="field"><label>Start *</label><input name="start" type="time" required></div><div class="field"><label>End *</label><input name="end" type="time" required></div><div class="field"><label>Status</label><select name="status"><option>Available</option><option>Partially Available</option><option>Unavailable</option><option>On Leave</option></select></div></div><button class="btn btn-dark">Save Availability</button></form><div class="booking-detail-section">${items.map(a => `<div class="info-row"><span>${fmtDate(a.date)} · ${time12(a.start)}–${time12(a.end)}</span><strong>${a.status}</strong></div>`).join('') || '<p class="muted">No availability overrides.</p>'}</div>`) };
  window.saveCoachAvailabilityV65 = function (e, coachId) { e.preventDefault(); const s = load(), admin = currentUser(s), f = new FormData(e.target); s.coachAvailability.push({ id: uid('COA'), coachId, date: f.get('date'), start: f.get('start'), end: f.get('end'), status: f.get('status') }); log(s, fullNameV65(admin), `Updated coach availability ${coachId}`, 'Coach Management'); save(s); closeModal(); toast('Coach availability saved.') };
  if (typeof window.adminCoachesView === 'function') { const oldCoaches = window.adminCoachesView; window.adminCoachesView = function (state) { return oldCoaches(state).replace(/<button class="btn btn-light btn-sm" onclick="adminEditCoach\('([^']+)'\)">Manage<\/button>/g, (m, id) => `${m} <button class="btn btn-light btn-sm" onclick="manageCoachAvailabilityV65('${id}')">Availability</button>`) } };

  document.addEventListener('DOMContentLoaded', () => { const bell = document.getElementById('bellButton'); if (bell) bell.innerHTML = window.sportivoBellSvg; });
})();

/* V65 policy/data refinements */
(function () {
  function personName(p) { return [p?.first, p?.middle, p?.last].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || '—' }

  // Warning records back the warning count so appeals are tied to an actual active warning.
  if (typeof window.adminSaveWarning === 'function') {
    window.adminSaveWarning = function (event, id) {
      event.preventDefault(); const state = load(), user = state.users.find(item => item.id === id), data = new FormData(event.target); if (!user) return; if (!Array.isArray(state.warnings)) state.warnings = []; const reason = data.get('reason'), note = data.get('note') || ''; const warning = { id: uid('W'), userId: id, bookingId: '', type: String(reason).includes('No-show') ? 'No-Show' : reason, reason, description: note, dateIssued: today(), issuedBy: currentUser(state)?.id || 'A-1001', status: 'Active', appealStatus: 'Not Submitted' }; state.warnings.unshift(warning); user.warningCount = state.warnings.filter(w => w.userId === id && w.status === 'Active').length; user.accountStanding = standingFromWarnings(user, state); notify(state, id, 'Account Warning', `${reason}. ${note}`.trim()); log(state, 'Administrator', `Issued warning ${warning.id} to ${user.id}: ${reason}`, 'Warnings'); save(state); closeModal(); toast('Warning issued. Appeal is now available from the warning details.'); location.reload();
    };
  }

  // Detailed court create flow: file upload, maximum 6 players, pricing and operating details.
  window.addCourt = function () {
    modal(`<h3>Add Court</h3><form id="addCourtV65"><div class="form-grid-2"><div class="field"><label>Court Name *</label><input name="name" required></div><div class="field"><label>Sport *</label><select name="sport"><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select></div><div class="field"><label>Location</label><input name="location" value="Main Facility"></div><div class="field"><label>Surface Type</label><input name="surface"></div><div class="field"><label>Included Players *</label><input name="includedPlayers" type="number" min="1" max="6" value="4" required></div><div class="field"><label>Maximum Players *</label><input name="maxPlayers" type="number" min="1" max="6" value="6" required></div><div class="field"><label>Base Court Fee *</label><input name="baseRate" type="number" min="0" value="400" required></div><div class="field"><label>Additional Player Fee</label><input name="additionalPlayerFee" type="number" min="0" value="75"></div><div class="field"><label>Open Time</label><input name="openTime" type="time" value="08:00"></div><div class="field"><label>Close Time</label><input name="closeTime" type="time" value="20:00"></div><div class="field"><label>Status</label><select name="status"><option>Available</option><option>Maintenance</option><option>Unavailable</option></select></div><div class="field"><label>Court Photo</label><input name="photo" type="file" accept="image/*"></div></div><div class="field"><label>Description</label><textarea name="description" rows="3"></textarea></div><div class="field"><label>Amenities</label><textarea name="amenities" rows="2"></textarea></div><div class="field"><label>Maintenance Notes</label><textarea name="notes" rows="2"></textarea></div><button class="btn btn-dark full">Add Court</button></form>`);
    document.getElementById('addCourtV65')?.addEventListener('submit', saveCourtV65);
  };
  window.saveCourtV65 = function (event) { event.preventDefault(); const state = load(), admin = currentUser(state), data = new FormData(event.target), file = event.target.elements.photo.files?.[0]; const saveWithPhoto = (photo = '') => { const max = Math.min(6, Number(data.get('maxPlayers') || 6)); state.courts.push({ id: uid('CT'), name: data.get('name'), sport: data.get('sport'), location: data.get('location'), surface: data.get('surface'), includedPlayers: Math.min(max, Number(data.get('includedPlayers') || 4)), maxPlayers: max, capacity: max, baseRate: Number(data.get('baseRate') || 0), additionalPlayerFee: Number(data.get('additionalPlayerFee') || 0), operatingHours: { open: data.get('openTime'), close: data.get('closeTime') }, status: data.get('status'), photo, description: data.get('description'), amenities: data.get('amenities'), notes: data.get('notes') }); log(state, personName(admin), 'Added court with facility, capacity and pricing details', 'Court Management'); save(state); closeModal(); toast('Court added.'); location.reload() }; if (file) { const reader = new FileReader(); reader.onload = () => saveWithPhoto(reader.result); reader.readAsDataURL(file) } else saveWithPhoto('') };
})();

/* Training request intro and coach-controlled trainee reschedule */
(function () {
  const oldTrainingApplicationPageV65 = window.trainingApplicationPage;
  if (typeof oldTrainingApplicationPageV65 === 'function') {
    window.trainingApplicationPage = function (state, user) {
      let html = oldTrainingApplicationPageV65(state, user);
      if (html.includes('id="trainingAppForm"')) {
        const intro = `<section class="card training-request-intro" id="trainingRequestIntroV65"><span class="eyebrow">TRAINING REQUEST</span><h3>Join a SPORTIVO training program</h3><p class="muted">Request coaching for a sport and program focus. Your selected Coach will review the request. Once confirmed, your training modules will be available.</p><p><strong>Would you like to submit a training request?</strong></p><div class="actions"><button class="btn btn-light" type="button" onclick="history.back()">No, Back</button><button class="btn btn-dark" type="button" id="continueTrainingRequestV65">Yes, Continue</button></div></section><br>`;
        html = html.replace('<form id="trainingAppForm" class="training-request-form">', `${intro}<form id="trainingAppForm" class="training-request-form hidden">`);
      }
      return html;
    };
    const oldBindTrainingRequestV65 = window.bindTrainingRequest;
    window.bindTrainingRequest = function () { oldBindTrainingRequestV65(); document.getElementById('continueTrainingRequestV65')?.addEventListener('click', () => { document.getElementById('trainingRequestIntroV65')?.classList.add('hidden'); document.getElementById('trainingAppForm')?.classList.remove('hidden'); document.getElementById('trainingAppForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }) };
  }

  window.requestTrainingReschedule = function (sessionId) {
    const s = load(), u = currentUser(s), session = s.sessions.find(x => x.id === sessionId); if (!session) return; const group = s.groups.find(g => g.id === session.groupId), coach = s.users.find(c => c.id === session.coachId); if (['Completed', 'Cancelled'].includes(session.status)) return toast('Completed or cancelled sessions cannot be rescheduled.');
    modal(`<h3>Request Training Reschedule</h3><div class="notice"><b>Current Schedule</b><br>${group?.sport || 'Training'} · ${fmtDate(session.date)} · ${time12(session.time)} · ${s.courts.find(c => c.id === session.court)?.name || session.court}<br>Coach ${userName(coach)}</div><form onsubmit="submitTrainingRescheduleV65(event,'${sessionId}')"><div class="field"><label>Reason for Rescheduling *</label><select name="reason" required><option>School Activity</option><option>Work Conflict</option><option>Personal Schedule</option><option>Medical / Health Reason</option><option>Emergency</option><option>Other</option></select></div><div class="form-grid-2"><div class="field"><label>Preferred New Date *</label><input name="date" type="date" min="${today()}" required></div><div class="field"><label>Preferred New Time *</label><input name="time" type="time" required></div></div><div class="notice">Your preferred schedule is subject to Coach and court availability. Your current schedule remains active until a replacement schedule is confirmed.</div><div class="actions"><button class="btn btn-light" type="button" onclick="closeModal()">Back</button><button class="btn btn-dark">Submit Request</button></div></form>`);
  };
  window.submitTrainingRescheduleV65 = function (e, sessionId) { e.preventDefault(); const s = load(), u = currentUser(s), session = s.sessions.find(x => x.id === sessionId), f = new FormData(e.target); session.traineeRescheduleRequests = session.traineeRescheduleRequests || []; if (session.traineeRescheduleRequests.some(r => r.traineeId === u.id && ['For Review', 'Awaiting Trainee Confirmation', 'Alternative Requested'].includes(r.status))) return toast('A reschedule request is already active for this session.'); const req = { id: uid('TRS'), traineeId: u.id, date: f.get('date'), time: f.get('time'), reason: f.get('reason'), status: 'For Review', createdAt: new Date().toISOString() }; session.traineeRescheduleRequests.push(req); notify(s, session.coachId, 'Training Reschedule Request', `${userName(u)} requested a new schedule for ${session.id}.`); log(s, userName(u), `Requested training reschedule for ${session.id}`, 'Training Schedule'); save(s); closeModal(); toast('Reschedule request sent to your Coach.'); location.reload() };

  if (typeof window.coachScheduleView === 'function') {
    const oldCoachScheduleViewV65 = window.coachScheduleView;
    window.coachScheduleView = function (state, coach) {
      let html = oldCoachScheduleViewV65(state, coach); const requests = []; state.sessions.filter(s => s.coachId === coach.id).forEach(session => (session.traineeRescheduleRequests || []).forEach(r => { if (['For Review', 'Awaiting Trainee Confirmation', 'Alternative Requested'].includes(r.status)) requests.push({ session, r }) }));
      if (requests.length) { const rows = requests.map(({ session, r }) => { const trainee = state.users.find(u => u.id === r.traineeId), group = state.groups.find(g => g.id === session.groupId); return `<tr><td>${userName(trainee)}</td><td>${session.id}<br><span class="muted small">${group?.sport || ''}</span></td><td>${fmtDate(session.date)} · ${time12(session.time)}</td><td>${fmtDate(r.date)} · ${time12(r.time)}</td><td>${r.reason}</td><td>${statusBadge(r.status)}</td><td><button class="btn btn-light btn-sm" onclick="reviewTrainingRescheduleV65('${session.id}','${r.id}')">Review</button></td></tr>` }); html += `<br><section class="card"><h3>Training Reschedule Requests</h3>${table(['Trainee', 'Session', 'Current', 'Preferred', 'Reason', 'Status', 'Action'], rows)}</section>` }
      return html;
    };
  }

  function coachConflictV65(state, coachId, date, time, duration, ignoreId) { return state.sessions.some(s => s.id !== ignoreId && s.coachId === coachId && ['Confirmed', 'Rescheduled'].includes(s.status) && s.date === date && overlap(time, duration, s.time, s.duration)) }
  function availableAlternativesV65(state, session, requestedDate) { const out = []; for (let day = 0; day < 5 && out.length < 4; day++) { const d = new Date(`${requestedDate}T00:00:00`); d.setDate(d.getDate() + day); const date = d.toISOString().slice(0, 10); for (const time of ['09:00', '11:00', '14:00', '16:00', '18:00']) { if (coachConflictV65(state, session.coachId, date, time, session.duration, session.id)) continue; for (const court of state.courts.filter(c => c.status === 'Available')) { if (conflict(state, court.id, date, time, session.duration, session.id)) continue; out.push({ date, time, court: court.id }); if (out.length >= 4) break } if (out.length >= 4) break } } return out }
  window.reviewTrainingRescheduleV65 = function (sessionId, reqId) { const s = load(), session = s.sessions.find(x => x.id === sessionId), req = (session?.traineeRescheduleRequests || []).find(r => r.id === reqId), trainee = s.users.find(u => u.id === req?.traineeId), group = s.groups.find(g => g.id === session?.groupId); if (!req) return; const coachBusy = coachConflictV65(s, session.coachId, req.date, req.time, session.duration, session.id), courts = s.courts.filter(c => c.status === 'Available' && !conflict(s, c.id, req.date, req.time, session.duration, session.id)); const available = !coachBusy && courts.length; const alts = availableAlternativesV65(s, session, req.date); modal(`<h3>Review Training Reschedule</h3><div class="grid grid-2"><div class="notice"><b>Current Schedule</b><br>${fmtDate(session.date)} · ${time12(session.time)} · ${s.courts.find(c => c.id === session.court)?.name || session.court}</div><div class="notice"><b>Trainee Preferred Schedule</b><br>${fmtDate(req.date)} · ${time12(req.time)}<br>${req.reason}</div></div><div class="booking-detail-section"><h4>Availability Check</h4><div class="info-row"><span>Coach Availability</span><strong>${coachBusy ? 'Not Available' : 'Available'}</strong></div><div class="info-row"><span>Court Availability</span><strong>${courts.length ? `${courts.length} court(s) available` : 'Not Available'}</strong></div></div>${available ? `<form onsubmit="approveTrainingRescheduleV65(event,'${sessionId}','${reqId}')"><div class="form-grid-3"><div class="field"><label>Final Date</label><input name="date" type="date" value="${req.date}" required></div><div class="field"><label>Final Time</label><input name="time" type="time" value="${req.time}" required></div><div class="field"><label>Final Court</label><select name="court">${courts.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div></div><div class="actions"><button type="button" class="btn btn-light" onclick="rejectTrainingRescheduleV65('${sessionId}','${reqId}')">Reject</button><button class="btn btn-dark">Approve Reschedule</button></div></form>` : `<div class="booking-detail-section"><h4>Suggested Alternative Schedules</h4><div class="player-list">${alts.map((a, i) => `<label class="player-row"><span class="player-index">${i + 1}</span><div><strong>${fmtDate(a.date)} · ${time12(a.time)}</strong><small>${s.courts.find(c => c.id === a.court)?.name || a.court}</small></div><input type="radio" name="trainingAlternativeV65" value="${a.date}|${a.time}|${a.court}" ${i === 0 ? 'checked' : ''}></label>`).join('')}</div><br><button class="btn btn-dark" onclick="sendTrainingAlternativeV65('${sessionId}','${reqId}')">Send Alternative Schedule</button></div>`}`) };
  window.approveTrainingRescheduleV65 = function (e, sessionId, reqId) { e.preventDefault(); const s = load(), session = s.sessions.find(x => x.id === sessionId), req = session.traineeRescheduleRequests.find(r => r.id === reqId), f = new FormData(e.target), old = `${session.date} ${session.time} ${session.court}`; session.date = f.get('date'); session.time = f.get('time'); session.court = f.get('court'); session.status = 'Rescheduled'; req.status = 'Approved'; notify(s, req.traineeId, 'Training Schedule Updated', `${session.id} has been rescheduled to ${fmtDate(session.date)} at ${time12(session.time)}.`); log(s, userName(currentUser(s)), `Approved training reschedule ${session.id}: ${old} → ${session.date} ${session.time} ${session.court}`, 'Training Schedule'); save(s); closeModal(); toast('Training session rescheduled.'); location.reload() };
  window.sendTrainingAlternativeV65 = function (sessionId, reqId) { const chosen = document.querySelector('input[name=trainingAlternativeV65]:checked')?.value; if (!chosen) return toast('Choose an alternative schedule.'); const s = load(), session = s.sessions.find(x => x.id === sessionId), req = session.traineeRescheduleRequests.find(r => r.id === reqId), [date, time, court] = chosen.split('|'); req.alternative = { date, time, court }; req.status = 'Awaiting Trainee Confirmation'; notify(s, req.traineeId, 'Alternative Schedule Suggested', `Coach suggested ${fmtDate(date)} at ${time12(time)} for ${session.id}. Open Training Schedule to accept or request another schedule.`); save(s); closeModal(); toast('Alternative schedule sent to trainee.') };
  window.rejectTrainingRescheduleV65 = function (sessionId, reqId) { const s = load(), session = s.sessions.find(x => x.id === sessionId), req = session.traineeRescheduleRequests.find(r => r.id === reqId); req.status = 'Rejected'; notify(s, req.traineeId, 'Training Reschedule Rejected', `Your reschedule request for ${session.id} was rejected.`); save(s); closeModal(); toast('Request rejected.'); location.reload() };

  // Trainee schedule gets Accept/Request Another actions when Coach proposed an alternative.
  const oldTraineeScheduleV65 = window.traineeSchedule;
  if (typeof oldTraineeScheduleV65 === 'function') {
    window.traineeSchedule = function (state, user) { let html = oldTraineeScheduleV65(state, user); const offers = []; state.sessions.forEach(session => (session.traineeRescheduleRequests || []).forEach(r => { if (r.traineeId === user.id && r.status === 'Awaiting Trainee Confirmation' && r.alternative) offers.push({ session, r }) })); if (offers.length) { html += `<br><section class="card"><h3>Alternative Schedule Suggested</h3>${offers.map(({ session, r }) => `<div class="notice"><b>${session.id}</b><br>Coach suggested ${fmtDate(r.alternative.date)} · ${time12(r.alternative.time)} · ${state.courts.find(c => c.id === r.alternative.court)?.name || r.alternative.court}<div class="actions" style="margin-top:12px"><button class="btn btn-dark btn-sm" onclick="acceptTrainingAlternativeV65('${session.id}','${r.id}')">Accept Schedule</button><button class="btn btn-light btn-sm" onclick="requestAnotherTrainingAlternativeV65('${session.id}','${r.id}')">Request Another Schedule</button></div></div>`).join('')}</section>` } return html };
  }
  window.acceptTrainingAlternativeV65 = function (sessionId, reqId) { const s = load(), u = currentUser(s), session = s.sessions.find(x => x.id === sessionId), req = session.traineeRescheduleRequests.find(r => r.id === reqId); if (!req?.alternative) return; session.date = req.alternative.date; session.time = req.alternative.time; session.court = req.alternative.court; session.status = 'Rescheduled'; req.status = 'Approved'; notify(s, session.coachId, 'Alternative Schedule Accepted', `${userName(u)} accepted the alternative for ${session.id}.`); log(s, userName(u), `Accepted alternative schedule for ${session.id}`, 'Training Schedule'); save(s); toast('New training schedule confirmed.'); location.reload() };
  window.requestAnotherTrainingAlternativeV65 = function (sessionId, reqId) { const s = load(), session = s.sessions.find(x => x.id === sessionId), req = session.traineeRescheduleRequests.find(r => r.id === reqId); modal(`<h3>Request Another Schedule</h3><form onsubmit="submitAnotherTrainingAlternativeV65(event,'${sessionId}','${reqId}')"><div class="form-grid-2"><div class="field"><label>Preferred Date *</label><input name="date" type="date" min="${today()}" required></div><div class="field"><label>Preferred Time *</label><input name="time" type="time" required></div></div><div class="field"><label>Message</label><textarea name="message"></textarea></div><button class="btn btn-dark full">Send to Coach</button></form>`) };
  window.submitAnotherTrainingAlternativeV65 = function (e, sessionId, reqId) { e.preventDefault(); const s = load(), session = s.sessions.find(x => x.id === sessionId), req = session.traineeRescheduleRequests.find(r => r.id === reqId), f = new FormData(e.target); req.date = f.get('date'); req.time = f.get('time'); req.message = f.get('message'); req.status = 'Alternative Requested'; delete req.alternative; notify(s, session.coachId, 'Another Training Schedule Requested', `${userName(currentUser(s))} requested another schedule for ${session.id}.`); save(s); closeModal(); toast('Another preferred schedule was sent to your Coach.'); location.reload() };
})();
