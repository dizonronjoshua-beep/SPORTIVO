# SPORTIVO V44 — Organized Module Structure

Every visible page has its own HTML, page-specific CSS, and page-specific JavaScript file.

## Shared core
- `assets/css/styles.css` — public/shared design tokens and base components
- `assets/css/portal.css` — portal shell/sidebar/table/form base
- `assets/js/app.js` — shared data, authentication, notifications, and reusable business helpers
- `assets/js/module-router.js` — connects each separate module HTML file to the correct portal view

## Module-specific files
For each page, edit the matching three files. Example:

- `admin/court-management.html`
- `assets/css/modules/admin/court-management.css`
- `assets/js/modules/admin/court-management.js`

The same pattern is used for `user`, `trainee`, `coach`, `admin`, and public pages. This keeps future Anti Gravity edits isolated and easier to trace.

## Role ownership changes
- Admin **does not grant Trainee role**.
- A User submits a Training Request and the selected Coach confirms it.
- Coach confirmation is the only workflow that changes the User into a Trainee.
- Training Groups and Trainee Management remain on the Coach portal.
- Attendance remains on the Coach portal.
- The Admin Training Sessions module has been removed; Coach scheduling is reflected in Master Schedule.

## Admin Court Management
Court records now support picture URL, facility description, location, surface, capacity, amenities, operating hours, maintenance notes, and status.


## V45 module editing rules
- Every page has its own HTML file.
- Every page has a matching module CSS file under `assets/css/modules/...`.
- Every page has a matching module JavaScript file under `assets/js/modules/...`.
- Shared helpers remain in `app.js`, `portal.css`, and role-level shared files to prevent duplicated code.
- HTML pages were reformatted vertically for easier editing in VS Code / Anti Gravity.
