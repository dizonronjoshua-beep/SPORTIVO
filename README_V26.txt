SPORTIVO V26 — TRAINING REQUEST FLOW UPDATE

USER SIDE
- Book a Court: removed Goal for this Session and Specific Goal from the coach add-on.
- Coach add-on only asks whether the user wants a training coach and, if yes, the preferred coach.

TRAINING REQUEST
- A normal User submits a Training Request and remains a User while the request is Pending.
- Reminder shown after submission: “Please reach out your selected coach for confirmation of your request”.
- The selected Coach receives the request and reviews the applicant details.
- Only after the selected Coach confirms the request does the account become Trainee.
- After Coach confirmation, trainee-only modules become available automatically: My Training, Training Schedule, My Sessions, Attendance, and Progress.
- The system creates/assigns the training group and starter sessions after Coach confirmation.
- Admin no longer directly grants Trainee access from User Management; Admin can still remove Trainee access when necessary.

TECHNICAL NOTE
- This is still an HTML/CSS/JavaScript browser prototype using localStorage/sessionStorage.
- V26 uses a fresh localStorage key so the revised flow can be tested cleanly.
