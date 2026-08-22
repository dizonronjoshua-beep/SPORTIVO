/* =========================================================
   SPORTIVO ADMIN PORTAL
   ---------------------------------------------------------
   Admin-only views are kept here so the shared app logic
   stays easier to maintain. All records use the same local
   SPORTIVO state from app.js.
========================================================= */

function adminCourtName(state, courtId) {
  return state.courts.find(court => court.id === courtId)?.name || courtId || '—';
}

function adminGroupName(state, groupId) {
  return state.groups.find(group => group.id === groupId)?.name || '—';
}

function adminCoachName(state, coachId) {
  return userName(state.users.find(user => user.id === coachId));
}

function adminTraineeGroups(state, traineeId) {
  return state.groups.filter(group => group.trainees.includes(traineeId));
}

function adminEmpty(message) {
  return `<div class="admin-empty"><strong>No records yet</strong><span>${message}</span></div>`;
}

function adminSection(title, content, action = '') {
  return `
    <section class="card admin-section-card">
      <div class="admin-section-head">
        <h3>${title}</h3>
        ${action}
      </div>
      ${content}
    </section>
  `;
}

function adminDashboard(state) {
  const todayValue = today();
  const todaysBookings = state.bookings.filter(item => item.date === todayValue);
  const todaysSessions = state.sessions.filter(item => item.date === todayValue);
  const pendingBookings = state.bookings.filter(item => item.status === 'Pending');
  const reviewAppeals = state.appeals.filter(item => item.status === 'For Review');
  const activeCoaches = state.users.filter(item => item.role === 'coach' && item.status === 'Active');
  const trainees = state.users.filter(item => item.traineeAccess);
  const availableCourts = state.courts.filter(item => item.status === 'Available');

  const scheduleRows = [
    ...todaysSessions.map(item => ({
      time: item.time,
      type: 'Training',
      name: adminGroupName(state, item.groupId),
      person: adminCoachName(state, item.coachId),
      court: adminCourtName(state, item.court),
      status: item.status
    })),
    ...todaysBookings.map(item => ({
      time: item.time,
      type: 'Court Booking',
      name: item.id,
      person: userName(state.users.find(user => user.id === item.userId)),
      court: adminCourtName(state, item.court),
      status: item.status
    }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  return head('Dashboard') + `
    ${stats([
      ['Today’s Bookings', todaysBookings.length, `${pendingBookings.length} pending review`, 'admin-bookings'],
      ['Today’s Training', todaysSessions.length, `${state.sessions.filter(x => x.status === 'Confirmed').length} scheduled by coaches`, 'master'],
      ['Active Trainees', trainees.length, `${state.groups.length} coach-managed groups`, 'users'],
      ['Available Courts', availableCourts.length, `${state.courts.length} total courts`, 'courts']
    ])}

    <div class="admin-dashboard-grid">
      ${adminSection('Today’s Operations', scheduleRows.length ? table(
        ['Time', 'Type', 'Reference / Group', 'User / Coach', 'Court', 'Status'],
        scheduleRows.map(row => `
          <tr>
            <td><strong>${time12(row.time)}</strong></td>
            <td>${row.type}</td>
            <td>${row.name}</td>
            <td>${row.person}</td>
            <td>${row.court}</td>
            <td>${statusBadge(row.status)}</td>
          </tr>
        `)
      ) : adminEmpty('There are no court bookings or training sessions scheduled for today.'), `<a class="btn btn-light btn-sm" href="master-schedule.html">Open Master Schedule</a>`)}

      ${adminSection('Needs Attention', `
        <div class="admin-attention-list">
          <a href="court-bookings.html"><span>Pending court bookings</span><strong>${pendingBookings.length}</strong></a>
          <a href="appeals.html"><span>Appeals for review</span><strong>${reviewAppeals.length}</strong></a>
          <a href="user-management.html"><span>Trainees without a group <small>(Coach-managed)</small></span><strong>${trainees.filter(t => !adminTraineeGroups(state, t.id).length).length}</strong></a>
          <a href="court-management.html"><span>Unavailable / maintenance courts</span><strong>${state.courts.filter(c => c.status !== 'Available').length}</strong></a>
        </div>
      `)}
    </div>

    <div class="admin-dashboard-grid">
      ${adminSection('Academy Overview', `
        <div class="admin-overview-grid">
          <div><span>Registered Users</span><strong>${state.users.filter(u => u.role === 'user' || u.role === 'trainee').length}</strong></div>
          <div><span>Active Coaches</span><strong>${activeCoaches.length}</strong></div>
          <div><span>Training Groups</span><strong>${state.groups.length}</strong></div>
          <div><span>Announcements</span><strong>${state.announcements.filter(a => a.status === 'Active').length}</strong></div>
        </div>
      `)}

      ${adminSection('Quick Actions', `
        <div class="admin-quick-actions">
          <button class="btn btn-dark" onclick="createCoachAccess()">Create Coach</button>
          <button class="btn btn-light" onclick="newSession()">Create Training Session</button>
          <button class="btn btn-light" onclick="newAnnouncement()">Publish Announcement</button>
        </div>
      `)}
    </div>
  `;
}

function adminUsersView(state) {
  const users = state.users.filter(user => ['user', 'trainee'].includes(user.role) || user.traineeAccess);
  const rows = users.map(user => {
    const groups = adminTraineeGroups(state, user.id);
    return `
      <tr>
        <td><strong>${userName(user)}</strong><br><span class="muted small">${user.id}</span></td>
        <td>${user.email}<br><span class="muted small">${user.mobile || 'No mobile'}</span></td>
        <td>${user.traineeAccess ? '<span class="badge success">Trainee</span><br><span class="muted small">Coach-confirmed</span>' : '<span class="badge sage">User</span><br><span class="muted small">Training request required</span>'}</td>
        <td>${user.status || 'Active'}</td>
        <td>${user.warningCount || 0}</td>
        <td>${statusBadge(standingFromWarnings(user, state))}</td>
        <td>${state.bookings.filter(b => b.userId === user.id).length}</td>
        <td>${groups.map(g => g.sport).join(', ') || '—'}</td>
        <td class="table-actions"><button class="btn btn-light btn-sm" onclick="editUser('${user.id}')">Edit</button>${user.warningCount ? ` <button class="btn btn-light btn-sm" onclick="clearWarning('${user.id}')">Clear Warning</button>` : ''}</td>
      </tr>
    `;
  });

  return head('User Management') +
    stats([
      ['Registered Users', users.length],
      ['Active Accounts', users.filter(u => u.status === 'Active').length],
      ['Trainees', users.filter(u => u.traineeAccess).length],
      ['With Warnings', users.filter(u => Number(u.warningCount || 0) > 0).length]
    ]) +
    `<br>${adminSection('User Accounts', rows.length ? table(['User', 'Contact', 'Role', 'Account', 'Warnings', 'Standing', 'Bookings', 'Sports', 'Actions'], rows) : adminEmpty('Registered SPORTIVO users will appear here.'))}`;
}

function adminTraineesView(state) {
  const trainees = state.users.filter(user => user.traineeAccess);
  const rows = trainees.map(trainee => {
    const groups = adminTraineeGroups(state, trainee.id);
    const attendance = state.attendance.filter(item => item.traineeId === trainee.id);
    const progress = state.progress.filter(item => item.traineeId === trainee.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    const plans = (state.trainingPlans || []).filter(plan => plan.traineeId === trainee.id);
    return `
      <tr>
        <td><strong>${userName(trainee)}</strong><br><span class="muted small">${trainee.email}</span></td>
        <td>${groups.map(group => `${group.sport}<br><span class="muted small">${group.name}</span>`).join('<br>') || 'Unassigned'}</td>
        <td>${groups.map(group => adminCoachName(state, group.coachId)).join('<br>') || '—'}</td>
        <td>${attendance.length}</td>
        <td>${plans.length}</td>
        <td>${progress ? `<strong>${progress.average.toFixed(1)}/5</strong><br><span class="muted small">${progress.assessment}</span>` : '—'}</td>
        <td><button class="btn btn-light btn-sm" onclick="traineeInfo('${trainee.id}')">View Details</button></td>
      </tr>
    `;
  });

  return head('Trainee Management') +
    stats([
      ['Active Trainees', trainees.length],
      ['Assigned to Groups', trainees.filter(t => adminTraineeGroups(state, t.id).length).length],
      ['Training Plans', (state.trainingPlans || []).length],
      ['Attendance Records', state.attendance.length]
    ]) +
    `<br>${adminSection('Trainee Records', rows.length ? table(['Trainee', 'Sport / Group', 'Coach', 'Attendance', 'Plans', 'Latest Assessment', 'Action'], rows) : adminEmpty('Approved trainees will appear here after coach confirmation.'))}`;
}

function adminCoachesView(state) {
  const coaches = state.users.filter(user => user.role === 'coach');
  const rows = coaches.map(coach => {
    const groups = state.groups.filter(group => group.coachId === coach.id);
    const sessions = state.sessions.filter(session => session.coachId === coach.id);
    return `
      <tr>
        <td><strong>${userName(coach)}</strong><br><span class="muted small">${coach.id}</span></td>
        <td>${coach.sport || coachSport(coach) || '—'}</td>
        <td>${coach.specialization || '—'}</td>
        <td>${coach.experience || '—'}</td>
        <td>${groups.length}</td>
        <td>${groups.reduce((sum, group) => sum + group.trainees.length, 0)}</td>
        <td>${sessions.filter(s => s.status === 'Confirmed').length}</td>
        <td>${statusBadge(coach.status || 'Active')}</td>
        <td><button class="btn btn-light btn-sm" onclick="editUser('${coach.id}')">Edit</button></td>
      </tr>
    `;
  });

  return head('Coach Management', '', `<button class="btn btn-dark" onclick="createCoachAccess()">+ Create Coach Account</button>`) +
    stats([
      ['Active Coaches', coaches.filter(c => c.status === 'Active').length],
      ['Assigned Groups', state.groups.length],
      ['Scheduled Sessions', state.sessions.filter(s => s.status === 'Confirmed').length],
      ['Assigned Trainees', state.groups.reduce((sum, group) => sum + group.trainees.length, 0)]
    ]) +
    `<br>${adminSection('Coach Directory', rows.length ? table(['Coach', 'Sport', 'Specialization', 'Experience', 'Groups', 'Trainees', 'Active Sessions', 'Status', 'Action'], rows) : adminEmpty('Coach accounts created by the administrator will appear here.'))}`;
}

function adminGroupsView(state) {
  const cards = state.groups.map(group => {
    const coach = state.users.find(user => user.id === group.coachId);
    const court = state.courts.find(item => item.id === group.court);
    const trainees = group.trainees.map(id => state.users.find(user => user.id === id)).filter(Boolean);
    return `
      <article class="card admin-group-card">
        <div class="admin-card-title-row"><div><span class="eyebrow">${group.sport}</span><h3>${group.name}</h3></div>${statusBadge(group.status || 'Active')}</div>
        <div class="info-row"><span>Level</span><strong>${group.level || 'Beginner'}</strong></div>
        <div class="info-row"><span>Coach</span><strong>${userName(coach)}</strong></div>
        <div class="info-row"><span>Schedule</span><strong>${group.days?.join(' & ') || '—'} · ${time12(group.time)}</strong></div>
        <div class="info-row"><span>Court</span><strong>${court?.name || group.court}</strong></div>
        <div class="info-row"><span>Sessions</span><strong>${group.totalSessions || 0}</strong></div>
        <div class="admin-trainee-chips">${trainees.length ? trainees.map(t => `<span>${userName(t)}</span>`).join('') : '<span>No trainees assigned</span>'}</div>
      </article>
    `;
  }).join('');

  return head('Training Groups', '', `<button class="btn btn-dark" onclick="newGroup()">+ Create Training Group</button>`) +
    stats([
      ['Training Groups', state.groups.length],
      ['Active Groups', state.groups.filter(g => g.status === 'Active').length],
      ['Assigned Trainees', state.groups.reduce((sum, g) => sum + g.trainees.length, 0)],
      ['Sports Covered', new Set(state.groups.map(g => g.sport)).size]
    ]) +
    `<br><div class="grid grid-2">${cards || adminEmpty('Create a training group to organize trainees, coaches, courts and schedules.')}</div>`;
}

function adminMasterView(state) {
  const rows = [
    ...state.bookings.filter(b => ['Confirmed', 'Pending'].includes(b.status)).map(b => ({
      date: b.date, time: b.time, court: b.court, type: 'Court Booking', ref: b.id,
      person: userName(state.users.find(u => u.id === b.userId)), status: b.status
    })),
    ...state.sessions.filter(s => ['Confirmed', 'Completed', 'Rescheduled'].includes(s.status)).map(s => ({
      date: s.date, time: s.time, court: s.court, type: 'Training', ref: adminGroupName(state, s.groupId),
      person: adminCoachName(state, s.coachId), status: s.status
    }))
  ].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return head('Master Schedule') +
    stats([
      ['Scheduled Records', rows.length],
      ['Court Bookings', rows.filter(r => r.type === 'Court Booking').length],
      ['Training Sessions', rows.filter(r => r.type === 'Training').length],
      ['Courts in Use', new Set(rows.map(r => r.court)).size]
    ]) + `
      <br>
      ${adminSection('Combined Academy Schedule', rows.length ? table(['Date', 'Time', 'Type', 'Reference / Group', 'User / Coach', 'Court', 'Status'], rows.map(row => `
        <tr>
          <td>${fmtDate(row.date)}</td>
          <td>${time12(row.time)}</td>
          <td><strong>${row.type}</strong></td>
          <td>${row.ref}</td>
          <td>${row.person}</td>
          <td>${adminCourtName(state, row.court)}</td>
          <td>${statusBadge(row.status)}</td>
        </tr>
      `)) : adminEmpty('Confirmed bookings and training sessions will appear together here.'))}
    `;
}

function adminCourtsView(state) {
  const cards = state.courts.map((court, index) => {
    const currentBookings = state.bookings.filter(b => b.court === court.id && ['Confirmed', 'Pending'].includes(b.status)).length;
    const trainingSessions = state.sessions.filter(s => s.court === court.id && s.status === 'Confirmed').length;
    return `
      <article class="card admin-court-card">
        <div class="admin-court-photo" style="background-image:url('${[IMG.badminton, IMG.basketball, IMG.volleyball, IMG.pickleball][index % 4]}')"></div>
        <div class="admin-card-title-row"><div><span class="eyebrow">${court.sport}</span><h3>${court.name}</h3></div>${statusBadge(court.status)}</div>
        <div class="admin-overview-grid compact">
          <div><span>Bookings</span><strong>${currentBookings}</strong></div>
          <div><span>Training</span><strong>${trainingSessions}</strong></div>
        </div>
        <button class="btn btn-light full" onclick="editCourt('${court.id}')">Manage Court</button>
      </article>
    `;
  }).join('');

  return head('Court Management', '', `<button class="btn btn-dark" onclick="addCourt()">+ Add Court</button>`) +
    stats([
      ['Total Courts', state.courts.length],
      ['Available', state.courts.filter(c => c.status === 'Available').length],
      ['Maintenance', state.courts.filter(c => c.status === 'Maintenance').length],
      ['Unavailable', state.courts.filter(c => c.status === 'Unavailable').length]
    ]) + `<br><div class="grid grid-2">${cards || adminEmpty('Add a court to begin managing academy availability.')}</div>`;
}

function adminBookingsView(state) {
  const rows = state.bookings.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).map(booking => {
    const user = state.users.find(item => item.id === booking.userId);
    return `
      <tr>
        <td><strong>${booking.id}</strong></td>
        <td>${userName(user)}<br><span class="muted small">${user?.mobile || '—'}</span></td>
        <td>${adminCourtName(state, booking.court)}<br><span class="muted small">${state.courts.find(c => c.id === booking.court)?.sport || '—'}</span></td>
        <td>${fmtDate(booking.date)}<br><span class="muted small">${time12(booking.time)} · ${booking.duration / 60} hr</span></td>
        <td>${booking.purpose || '—'}<br><span class="muted small">${booking.players || 1} player(s)</span></td>
        <td>${statusBadge(booking.status)}</td>
        <td class="table-actions">
          ${booking.status === 'Pending' ? `<button class="btn btn-dark btn-sm" onclick="confirmBooking('${booking.id}')">Confirm</button> <button class="btn btn-light btn-sm" onclick="rejectBooking('${booking.id}')">Reject</button>` : ''}
          ${booking.status === 'Confirmed' ? `<button class="btn btn-light btn-sm" onclick="checkIn('${booking.id}')">Check In</button>` : ''}
          ${!['Pending', 'Confirmed'].includes(booking.status) ? '—' : ''}
        </td>
      </tr>
    `;
  });

  return head('Court Bookings') +
    stats([
      ['Pending', state.bookings.filter(b => b.status === 'Pending').length],
      ['Confirmed', state.bookings.filter(b => b.status === 'Confirmed').length],
      ['Completed', state.bookings.filter(b => b.status === 'Completed').length],
      ['Cancelled / Rejected', state.bookings.filter(b => ['Cancelled', 'Rejected'].includes(b.status)).length]
    ]) + `<br>${adminSection('Booking Records', rows.length ? table(['Booking', 'Player', 'Court / Sport', 'Schedule', 'Purpose', 'Status', 'Actions'], rows) : adminEmpty('Court booking requests will appear here.'))}`;
}

function adminSessionsView(state) {
  const rows = state.sessions.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).map(session => `
    <tr>
      <td><strong>${session.id}</strong></td>
      <td>${adminGroupName(state, session.groupId)}</td>
      <td>${adminCoachName(state, session.coachId)}</td>
      <td>${fmtDate(session.date)}<br><span class="muted small">${time12(session.time)} · ${session.duration / 60} hr</span></td>
      <td>${adminCourtName(state, session.court)}</td>
      <td>${session.topic || '—'}</td>
      <td>${state.groups.find(g => g.id === session.groupId)?.trainees.length || 0}</td>
      <td>${statusBadge(session.status)}</td>
    </tr>
  `);

  return head('Training Sessions', '', `<button class="btn btn-dark" onclick="newSession()">+ Create Session</button>`) +
    stats([
      ['Total Sessions', state.sessions.length],
      ['Confirmed', state.sessions.filter(s => s.status === 'Confirmed').length],
      ['Completed', state.sessions.filter(s => s.status === 'Completed').length],
      ['Cancelled / Rescheduled', state.sessions.filter(s => ['Cancelled', 'Rescheduled'].includes(s.status)).length]
    ]) + `<br>${adminSection('Session Records', rows.length ? table(['Session', 'Training Group', 'Coach', 'Schedule', 'Court', 'Topic', 'Trainees', 'Status'], rows) : adminEmpty('Training sessions created by coaches or the administrator will appear here.'))}`;
}

function adminAttendanceView(state) {
  const records = state.attendance.slice().sort((a, b) => b.date.localeCompare(a.date));
  const rows = records.map(record => {
    const trainee = state.users.find(u => u.id === record.traineeId);
    const session = state.sessions.find(s => s.id === record.sessionId);
    const group = session ? state.groups.find(g => g.id === session.groupId) : adminTraineeGroups(state, record.traineeId)[0];
    return `
      <tr>
        <td>${fmtDate(record.date)}</td>
        <td><strong>${userName(trainee)}</strong></td>
        <td>${group?.sport || '—'}</td>
        <td>${group?.name || '—'}</td>
        <td>${record.sessionId || '—'}</td>
        <td>${userName(state.users.find(u => u.id === record.recordedBy))}</td>
        <td>${statusBadge(record.status)}</td>
        <td>${record.remarks || '—'}</td>
      </tr>
    `;
  });

  return head('Attendance Management') +
    stats([
      ['Attendance Records', records.length],
      ['Present', records.filter(r => r.status === 'Present').length],
      ['Late', records.filter(r => r.status === 'Late').length],
      ['Absent / Excused', records.filter(r => ['Absent', 'Excused'].includes(r.status)).length]
    ]) + `<br>${adminSection('Attendance Records', rows.length ? table(['Date', 'Trainee', 'Sport', 'Group', 'Session', 'Recorded By', 'Status', 'Remarks'], rows) : adminEmpty('Coach attendance records will appear here.'))}`;
}

function adminProgressView(state) {
  const records = state.progress.slice().sort((a, b) => b.date.localeCompare(a.date));
  const rows = records.map(record => {
    const trainee = state.users.find(u => u.id === record.traineeId);
    const group = adminTraineeGroups(state, record.traineeId).find(g => g.coachId === record.coachId) || adminTraineeGroups(state, record.traineeId)[0];
    return `
      <tr>
        <td>${fmtDate(record.date)}</td>
        <td><strong>${userName(trainee)}</strong><br><span class="muted small">${group?.sport || '—'}</span></td>
        <td>${adminCoachName(state, record.coachId)}</td>
        <td>${record.technique}/5</td>
        <td>${record.consistency}/5</td>
        <td>${record.discipline}/5</td>
        <td>${record.participation}/5</td>
        <td><strong>${record.average.toFixed(1)}/5</strong><br><span class="muted small">${record.assessment}</span></td>
        <td>${record.remarks || '—'}<br><span class="muted small">Next: ${record.nextFocus || '—'}</span></td>
      </tr>
    `;
  });

  const avg = records.length ? records.reduce((sum, item) => sum + Number(item.average || 0), 0) / records.length : 0;
  return head('Progress Monitoring') +
    stats([
      ['Assessments', records.length],
      ['Average Rating', records.length ? `${avg.toFixed(1)}/5` : '—'],
      ['Trainees Assessed', new Set(records.map(r => r.traineeId)).size],
      ['Coaches Reporting', new Set(records.map(r => r.coachId)).size]
    ]) + `<br>${adminSection('Coach Assessments', rows.length ? table(['Date', 'Trainee / Sport', 'Coach', 'Technique', 'Consistency', 'Discipline', 'Participation', 'Overall', 'Feedback'], rows) : adminEmpty('Coach progress assessments will appear here.'))}`;
}

function adminAnnouncementsView(state) {
  const rows = state.announcements.slice().sort((a, b) => b.date.localeCompare(a.date)).map(item => `
    <tr>
      <td>${fmtDate(item.date)}</td>
      <td><strong>${item.title}</strong></td>
      <td>${item.audience}</td>
      <td>${item.message}</td>
      <td>${statusBadge(item.status)}</td>
    </tr>
  `);
  return head('Announcements', '', `<button class="btn btn-dark" onclick="newAnnouncement()">+ New Announcement</button>`) +
    stats([
      ['Announcements', state.announcements.length],
      ['Active', state.announcements.filter(a => a.status === 'Active').length],
      ['For All Users', state.announcements.filter(a => a.audience === 'All').length],
      ['Targeted', state.announcements.filter(a => a.audience !== 'All').length]
    ]) + `<br>${adminSection('Published Notices', rows.length ? table(['Date', 'Title', 'Audience', 'Message', 'Status'], rows) : adminEmpty('Published academy announcements will appear here.'))}`;
}

function adminAppealsView(state) {
  const rows = state.appeals.slice().sort((a, b) => b.date.localeCompare(a.date)).map(appeal => `
    <tr>
      <td><strong>${appeal.id}</strong></td>
      <td>${userName(state.users.find(u => u.id === appeal.userId))}</td>
      <td>${appeal.bookingId}</td>
      <td>${appeal.reason}</td>
      <td>${appeal.explanation}</td>
      <td>${fmtDate(appeal.date)}</td>
      <td>${statusBadge(appeal.status)}</td>
      <td>${appeal.status === 'For Review' ? `<button class="btn btn-dark btn-sm" onclick="approveAppeal('${appeal.id}')">Approve</button> <button class="btn btn-light btn-sm" onclick="rejectAppeal('${appeal.id}')">Reject</button>` : '—'}</td>
    </tr>
  `);
  return head('Appeals') +
    stats([
      ['For Review', state.appeals.filter(a => a.status === 'For Review').length],
      ['Approved', state.appeals.filter(a => a.status === 'Approved').length],
      ['Rejected', state.appeals.filter(a => a.status === 'Rejected').length],
      ['Total Appeals', state.appeals.length]
    ]) + `<br>${adminSection('No-Show Appeals', rows.length ? table(['Appeal', 'User', 'Booking', 'Reason', 'Explanation', 'Date', 'Status', 'Actions'], rows) : adminEmpty('No-show appeals submitted by users will appear here.'))}`;
}

function adminReportsView(state) {
  const completedBookings = state.bookings.filter(b => b.status === 'Completed');
  const completedSessions = state.sessions.filter(s => s.status === 'Completed');
  const attendanceTotal = state.attendance.length;
  const present = state.attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = attendanceTotal ? Math.round((present / attendanceTotal) * 100) : 0;

  return head('Reports', '', `<button class="btn btn-dark" onclick="exportCSV()">Export CSV</button>`) + `
    <div class="grid grid-4">
      <article class="card admin-report-card"><span>Court Booking Report</span><strong>${state.bookings.length}</strong><small>${completedBookings.length} completed bookings</small></article>
      <article class="card admin-report-card"><span>Training Session Report</span><strong>${state.sessions.length}</strong><small>${completedSessions.length} completed sessions</small></article>
      <article class="card admin-report-card"><span>Attendance Report</span><strong>${attendanceRate}%</strong><small>${present} present of ${attendanceTotal} records</small></article>
      <article class="card admin-report-card"><span>Trainee Report</span><strong>${state.users.filter(u => u.traineeAccess).length}</strong><small>${state.groups.length} active training groups</small></article>
    </div>
    <div class="admin-dashboard-grid">
      ${adminSection('Court Usage by Sport', table(['Sport', 'Courts', 'Bookings', 'Training Sessions'], [...new Set(state.courts.map(c => c.sport))].map(sport => {
        const courtIds = state.courts.filter(c => c.sport === sport).map(c => c.id);
        return `<tr><td><strong>${sport}</strong></td><td>${courtIds.length}</td><td>${state.bookings.filter(b => courtIds.includes(b.court)).length}</td><td>${state.sessions.filter(s => courtIds.includes(s.court)).length}</td></tr>`;
      })))}
      ${adminSection('Coach Workload', table(['Coach', 'Groups', 'Trainees', 'Sessions', 'Progress Updates'], state.users.filter(u => u.role === 'coach').map(coach => {
        const groups = state.groups.filter(g => g.coachId === coach.id);
        return `<tr><td><strong>${userName(coach)}</strong></td><td>${groups.length}</td><td>${groups.reduce((sum, g) => sum + g.trainees.length, 0)}</td><td>${state.sessions.filter(s => s.coachId === coach.id).length}</td><td>${state.progress.filter(p => p.coachId === coach.id).length}</td></tr>`;
      })))}
    </div>
  `;
}

function adminLogsView(state) {
  const rows = state.logs.slice(0, 100).map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${fmtDate(item.date)}<br><span class="muted small">${item.time}</span></td>
      <td><strong>${item.actor}</strong></td>
      <td>${item.module}</td>
      <td>${item.action}</td>
    </tr>
  `);
  return head('Activity Logs') +
    stats([
      ['Recorded Activities', state.logs.length],
      ['Today', state.logs.filter(l => l.date === today()).length],
      ['Modules Affected', new Set(state.logs.map(l => l.module)).size],
      ['Latest Actor', state.logs[0]?.actor || '—']
    ]) + `<br>${adminSection('System Activity', rows.length ? table(['Log ID', 'Date / Time', 'User', 'Module', 'Action'], rows) : adminEmpty('Important administrative and system actions will be recorded here.'))}`;
}

function adminSettingsView(state) {
  return head('Settings') + `
    <div class="admin-dashboard-grid">
      <form id="settingsForm" class="card admin-settings-card">
        <div class="admin-section-head"><h3>Booking & Attendance Rules</h3></div>
        <div class="form-grid-2">
          <div class="field"><label>Cancellation Notice</label><div class="input-suffix"><input name="cancelHours" type="number" min="0" value="${state.settings.cancelHours}"><span>hours</span></div></div>
          <div class="field"><label>Reschedule Notice</label><div class="input-suffix"><input name="rescheduleHours" type="number" min="0" value="${state.settings.rescheduleHours}"><span>hours</span></div></div>
          <div class="field"><label>No-Show Grace Period</label><div class="input-suffix"><input name="graceMinutes" type="number" min="0" value="${state.settings.graceMinutes}"><span>minutes</span></div></div>
          <div class="field"><label>Restriction Duration</label><div class="input-suffix"><input name="restrictionDays" type="number" min="1" value="${state.settings.restrictionDays}"><span>days</span></div></div>
        </div>
        <button class="btn btn-dark" type="submit">Save Rules</button>
      </form>

      <section class="card admin-settings-card">
        <div class="admin-section-head"><h3>Academy Information</h3></div>
        <div class="info-row"><span>Academy</span><strong>${state.settings.academyName || 'SPORTIVO Management System'}</strong></div>
        <div class="info-row"><span>Contact Number</span><strong>${state.settings.contact || '—'}</strong></div>
        <div class="info-row"><span>Email</span><strong>${state.settings.email || '—'}</strong></div>
        <div class="info-row"><span>System Status</span><strong>${statusBadge('Active')}</strong></div>
        <button class="btn btn-light" type="button" onclick="resetDemo()">Reset Demo Data</button>
      </section>
    </div>
  `;
}

function renderAdmin(route, state, admin) {
  const views = {
    dashboard: () => adminDashboard(state),
    users: () => adminUsersView(state),
    'coach-access': () => adminCoachesView(state),
    master: () => adminMasterView(state),
    courts: () => adminCourtsView(state),
    'admin-bookings': () => adminBookingsView(state),
    'admin-progress': () => adminProgressView(state),
    'admin-announcements': () => adminAnnouncementsView(state),
    appeals: () => adminAppealsView(state),
    reports: () => adminReportsView(state),
    logs: () => adminLogsView(state),
    settings: () => adminSettingsView(state),
    profile: () => accountPage(state, admin)
  };

  return (views[route] || views.dashboard)();
}

/* =========================================================
   SPORTIVO ADMIN FEATURE PACK V42
   ---------------------------------------------------------
   Adds practical Admin CRUD/review tools to every module.
   These functions intentionally live in admin.js so the
   general portal logic in app.js stays shared and readable.
========================================================= */

function adminReload() {
  window.location.reload();
}

function adminSelect(options, selected = '') {
  return options.map(value => `<option ${String(value) === String(selected) ? 'selected' : ''}>${value}</option>`).join('');
}

function adminUserOptions(state, selected = '') {
  return state.users
    .filter(user => user.role === 'user' || user.traineeAccess)
    .map(user => `<option value="${user.id}" ${user.id === selected ? 'selected' : ''}>${userName(user)} · ${user.email}</option>`)
    .join('');
}

function adminCoachOptions(state, selected = '') {
  return state.users
    .filter(user => user.role === 'coach' && user.status === 'Active')
    .map(user => `<option value="${user.id}" ${user.id === selected ? 'selected' : ''}>${userName(user)} · ${coachSport(user) || 'Coach'}</option>`)
    .join('');
}

function adminCourtOptions(state, selected = '') {
  return state.courts
    .map(court => `<option value="${court.id}" ${court.id === selected ? 'selected' : ''}>${court.name} · ${court.sport}</option>`)
    .join('');
}

function adminGroupOptions(state, selected = '') {
  return state.groups
    .map(group => `<option value="${group.id}" ${group.id === selected ? 'selected' : ''}>${group.name} · ${group.sport}</option>`)
    .join('');
}

function adminAddUser() {
  modal(`
    <h3>Add User Account</h3>
    <form onsubmit="adminSaveNewUser(event)">
      <div class="form-grid-2">
        <div class="field"><label>First Name *</label><input name="first" required></div>
        <div class="field"><label>Last Name *</label><input name="last" required></div>
        <div class="field"><label>Email *</label><input name="email" type="email" required></div>
        <div class="field"><label>Mobile *</label><input name="mobile" required></div>
        <div class="field"><label>Gender</label><select name="gender">${adminSelect(['Male','Female','Prefer not to say'])}</select></div>
        <div class="field"><label>Date of Birth</label><input name="dob" type="date"></div>
        <div class="field"><label>Temporary Password *</label><input name="password" value="user123" required></div>
        <div class="field"><label>Account Status</label><select name="status">${adminSelect(['Active','Deactivated'],'Active')}</select></div>
      </div>
      <button class="btn btn-dark full" type="submit">Create User Account</button>
    </form>
  `);
}

function adminSaveNewUser(event) {
  event.preventDefault();
  const state = load();
  const data = new FormData(event.target);
  const email = String(data.get('email')).trim().toLowerCase();
  if (state.users.some(user => user.email.toLowerCase() === email)) return toast('Email already exists.');
  const user = {
    id: uid('U'), role: 'user', first: data.get('first'), middle: '', last: data.get('last'), suffix: '',
    dob: data.get('dob') || '', gender: data.get('gender'), mobile: data.get('mobile'), email,
    password: data.get('password'), status: data.get('status'), traineeAccess: false, warningCount: 0,
    accountStanding: 'Good Standing', restrictedUntil: '', address: {}, emergencyContact: {}, guardian: null
  };
  state.users.push(user);
  log(state, 'Administrator', `Created user account ${user.id}`, 'Users');
  save(state);
  closeModal();
  toast('User account created.');
  adminReload();
}

function adminViewUser(id) {
  const state = load();
  const user = state.users.find(item => item.id === id);
  if (!user) return;
  const bookings = state.bookings.filter(item => item.userId === id);
  const groups = adminTraineeGroups(state, id);
  modal(`
    <h3>${userName(user)} · Account Details</h3>
    <div class="info-row"><span>User ID</span><strong>${user.id}</strong></div>
    <div class="info-row"><span>Email</span><strong>${user.email}</strong></div>
    <div class="info-row"><span>Mobile</span><strong>${user.mobile || '—'}</strong></div>
    <div class="info-row"><span>Account Status</span><strong>${statusBadge(user.status || 'Active')}</strong></div>
    <div class="info-row"><span>Portal Role</span><strong>${user.traineeAccess ? 'Trainee · Coach-confirmed' : 'User'}</strong></div><div class="notice info"><strong>Role control:</strong> Admin can manage account status and warnings, but only the selected coach can grant Trainee access by confirming a Training Request.</div>
    <div class="info-row"><span>Warnings</span><strong>${user.warningCount || 0}</strong></div>
    <div class="info-row"><span>Standing</span><strong>${statusBadge(standingFromWarnings(user, state))}</strong></div>
    <div class="info-row"><span>Court Bookings</span><strong>${bookings.length}</strong></div>
    <div class="info-row"><span>Training Sports</span><strong>${groups.map(group => group.sport).join(', ') || '—'}</strong></div>
    <br>
    <div class="modal-actions">
      <button class="btn btn-light" onclick="closeModal();editUser('${id}')">Edit Account</button>
      <button class="btn btn-dark" onclick="adminToggleUserStatus('${id}')">${user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
    </div>
  `);
}

function adminToggleUserStatus(id) {
  const state = load();
  const user = state.users.find(item => item.id === id);
  if (!user) return;
  user.status = user.status === 'Active' ? 'Deactivated' : 'Active';
  log(state, 'Administrator', `${user.status === 'Active' ? 'Activated' : 'Deactivated'} ${user.id}`, 'Users');
  save(state);
  closeModal();
  toast(`Account ${user.status.toLowerCase()}.`);
  adminReload();
}

function adminAddWarning(id) {
  const state = load();
  const user = state.users.find(item => item.id === id);
  if (!user) return;
  modal(`
    <h3>Add Account Warning</h3>
    <form onsubmit="adminSaveWarning(event,'${id}')">
      <div class="field"><label>Reason *</label><select name="reason" required><option>No-show violation</option><option>Repeated late cancellation</option><option>Facility policy violation</option><option>Behavior concern</option><option>Other</option></select></div>
      <div class="field"><label>Admin Note</label><textarea name="note" rows="4" placeholder="Document the warning reason..."></textarea></div>
      <button class="btn btn-danger full" type="submit">Issue Warning</button>
    </form>
  `);
}

function adminSaveWarning(event, id) {
  event.preventDefault();
  const state = load();
  const user = state.users.find(item => item.id === id);
  const data = new FormData(event.target);
  user.warningCount = Number(user.warningCount || 0) + 1;
  user.accountStanding = standingFromWarnings(user, state);
  if (user.warningCount >= 3) user.restrictedUntil = plusDays(Number(state.settings.restrictionDays || 7));
  notify(state, id, 'Account Warning', `${data.get('reason')}. ${data.get('note') || ''}`.trim());
  log(state, 'Administrator', `Issued warning to ${user.id}: ${data.get('reason')}`, 'Users');
  save(state);
  closeModal();
  toast('Warning issued.');
  adminReload();
}

function adminAssignTraineeGroup(id) {
  const state = load();
  const user = state.users.find(item => item.id === id);
  modal(`
    <h3>Manage ${userName(user)} Training Assignment</h3>
    <form onsubmit="adminSaveTraineeGroup(event,'${id}')">
      <div class="field"><label>Training Group *</label><select name="groupId" required>${adminGroupOptions(state)}</select></div>
      <div class="field"><label>Action</label><select name="action"><option value="add">Add trainee to group</option><option value="move">Move trainee to selected group</option></select></div>
      <button class="btn btn-dark full">Save Assignment</button>
    </form>
  `);
}

function adminSaveTraineeGroup(event, id) {
  event.preventDefault();
  const state = load();
  const data = new FormData(event.target);
  const user = state.users.find(item => item.id === id);
  const group = state.groups.find(item => item.id === data.get('groupId'));
  if (!user || !group) return;
  if (data.get('action') === 'move') state.groups.forEach(item => item.trainees = item.trainees.filter(traineeId => traineeId !== id));
  if (!group.trainees.includes(id)) group.trainees.push(id);
  user.traineeAccess = true;
  user.trainingGroupId = group.id;
  notify(state, id, 'Training Assignment Updated', `You are assigned to ${group.name} for ${group.sport}.`);
  log(state, 'Administrator', `Assigned ${user.id} to ${group.id}`, 'Trainees');
  save(state);
  closeModal();
  toast('Training assignment updated.');
  adminReload();
}

function adminEditCoach(id) {
  const state = load();
  const coach = state.users.find(item => item.id === id);
  if (!coach) return;
  modal(`
    <h3>Edit Coach</h3>
    <form onsubmit="adminSaveCoachEdit(event,'${id}')">
      <div class="form-grid-2">
        <div class="field"><label>Sport</label><select name="sport">${adminSelect(['Badminton','Basketball','Volleyball','Pickleball'], coachSport(coach))}</select></div>
        <div class="field"><label>Status</label><select name="status">${adminSelect(['Active','Deactivated'], coach.status || 'Active')}</select></div>
        <div class="field"><label>Specialization</label><input name="specialization" value="${coach.specialization || ''}"></div>
        <div class="field"><label>Experience</label><input name="experience" value="${coach.experience || ''}"></div>
        <div class="field"><label>Mobile</label><input name="mobile" value="${coach.mobile || ''}"></div>
        <div class="field"><label>Email</label><input name="email" type="email" value="${coach.email || ''}"></div>
        <div class="field"><label>Messenger Link</label><input name="messenger" value="${coach.messenger || ''}"></div>
        <div class="field"><label>Facebook Link</label><input name="facebook" value="${coach.facebook || ''}"></div>
      </div>
      <button class="btn btn-dark full">Save Coach</button>
    </form>
  `);
}

function adminSaveCoachEdit(event, id) {
  event.preventDefault();
  const state = load();
  const coach = state.users.find(item => item.id === id);
  const data = new FormData(event.target);
  ['sport','status','specialization','experience','mobile','email','messenger','facebook'].forEach(key => coach[key] = data.get(key));
  log(state, 'Administrator', `Updated coach ${coach.id}`, 'Coaches');
  save(state);
  closeModal(); toast('Coach updated.'); adminReload();
}

function adminEditGroup(id) {
  const state = load();
  const group = state.groups.find(item => item.id === id);
  if (!group) return;
  modal(`
    <h3>Edit Training Group</h3>
    <form onsubmit="adminSaveGroupEdit(event,'${id}')">
      <div class="form-grid-2">
        <div class="field"><label>Group Name</label><input name="name" value="${group.name}"></div>
        <div class="field"><label>Level</label><select name="level">${adminSelect(['Beginner','Intermediate','Advanced'], group.level || 'Beginner')}</select></div>
        <div class="field"><label>Coach</label><select name="coachId">${adminCoachOptions(state, group.coachId)}</select></div>
        <div class="field"><label>Court</label><select name="court">${adminCourtOptions(state, group.court)}</select></div>
        <div class="field"><label>Training Days</label><input name="days" value="${(group.days || []).join(', ')}"></div>
        <div class="field"><label>Time</label><input name="time" type="time" value="${group.time || ''}"></div>
        <div class="field"><label>Total Sessions</label><input name="totalSessions" type="number" min="1" value="${group.totalSessions || 24}"></div>
        <div class="field"><label>Status</label><select name="status">${adminSelect(['Active','Inactive'], group.status || 'Active')}</select></div>
      </div>
      <button class="btn btn-dark full">Save Group</button>
    </form>
  `);
}

function adminSaveGroupEdit(event, id) {
  event.preventDefault();
  const state = load();
  const group = state.groups.find(item => item.id === id);
  const data = new FormData(event.target);
  group.name = data.get('name'); group.level = data.get('level'); group.coachId = data.get('coachId'); group.court = data.get('court');
  group.days = String(data.get('days') || '').split(',').map(item => item.trim()).filter(Boolean);
  group.time = data.get('time'); group.totalSessions = Number(data.get('totalSessions')); group.status = data.get('status');
  log(state, 'Administrator', `Updated training group ${group.id}`, 'Training Groups');
  save(state); closeModal(); toast('Training group updated.'); adminReload();
}

function adminManageGroupTrainees(id) {
  const state = load();
  const group = state.groups.find(item => item.id === id);
  const candidates = state.users.filter(user => user.traineeAccess || user.role === 'user');
  modal(`
    <h3>${group.name} · Trainees</h3>
    <form onsubmit="adminSaveGroupTrainees(event,'${id}')">
      <div class="admin-check-list">
        ${candidates.map(user => `<label><input type="checkbox" name="trainees" value="${user.id}" ${group.trainees.includes(user.id) ? 'checked' : ''}> <span><strong>${userName(user)}</strong><small>${user.email}</small></span></label>`).join('')}
      </div>
      <button class="btn btn-dark full">Save Trainee List</button>
    </form>
  `);
}

function adminSaveGroupTrainees(event, id) {
  event.preventDefault();
  const state = load();
  const group = state.groups.find(item => item.id === id);
  const data = new FormData(event.target);
  group.trainees = data.getAll('trainees');
  group.trainees.forEach(traineeId => {
    const user = state.users.find(item => item.id === traineeId);
    if (user) { user.traineeAccess = true; user.trainingGroupId = group.id; }
  });
  log(state, 'Administrator', `Updated trainee list for ${group.id}`, 'Training Groups');
  save(state); closeModal(); toast('Group trainees updated.'); adminReload();
}

function adminCourtImageFallback(court) {
  const images = {
    Badminton: IMG.badminton,
    Basketball: IMG.basketball,
    Volleyball: IMG.volleyball,
    Pickleball: IMG.pickleball
  };
  return court.imageUrl || images[court.sport] || IMG.badminton;
}

function adminEditCourtFull(id) {
  const state = load();
  const court = state.courts.find(item => item.id === id);
  if (!court) return;
  modal(`
    <div class="admin-court-editor-head">
      <img class="admin-court-editor-image" src="${adminCourtImageFallback(court)}" alt="${court.name}">
      <div><span class="eyebrow">${court.sport}</span><h3>Manage ${court.name}</h3><p class="muted">Update the court photo, facility information, operating status and reservation details.</p></div>
    </div>
    <form onsubmit="adminSaveCourtFull(event,'${id}')">
      <div class="form-grid-2">
        <div class="field"><label>Court Name *</label><input name="name" value="${court.name}" required></div>
        <div class="field"><label>Sport *</label><select name="sport">${adminSelect(['Badminton','Basketball','Volleyball','Pickleball'], court.sport)}</select></div>
        <div class="field"><label>Status</label><select name="status">${adminSelect(['Available','Maintenance','Unavailable'], court.status)}</select></div>
        <div class="field"><label>Location / Area</label><input name="location" value="${court.location || 'Main Facility'}"></div>
        <div class="field"><label>Surface Type</label><input name="surface" value="${court.surface || ''}" placeholder="e.g. Wood, Vinyl, Acrylic"></div>
        <div class="field"><label>Capacity</label><input name="capacity" type="number" min="1" value="${court.capacity || ''}" placeholder="Players / occupants"></div>
        <div class="field"><label>Open Time</label><input name="openTime" type="time" value="${court.openTime || '06:00'}"></div>
        <div class="field"><label>Close Time</label><input name="closeTime" type="time" value="${court.closeTime || '22:00'}"></div>
      </div>
      <div class="field"><label>Court Photo URL</label><input name="imageUrl" type="url" value="${court.imageUrl || ''}" placeholder="https://...jpg"></div>
      <div class="field"><label>Facility Description</label><textarea name="description" rows="3" placeholder="Describe the court, flooring, lighting and recommended use.">${court.description || ''}</textarea></div>
      <div class="field"><label>Amenities</label><textarea name="amenities" rows="2" placeholder="Lighting, benches, scoreboards, nets, water station...">${court.amenities || ''}</textarea></div>
      <div class="field"><label>Maintenance / Admin Notes</label><textarea name="notes" rows="3">${court.notes || ''}</textarea></div>
      <button class="btn btn-dark full">Save Court Details</button>
    </form>
  `);
}

function adminSaveCourtFull(event, id) {
  event.preventDefault();
  const state = load();
  const court = state.courts.find(item => item.id === id);
  const data = new FormData(event.target);
  ['name','sport','status','location','surface','capacity','openTime','closeTime','imageUrl','description','amenities','notes'].forEach(key => {
    court[key] = data.get(key);
  });
  log(state, 'Administrator', `Updated court details for ${court.id}`, 'Courts');
  save(state);
  closeModal();
  toast('Court details updated.');
  adminReload();
}

function adminBookingDetails(id) {
  const state = load(); const booking = state.bookings.find(item => item.id === id); const user = state.users.find(item => item.id === booking.userId);
  modal(`
    <h3>${booking.id} · Booking Details</h3>
    <div class="info-row"><span>Customer</span><strong>${userName(user)}</strong></div>
    <div class="info-row"><span>Contact</span><strong>${user?.mobile || '—'}</strong></div>
    <div class="info-row"><span>Court</span><strong>${adminCourtName(state, booking.court)}</strong></div>
    <div class="info-row"><span>Date & Time</span><strong>${fmtDate(booking.date)} · ${time12(booking.time)}</strong></div>
    <div class="info-row"><span>Duration</span><strong>${booking.duration / 60} hour(s)</strong></div>
    <div class="info-row"><span>Purpose</span><strong>${booking.purpose || '—'}</strong></div>
    <div class="info-row"><span>Players</span><strong>${booking.players || 1}</strong></div>
    <div class="info-row"><span>Estimated Amount</span><strong>${typeof booking.estimatedAmount === 'number' ? `₱${booking.estimatedAmount.toLocaleString()}` : '—'}</strong></div>
    <div class="info-row"><span>Status</span><strong>${statusBadge(booking.status)}</strong></div>
    <div class="info-row"><span>Notes</span><strong>${booking.notes || '—'}</strong></div>
    <br><button class="btn btn-light full" onclick="closeModal()">Close</button>
  `);
}

function adminRescheduleBooking(id) {
  const state = load(); const booking = state.bookings.find(item => item.id === id);
  modal(`
    <h3>Reschedule ${id}</h3>
    <form onsubmit="adminSaveBookingSchedule(event,'${id}')">
      <div class="form-grid-2">
        <div class="field"><label>Date *</label><input name="date" type="date" value="${booking.date}" required></div>
        <div class="field"><label>Time *</label><input name="time" type="time" value="${booking.time}" required></div>
        <div class="field"><label>Duration</label><select name="duration">${[60,120,180].map(value => `<option value="${value}" ${booking.duration === value ? 'selected' : ''}>${value / 60} hour(s)</option>`).join('')}</select></div>
        <div class="field"><label>Court</label><select name="court">${adminCourtOptions(state, booking.court)}</select></div>
      </div>
      <button class="btn btn-dark full">Save New Schedule</button>
    </form>
  `);
}

function adminSaveBookingSchedule(event, id) {
  event.preventDefault(); const state = load(); const booking = state.bookings.find(item => item.id === id); const data = new FormData(event.target);
  const message = conflict(state, data.get('court'), data.get('date'), data.get('time'), Number(data.get('duration')), id);
  if (message) return toast(message);
  booking.date = data.get('date'); booking.time = data.get('time'); booking.duration = Number(data.get('duration')); booking.court = data.get('court'); booking.status = 'Confirmed';
  notify(state, booking.userId, 'Booking Rescheduled', `${id} was moved to ${fmtDate(booking.date)} at ${time12(booking.time)}.`);
  log(state, 'Administrator', `Rescheduled ${id}`, 'Bookings'); save(state); closeModal(); toast('Booking rescheduled.'); adminReload();
}

function adminCancelBooking(id) {
  const state = load(); const booking = state.bookings.find(item => item.id === id); if (!booking) return;
  booking.status = 'Cancelled'; notify(state, booking.userId, 'Booking Cancelled', `${id} was cancelled by the administrator.`);
  log(state, 'Administrator', `Cancelled ${id}`, 'Bookings'); save(state); toast('Booking cancelled.'); adminReload();
}

function adminSessionDetails(id) {
  const state = load(); const session = state.sessions.find(item => item.id === id); const group = state.groups.find(item => item.id === session.groupId);
  modal(`
    <h3>${session.id} · Session Details</h3>
    <div class="info-row"><span>Training Group</span><strong>${group?.name || '—'}</strong></div>
    <div class="info-row"><span>Sport / Level</span><strong>${group?.sport || '—'} · ${group?.level || '—'}</strong></div>
    <div class="info-row"><span>Coach</span><strong>${adminCoachName(state, session.coachId)}</strong></div>
    <div class="info-row"><span>Schedule</span><strong>${fmtDate(session.date)} · ${time12(session.time)}</strong></div>
    <div class="info-row"><span>Court</span><strong>${adminCourtName(state, session.court)}</strong></div>
    <div class="info-row"><span>Topic</span><strong>${session.topic || '—'}</strong></div>
    <div class="info-row"><span>Status</span><strong>${statusBadge(session.status)}</strong></div>
    <h4>Assigned Trainees</h4>
    <div class="admin-trainee-chips">${(group?.trainees || []).map(traineeId => `<span>${userName(state.users.find(user => user.id === traineeId))}</span>`).join('') || '<span>No trainees</span>'}</div>
    <br><button class="btn btn-light full" onclick="closeModal()">Close</button>
  `);
}

function adminEditSession(id) {
  const state = load(); const session = state.sessions.find(item => item.id === id);
  modal(`
    <h3>Edit Training Session</h3>
    <form onsubmit="adminSaveSessionEdit(event,'${id}')">
      <div class="form-grid-2">
        <div class="field"><label>Group</label><select name="groupId">${adminGroupOptions(state, session.groupId)}</select></div>
        <div class="field"><label>Court</label><select name="court">${adminCourtOptions(state, session.court)}</select></div>
        <div class="field"><label>Date</label><input name="date" type="date" value="${session.date}" required></div>
        <div class="field"><label>Time</label><input name="time" type="time" value="${session.time}" required></div>
        <div class="field"><label>Duration</label><input name="duration" type="number" min="30" step="30" value="${session.duration || 120}"></div>
        <div class="field"><label>Status</label><select name="status">${adminSelect(['Confirmed','Completed','Cancelled','Rescheduled'], session.status)}</select></div>
      </div>
      <div class="field"><label>Session Topic</label><input name="topic" value="${session.topic || ''}"></div>
      <button class="btn btn-dark full">Save Session</button>
    </form>
  `);
}

function adminSaveSessionEdit(event, id) {
  event.preventDefault(); const state = load(); const session = state.sessions.find(item => item.id === id); const data = new FormData(event.target); const group = state.groups.find(item => item.id === data.get('groupId'));
  const message = conflict(state, data.get('court'), data.get('date'), data.get('time'), Number(data.get('duration')), '');
  const conflictingSameSession = session.court === data.get('court') && session.date === data.get('date') && session.time === data.get('time');
  if (message && !conflictingSameSession) return toast(message);
  session.groupId = data.get('groupId'); session.coachId = group?.coachId || session.coachId; session.court = data.get('court'); session.date = data.get('date'); session.time = data.get('time'); session.duration = Number(data.get('duration')); session.status = data.get('status'); session.topic = data.get('topic');
  (group?.trainees || []).forEach(traineeId => notify(state, traineeId, 'Training Session Updated', `${group.name}: ${fmtDate(session.date)} at ${time12(session.time)}.`));
  log(state, 'Administrator', `Updated session ${id}`, 'Training Sessions'); save(state); closeModal(); toast('Session updated.'); adminReload();
}

function adminCorrectAttendance(id) {
  const state = load(); const record = state.attendance.find(item => item.id === id);
  modal(`
    <h3>Correct Attendance</h3>
    <form onsubmit="adminSaveAttendanceCorrection(event,'${id}')">
      <div class="field"><label>Status</label><select name="status">${adminSelect(['Present','Late','Absent','Excused'], record.status)}</select></div>
      <div class="field"><label>Remarks</label><textarea name="remarks" rows="3">${record.remarks || ''}</textarea></div>
      <button class="btn btn-dark full">Save Correction</button>
    </form>
  `);
}

function adminSaveAttendanceCorrection(event, id) {
  event.preventDefault(); const state = load(); const record = state.attendance.find(item => item.id === id); const data = new FormData(event.target);
  record.status = data.get('status'); record.remarks = data.get('remarks');
  log(state, 'Administrator', `Corrected attendance ${id}`, 'Attendance'); save(state); closeModal(); toast('Attendance corrected.'); adminReload();
}

function adminProgressDetails(id) {
  const state = load(); const record = state.progress.find(item => item.id === id); const trainee = state.users.find(item => item.id === record.traineeId);
  modal(`
    <h3>${userName(trainee)} · Progress Assessment</h3>
    <div class="info-row"><span>Date</span><strong>${fmtDate(record.date)}</strong></div>
    <div class="info-row"><span>Coach</span><strong>${adminCoachName(state, record.coachId)}</strong></div>
    <div class="info-row"><span>Technique</span><strong>${record.technique}/5</strong></div>
    <div class="info-row"><span>Consistency</span><strong>${record.consistency}/5</strong></div>
    <div class="info-row"><span>Discipline</span><strong>${record.discipline}/5</strong></div>
    <div class="info-row"><span>Participation</span><strong>${record.participation}/5</strong></div>
    <div class="info-row"><span>Overall</span><strong>${record.average.toFixed(1)}/5 · ${record.assessment}</strong></div>
    <div class="info-row"><span>Coach Remarks</span><strong>${record.remarks || '—'}</strong></div>
    <div class="info-row"><span>Next Focus</span><strong>${record.nextFocus || '—'}</strong></div>
    <br><button class="btn btn-light full" onclick="closeModal()">Close</button>
  `);
}

function adminEditAnnouncement(id) {
  const state = load(); const item = state.announcements.find(entry => entry.id === id);
  modal(`
    <h3>Edit Announcement</h3>
    <form onsubmit="adminSaveAnnouncementEdit(event,'${id}')">
      <div class="field"><label>Title</label><input name="title" value="${item.title}" required></div>
      <div class="field"><label>Audience</label><select name="audience">${adminSelect(['All','Trainees','Coaches'], item.audience)}</select></div>
      <div class="field"><label>Status</label><select name="status">${adminSelect(['Active','Archived'], item.status)}</select></div>
      <div class="field"><label>Message</label><textarea name="message" rows="5" required>${item.message}</textarea></div>
      <button class="btn btn-dark full">Save Announcement</button>
    </form>
  `);
}

function adminSaveAnnouncementEdit(event, id) {
  event.preventDefault(); const state = load(); const item = state.announcements.find(entry => entry.id === id); const data = new FormData(event.target);
  item.title = data.get('title'); item.audience = data.get('audience'); item.status = data.get('status'); item.message = data.get('message');
  log(state, 'Administrator', `Updated announcement ${id}`, 'Announcements'); save(state); closeModal(); toast('Announcement updated.'); adminReload();
}

function adminArchiveAnnouncement(id) {
  const state = load(); const item = state.announcements.find(entry => entry.id === id); item.status = 'Archived';
  log(state, 'Administrator', `Archived announcement ${id}`, 'Announcements'); save(state); toast('Announcement archived.'); adminReload();
}

function adminSaveAcademyInfo(event) {
  event.preventDefault(); const state = load(); const data = new FormData(event.target);
  state.settings.academyName = data.get('academyName'); state.settings.contact = data.get('contact'); state.settings.email = data.get('email'); state.settings.openTime = data.get('openTime'); state.settings.closeTime = data.get('closeTime'); state.settings.systemStatus = data.get('systemStatus');
  log(state, 'Administrator', 'Updated academy information', 'Settings'); save(state); toast('Academy information saved.');
}

function adminApplyTableFilters() {
  const filters = [...document.querySelectorAll('[data-admin-filter]')];
  const rows = [...document.querySelectorAll('.data-table tbody tr')];
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const match = filters.every(control => !control.value || text.includes(String(control.value).toLowerCase()));
    row.style.display = match ? '' : 'none';
  });
}

function adminReportExport(type) {
  const state = load();
  let rows = [['Report','Reference','Date','Name / Description','Status']];
  if (type === 'bookings' || type === 'all') rows.push(...state.bookings.map(item => ['Court Booking', item.id, item.date, adminCourtName(state, item.court), item.status]));
  if (type === 'sessions' || type === 'all') rows.push(...state.sessions.map(item => ['Training Session', item.id, item.date, adminGroupName(state, item.groupId), item.status]));
  if (type === 'attendance' || type === 'all') rows.push(...state.attendance.map(item => ['Attendance', item.id, item.date, userName(state.users.find(user => user.id === item.traineeId)), item.status]));
  if (type === 'progress' || type === 'all') rows.push(...state.progress.map(item => ['Progress', item.id, item.date, userName(state.users.find(user => user.id === item.traineeId)), item.assessment]));
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'})); link.download = `sportivo-${type}-report.csv`; link.click(); URL.revokeObjectURL(link.href);
}

/* ---------- Enhanced views ---------- */
function adminUsersView(state) {
  const users = state.users.filter(user => user.role === 'user' || user.traineeAccess);
  const rows = users.map(user => {
    const groups = adminTraineeGroups(state, user.id);
    return `<tr>
      <td><strong>${userName(user)}</strong><br><span class="muted small">${user.id}</span></td>
      <td>${user.email}<br><span class="muted small">${user.mobile || '—'}</span></td>
      <td>${user.traineeAccess ? '<span class="badge success">Trainee</span><br><span class="muted small">Coach-confirmed</span>' : '<span class="badge sage">User</span><br><span class="muted small">Training request required</span>'}</td>
      <td>${statusBadge(user.status || 'Active')}</td>
      <td>${user.warningCount || 0}<br><span class="muted small">${standingFromWarnings(user, state)}</span></td>
      <td>${state.bookings.filter(item => item.userId === user.id).length}</td>
      <td>${groups.map(group => group.sport).join(', ') || '—'}</td>
      <td class="table-actions"><button class="btn btn-light btn-sm" onclick="adminViewUser('${user.id}')">View</button> <button class="btn btn-light btn-sm" onclick="editUser('${user.id}')">Edit</button> <button class="btn btn-light btn-sm" onclick="adminAddWarning('${user.id}')">Warning</button></td>
    </tr>`;
  });
  return head('User Management','',`<button class="btn btn-dark" onclick="adminAddUser()">+ Add User</button>`) +
    stats([['Registered Users', users.length],['Active Accounts', users.filter(user => user.status === 'Active').length],['Coach-confirmed Trainees', users.filter(user => user.traineeAccess).length],['With Warnings', users.filter(user => Number(user.warningCount || 0) > 0).length]]) +
    `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Roles</option><option>User</option><option>Trainee (Coach-confirmed)</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Account Status</option><option>Active</option><option>Deactivated</option></select></div>` +
    adminSection('User Accounts', rows.length ? table(['User','Contact','Role','Account','Warnings','Bookings','Sports','Actions'], rows) : adminEmpty('Registered users will appear here.'));
}

function adminTraineesView(state) {
  const trainees = state.users.filter(user => user.traineeAccess);
  const rows = trainees.map(trainee => {
    const groups = adminTraineeGroups(state, trainee.id); const attendance = state.attendance.filter(item => item.traineeId === trainee.id); const progress = state.progress.filter(item => item.traineeId === trainee.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
    return `<tr><td><strong>${userName(trainee)}</strong><br><span class="muted small">${trainee.email}</span></td><td>${groups.map(group => `${group.sport} · ${group.name}`).join('<br>') || 'Unassigned'}</td><td>${groups.map(group => adminCoachName(state, group.coachId)).join('<br>') || '—'}</td><td>${attendance.length}</td><td>${(state.trainingPlans || []).filter(plan => plan.traineeId === trainee.id).length}</td><td>${progress ? `${progress.average.toFixed(1)}/5 · ${progress.assessment}` : '—'}</td><td class="table-actions"><button class="btn btn-light btn-sm" onclick="traineeInfo('${trainee.id}')">Details</button> <button class="btn btn-dark btn-sm" onclick="adminAssignTraineeGroup('${trainee.id}')">Assign Group</button></td></tr>`;
  });
  return head('Trainee Management') + stats([['Active Trainees',trainees.length],['Assigned to Groups',trainees.filter(item=>adminTraineeGroups(state,item.id).length).length],['Training Plans',(state.trainingPlans||[]).length],['Attendance Records',state.attendance.length]]) +
    `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Sports / Groups</option>${[...new Set(state.groups.map(group=>group.sport))].map(sport=>`<option>${sport}</option>`).join('')}</select></div>` + adminSection('Trainee Records', rows.length ? table(['Trainee','Sport / Group','Coach','Attendance','Plans','Latest Assessment','Actions'],rows) : adminEmpty('Approved trainees will appear here.'));
}

function adminCoachesView(state) {
  const coaches = state.users.filter(user => user.role === 'coach');
  const rows = coaches.map(coach => { const groups = state.groups.filter(group => group.coachId === coach.id); const sessions = state.sessions.filter(session => session.coachId === coach.id); return `<tr><td><strong>${userName(coach)}</strong><br><span class="muted small">${coach.email}</span></td><td>${coachSport(coach)||'—'}</td><td>${coach.specialization||'—'}</td><td>${coach.experience||'—'}</td><td>${groups.length}</td><td>${groups.reduce((sum,g)=>sum+g.trainees.length,0)}</td><td>${sessions.filter(s=>s.status==='Confirmed').length}</td><td>${statusBadge(coach.status||'Active')}</td><td><button class="btn btn-light btn-sm" onclick="adminEditCoach('${coach.id}')">Manage</button></td></tr>`; });
  return head('Coach Management','',`<button class="btn btn-dark" onclick="createCoachAccess()">+ Create Coach Account</button>`) + stats([['Active Coaches',coaches.filter(c=>c.status==='Active').length],['Assigned Groups',state.groups.length],['Scheduled Sessions',state.sessions.filter(s=>s.status==='Confirmed').length],['Assigned Trainees',state.groups.reduce((sum,g)=>sum+g.trainees.length,0)]]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Sports</option><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Status</option><option>Active</option><option>Deactivated</option></select></div>` + adminSection('Coach Directory', rows.length ? table(['Coach','Sport','Specialization','Experience','Groups','Trainees','Active Sessions','Status','Actions'],rows) : adminEmpty('Coach accounts will appear here.'));
}

function adminGroupsView(state) {
  const cards = state.groups.map(group => { const trainees = group.trainees.map(id=>state.users.find(user=>user.id===id)).filter(Boolean); return `<article class="card admin-group-card"><div class="admin-card-title-row"><div><span class="eyebrow">${group.sport}</span><h3>${group.name}</h3></div>${statusBadge(group.status||'Active')}</div><div class="info-row"><span>Level</span><strong>${group.level||'Beginner'}</strong></div><div class="info-row"><span>Coach</span><strong>${adminCoachName(state,group.coachId)}</strong></div><div class="info-row"><span>Schedule</span><strong>${group.days?.join(' & ')||'—'} · ${time12(group.time)}</strong></div><div class="info-row"><span>Court</span><strong>${adminCourtName(state,group.court)}</strong></div><div class="info-row"><span>Sessions</span><strong>${group.totalSessions||0}</strong></div><div class="admin-trainee-chips">${trainees.map(t=>`<span>${userName(t)}</span>`).join('')||'<span>No trainees assigned</span>'}</div><div class="admin-card-actions"><button class="btn btn-light" onclick="adminEditGroup('${group.id}')">Edit Group</button><button class="btn btn-dark" onclick="adminManageGroupTrainees('${group.id}')">Manage Trainees</button></div></article>`; }).join('');
  return head('Training Groups','',`<button class="btn btn-dark" onclick="newGroup()">+ Create Training Group</button>`) + stats([['Training Groups',state.groups.length],['Active Groups',state.groups.filter(g=>g.status==='Active').length],['Assigned Trainees',state.groups.reduce((sum,g)=>sum+g.trainees.length,0)],['Sports Covered',new Set(state.groups.map(g=>g.sport)).size]]) + `<br><div class="grid grid-2">${cards||adminEmpty('Create a training group to begin.')}</div>`;
}

function adminMasterView(state) {
  const rows = [...state.bookings.map(item=>({date:item.date,time:item.time,court:item.court,type:'Court Booking',ref:item.id,person:userName(state.users.find(user=>user.id===item.userId)),status:item.status})),...state.sessions.map(item=>({date:item.date,time:item.time,court:item.court,type:'Training',ref:adminGroupName(state,item.groupId),person:adminCoachName(state,item.coachId),status:item.status}))].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const conflicts = [];
  rows.forEach((row,index)=>rows.slice(index+1).forEach(other=>{ if(row.date===other.date&&row.court===other.court&&row.time===other.time&&['Confirmed','Pending'].includes(row.status)&&['Confirmed','Pending'].includes(other.status)) conflicts.push(`${row.ref} / ${other.ref}`); }));
  return head('Master Schedule') + stats([['All Scheduled Records',rows.length],['Court Bookings',rows.filter(r=>r.type==='Court Booking').length],['Training Sessions',rows.filter(r=>r.type==='Training').length],['Possible Conflicts',conflicts.length]]) + `<div class="admin-filterbar"><input data-admin-filter type="date" onchange="adminApplyTableFilters()"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Types</option><option>Court Booking</option><option>Training</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Courts</option>${state.courts.map(c=>`<option>${c.name}</option>`).join('')}</select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Status</option><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option><option>Rescheduled</option></select></div>` + adminSection('Combined Academy Schedule', rows.length ? table(['Date','Time','Type','Reference / Group','User / Coach','Court','Status'],rows.map(row=>`<tr><td>${fmtDate(row.date)}<span class="hidden-admin-date"> ${row.date}</span></td><td>${time12(row.time)}</td><td>${row.type}</td><td>${row.ref}</td><td>${row.person}</td><td>${adminCourtName(state,row.court)}</td><td>${statusBadge(row.status)}</td></tr>`)) : adminEmpty('No schedule records yet.')) + (conflicts.length ? `<div class="notice danger"><strong>Potential conflicts:</strong> ${conflicts.join(', ')}</div>` : `<div class="notice success"><strong>Schedule check:</strong> No obvious same-time court conflicts found.</div>`);
}

function adminCourtsView(state) {
  const cards = state.courts.map((court,index)=>{ const fallback=[IMG.badminton,IMG.basketball,IMG.volleyball,IMG.pickleball][index%4]; const image=court.imageUrl||fallback; return `<article class="card admin-court-card"><div class="admin-court-photo" style="background-image:url('${image}')"></div><div class="admin-card-title-row"><div><span class="eyebrow">${court.sport}</span><h3>${court.name}</h3></div>${statusBadge(court.status)}</div><p class="muted admin-court-description">${court.description||'Indoor academy court prepared for scheduled training and court reservations.'}</p><div class="info-row"><span>Location</span><strong>${court.location||'Main Facility'}</strong></div><div class="info-row"><span>Surface</span><strong>${court.surface||'Sports flooring'}</strong></div><div class="info-row"><span>Capacity</span><strong>${court.capacity||'—'}</strong></div><div class="info-row"><span>Amenities</span><strong>${court.amenities||'Lighting, benches'}</strong></div><div class="info-row"><span>Operating Hours</span><strong>${time12(court.openTime||'06:00')}–${time12(court.closeTime||'22:00')}</strong></div><div class="info-row"><span>Active Bookings</span><strong>${state.bookings.filter(b=>b.court===court.id&&['Pending','Confirmed'].includes(b.status)).length}</strong></div><button class="btn btn-light full" onclick="adminEditCourtFull('${court.id}')">View / Manage Details</button></article>`; }).join('');
  return head('Court Management','',`<button class="btn btn-dark" onclick="addCourt()">+ Add Court</button>`) + stats([['Total Courts',state.courts.length],['Available',state.courts.filter(c=>c.status==='Available').length],['Maintenance',state.courts.filter(c=>c.status==='Maintenance').length],['Unavailable',state.courts.filter(c=>c.status==='Unavailable').length]]) + `<br><div class="grid grid-2">${cards||adminEmpty('Add courts to begin.')}</div>`;
}

function adminBookingsView(state) {
  const rows = state.bookings.slice().sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)).map(booking=>{ const user=state.users.find(item=>item.id===booking.userId); return `<tr><td><strong>${booking.id}</strong></td><td>${userName(user)}</td><td>${adminCourtName(state,booking.court)}<br><span class="muted small">${state.courts.find(c=>c.id===booking.court)?.sport||'—'}</span></td><td>${fmtDate(booking.date)}<br><span class="muted small">${time12(booking.time)} · ${booking.duration/60} hr</span></td><td>${booking.purpose||'—'}</td><td>${statusBadge(booking.status)}</td><td class="table-actions"><button class="btn btn-light btn-sm" onclick="adminBookingDetails('${booking.id}')">View</button> ${booking.status==='Pending'?`<button class="btn btn-dark btn-sm" onclick="confirmBooking('${booking.id}')">Confirm</button> <button class="btn btn-light btn-sm" onclick="rejectBooking('${booking.id}')">Reject</button>`:''} ${booking.status==='Confirmed'?`<button class="btn btn-light btn-sm" onclick="adminRescheduleBooking('${booking.id}')">Reschedule</button> <button class="btn btn-light btn-sm" onclick="checkIn('${booking.id}')">Check In</button> <button class="btn btn-danger btn-sm" onclick="adminCancelBooking('${booking.id}')">Cancel</button>`:''}</td></tr>`; });
  return head('Court Bookings') + stats([['Pending',state.bookings.filter(b=>b.status==='Pending').length],['Confirmed',state.bookings.filter(b=>b.status==='Confirmed').length],['Completed',state.bookings.filter(b=>b.status==='Completed').length],['Cancelled / Rejected',state.bookings.filter(b=>['Cancelled','Rejected'].includes(b.status)).length]]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Status</option><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option><option>Rejected</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Sports</option><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select></div>` + adminSection('Booking Records',rows.length?table(['Booking','Player','Court / Sport','Schedule','Purpose','Status','Actions'],rows):adminEmpty('Court booking requests will appear here.'));
}

function adminSessionsView(state) {
  const rows = state.sessions.slice().sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)).map(session=>`<tr><td><strong>${session.id}</strong></td><td>${adminGroupName(state,session.groupId)}</td><td>${adminCoachName(state,session.coachId)}</td><td>${fmtDate(session.date)}<br><span class="muted small">${time12(session.time)}</span></td><td>${adminCourtName(state,session.court)}</td><td>${session.topic||'—'}</td><td>${statusBadge(session.status)}</td><td class="table-actions"><button class="btn btn-light btn-sm" onclick="adminSessionDetails('${session.id}')">View</button> <button class="btn btn-dark btn-sm" onclick="adminEditSession('${session.id}')">Edit</button></td></tr>`);
  return head('Training Sessions','',`<button class="btn btn-dark" onclick="newSession()">+ Create Session</button>`) + stats([['Total Sessions',state.sessions.length],['Confirmed',state.sessions.filter(s=>s.status==='Confirmed').length],['Completed',state.sessions.filter(s=>s.status==='Completed').length],['Cancelled / Rescheduled',state.sessions.filter(s=>['Cancelled','Rescheduled'].includes(s.status)).length]]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Status</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option><option>Rescheduled</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Groups</option>${state.groups.map(g=>`<option>${g.name}</option>`).join('')}</select></div>` + adminSection('Session Records',rows.length?table(['Session','Training Group','Coach','Schedule','Court','Topic','Status','Actions'],rows):adminEmpty('Training sessions will appear here.'));
}

function adminAttendanceView(state) {
  const records=state.attendance.slice().sort((a,b)=>b.date.localeCompare(a.date));
  const rows=records.map(record=>{const trainee=state.users.find(u=>u.id===record.traineeId),session=state.sessions.find(s=>s.id===record.sessionId),group=session?state.groups.find(g=>g.id===session.groupId):adminTraineeGroups(state,record.traineeId)[0];return `<tr><td>${fmtDate(record.date)}</td><td><strong>${userName(trainee)}</strong></td><td>${group?.sport||'—'}</td><td>${group?.name||'—'}</td><td>${record.sessionId||'—'}</td><td>${statusBadge(record.status)}</td><td>${record.remarks||'—'}</td><td><button class="btn btn-light btn-sm" onclick="adminCorrectAttendance('${record.id}')">Correct</button></td></tr>`;});
  return head('Attendance Management') + stats([['Attendance Records',records.length],['Present',records.filter(r=>r.status==='Present').length],['Late',records.filter(r=>r.status==='Late').length],['Absent / Excused',records.filter(r=>['Absent','Excused'].includes(r.status)).length]]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Attendance</option><option>Present</option><option>Late</option><option>Absent</option><option>Excused</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Sports</option><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select></div>` + adminSection('Attendance Records',rows.length?table(['Date','Trainee','Sport','Group','Session','Status','Remarks','Action'],rows):adminEmpty('Coach attendance records will appear here.'));
}

function adminProgressView(state) {
  const records=state.progress.slice().sort((a,b)=>b.date.localeCompare(a.date)); const avg=records.length?records.reduce((sum,item)=>sum+Number(item.average||0),0)/records.length:0;
  const rows=records.map(record=>{const trainee=state.users.find(u=>u.id===record.traineeId),group=adminTraineeGroups(state,record.traineeId).find(g=>g.coachId===record.coachId)||adminTraineeGroups(state,record.traineeId)[0];return `<tr><td>${fmtDate(record.date)}</td><td><strong>${userName(trainee)}</strong><br><span class="muted small">${group?.sport||'—'}</span></td><td>${adminCoachName(state,record.coachId)}</td><td>${record.average.toFixed(1)}/5</td><td>${record.assessment}</td><td>${record.nextFocus||'—'}</td><td><button class="btn btn-light btn-sm" onclick="adminProgressDetails('${record.id}')">View Assessment</button></td></tr>`;});
  return head('Progress Monitoring') + stats([['Assessments',records.length],['Average Rating',records.length?`${avg.toFixed(1)}/5`:'—'],['Trainees Assessed',new Set(records.map(r=>r.traineeId)).size],['Coaches Reporting',new Set(records.map(r=>r.coachId)).size]]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Sports</option><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Assessments</option><option>Excellent</option><option>Very Good</option><option>Good</option><option>Needs Improvement</option></select></div>` + adminSection('Coach Assessments',rows.length?table(['Date','Trainee / Sport','Coach','Overall','Assessment','Next Focus','Action'],rows):adminEmpty('Coach assessments will appear here.'));
}

function adminAnnouncementsView(state) {
  const rows=state.announcements.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(item=>`<tr><td>${fmtDate(item.date)}</td><td><strong>${item.title}</strong></td><td>${item.audience}</td><td>${item.message}</td><td>${statusBadge(item.status)}</td><td class="table-actions"><button class="btn btn-light btn-sm" onclick="adminEditAnnouncement('${item.id}')">Edit</button>${item.status==='Active'?` <button class="btn btn-light btn-sm" onclick="adminArchiveAnnouncement('${item.id}')">Archive</button>`:''}</td></tr>`);
  return head('Announcements','',`<button class="btn btn-dark" onclick="newAnnouncement()">+ New Announcement</button>`) + stats([['Announcements',state.announcements.length],['Active',state.announcements.filter(a=>a.status==='Active').length],['For All Users',state.announcements.filter(a=>a.audience==='All').length],['Targeted',state.announcements.filter(a=>a.audience!=='All').length]]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Audience</option><option>All</option><option>Trainees</option><option>Coaches</option></select><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Status</option><option>Active</option><option>Archived</option></select></div>` + adminSection('Published Notices',rows.length?table(['Date','Title','Audience','Message','Status','Actions'],rows):adminEmpty('Announcements will appear here.'));
}

function adminReportsView(state) {
  const completedBookings=state.bookings.filter(b=>b.status==='Completed'); const completedSessions=state.sessions.filter(s=>s.status==='Completed'); const attendanceTotal=state.attendance.length; const present=state.attendance.filter(a=>a.status==='Present').length; const attendanceRate=attendanceTotal?Math.round((present/attendanceTotal)*100):0;
  return head('Reports') + `<div class="admin-filterbar"><select id="adminReportType"><option value="all">Complete Operations</option><option value="bookings">Court Bookings</option><option value="sessions">Training Sessions</option><option value="attendance">Attendance</option><option value="progress">Progress</option></select><button class="btn btn-dark" onclick="adminReportExport(document.getElementById('adminReportType').value)">Export CSV</button></div><div class="grid grid-4"><article class="card admin-report-card"><span>Court Booking Report</span><strong>${state.bookings.length}</strong><small>${completedBookings.length} completed bookings</small></article><article class="card admin-report-card"><span>Training Session Report</span><strong>${state.sessions.length}</strong><small>${completedSessions.length} completed sessions</small></article><article class="card admin-report-card"><span>Attendance Report</span><strong>${attendanceRate}%</strong><small>${present} present of ${attendanceTotal} records</small></article><article class="card admin-report-card"><span>Trainee Report</span><strong>${state.users.filter(u=>u.traineeAccess).length}</strong><small>${state.groups.length} training groups</small></article></div><div class="admin-dashboard-grid">${adminSection('Court Usage by Sport',table(['Sport','Courts','Bookings','Training Sessions'],[...new Set(state.courts.map(c=>c.sport))].map(sport=>{const ids=state.courts.filter(c=>c.sport===sport).map(c=>c.id);return `<tr><td><strong>${sport}</strong></td><td>${ids.length}</td><td>${state.bookings.filter(b=>ids.includes(b.court)).length}</td><td>${state.sessions.filter(s=>ids.includes(s.court)).length}</td></tr>`;})))}${adminSection('Coach Workload',table(['Coach','Groups','Trainees','Sessions','Progress Updates'],state.users.filter(u=>u.role==='coach').map(coach=>{const groups=state.groups.filter(g=>g.coachId===coach.id);return `<tr><td><strong>${userName(coach)}</strong></td><td>${groups.length}</td><td>${groups.reduce((sum,g)=>sum+g.trainees.length,0)}</td><td>${state.sessions.filter(s=>s.coachId===coach.id).length}</td><td>${state.progress.filter(p=>p.coachId===coach.id).length}</td></tr>`;})))}</div>`;
}

function adminLogsView(state) {
  const rows=state.logs.slice(0,150).map(item=>`<tr><td>${item.id}</td><td>${fmtDate(item.date)}<br><span class="muted small">${item.time}</span></td><td><strong>${item.actor}</strong></td><td>${item.module}</td><td>${item.action}</td></tr>`);
  return head('Activity Logs') + stats([['Recorded Activities',state.logs.length],['Today',state.logs.filter(l=>l.date===today()).length],['Modules Affected',new Set(state.logs.map(l=>l.module)).size],['Latest Actor',state.logs[0]?.actor||'—']]) + `<div class="admin-filterbar"><select data-admin-filter onchange="adminApplyTableFilters()"><option value="">All Modules</option>${[...new Set(state.logs.map(l=>l.module))].map(module=>`<option>${module}</option>`).join('')}</select><input data-admin-filter placeholder="Filter actor or action..." oninput="adminApplyTableFilters()"></div>` + adminSection('System Activity',rows.length?table(['Log ID','Date / Time','User','Module','Action'],rows):adminEmpty('System actions will appear here.'));
}

function adminSettingsView(state) {
  return head('Settings') + `<div class="admin-dashboard-grid"><form id="settingsForm" class="card admin-settings-card"><div class="admin-section-head"><h3>Booking & Attendance Rules</h3></div><div class="form-grid-2"><div class="field"><label>Cancellation Notice</label><div class="input-suffix"><input name="cancelHours" type="number" min="0" value="${state.settings.cancelHours}"><span>hours</span></div></div><div class="field"><label>Reschedule Notice</label><div class="input-suffix"><input name="rescheduleHours" type="number" min="0" value="${state.settings.rescheduleHours}"><span>hours</span></div></div><div class="field"><label>No-Show Grace Period</label><div class="input-suffix"><input name="graceMinutes" type="number" min="0" value="${state.settings.graceMinutes}"><span>minutes</span></div></div><div class="field"><label>Restriction Duration</label><div class="input-suffix"><input name="restrictionDays" type="number" min="1" value="${state.settings.restrictionDays}"><span>days</span></div></div></div><button class="btn btn-dark" type="submit">Save Rules</button></form><form class="card admin-settings-card" onsubmit="adminSaveAcademyInfo(event)"><div class="admin-section-head"><h3>Academy Information</h3></div><div class="field"><label>Academy Name</label><input name="academyName" value="${state.settings.academyName||'SPORTIVO Management System'}"></div><div class="form-grid-2"><div class="field"><label>Contact</label><input name="contact" value="${state.settings.contact||''}"></div><div class="field"><label>Email</label><input name="email" type="email" value="${state.settings.email||''}"></div><div class="field"><label>Operating Start</label><input name="openTime" type="time" value="${state.settings.openTime||'06:00'}"></div><div class="field"><label>Operating End</label><input name="closeTime" type="time" value="${state.settings.closeTime||'22:00'}"></div></div><div class="field"><label>System Status</label><select name="systemStatus">${adminSelect(['Active','Maintenance Mode'],state.settings.systemStatus||'Active')}</select></div><button class="btn btn-dark" type="submit">Save Academy Info</button><button class="btn btn-light" type="button" onclick="resetDemo()">Reset Demo Data</button></form></div>`;
}

function bindAdminModule(route) {
  // Reserved for route-specific Admin behavior.
  // Most controls use explicit event handlers to keep each module simple.
  adminApplyTableFilters();
}


/* =========================================================
   COURT MANAGEMENT — DETAILED ADMIN CREATE FLOW
========================================================= */
function addCourt() {
  modal(`
    <h3>Add Court</h3>
    <form onsubmit="saveCourt(event)">
      <div class="form-grid-2">
        <div class="field"><label>Court Name *</label><input name="name" required placeholder="Badminton Court 3"></div>
        <div class="field"><label>Sport *</label><select name="sport">${adminSelect(['Badminton','Basketball','Volleyball','Pickleball'])}</select></div>
        <div class="field"><label>Location / Area</label><input name="location" value="Main Facility"></div>
        <div class="field"><label>Surface Type</label><input name="surface" placeholder="Wood / Vinyl / Acrylic"></div>
        <div class="field"><label>Capacity</label><input name="capacity" type="number" min="1" placeholder="10"></div>
        <div class="field"><label>Status</label><select name="status">${adminSelect(['Available','Maintenance','Unavailable'],'Available')}</select></div>
        <div class="field"><label>Open Time</label><input name="openTime" type="time" value="06:00"></div>
        <div class="field"><label>Close Time</label><input name="closeTime" type="time" value="22:00"></div>
      </div>
      <div class="field"><label>Court Photo URL</label><input name="imageUrl" type="url" placeholder="https://...jpg"></div>
      <div class="field"><label>Facility Description</label><textarea name="description" rows="3"></textarea></div>
      <div class="field"><label>Amenities</label><textarea name="amenities" rows="2" placeholder="Lighting, benches, net, scoreboard..."></textarea></div>
      <div class="field"><label>Maintenance Notes</label><textarea name="notes" rows="2"></textarea></div>
      <button class="btn btn-dark full">Add Court</button>
    </form>
  `);
}

function saveCourt(event) {
  event.preventDefault();
  const state = load();
  const data = new FormData(event.target);
  state.courts.push({
    id: uid('CT'),
    name: data.get('name'),
    sport: data.get('sport'),
    status: data.get('status') || 'Available',
    location: data.get('location') || 'Main Facility',
    surface: data.get('surface') || '',
    capacity: data.get('capacity') || '',
    openTime: data.get('openTime') || '06:00',
    closeTime: data.get('closeTime') || '22:00',
    imageUrl: data.get('imageUrl') || '',
    description: data.get('description') || '',
    amenities: data.get('amenities') || '',
    notes: data.get('notes') || ''
  });
  log(state, 'Administrator', 'Added a new court with facility details', 'Courts');
  save(state);
  closeModal();
  toast('Court added.');
  adminReload();
}
