SPORTIVO MANAGEMENT SYSTEM — GLASS FINAL V12

DESIGN
- Same palette: Forest #181C14, Charcoal #3C3D37, Sage #697565, Cream #ECDFCC, White.
- Larger readable typography and glass/frosted cards.
- Real sports/court photographs loaded from Wikimedia Commons URLs.

LOGIN — ONE PAGE / NO ROLE SELECTOR
User:  user@sportivo.com / user123
Coach: coach@sportivo.com / coach123
Admin: admin@sportivo.com / admin123
The system detects the role automatically from credentials.

REGISTRATION
- One User registration only.
- No trainee registration option.
- A User requests a Training Plan inside the same portal.
- Admin grants/removes trainee access. When granted, trainee modules appear in the User portal automatically.

LANDING PAGE
- No timetable section.
- No Courts/Facilities section.
- No Contact link in header.
- Footer includes contact information, Terms & Conditions, Privacy Notice and Booking Policies.

BOOKING
- Exact timetable inside Book a Court.
- Available / Pending / Booked / Training / Maintenance states.
- Initial payment percentage configurable by Admin (default 30%).
- Initial payment is non-refundable.
- Appointment information, GCash/Bank reference and proof filename.
- Cancellation notice rule and one reschedule request rule.
- Admin verification + confirmation required.

NO-SHOW / APPEAL
- Confirmed booking not checked in after 15 minutes is marked No-Show when the frontend runs its automatic sweep.
- Court is released because No-Show records no longer block the availability grid; Admin dashboard labels this as walk-in release.
- 1st unresolved no-show: Warning + appeal option.
- 2nd: Booking Limited (only one active booking).
- 3rd: Temporary Restriction (default 7 days).
- Appeals go to Admin and should be for unavoidable circumstances only.
- Approved appeal removes one warning.

COACH
- Coach sees only Admin-assigned groups/trainees.
- Attendance has dates.
- Progress Update removes Skill Level and Strengths.
- Ratings: Technique, Consistency, Discipline, Participation.
- Overall assessment is calculated automatically from ratings.

ADMIN
- No Profile sidebar module.
- No Conflict Detection sidebar module; conflict rules run during booking/session confirmation.
- User Management includes large editable summary, trainee access, warning status and restrictions.
- Coach Management is Admin-only; Coach accounts are created by Admin.
- Trainee Management focuses on trainee info, dated attendance, training balance and latest assessment.
- Payment calculator uses Balance = Total Fee - Paid Amount.
- Progress Monitoring changes based on Coach ratings.

IMPORTANT FRONTEND NOTE
This package is a functional HTML/CSS/JavaScript browser prototype using localStorage/sessionStorage. A true unattended 15-minute auto-cancel while every browser is closed, secure multi-user authentication, permanent database persistence, Microsoft Access integration, real payment verification, server-side file uploads, email delivery, and concurrency locking require a backend/service process.



V13 TIMETABLE FLOW UPDATE
- Removed timetable from the Home page.
- Home hero "Create an Account" CTA changed to "Book a Court / Slot".
- Clicking "Book a Court / Slot" opens the public Availability / Timetable page first.
- Availability now uses the Training Classes / Sports & Appointments timetable interface.
- Book Now from a court opens the single Login page, then continues to Book a Court.
- Book Now from a training class opens the single Login page, then continues to Training Plan.


SPORTIVO V14 — NO PAYMENT FEATURES
- Removed the Payments module from User navigation.
- Removed Payment Management from Admin navigation.
- Removed payment data, payment status, balances, counter collection, rates and fee calculations.
- Book a Court now contains appointment details, timetable, cancellation/reschedule rules, no-show rules and Admin confirmation only.
- Dashboard no longer shows payment summaries.
- Booking details and Admin Court Bookings no longer show payment information.
- Reports no longer contain payment totals.
- Fixed the visible typing/caret indicator on headings.
- Added Show/Hide Password eye buttons to Login and Registration.


V15 UX UPDATE
- Creativewise-inspired monochrome editorial refinement.
- Portal logo returns to dashboard and does not log out.
- Removed sidebar account identity card and upper-right profile avatar.
- My Profile remains a sidebar module and Enter does not save changes.
- Training sessions show sport and coach; trainee can request cancellation/reschedule with a required reason.
- Attendance and Progress show sport/coach; Progress exposes coach feedback history.
- My Sessions removes Upcoming summary.
- My Bookings shows court type.
- Book a Court adds court-type filtering and timetable updates by selected type.


V16 PROFILE + CONTENT CLEANUP
- User profile is now directly under the SPORTIVO logo in the sidebar and opens the Profile page when clicked.
- Removed the visible My Profile item from User and Coach module lists.
- Removed description text directly under portal module titles.
- Removed unnecessary heading descriptions from public landing pages.
- Portal title bar no longer displays the SPORTIVO Management System subtitle.
