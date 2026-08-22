/* =========================================================
   SPORTIVO — ADMIN / COURT MANAGEMENT
   ---------------------------------------------------------
   Court details, capacity and additional-player pricing.
   Court photos are selected from the device, not by URL.
========================================================= */

function courtFallbackImage(court) {
  const images = {
    Badminton: IMG.badminton,
    Basketball: IMG.basketball,
    Volleyball: IMG.volleyball,
    Pickleball: IMG.pickleball
  };

  return court.imageData || court.imageUrl || images[court.sport] || IMG.badminton;
}

function courtDefaultMaxPlayers(sport) {
  const defaults = {
    Badminton: 8,
    Basketball: 12,
    Volleyball: 12,
    Pickleball: 8
  };

  return defaults[sport] || 6;
}

function courtDefaultBaseRate(sport) {
  const rates = {
    Badminton: 350,
    Basketball: 600,
    Volleyball: 550,
    Pickleball: 350
  };

  return rates[sport] || 350;
}

function fileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindCourtPhotoPreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  input?.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file || !preview) return;

    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.onload = () => URL.revokeObjectURL(url);
  });
}

window.adminCourtsView = function adminCourtsView(state) {
  const cards = state.courts.map(court => {
    const includedPlayers = Number(court.includedPlayers || 6);
    const maxPlayers = Number(court.maxPlayers || court.capacity || courtDefaultMaxPlayers(court.sport));
    const baseRate = Number(court.baseRate || courtDefaultBaseRate(court.sport));
    const additionalFee = Number(court.additionalPlayerFee || 75);
    const activeBookings = state.bookings.filter(booking =>
      booking.court === court.id && ['Pending', 'Confirmed'].includes(booking.status)
    ).length;

    return `
      <article class="card admin-court-card court-detail-card">
        <div
          class="admin-court-photo"
          style="background-image: url('${courtFallbackImage(court)}')"
          role="img"
          aria-label="${court.name}"
        ></div>

        <div class="admin-card-title-row">
          <div>
            <span class="eyebrow">${court.sport}</span>
            <h3>${court.name}</h3>
          </div>
          ${statusBadge(court.status)}
        </div>

        <p class="muted admin-court-description">
          ${court.description || 'Sports court available for academy training and reservations.'}
        </p>

        <div class="court-detail-grid">
          <div><span>Location</span><strong>${court.location || 'Main Facility'}</strong></div>
          <div><span>Surface</span><strong>${court.surface || 'Sports flooring'}</strong></div>
          <div><span>Included Players</span><strong>${includedPlayers}</strong></div>
          <div><span>Maximum Players</span><strong>${maxPlayers}</strong></div>
          <div><span>Base Rate</span><strong>₱${baseRate.toLocaleString()}/hr</strong></div>
          <div><span>Extra Player</span><strong>+₱${additionalFee.toLocaleString()} each</strong></div>
          <div><span>Operating Hours</span><strong>${time12(court.openTime || '06:00')}–${time12(court.closeTime || '22:00')}</strong></div>
          <div><span>Active Bookings</span><strong>${activeBookings}</strong></div>
        </div>

        <button
          class="btn btn-light full"
          type="button"
          onclick="adminEditCourtFull('${court.id}')"
        >
          View / Manage Details
        </button>
      </article>
    `;
  }).join('');

  return head(
    'Court Management',
    '',
    '<button class="btn btn-dark" type="button" onclick="addCourt()">+ Add Court</button>'
  ) +
  stats([
    ['Total Courts', state.courts.length],
    ['Available', state.courts.filter(court => court.status === 'Available').length],
    ['Maintenance', state.courts.filter(court => court.status === 'Maintenance').length],
    ['Unavailable', state.courts.filter(court => court.status === 'Unavailable').length]
  ]) +
  `<br><div class="grid grid-2">${cards || adminEmpty('Add courts to begin managing academy availability.')}</div>`;
};

window.addCourt = function addCourt() {
  modal(`
    <div class="court-form-heading">
      <div>
        <span class="eyebrow">NEW FACILITY</span>
        <h3>Add Court</h3>
      </div>
    </div>

    <form id="addCourtForm" onsubmit="saveCourt(event)">
      <section class="court-form-section">
        <h4>Basic Court Information</h4>

        <div class="form-grid-2">
          <div class="field">
            <label>Court Name *</label>
            <input name="name" required placeholder="Badminton Court 3">
          </div>

          <div class="field">
            <label>Sport / Program *</label>
            <select name="sport" id="newCourtSport" required>
              ${adminSelect(['Badminton', 'Basketball', 'Volleyball', 'Pickleball'])}
            </select>
          </div>

          <div class="field">
            <label>Location / Area</label>
            <input name="location" value="Main Facility">
          </div>

          <div class="field">
            <label>Surface Type</label>
            <input name="surface" placeholder="Wood, vinyl, acrylic...">
          </div>

          <div class="field">
            <label>Status</label>
            <select name="status">
              ${adminSelect(['Available', 'Maintenance', 'Unavailable'], 'Available')}
            </select>
          </div>

          <div class="field">
            <label>Maximum Players *</label>
            <input name="maxPlayers" id="newCourtMaxPlayers" type="number" min="6" value="8" required>
          </div>
        </div>
      </section>

      <section class="court-form-section">
        <h4>Player Capacity & Pricing</h4>
        <p class="muted">The standard court rate includes up to 6 players. Each player above 6 adds the configured additional-player fee.</p>

        <div class="form-grid-3">
          <div class="field">
            <label>Players Included in Base Rate</label>
            <input name="includedPlayers" type="number" min="1" value="6" readonly>
          </div>

          <div class="field">
            <label>Base Court Rate / Hour (₱) *</label>
            <input name="baseRate" id="newCourtBaseRate" type="number" min="0" value="350" required>
          </div>

          <div class="field">
            <label>Additional Player Fee (₱) *</label>
            <input name="additionalPlayerFee" type="number" min="0" value="75" required>
          </div>
        </div>
      </section>

      <section class="court-form-section">
        <h4>Court Photo</h4>

        <div class="court-photo-upload-box">
          <img id="newCourtPhotoPreview" src="${IMG.badminton}" alt="Court preview">

          <div>
            <label class="btn btn-light" for="newCourtPhoto">Choose Photo</label>
            <input
              id="newCourtPhoto"
              name="courtPhoto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
            >
            <p class="muted small">JPG, PNG or WEBP. Recommended landscape image.</p>
          </div>
        </div>
      </section>

      <section class="court-form-section">
        <h4>Operating & Facility Details</h4>

        <div class="form-grid-2">
          <div class="field">
            <label>Open Time</label>
            <input name="openTime" type="time" value="06:00">
          </div>

          <div class="field">
            <label>Close Time</label>
            <input name="closeTime" type="time" value="22:00">
          </div>
        </div>

        <div class="field">
          <label>Facility Description</label>
          <textarea name="description" rows="3" placeholder="Describe the court, recommended use, lighting, flooring and other facility details."></textarea>
        </div>

        <div class="field">
          <label>Amenities</label>
          <textarea name="amenities" rows="2" placeholder="Lighting, benches, net, scoreboard, water station..."></textarea>
        </div>

        <div class="field">
          <label>Maintenance / Admin Notes</label>
          <textarea name="notes" rows="2" placeholder="Internal maintenance notes"></textarea>
        </div>
      </section>

      <button class="btn btn-dark full" type="submit">Add Court</button>
    </form>
  `);

  bindCourtPhotoPreview('newCourtPhoto', 'newCourtPhotoPreview');

  document.getElementById('newCourtSport')?.addEventListener('change', event => {
    const sport = event.target.value;
    document.getElementById('newCourtMaxPlayers').value = courtDefaultMaxPlayers(sport);
    document.getElementById('newCourtBaseRate').value = courtDefaultBaseRate(sport);
    document.getElementById('newCourtPhotoPreview').src = courtFallbackImage({ sport });
  });
};

window.saveCourt = async function saveCourt(event) {
  event.preventDefault();

  const state = load();
  const data = new FormData(event.target);
  const sport = String(data.get('sport'));
  const file = event.target.querySelector('[name="courtPhoto"]')?.files?.[0];
  const imageData = await fileAsDataUrl(file);

  state.courts.push({
    id: uid('CT'),
    name: String(data.get('name')),
    sport,
    status: String(data.get('status') || 'Available'),
    location: String(data.get('location') || 'Main Facility'),
    surface: String(data.get('surface') || ''),
    includedPlayers: 6,
    maxPlayers: Number(data.get('maxPlayers') || courtDefaultMaxPlayers(sport)),
    capacity: Number(data.get('maxPlayers') || courtDefaultMaxPlayers(sport)),
    baseRate: Number(data.get('baseRate') || courtDefaultBaseRate(sport)),
    additionalPlayerFee: Number(data.get('additionalPlayerFee') || 75),
    openTime: String(data.get('openTime') || '06:00'),
    closeTime: String(data.get('closeTime') || '22:00'),
    imageData,
    imageUrl: '',
    description: String(data.get('description') || ''),
    amenities: String(data.get('amenities') || ''),
    notes: String(data.get('notes') || '')
  });

  log(state, 'Administrator', 'Added a new court with capacity and pricing details', 'Courts');
  save(state);
  closeModal();
  toast('Court added.');
  adminReload();
};

window.adminEditCourtFull = function adminEditCourtFull(id) {
  const state = load();
  const court = state.courts.find(item => item.id === id);
  if (!court) return;

  const maxPlayers = Number(court.maxPlayers || court.capacity || courtDefaultMaxPlayers(court.sport));

  modal(`
    <div class="admin-court-editor-head">
      <img
        id="editCourtPhotoPreview"
        class="admin-court-editor-image"
        src="${courtFallbackImage(court)}"
        alt="${court.name}"
      >

      <div>
        <span class="eyebrow">${court.sport}</span>
        <h3>Manage ${court.name}</h3>
        <p class="muted">Update facility information, pricing, capacity and photo.</p>
      </div>
    </div>

    <form onsubmit="adminSaveCourtFull(event, '${id}')">
      <div class="form-grid-2">
        <div class="field"><label>Court Name *</label><input name="name" value="${court.name}" required></div>
        <div class="field"><label>Sport *</label><select name="sport">${adminSelect(['Badminton','Basketball','Volleyball','Pickleball'], court.sport)}</select></div>
        <div class="field"><label>Status</label><select name="status">${adminSelect(['Available','Maintenance','Unavailable'], court.status)}</select></div>
        <div class="field"><label>Location / Area</label><input name="location" value="${court.location || 'Main Facility'}"></div>
        <div class="field"><label>Surface Type</label><input name="surface" value="${court.surface || ''}"></div>
        <div class="field"><label>Maximum Players</label><input name="maxPlayers" type="number" min="6" value="${maxPlayers}"></div>
        <div class="field"><label>Players Included in Base Rate</label><input name="includedPlayers" type="number" value="6" readonly></div>
        <div class="field"><label>Base Court Rate / Hour (₱)</label><input name="baseRate" type="number" min="0" value="${Number(court.baseRate || courtDefaultBaseRate(court.sport))}"></div>
        <div class="field"><label>Additional Player Fee (₱)</label><input name="additionalPlayerFee" type="number" min="0" value="${Number(court.additionalPlayerFee || 75)}"></div>
        <div class="field"><label>Open Time</label><input name="openTime" type="time" value="${court.openTime || '06:00'}"></div>
        <div class="field"><label>Close Time</label><input name="closeTime" type="time" value="${court.closeTime || '22:00'}"></div>
      </div>

      <div class="field">
        <label>Replace Court Photo</label>
        <label class="btn btn-light" for="editCourtPhoto">Choose Photo</label>
        <input id="editCourtPhoto" name="courtPhoto" type="file" accept="image/jpeg,image/png,image/webp" hidden>
      </div>

      <div class="field"><label>Facility Description</label><textarea name="description" rows="3">${court.description || ''}</textarea></div>
      <div class="field"><label>Amenities</label><textarea name="amenities" rows="2">${court.amenities || ''}</textarea></div>
      <div class="field"><label>Maintenance / Admin Notes</label><textarea name="notes" rows="3">${court.notes || ''}</textarea></div>

      <button class="btn btn-dark full" type="submit">Save Court Details</button>
    </form>
  `);

  bindCourtPhotoPreview('editCourtPhoto', 'editCourtPhotoPreview');
};

window.adminSaveCourtFull = async function adminSaveCourtFull(event, id) {
  event.preventDefault();

  const state = load();
  const court = state.courts.find(item => item.id === id);
  if (!court) return;

  const data = new FormData(event.target);
  const file = event.target.querySelector('[name="courtPhoto"]')?.files?.[0];
  const imageData = file ? await fileAsDataUrl(file) : court.imageData || '';

  court.name = String(data.get('name'));
  court.sport = String(data.get('sport'));
  court.status = String(data.get('status'));
  court.location = String(data.get('location') || 'Main Facility');
  court.surface = String(data.get('surface') || '');
  court.includedPlayers = 6;
  court.maxPlayers = Number(data.get('maxPlayers') || 6);
  court.capacity = court.maxPlayers;
  court.baseRate = Number(data.get('baseRate') || 0);
  court.additionalPlayerFee = Number(data.get('additionalPlayerFee') || 0);
  court.openTime = String(data.get('openTime') || '06:00');
  court.closeTime = String(data.get('closeTime') || '22:00');
  court.imageData = imageData;
  court.imageUrl = '';
  court.description = String(data.get('description') || '');
  court.amenities = String(data.get('amenities') || '');
  court.notes = String(data.get('notes') || '');

  log(state, 'Administrator', `Updated court details for ${court.id}`, 'Courts');
  save(state);
  closeModal();
  toast('Court details updated.');
  adminReload();
};

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.sportivoPage = 'admin-court-management';
});
