const PROGRAMS = {
  badminton: {
    name: 'Badminton',
    emoji: '🏸',
    image: 'https://i.pinimg.com/736x/10/8f/22/108f22d0ee9e92b4a8ce91887b3e27e3.jpg',
    description: 'Develop footwork, racket control, serving, receiving, and match awareness through structured training for different skill levels.',
    skills: [
      ['Footwork & Movement', 'Court coverage, balance, recovery, and movement drills.'],
      ['Racket Control', 'Grip, swing mechanics, placement, and consistency.'],
      ['Serving & Receiving', 'Serve technique, returns, and first-shot control.'],
      ['Match Strategy', 'Positioning, shot selection, and decision making.']
    ]
  },
  basketball: {
    name: 'Basketball',
    emoji: '🏀',
    image: 'https://i.pinimg.com/1200x/1b/3a/48/1b3a48c42505d2bef272498a64098a40.jpg',
    description: 'Build ball control, shooting, passing, movement, and team fundamentals through structured basketball sessions.',
    skills: [
      ['Ball Handling', 'Control, dribbling, change of direction, and protection.'],
      ['Shooting', 'Form, balance, finishing, and shooting consistency.'],
      ['Passing & Movement', 'Passing decisions, spacing, cuts, and off-ball movement.'],
      ['Team Play', 'Communication, positioning, transition, and game awareness.']
    ]
  },
  volleyball: {
    name: 'Volleyball',
    emoji: '🏐',
    image: 'https://i.pinimg.com/736x/f0/a0/4b/f0a04b80841dda3350a658d600b5c469.jpg',
    description: 'Improve passing, serving, setting, positioning, and team coordination with progressive volleyball training.',
    skills: [
      ['Passing', 'Platform control, reception, and defensive passing.'],
      ['Serving', 'Serve mechanics, placement, and consistency.'],
      ['Setting', 'Hand positioning, control, and decision making.'],
      ['Team Coordination', 'Rotation, court positioning, communication, and game flow.']
    ]
  },
  pickleball: {
    name: 'Pickleball',
    emoji: '🏓',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Outdoor_pickleball_courts.jpg',
    description: 'Learn paddle control, serving, returns, court movement, and practical strategy for recreational and developmental play.',
    skills: [
      ['Paddle Control', 'Grip, touch, placement, and consistency.'],
      ['Serving & Return', 'Legal serves, depth, return positioning, and control.'],
      ['Court Movement', 'Transition, balance, recovery, and positioning.'],
      ['Strategy', 'Shot selection, patience, partner positioning, and point construction.']
    ]
  }
};

const key = new URLSearchParams(location.search).get('sport') || 'badminton';
const p = PROGRAMS[key] || PROGRAMS.badminton;
document.title = `${p.name} Program | SPORTIVO`;

document.getElementById('programDetailRoot').innerHTML = `
  <section class="program-detail-shell">
    <a class="btn btn-light program-detail-back" href="programs.html"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>Back to Programs</a>
    
    <div class="program-detail-layout-grid">
      <!-- Left Column: Details -->
      <div class="program-detail-left">
        <h1 class="program-main-title">${p.name} Program</h1>
        
        <div class="program-about-section">
          <h3>About the program</h3>
          <p>${p.description}</p>
        </div>
        
        <div class="program-detail-lower-split">
          <article class="program-detail-panel">
            <span class="eyebrow">ABOUT THE PROGRAM</span>
            <h2>What you will learn</h2>
            <div class="learn-list">
              ${p.skills.map((x, i) => `
                <div class="learn-item">
                  <strong>${String(i + 1).padStart(2, '0')} · ${x[0]}</strong>
                  <span>${x[1]}</span>
                </div>
              `).join('')}
            </div>
          </article>
          
          <article class="program-detail-panel">
            <span class="eyebrow">PROGRAM INFORMATION</span>
            <div class="info-row"><span>Training Format</span><strong>Individual / Group</strong></div>
            <div class="info-row"><span>Coach</span><strong>Selected during training request</strong></div>
            <div class="info-row"><span>Court</span><strong>Assigned according to sport and availability</strong></div>
            <div class="info-row"><span>Schedule</span><strong>Based on Coach and court availability</strong></div>
            <div class="info-row"><span>Equipment</span><strong>Sport-specific equipment and proper attire</strong></div>
          </article>
        </div>
      </div>
      
      <!-- Right Column: Sidebar Card -->
      <div class="program-detail-right">
        <div class="program-sidebar-card">
          <img class="program-sidebar-image" src="${p.image}" alt="${p.name}">
          
          <div class="program-sidebar-meta">
            <div class="sidebar-meta-item">
              <span>Skill Level</span>
              <strong>Beginner – Advanced</strong>
            </div>
            <div class="sidebar-meta-item">
              <span>Session Duration</span>
              <strong>60 Minutes</strong>
            </div>
            <div class="sidebar-meta-item">
              <span>Training Type</span>
              <strong>Individual / Group</strong>
            </div>
          </div>
          
          <a class="btn btn-dark program-sidebar-btn" href="login.html?next=training&sport=${key}">Request Training</a>
        </div>
      </div>
    </div>
  </section>
`;
