SPORTIVO V42 — COMPLETE ADMIN OPERATIONS UPDATE

Admin Portal enhancements:
- Dashboard: live operations summary, attention queue and quick actions.
- User Management: create, view, edit, activate/deactivate, issue/clear warnings, role/standing review.
- Trainee Management: detailed trainee records and training-group assignment/move tools.
- Coach Management: create and manage coach profile, sport, specialization, experience, links and status.
- Training Groups: create/edit groups and manage assigned trainees.
- Master Schedule: combined court/training schedule, filters and basic conflict visibility.
- Court Management: add/manage courts, sport, status, location, operating hours and maintenance notes.
- Court Bookings: details, confirm/reject, reschedule, check-in/complete and cancel.
- Training Sessions: create, view and edit session group, date, time, court, topic and status.
- Attendance: review/filter and correct attendance records.
- Progress Monitoring: filter and open full coach assessments.
- Announcements: create, edit and archive notices by audience/status.
- Appeals: review, approve or reject no-show appeals using existing SPORTIVO warning rules.
- Reports: operation summaries, coach workload, court usage and selectable CSV exports.
- Activity Logs: searchable/filterable audit history.
- Settings: booking rules, restriction rules, academy contact, operating hours and system status.
- Profile: Admin account profile remains available from the profile card under the SPORTIVO logo.

Architecture remains separated:
- admin/*.html = individual Admin module pages
- assets/css/admin.css = Admin-only presentation
- assets/js/admin.js = Admin-only content and operations
- assets/js/app.js = shared state/auth/common helpers
- assets/js/module-router.js = separate-page routing

NOTE: This remains a frontend prototype using localStorage/sessionStorage. Real secure multi-user concurrency and permanent database transactions require a backend/database.
