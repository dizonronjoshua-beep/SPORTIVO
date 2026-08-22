SPORTIVO V31 — LOGOUT PATH FIX

FIXED
- Logout now works from User, Trainee, Coach, and Admin module folders.
- Nested pages redirect to ../login.html instead of looking for trainee/login.html, user/login.html, coach/login.html, or admin/login.html.
- Session-expired fallback uses the same safe path logic.
- Reset Demo also returns to the correct root login page.

WHY THE ERROR HAPPENED
The shared logout function used location.href = 'login.html'.
From trainee/dashboard.html, the browser interpreted that as trainee/login.html.
There is no login.html inside the trainee folder, so Live Server displayed "Cannot GET /trainee/login.html".
