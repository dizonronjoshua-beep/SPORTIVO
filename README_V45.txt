SPORTIVO V45 — Organized Code + Court Pricing + Progress UI

Updates:
1. Trainee Progress redesigned into a clean, neutral, structured assessment dashboard.
2. Admin User Management no longer shows + Add User.
3. Court Management uses Choose Photo file upload instead of a photo URL.
4. Court configuration now includes:
   - 6 players included in the standard rate
   - sport-specific maximum player capacity
   - base court rate per hour
   - additional-player fee for every player above 6
5. Book a Court now shows an estimated payment summary and applies the additional-player fee.
6. HTML files were reformatted vertically for easier editing in VS Code / Anti Gravity.
7. Page-specific CSS and JavaScript stay in assets/css/modules and assets/js/modules.

Important architecture:
- HTML = page structure
- module CSS = page-specific design
- module JS = page-specific behavior/overrides
- app.js / portal.css = shared system helpers and reusable behavior
