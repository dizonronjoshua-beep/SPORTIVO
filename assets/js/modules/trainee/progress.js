/* =========================================================
   SPORTIVO — TRAINEE / PROGRESS
   ---------------------------------------------------------
   Page-specific rendering for the trainee progress module.
   Shared state helpers remain in app.js and trainee.js.
========================================================= */

function progressMetric(label, value) {
  const score = Math.max(0, Math.min(5, Number(value || 0)));
  const percent = (score / 5) * 100;

  return `
    <article class="progress-metric-card">
      <div class="progress-metric-head">
        <span>${label}</span>
        <strong>${score}/5</strong>
      </div>

      <div class="progress-metric-track" aria-label="${label}: ${score} out of 5">
        <span style="width: ${percent}%"></span>
      </div>
    </article>
  `;
}

window.traineeProgress = function traineeProgress(state, user) {
  const data = trainingContext(state, user);
  const latest = data.progress[0];
  const sportSelector = sportTitleFilter(data.groups, data.group?.sport);

  const overview = latest
    ? `
      <section class="progress-overview-card card">
        <div class="progress-score-panel">
          <span class="progress-label">LATEST ASSESSMENT</span>
          <div class="progress-big-score">
            <strong>${Number(latest.average || 0).toFixed(1)}</strong>
            <span>/ 5</span>
          </div>
          <div class="progress-assessment-name">${latest.assessment || 'Assessment'}</div>
          <div class="progress-date">Updated ${fmtDate(latest.date)}</div>
        </div>

        <div class="progress-summary-panel-v2">
          <span class="progress-label">COACH SUMMARY</span>
          <h3>${userName(data.coach)}</h3>
          <p>${latest.remarks || 'No coach summary has been added yet.'}</p>

          <div class="progress-focus-box">
            <span>Next Training Focus</span>
            <strong>${latest.nextFocus || 'Continue the current training plan'}</strong>
          </div>
        </div>
      </section>

      <section class="progress-metrics-grid">
        ${progressMetric('Technique', latest.technique)}
        ${progressMetric('Consistency', latest.consistency)}
        ${progressMetric('Discipline', latest.discipline)}
        ${progressMetric('Participation', latest.participation)}
      </section>
    `
    : `
      <section class="card progress-empty-v2">
        <strong>No assessment available yet</strong>
        <p>Your coach's first progress evaluation for this sport will appear here.</p>
      </section>
    `;

  const history = data.progress.length
    ? data.progress.map((record, index) => `
        <article class="progress-history-row ${index === 0 ? 'latest' : ''}">
          <div class="progress-history-date">
            <span>${fmtDate(record.date)}</span>
            ${index === 0 ? '<small>Latest</small>' : ''}
          </div>

          <div class="progress-history-copy">
            <strong>${record.assessment || 'Assessment'}</strong>
            <p>${record.remarks || 'No remarks.'}</p>
            <span>Next focus: ${record.nextFocus || '—'}</span>
          </div>

          <div class="progress-history-score">
            <strong>${Number(record.average || 0).toFixed(1)}</strong>
            <span>/5</span>
          </div>
        </article>
      `).join('')
    : '<div class="progress-empty-v2"><p>No feedback history yet.</p></div>';

  return head('Progress', '', sportSelector) + `
    <section class="progress-context-card card">
      <div>
        <span>Sport</span>
        <strong>${data.group?.sport || '—'}</strong>
      </div>

      <div>
        <span>Coach</span>
        <strong>${userName(data.coach)}</strong>
      </div>

      <div>
        <span>Total Assessments</span>
        <strong>${data.progress.length}</strong>
      </div>
    </section>

    ${overview}

    <section class="card progress-history-v2">
      <div class="progress-section-title">
        <div>
          <span class="progress-label">DEVELOPMENT HISTORY</span>
          <h3>Coach Feedback</h3>
        </div>
        <strong>${data.progress.length} record${data.progress.length === 1 ? '' : 's'}</strong>
      </div>

      <div class="progress-history-list-v2">
        ${history}
      </div>
    </section>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.sportivoPage = 'trainee-progress';
});
