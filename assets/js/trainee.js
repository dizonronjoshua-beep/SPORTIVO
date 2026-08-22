/* =========================================================
   SPORTIVO - TRAINEE MODULES
   ---------------------------------------------------------
   Handles:
   - My Training
   - Training Schedule
   - My Sessions
   - Progress
   - Shared sport/status filters
========================================================= */

function traineeGroups(state, user) {
  return state.groups.filter(group => group.trainees.includes(user.id));
}

function selectedTrainingGroup(state, user) {
  const groups = traineeGroups(state, user);
  const selectedSport = sessionStorage.getItem('sportivoTrainingSport');

  return groups.find(group => group.sport === selectedSport) || groups[0];
}

function trainingContext(state, user) {
  const groups = traineeGroups(state, user);
  const group = selectedTrainingGroup(state, user);
  const coach = state.users.find(item => item.id === group?.coachId);

  const sessions = state.sessions
    .filter(session => session.groupId === group?.id)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const progress = state.progress
    .filter(record => {
      if (record.traineeId !== user.id) return false;
      if (!group) return true;

      if (record.sport) return record.sport === group.sport;
      if (record.groupId) return record.groupId === group.id;

      return record.coachId === group.coachId;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    groups,
    group,
    coach,
    sessions,
    progress
  };
}

function sessionStatusKey(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function isCompletedSession(session) {
  const status = sessionStatusKey(session?.status);
  return status === 'complete' || status === 'completed';
}

function sportTitleFilter(groups, selectedSport) {
  const sports = [...new Set(groups.map(group => group.sport).filter(Boolean))];

  if (!sports.length) return '';

  return `
    <label class="title-sport-filter">
      <span>Sport</span>
      <select
        id="traineeSportFilter"
        aria-label="Choose sport"
        ${sports.length === 1 ? 'disabled' : ''}
      >
        ${sports.map(sport => `
          <option value="${sport}" ${sport === selectedSport ? 'selected' : ''}>
            ${sport}
          </option>
        `).join('')}
      </select>
    </label>
  `;
}

function sessionStatusFilter(selectedStatus) {
  const options = ['All', 'Ongoing / Scheduled', 'Completed', 'Cancelled', 'Rescheduled'];

  return `
    <label class="title-sport-filter session-status-filter">
      <span>Session Status</span>
      <select id="traineeSessionStatusFilter" aria-label="Filter sessions by status">
        ${options.map(status => `
          <option value="${status}" ${status === selectedStatus ? 'selected' : ''}>
            ${status}
          </option>
        `).join('')}
      </select>
    </label>
  `;
}

function traineeTraining(state, user) {
  const data = trainingContext(state, user);
  const group = data.group;
  const coach = data.coach;
  const sportSelector = sportTitleFilter(data.groups, group?.sport);

  const titleActions = `
    <div class="title-actions">
      ${sportSelector}
      <a class="btn btn-dark add-sport-button" href="training-request.html?from=training">
        + Enroll Program
      </a>
    </div>
  `;

  const plans = Array.isArray(state.trainingPlans) ? state.trainingPlans : [];
  const plan = plans.find(item =>
    item.traineeId === user.id && item.groupId === group?.id
  );

  const planDetail = (label, value) => value ? `
    <div class="trainee-plan-detail">
      <span>${label}</span>
      <p>${value}</p>
    </div>
  ` : '';

  const trainingPlanCard = plan ? `
    <article class="card trainee-plan-card detailed-trainee-plan">
      <div class="section-heading-row">
        <div>
          <span class="eyebrow">COACH TRAINING PLAN</span>
          <h3>${group?.sport || 'Training'} Development Plan</h3>
          <p class="muted plan-intro">Your coach's detailed guide for your current training cycle.</p>
        </div>
        ${statusBadge(plan.status || 'Active')}
      </div>

      <div class="training-plan-grid training-plan-overview-grid">
        <div>
          <span>Training Phase</span>
          <strong>${plan.phase || '—'}</strong>
        </div>
        <div>
          <span>Current Level</span>
          <strong>${plan.level || '—'}</strong>
        </div>
        <div>
          <span>Program Duration</span>
          <strong>${plan.programDuration || '—'}</strong>
        </div>
        <div>
          <span>Sessions / Week</span>
          <strong>${plan.sessionsPerWeek || '—'}</strong>
        </div>
        <div>
          <span>Session Duration</span>
          <strong>${plan.sessionDuration || '—'}</strong>
        </div>
        <div>
          <span>Target Review</span>
          <strong>${plan.reviewDate ? fmtDate(plan.reviewDate) : 'Not set'}</strong>
        </div>
      </div>

      <section class="trainee-plan-section">
        <div class="trainee-plan-section-head">
          <span>01</span>
          <h4>Goals & Development Focus</h4>
        </div>
        <div class="trainee-plan-detail-grid">
          ${planDetail('Main Training Goal', plan.goal)}
          ${planDetail('Current Weekly Focus', plan.weeklyFocus)}
          ${planDetail('Technical Skills', plan.technicalFocus)}
          ${planDetail('Tactical / Game Strategy', plan.tacticalFocus)}
          ${planDetail('Physical Conditioning', plan.physicalFocus)}
          ${planDetail('Mental / Discipline Focus', plan.mentalFocus)}
        </div>
      </section>

      <section class="trainee-plan-section">
        <div class="trainee-plan-section-head">
          <span>02</span>
          <h4>Session Structure</h4>
        </div>
        <div class="trainee-plan-detail-grid">
          ${planDetail('Warm-up Routine', plan.warmup)}
          ${planDetail('Main Skill Drills', plan.mainDrills)}
          ${planDetail('Game / Application Drills', plan.applicationDrills)}
          ${planDetail('Conditioning Component', plan.conditioning)}
          ${planDetail('Cool-down / Recovery', plan.cooldown)}
        </div>
      </section>

      <section class="trainee-plan-section">
        <div class="trainee-plan-section-head">
          <span>03</span>
          <h4>Milestones & Evaluation</h4>
        </div>
        <div class="trainee-plan-detail-grid">
          ${planDetail('Short-term Milestones', plan.shortTermMilestones)}
          ${planDetail('Long-term Milestones', plan.longTermMilestones)}
          ${planDetail('Evaluation Criteria', plan.evaluationCriteria)}
          ${planDetail('Home Practice', plan.homePractice)}
        </div>
      </section>

      <section class="trainee-plan-section">
        <div class="trainee-plan-section-head">
          <span>04</span>
          <h4>Requirements & Coach Notes</h4>
        </div>
        <div class="trainee-plan-detail-grid">
          ${planDetail('Required Equipment', plan.equipment)}
          ${planDetail('Safety / Medical Considerations', plan.safetyNotes)}
          ${planDetail('Coach Instructions', plan.notes)}
        </div>
      </section>

      <p class="muted small plan-updated-at">
        Last updated by ${userName(coach)}${plan.updatedAt ? ` · ${new Date(plan.updatedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
      </p>
    </article>
  ` : `
    <article class="card trainee-plan-card plan-empty">
      <span class="eyebrow">COACH TRAINING PLAN</span>
      <h3>No training plan has been set yet.</h3>
      <p class="muted">Your coach can create a detailed training plan that will appear here automatically.</p>
    </article>
  `;

  return head('My Training', '', titleActions) + `
    <div class="grid grid-2">
      <article class="card">
        <h3>Training Assignment</h3>

        <div class="info-row">
          <span>Group</span>
          <strong>${group?.name || '—'}</strong>
        </div>

        <div class="info-row">
          <span>Sport</span>
          <strong>${group?.sport || '—'}</strong>
        </div>

        <div class="info-row">
          <span>Coach</span>
          <strong>${userName(coach)}</strong>
        </div>

        <div class="info-row">
          <span>Court</span>
          <strong>
            ${group
              ? (state.courts.find(court => court.id === group.court)?.name || group.court)
              : '—'}
          </strong>
        </div>
      </article>

      <article class="card">
        <h3>Schedule</h3>

        <div class="info-row">
          <span>Days</span>
          <strong>${group?.days?.join(' & ') || '—'}</strong>
        </div>

        <div class="info-row">
          <span>Time</span>
          <strong>${time12(group?.time)}</strong>
        </div>

        <div class="info-row">
          <span>Start Date</span>
          <strong>${fmtDate(group?.startDate)}</strong>
        </div>

        <div class="info-row">
          <span>Total Sessions</span>
          <strong>${group?.totalSessions || 0}</strong>
        </div>
      </article>
    </div>

    <br>
    ${trainingPlanCard}
  `;
}

function traineeSchedule(state, user) {
  const data = trainingContext(state, user);
  const sportSelector = sportTitleFilter(data.groups, data.group?.sport);

  const rows = data.sessions.map(session => {
    const completed = isCompletedSession(session);
    const confirmed = sessionStatusKey(session.status) === 'confirmed';

    const hasCancelRequest = (session.traineeCancelRequests || []).some(request =>
      request.traineeId === user.id && request.status === 'For Review'
    );

    const hasRescheduleRequest = (session.traineeRescheduleRequests || []).some(request =>
      request.traineeId === user.id && request.status === 'For Review'
    );

    let actions = '—';

    if (completed) {
      actions = `
        <div class="completed-actions">
          <button class="btn btn-sm action-disabled" type="button" disabled>
            Reschedule
          </button>
        </div>
      `;
    } else if (confirmed) {
      actions = `
        <div class="session-actions">
          <button
            class="btn btn-sm ${hasRescheduleRequest ? 'session-reschedule-requested' : 'btn-light'}"
            type="button"
            ${hasRescheduleRequest ? 'disabled' : `onclick="requestTrainingReschedule('${session.id}')"`}
          >
            ${hasRescheduleRequest ? 'Reschedule Requested' : 'Reschedule'}
          </button>
        </div>
      `;
    }

    return `
      <tr class="${completed ? 'row-completed' : ''}">
        <td>${session.id}</td>
        <td><b>${data.group?.sport || '—'}</b></td>
        <td>${fmtDate(session.date)}</td>
        <td>${time12(session.time)}</td>
        <td>${state.courts.find(court => court.id === session.court)?.name || session.court}</td>
        <td>${userName(data.coach)}</td>
        <td>${session.topic}</td>
        <td>${statusBadge(session.status === 'Confirmed' ? 'Complete' : session.status)}</td>
        <td>${actions}</td>
      </tr>
    `;
  });

  return head('Training Schedule', '', sportSelector) + table(
    ['Session', 'Sport', 'Date', 'Time', 'Court', 'Coach', 'Topic', 'Status', 'Actions'],
    rows
  );
}

function traineeSessions(state, user) {
  const data = trainingContext(state, user);
  const selectedStatus = sessionStorage.getItem('sportivoSessionStatus') || 'All';

  const sportSelector = sportTitleFilter(data.groups, data.group?.sport);
  const statusSelector = sessionStatusFilter(selectedStatus);

  const filteredSessions = data.sessions.filter(session => {
    if (selectedStatus === 'All') return true;

    if (selectedStatus === 'Completed') {
      return isCompletedSession(session);
    }

    if (selectedStatus === 'Ongoing / Scheduled') {
      return ['confirmed', 'ongoing'].includes(sessionStatusKey(session.status));
    }

    return sessionStatusKey(session.status) === selectedStatus.toLowerCase();
  });

  const completedSessions = filteredSessions.filter(isCompletedSession);
  const cancelledSessions = filteredSessions.filter(session =>
    sessionStatusKey(session.status) === 'cancelled'
  );

  const ongoingSessions = filteredSessions.filter(session =>
    !isCompletedSession(session) &&
    !['cancelled'].includes(sessionStatusKey(session.status))
  );

  const rows = filteredSessions.map(session => `
    <tr>
      <td>${session.id}</td>
      <td><b>${data.group?.sport || '—'}</b></td>
      <td>${fmtDate(session.date)}</td>
      <td>${userName(data.coach)}</td>
      <td>${session.topic}</td>
      <td>${statusBadge(session.status === 'Confirmed' ? 'Complete' : session.status)}</td>
    </tr>
  `);

  return head(
    'My Sessions',
    '',
    `<div class="title-filter-group">${sportSelector}${statusSelector}</div>`
  ) +
    stats([
      ['Displayed Sessions', filteredSessions.length],
      ['Completed', completedSessions.length],
      ['Ongoing / Scheduled', ongoingSessions.length],
      ['Cancelled', cancelledSessions.length]
    ]) +
    `<br>${table(
      ['Session', 'Sport', 'Date', 'Coach', 'Topic', 'Session Status'],
      rows
    )}`;
}

function ratingRow(label, value) {
  const safe = Number(value || 0);
  const percent = Math.max(0, Math.min(100, (safe / 5) * 100));

  return `
    <div class="rating-row">
      <span>${label}</span>
      <div class="rating-track">
        <div class="rating-fill" style="width:${percent}%"></div>
      </div>
      <strong>${safe}/5</strong>
    </div>
  `;
}

function traineeProgress(state, user) {
  const data = trainingContext(state, user);
  const latest = data.progress[0];
  const sportSelector = sportTitleFilter(data.groups, data.group?.sport);

  const score = latest ? Number(latest.average || 0) : 0;
  const scorePercent = Math.max(0, Math.min(100, (score / 5) * 100));

  const latestFeedback = latest ? `
    <div class="progress-summary-panel">
      <div class="progress-score-block">
        <span class="progress-kicker">Latest Assessment</span>
        <div class="progress-score-line">
          <strong>${latest.average.toFixed(1)}</strong>
          <span>/ 5</span>
        </div>
        <div class="progress-assessment-label">${latest.assessment}</div>
      </div>

      <div class="progress-summary-copy">
        <span class="progress-kicker">Coach Summary</span>
        <p>${latest.remarks}</p>
        <div class="overall-progress-track" aria-label="Overall assessment ${scorePercent.toFixed(0)} percent">
          <span style="width:${scorePercent}%"></span>
        </div>
      </div>
    </div>

    <div class="rating-grid">
      ${ratingRow('Technique', latest.technique)}
      ${ratingRow('Consistency', latest.consistency)}
      ${ratingRow('Discipline', latest.discipline)}
      ${ratingRow('Participation', latest.participation)}
    </div>

    <div class="next-focus-card">
      <div class="next-focus-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
      <div>
        <span>Next Focus</span>
        <strong>${latest.nextFocus || 'Continue current training plan'}</strong>
      </div>
    </div>
  ` : `
    <div class="progress-empty-state">
      <strong>No assessment yet</strong>
      <p class="muted">Your coach's first assessment for this sport will appear here.</p>
    </div>
  `;

  const history = data.progress.length
    ? data.progress.map((record, index) => `
        <article class="progress-history-item ${index === 0 ? 'is-latest' : ''}">
          <div class="history-head">
            <div>
              <span class="history-date">${fmtDate(record.date)}</span>
              ${index === 0 ? '<span class="history-latest-badge">Latest</span>' : ''}
            </div>
            <strong>${record.average.toFixed(1)}/5</strong>
          </div>
          <h4>${record.assessment}</h4>
          <p>${record.remarks}</p>
          <div class="history-focus"><span>Next focus</span><strong>${record.nextFocus || '—'}</strong></div>
        </article>
      `).join('')
    : '<div class="progress-empty-state"><p class="muted">No feedback history yet for this sport.</p></div>';

  return head('Progress', '', sportSelector) + `
    <div class="progress-profile-strip">
      <div>
        <span>Sport</span>
        <strong>${data.group?.sport || '—'}</strong>
      </div>
      <div>
        <span>Coach</span>
        <strong>${userName(data.coach)}</strong>
      </div>
      <div>
        <span>Assessments</span>
        <strong>${data.progress.length}</strong>
      </div>
    </div>

    <div class="progress-layout">
      <article class="card progress-main-card">
        ${latestFeedback}
      </article>

      <article class="card progress-history-card">
        <div class="progress-section-heading">
          <div>
            <span class="progress-kicker">History</span>
            <h3>Coach Feedback</h3>
          </div>
          <span class="history-count">${data.progress.length}</span>
        </div>
        <div class="progress-history-list">${history}</div>
      </article>
    </div>
  `;
}

function bindTraineeSportFilter(route) {
  const sportFilter = $('#traineeSportFilter');

  sportFilter?.addEventListener('change', event => {
    sessionStorage.setItem('sportivoTrainingSport', event.target.value);
    go(route, false);
  });

  if (route === 'sessions') {
    const statusFilter = $('#traineeSessionStatusFilter');

    statusFilter?.addEventListener('change', event => {
      sessionStorage.setItem('sportivoSessionStatus', event.target.value);
      go(route, false);
    });
  }
}
