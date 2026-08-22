# SPORTIVO V65 — Integrated Workflow Build

This build uses the supplied SPORTIVO V46 project as the base. The existing landing-page Availability/Timetable implementation was intentionally preserved.

## Latest UI / flow changes
- Sidebar module navigation is text-only; decorative icons were removed.
- The portal top bar contains only Search and the notification Bell.
- The landing hero aligns to the same left/right content width as Programs & Training.
- Landing and Programs `View Program` buttons open the selected sport directly in `program-details.html`.
- Program Details includes the sport image, About the Program, program information, learning topics, schedule link, and training-request entry point.
- `Enroll to Another Sport` is renamed to `Enroll Program`; trainees can request another program/session focus even under the same sport.
- Book a Court records actual Player / Visitor names, with a maximum of 6 total players.
- Booking Guide is a numbered professional policy list without decorative icons.
- My Bookings uses one `View Details` action. Cancellation, emergency cancellation, reschedule, warning appeal, Pre-Invoice, and Final Invoice live inside details.

## Booking workflow
1. Public timetable selection (unchanged) or direct Book a Court.
2. Booker details are auto-filled.
3. Actual Player / Visitor names are collected (max 6).
4. Appointment and available court/time are selected.
5. Estimated charges are calculated from configured court pricing.
6. Submit → Pending Admin Review, Payment Status = Unpaid, Payment Method = Walk-in / On-site.
7. Admin approves/rejects.
8. Confirmed bookings support walk-in payment recording and check-in.
9. Check-in → In Use.
10. Complete Court Use → Completed + Final Invoice.

## Cancellation
- 6+ hours before: cancellation is immediate, no Admin approval, court slot released.
- Under 6 hours: Emergency Cancellation can be submitted for Admin review.
- Approved emergency cancellation releases the slot and does not create a warning.

## Booking reschedule
- One approved reschedule per booking.
- Must be requested at least 6 hours before.
- Original reservation remains active while pending.
- Admin checks the requested court/date/time and approves/rejects.

## Payment / invoices
- Walk-in / on-site payments only.
- Admin records payment.
- Pre-Invoice = expected charges before court use.
- Final Invoice = actual final charges after court use.

## Warnings / appeals
- No-Show by itself does not expose Apply Appeal.
- Admin issuing a Warning creates an Active Warning record.
- Apply Appeal appears only for an Active Warning.
- Approved appeal resolves the Warning; rejected appeal leaves it Active.

## Training request
- User first sees a short Training Request overview and chooses whether to continue.
- Program / Session Focus is stored separately from sport.
- Same sport may be requested again when the program/session focus differs.
- Coach confirmation grants Trainee access.

## Trainee training
- My Training includes `Enroll Program`.
- My Sessions remains available.
- Training Schedule supports trainee reschedule requests.
- Preferred date/time is sent to the Coach, not Admin.
- If unavailable, Coach can send an alternative available schedule.
- Trainee can Accept or Request Another Schedule.
- Session ID remains unchanged through rescheduling.

## Coach portal
- Training Requests grant Trainee role/access after Coach approval.
- My Schedule remains Coach-controlled and supports coach-initiated schedule changes.
- Attendance is checklist-based.
- Training Plans includes `+ Add Training Plan` and saved plans appear in Trainee My Training.
- Activity Log module is included and read-only.
- Training Groups and Trainee Management stay under Coach.

## Admin portal
- User Management does not provide an Add User button in the enhanced view; users self-register.
- Admin does not grant Trainee access.
- Court Management supports detailed court creation with local image upload, capacity/pricing, and availability blocking.
- Standard booking maximum is capped at 6 players.
- Coach Management includes availability management.
- Court Bookings includes booking review, walk-in payment, check-in, completion, emergency cancellation review, and reschedule review.
- Master Schedule, Announcements, Appeals, Reports, Activity Logs, Progress Monitoring, and Settings remain connected to the existing system.

## Files added / updated
- `program-details.html`
- `assets/js/program-details.js`
- `assets/css/v65-integrated.css`
- `assets/js/v65-integrated.js`
- `coach/activity-log.html`
- existing portal/public files updated to load the integrated layer

The project remains a front-end prototype using the existing localStorage/sessionStorage architecture.
