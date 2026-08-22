/* =========================================================
   SPORTIVO - COACH SCHEDULE
   ---------------------------------------------------------
   Interactive calendar and coach-controlled session planner.
========================================================= */

let coachScheduleState = {
  selectedDate: '',
  calendarMonth: '',
  sortBy: 'time-asc'
};

function coachScheduleSessions(state, coach) {
  return state.sessions.filter(session => session.coachId === coach.id);
}

function coachScheduleGroups(state, coach) {
  return state.groups.filter(group => group.coachId === coach.id);
}

function coachScheduleInitialDate(state, coach) {
  const sessions = coachScheduleSessions(state, coach)
    .slice()
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const todayValue = today();
  const next = sessions.find(session => session.date >= todayValue);
  return next?.date || sessions[0]?.date || todayValue;
}

function coachScheduleCourtName(state, courtId) {
  return state.courts.find(court => court.id === courtId)?.name || courtId || '—';
}

function coachScheduleTrainees(state, groupId) {
  const group = state.groups.find(item => item.id === groupId);
  if (!group) return [];

  return group.trainees
    .map(id => state.users.find(user => user.id === id))
    .filter(Boolean);
}

function coachScheduleStatusClass(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'completed') return 'is-completed';
  if (value === 'cancelled') return 'is-cancelled';
  if (value === 'rescheduled') return 'is-rescheduled';
  return 'is-confirmed';
}

function coachScheduleView(state, coach) {
  const selected = coachScheduleState.selectedDate || coachScheduleInitialDate(state, coach);
  coachScheduleState.selectedDate = selected;
  coachScheduleState.calendarMonth = coachScheduleState.calendarMonth || selected.slice(0, 7);

  return `
    <div class="page-head coach-schedule-heading">
      <div>
        <h2>My Schedule</h2>
      </div>

      <div class="coach-schedule-heading-actions">
        <label class="coach-sort-control">
          <span>Sort</span>
          <select id="coachScheduleSort">
            <option value="time-asc" ${coachScheduleState.sortBy === 'time-asc' ? 'selected' : ''}>Time · Earliest First</option>
            <option value="time-desc" ${coachScheduleState.sortBy === 'time-desc' ? 'selected' : ''}>Time · Latest First</option>
            <option value="group" ${coachScheduleState.sortBy === 'group' ? 'selected' : ''}>Training Group</option>
            <option value="status" ${coachScheduleState.sortBy === 'status' ? 'selected' : ''}>Session Status</option>
          </select>
        </label>

        <button
          class="btn btn-dark coach-add-session-button"
          id="coachAddSessionButton"
          type="button"
        >
          + Add Session
        </button>
      </div>
    </div>

    <div class="coach-schedule-layout">
      <aside class="card coach-calendar-card">
        <div class="coach-calendar-toolbar">
          <button type="button" class="calendar-nav-button" id="coachPrevMonth" aria-label="Previous month">‹</button>
          <strong id="coachCalendarMonthLabel"></strong>
          <button type="button" class="calendar-nav-button" id="coachNextMonth" aria-label="Next month">›</button>
        </div>

        <div class="coach-calendar-weekdays" aria-hidden="true">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div class="coach-calendar-grid" id="coachCalendarGrid"></div>

        <div class="coach-calendar-legend">
          <span><i class="legend-dot has-session"></i> Has schedule</span>
          <span><i class="legend-dot selected-day"></i> Selected date</span>
        </div>
      </aside>

      <section class="coach-day-panel">
        <div class="coach-day-header">
          <div>
            <span class="section-kicker">SELECTED DATE</span>
            <h3 id="coachSelectedDateLabel">${fmtDate(selected)}</h3>
          </div>

          <div class="coach-day-count" id="coachDayCount"></div>
        </div>

        <div id="coachScheduleList" class="coach-session-list"></div>
      </section>
    </div>
  `;
}

function renderCoachCalendar() {
  const state = load();
  const coach = currentUser(state);
  if (!coach) return;

  const monthValue = coachScheduleState.calendarMonth || coachScheduleState.selectedDate.slice(0, 7);
  const [year, month] = monthValue.split('-').map(Number);
  const first = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  const startOffset = first.getDay();
  const sessions = coachScheduleSessions(state, coach);

  const label = first.toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric'
  });

  const monthLabel = document.getElementById('coachCalendarMonthLabel');
  if (monthLabel) monthLabel.textContent = label;

  const grid = document.getElementById('coachCalendarGrid');
  if (!grid) return;

  let html = '';

  for (let i = 0; i < startOffset; i += 1) {
    html += '<span class="coach-calendar-empty"></span>';
  }

  for (let day = 1; day <= lastDay; day += 1) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = sessions.filter(session => session.date === date).length;
    const isSelected = date === coachScheduleState.selectedDate;
    const isToday = date === today();

    html += `
      <button
        type="button"
        class="coach-calendar-day ${count ? 'has-session' : ''} ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}"
        data-coach-calendar-date="${date}"
      >
        <span>${day}</span>
        ${count ? `<small>${count}</small>` : ''}
      </button>
    `;
  }

  grid.innerHTML = html;

  grid.querySelectorAll('[data-coach-calendar-date]').forEach(button => {
    button.addEventListener('click', () => {
      coachScheduleState.selectedDate = button.dataset.coachCalendarDate;
      renderCoachCalendar();
      renderCoachScheduleDay();
    });
  });
}

function sortedCoachDaySessions(state, coach) {
  const selectedDate = coachScheduleState.selectedDate;
  const groups = coachScheduleGroups(state, coach);

  const list = coachScheduleSessions(state, coach)
    .filter(session => session.date === selectedDate)
    .slice();

  if (coachScheduleState.sortBy === 'time-desc') {
    return list.sort((a, b) => b.time.localeCompare(a.time));
  }

  if (coachScheduleState.sortBy === 'group') {
    return list.sort((a, b) => {
      const groupA = groups.find(group => group.id === a.groupId)?.name || '';
      const groupB = groups.find(group => group.id === b.groupId)?.name || '';
      return groupA.localeCompare(groupB);
    });
  }

  if (coachScheduleState.sortBy === 'status') {
    return list.sort((a, b) => String(a.status).localeCompare(String(b.status)));
  }

  return list.sort((a, b) => a.time.localeCompare(b.time));
}

function coachTraineeChips(state, groupId) {
  const trainees = coachScheduleTrainees(state, groupId);

  if (!trainees.length) {
    return '<span class="coach-no-trainees">No trainees assigned yet</span>';
  }

  return trainees.map(trainee => `
    <span class="coach-trainee-chip">
      <i>${initialsFor(trainee)}</i>
      ${userName(trainee)}
    </span>
  `).join('');
}

function renderCoachScheduleDay() {
  const state = load();
  const coach = currentUser(state);
  if (!coach) return;

  const sessions = sortedCoachDaySessions(state, coach);
  const dateLabel = document.getElementById('coachSelectedDateLabel');
  const countLabel = document.getElementById('coachDayCount');
  const list = document.getElementById('coachScheduleList');

  if (dateLabel) dateLabel.textContent = fmtDate(coachScheduleState.selectedDate);
  if (countLabel) countLabel.textContent = `${sessions.length} ${sessions.length === 1 ? 'session' : 'sessions'}`;
  if (!list) return;

  if (!sessions.length) {
    list.innerHTML = `
      <div class="coach-empty-schedule">
        <div class="coach-empty-icon">▦</div>
        <h4>No schedule for this date</h4>
        <p>Select another date or create a new session for this day.</p>
        <button type="button" class="btn btn-dark" id="coachEmptyAddSession">+ Add Session</button>
      </div>
    `;

    document.getElementById('coachEmptyAddSession')?.addEventListener('click', openCoachAddSession);
    return;
  }

  list.innerHTML = sessions.map(session => {
    const group = state.groups.find(item => item.id === session.groupId);
    const canEdit = !['Completed', 'Cancelled'].includes(session.status);

    return `
      <article class="coach-session-card ${coachScheduleStatusClass(session.status)}">
        <div class="coach-session-time">
          <strong>${time12(session.time)}</strong>
          <span>${Number(session.duration || 60) / 60} hr${Number(session.duration || 60) > 60 ? 's' : ''}</span>
        </div>

        <div class="coach-session-main">
          <div class="coach-session-topline">
            <div>
              <span class="session-sport">${group?.sport || 'Training'}</span>
              <h4>${group?.name || 'Training Session'}</h4>
            </div>
            ${statusBadge(session.status)}
          </div>

          <div class="coach-session-meta">
            <span><b>Court</b>${coachScheduleCourtName(state, session.court)}</span>
            <span><b>Topic</b>${session.topic || 'General training'}</span>
            <span><b>Level</b>${group?.level || '—'}</span>
          </div>

          <div class="coach-trainee-section">
            <div class="coach-trainee-heading">
              <strong>Trainees</strong>
              <span>${coachScheduleTrainees(state, session.groupId).length} assigned</span>
            </div>
            <div class="coach-trainee-list">
              ${coachTraineeChips(state, session.groupId)}
            </div>
          </div>
        </div>

        <div class="coach-session-actions">
          <button
            type="button"
            class="btn btn-light btn-sm"
            onclick="openCoachSessionDetails('${session.id}')"
          >
            View Details
          </button>

          <button
            type="button"
            class="btn btn-dark btn-sm"
            ${canEdit ? '' : 'disabled'}
            onclick="openCoachReschedule('${session.id}')"
          >
            Reschedule
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function bindCoachSchedule() {
  const state = load();
  const coach = currentUser(state);
  if (!coach) return;

  if (!coachScheduleState.selectedDate) {
    coachScheduleState.selectedDate = coachScheduleInitialDate(state, coach);
  }

  if (!coachScheduleState.calendarMonth) {
    coachScheduleState.calendarMonth = coachScheduleState.selectedDate.slice(0, 7);
  }

  document.getElementById('coachScheduleSort')?.addEventListener('change', event => {
    coachScheduleState.sortBy = event.target.value;
    renderCoachScheduleDay();
  });

  document.getElementById('coachAddSessionButton')?.addEventListener('click', openCoachAddSession);

  document.getElementById('coachPrevMonth')?.addEventListener('click', () => {
    const [year, month] = coachScheduleState.calendarMonth.split('-').map(Number);
    const next = new Date(year, month - 2, 1);
    coachScheduleState.calendarMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    renderCoachCalendar();
  });

  document.getElementById('coachNextMonth')?.addEventListener('click', () => {
    const [year, month] = coachScheduleState.calendarMonth.split('-').map(Number);
    const next = new Date(year, month, 1);
    coachScheduleState.calendarMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    renderCoachCalendar();
  });

  renderCoachCalendar();
  renderCoachScheduleDay();
}

function coachGroupOptions(state, coachId, selectedGroupId = '') {
  return state.groups
    .filter(group => group.coachId === coachId && group.status === 'Active')
    .map(group => `
      <option value="${group.id}" ${group.id === selectedGroupId ? 'selected' : ''}>
        ${group.name} · ${group.sport}
      </option>
    `)
    .join('');
}

function coachCourtOptions(state, selectedCourt = '') {
  return state.courts
    .filter(court => court.status === 'Available')
    .map(court => `
      <option value="${court.id}" ${court.id === selectedCourt ? 'selected' : ''}>
        ${court.name}
      </option>
    `)
    .join('');
}

function openCoachAddSession() {
  const state = load();
  const coach = currentUser(state);
  if (!coach) return;

  const groups = coachScheduleGroups(state, coach).filter(group => group.status === 'Active');
  if (!groups.length) {
    toast('You need an active training group before adding a session.');
    return;
  }

  const defaultGroup = groups[0];
  const dateValue = coachScheduleState.selectedDate || today();

  modal(`
    <div class="modal-head">
      <div>
        <span class="section-kicker">COACH SCHEDULE</span>
        <h2>Add Training Session</h2>
      </div>
      <button type="button" class="modal-close" onclick="closeModal()">×</button>
    </div>

    <form id="coachAddSessionForm" class="coach-session-form">
      <div class="form-grid-2">
        <div class="field">
          <label>Training Group *</label>
          <select name="groupId" required>
            ${coachGroupOptions(state, coach.id, defaultGroup.id)}
          </select>
        </div>

        <div class="field">
          <label>Date *</label>
          <input name="date" type="date" value="${dateValue}" required>
        </div>

        <div class="field">
          <label>Time *</label>
          <input name="time" type="time" value="${defaultGroup.time || '16:00'}" required>
        </div>

        <div class="field">
          <label>Duration *</label>
          <select name="duration" required>
            <option value="60">1 hour</option>
            <option value="90">1 hour 30 minutes</option>
            <option value="120" selected>2 hours</option>
          </select>
        </div>

        <div class="field full">
          <label>Court *</label>
          <select name="court" required>
            ${coachCourtOptions(state, defaultGroup.court)}
          </select>
        </div>

        <div class="field full">
          <label>Session Topic *</label>
          <input name="topic" placeholder="Example: Footwork and recovery" required>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-light" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-dark">Add Session</button>
      </div>
    </form>
  `);

  document.getElementById('coachAddSessionForm')?.addEventListener('submit', saveCoachSession);
}

function coachHasScheduleConflict(state, coachId, date, time, duration, ignoreSessionId = '') {
  return state.sessions.some(session => {
    if (session.id === ignoreSessionId) return false;
    if (session.coachId !== coachId) return false;
    if (session.date !== date) return false;
    if (!['Confirmed', 'Rescheduled'].includes(session.status)) return false;
    return overlap(time, duration, session.time, session.duration);
  });
}

function saveCoachSession(event) {
  event.preventDefault();

  const state = load();
  const coach = currentUser(state);
  if (!coach) return;

  const data = new FormData(event.target);
  const group = state.groups.find(item => item.id === data.get('groupId'));
  if (!group || group.coachId !== coach.id) {
    toast('Select one of your assigned training groups.');
    return;
  }

  const date = data.get('date');
  const time = data.get('time');
  const duration = Number(data.get('duration'));
  const court = data.get('court');

  const courtConflict = conflict(state, court, date, time, duration);
  if (courtConflict) {
    toast(courtConflict);
    return;
  }

  if (coachHasScheduleConflict(state, coach.id, date, time, duration)) {
    toast('You already have another training session during this time.');
    return;
  }

  const session = {
    id: uid('S'),
    groupId: group.id,
    coachId: coach.id,
    court,
    date,
    time,
    duration,
    status: 'Confirmed',
    topic: String(data.get('topic') || '').trim()
  };

  state.sessions.push(session);
  log(state, userName(coach), `Added training session ${session.id}`, 'My Schedule');

  group.trainees.forEach(traineeId => {
    notify(
      state,
      traineeId,
      'Training Session Added',
      `${group.name} has a new session on ${fmtDate(date)} at ${time12(time)}.`
    );
  });

  save(state);
  coachScheduleState.selectedDate = date;
  coachScheduleState.calendarMonth = date.slice(0, 7);
  closeModal();
  toast('Training session added.');
  renderCoachCalendar();
  renderCoachScheduleDay();
}

function openCoachReschedule(sessionId) {
  const state = load();
  const coach = currentUser(state);
  const session = state.sessions.find(item => item.id === sessionId && item.coachId === coach?.id);
  if (!session) return;

  if (['Completed', 'Cancelled'].includes(session.status)) {
    toast('Completed or cancelled sessions cannot be rescheduled.');
    return;
  }

  const group = state.groups.find(item => item.id === session.groupId);

  modal(`
    <div class="modal-head">
      <div>
        <span class="section-kicker">${group?.name || 'TRAINING SESSION'}</span>
        <h2>Reschedule Session</h2>
      </div>
      <button type="button" class="modal-close" onclick="closeModal()">×</button>
    </div>

    <form id="coachRescheduleForm" class="coach-session-form" data-session-id="${session.id}">
      <div class="form-grid-2">
        <div class="field">
          <label>New Date *</label>
          <input name="date" type="date" value="${session.date}" required>
        </div>

        <div class="field">
          <label>New Time *</label>
          <input name="time" type="time" value="${session.time}" required>
        </div>

        <div class="field">
          <label>Duration *</label>
          <select name="duration" required>
            <option value="60" ${Number(session.duration) === 60 ? 'selected' : ''}>1 hour</option>
            <option value="90" ${Number(session.duration) === 90 ? 'selected' : ''}>1 hour 30 minutes</option>
            <option value="120" ${Number(session.duration) === 120 ? 'selected' : ''}>2 hours</option>
          </select>
        </div>

        <div class="field">
          <label>New Court *</label>
          <select name="court" required>
            ${coachCourtOptions(state, session.court)}
          </select>
        </div>

        <div class="field full">
          <label>Reason / Note *</label>
          <textarea name="note" placeholder="Explain the schedule adjustment for the trainees." required></textarea>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-light" onclick="closeModal()">Keep Current Schedule</button>
        <button type="submit" class="btn btn-dark">Save New Schedule</button>
      </div>
    </form>
  `);

  document.getElementById('coachRescheduleForm')?.addEventListener('submit', saveCoachReschedule);
}

function saveCoachReschedule(event) {
  event.preventDefault();

  const state = load();
  const coach = currentUser(state);
  if (!coach) return;

  const sessionId = event.target.dataset.sessionId;
  const session = state.sessions.find(item => item.id === sessionId && item.coachId === coach.id);
  if (!session) return;

  const data = new FormData(event.target);
  const date = data.get('date');
  const time = data.get('time');
  const duration = Number(data.get('duration'));
  const court = data.get('court');
  const note = String(data.get('note') || '').trim();

  const courtConflict = conflict(state, court, date, time, duration, session.id);
  if (courtConflict) {
    toast(courtConflict);
    return;
  }

  if (coachHasScheduleConflict(state, coach.id, date, time, duration, session.id)) {
    toast('You already have another training session during this time.');
    return;
  }

  const oldDate = session.date;
  const oldTime = session.time;
  const oldCourt = session.court;

  session.date = date;
  session.time = time;
  session.duration = duration;
  session.court = court;
  session.status = 'Rescheduled';
  session.rescheduleNote = note;

  const group = state.groups.find(item => item.id === session.groupId);
  group?.trainees.forEach(traineeId => {
    notify(
      state,
      traineeId,
      'Training Schedule Changed',
      `${group.name} moved from ${fmtDate(oldDate)} ${time12(oldTime)} to ${fmtDate(date)} ${time12(time)} at ${coachScheduleCourtName(state, court)}.`
    );
  });

  log(
    state,
    userName(coach),
    `Rescheduled ${session.id} from ${oldDate} ${oldTime} ${oldCourt} to ${date} ${time} ${court}`,
    'My Schedule'
  );

  save(state);
  coachScheduleState.selectedDate = date;
  coachScheduleState.calendarMonth = date.slice(0, 7);
  closeModal();
  toast('Session schedule updated.');
  renderCoachCalendar();
  renderCoachScheduleDay();
}

function openCoachSessionDetails(sessionId) {
  const state = load();
  const coach = currentUser(state);
  const session = state.sessions.find(item => item.id === sessionId && item.coachId === coach?.id);
  if (!session) return;

  const group = state.groups.find(item => item.id === session.groupId);
  const trainees = coachScheduleTrainees(state, session.groupId);

  modal(`
    <div class="modal-head">
      <div>
        <span class="section-kicker">${session.id}</span>
        <h2>${group?.name || 'Training Session'}</h2>
      </div>
      <button type="button" class="modal-close" onclick="closeModal()">×</button>
    </div>

    <div class="coach-detail-summary">
      <div><span>Date</span><strong>${fmtDate(session.date)}</strong></div>
      <div><span>Time</span><strong>${time12(session.time)}</strong></div>
      <div><span>Court</span><strong>${coachScheduleCourtName(state, session.court)}</strong></div>
      <div><span>Status</span><strong>${session.status}</strong></div>
      <div class="wide"><span>Topic</span><strong>${session.topic || 'General training'}</strong></div>
    </div>

    <div class="coach-modal-trainees">
      <div class="coach-trainee-heading">
        <strong>Trainees</strong>
        <span>${trainees.length} assigned</span>
      </div>

      <div class="coach-trainee-list">
        ${coachTraineeChips(state, session.groupId)}
      </div>
    </div>
  `);
}
