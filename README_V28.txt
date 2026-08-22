SPORTIVO V28 — TRAINEE FILTERS & BOOKING POLICY UI

UPDATES

BOOK A COURT
- Redesigned Booking Policies into four colored policy cards.
- Confirmation, cancellation, reschedule, and no-show/grace-period rules are easier to scan.
- Existing mini calendar, daily timetable, court columns, and available-time summary are preserved.

MY TRAINING
- Sport dropdown now appears beside the page title when the trainee belongs to more than one sport.
- Training assignment and schedule switch to the selected sport only.

TRAINING SCHEDULE
- Sport dropdown appears beside the page title when multiple sports are available.
- Completed sessions have disabled Reschedule and Cancel actions.
- Disabled actions use muted gray styling and cannot be clicked.

MY SESSIONS
- Sport dropdown appears beside the title.
- Only sessions under the selected sport are displayed.
- Completed count is calculated directly from rows whose status is Completed.
- Total, Remaining, and Cancelled summaries are calculated from the displayed sport records.

ATTENDANCE / PROGRESS
- Sport dropdown appears beside the title when applicable.
- Records are limited to the selected sport.
- New coach progress records save the related sport/group so future filtering is accurate.

CODE STRUCTURE
- HTML remains separate from CSS and JavaScript.
- Shared HTML shell: portal.html and other .html pages
- Shared CSS: assets/css/styles.css
- Shared JavaScript: assets/js/app.js
- Updated trainee functions were reformatted into readable blocks with clear variable names.

NOTE
This remains a browser prototype using localStorage/sessionStorage. Production multi-user use requires a backend/database.
