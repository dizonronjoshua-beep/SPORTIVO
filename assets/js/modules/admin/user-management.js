/* =========================================================
   SPORTIVO — ADMIN / USER MANAGEMENT
   ---------------------------------------------------------
   Users may be managed by Admin, but Trainee access is
   granted only through Coach confirmation.
========================================================= */

window.adminUsersView = function adminUsersView(state) {
  const users = state.users.filter(user => user.role === 'user');

  const rows = users.map(user => `
    <tr>
      <td>
        <strong>${userName(user)}</strong>
        <br>
        <span class="muted small">${user.id}</span>
      </td>

      <td>
        ${user.email || '—'}
        <br>
        <span class="muted small">${user.mobile || '—'}</span>
      </td>

      <td>${user.traineeAccess ? statusBadge('Trainee') : statusBadge('User')}</td>
      <td>${statusBadge(user.status || 'Active')}</td>
      <td>${user.warningCount || 0}</td>

      <td class="table-actions">
        <button class="btn btn-light btn-sm" onclick="adminViewUser('${user.id}')">View</button>
        <button class="btn btn-light btn-sm" onclick="editUser('${user.id}')">Edit</button>
        <button class="btn btn-light btn-sm" onclick="adminAddWarning('${user.id}')">Warning</button>
      </td>
    </tr>
  `);

  return head('User Management') +
    stats([
      ['Registered Users', users.length],
      ['Active', users.filter(user => user.status === 'Active').length],
      ['Coach-Confirmed Trainees', users.filter(user => user.traineeAccess).length],
      ['With Warnings', users.filter(user => (user.warningCount || 0) > 0).length]
    ]) +
    `<br>${adminSection(
      'Registered Accounts',
      rows.length
        ? table(['User', 'Contact', 'Access', 'Status', 'Warnings', 'Actions'], rows)
        : adminEmpty('Registered user accounts will appear here.')
    )}`;
};

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.sportivoPage = 'admin-user-management';
});
