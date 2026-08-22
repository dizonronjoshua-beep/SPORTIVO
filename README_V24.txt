SPORTIVO V24 — PROFILE & CODE ORGANIZATION UPDATE

UPDATES
- Profile card is directly under the SPORTIVO logo for User, Coach, and Administrator.
- Profile avatar is a true fixed circle for every role and uses account initials.
- Administrator profile no longer squeezes or distorts the avatar when the name wraps.
- Profile card names can wrap naturally without breaking the layout.
- Clicking the profile card opens the Profile page.
- No separate My Profile item is added to the Modules list.
- Sidebar is wider and has cleaner independent scrolling.
- Account / Logout area stays at the bottom when space allows.
- Profile page now includes a clear profile summary plus organized Personal Information, Address, and Account sections.
- Enter key protection on the Profile form remains active so pressing Enter does not unexpectedly save changes.
- Existing SPORTIVO modules and prototype behavior are preserved.

CODE ORGANIZATION
- HTML pages remain separate from the shared CSS and JavaScript.
- Shared styles: assets/css/styles.css
- Shared system logic: assets/js/app.js
- Portal shell/profile markup was reformatted into readable blocks for easier editing.

DEMO ACCOUNTS
User:  user@sportivo.com / user123
Coach: coach@sportivo.com / coach123
Admin: admin@sportivo.com / admin123

NOTE
This is still a browser prototype using localStorage/sessionStorage. A production multi-user system needs a backend and database.
