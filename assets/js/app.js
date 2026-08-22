
const IMG={
  badminton:'https://upload.wikimedia.org/wikipedia/commons/7/78/Indoor_badminton_court.jpg',
  basketball:'https://upload.wikimedia.org/wikipedia/commons/b/b0/KSA_basketball_court.jpg',
  volleyball:'https://upload.wikimedia.org/wikipedia/commons/e/e5/Volleyball_court.jpg',
  pickleball:'https://upload.wikimedia.org/wikipedia/commons/3/39/Outdoor_pickleball_courts.jpg'
};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const today=()=>new Date().toISOString().slice(0,10);
function plusDays(n){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function fmtDate(v){if(!v)return '—';return new Date(v+'T00:00:00').toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}
function time12(v){if(!v)return '—';let [h,m]=v.split(':').map(Number),ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${String(m).padStart(2,'0')} ${ap}`}
function uid(p){return p+'-'+Math.random().toString(36).slice(2,7).toUpperCase()}
function clone(x){return JSON.parse(JSON.stringify(x))}
function defaultState(){return {
 users:[
  {id:'U-1001',role:'user',first:'Juan',middle:'Dela',last:'Cruz',suffix:'',dob:'2002-05-12',gender:'Male',mobile:'09171234567',email:'user@sportivo.com',password:'user123',status:'Active',traineeAccess:false,warningCount:0,accountStanding:'Good Standing',restrictedUntil:'',address:{house:'12',street:'Rizal St.',barangay:'Poblacion',city:'Lucena City',province:'Quezon',zip:'4301'},emergencyContact:{name:'Maria Cruz',relationship:'Mother',mobile:'09178889999'},guardian:null,trainingGroupId:''},
  {id:'C-1001',role:'coach',first:'Kevin',middle:'A.',last:'Reyes',suffix:'',dob:'1992-06-02',gender:'Male',mobile:'09171112222',email:'coach@sportivo.com',password:'coach123',status:'Active',sport:'Badminton',specialization:'Badminton Development',experience:'6 years',facebook:'https://www.facebook.com/',messenger:'https://m.me/',instagram:'https://www.instagram.com/',warningCount:0,accountStanding:'Good Standing'},
  {id:'C-1002',role:'coach',first:'Marco',middle:'',last:'Santos',suffix:'',dob:'1990-04-18',gender:'Male',mobile:'09172223333',email:'marco@sportivo.com',password:'coach123',status:'Active',sport:'Basketball',specialization:'Basketball Skills & Team Development',experience:'8 years',facebook:'https://www.facebook.com/',messenger:'https://m.me/',instagram:'https://www.instagram.com/',warningCount:0,accountStanding:'Good Standing'},
  {id:'C-1003',role:'coach',first:'Angela',middle:'',last:'Cruz',suffix:'',dob:'1991-09-10',gender:'Female',mobile:'09173334444',email:'angela@sportivo.com',password:'coach123',status:'Active',sport:'Volleyball',specialization:'Volleyball Fundamentals & Positioning',experience:'7 years',facebook:'https://www.facebook.com/',messenger:'https://m.me/',instagram:'https://www.instagram.com/',warningCount:0,accountStanding:'Good Standing'},
  {id:'C-1004',role:'coach',first:'Lara',middle:'',last:'Gomez',suffix:'',dob:'1993-02-15',gender:'Female',mobile:'09174445555',email:'lara@sportivo.com',password:'coach123',status:'Active',sport:'Pickleball',specialization:'Pickleball Fundamentals & Court Strategy',experience:'5 years',facebook:'https://www.facebook.com/',messenger:'https://m.me/',instagram:'https://www.instagram.com/',warningCount:0,accountStanding:'Good Standing'},
  {id:'A-1001',role:'admin',first:'System',middle:'',last:'Administrator',suffix:'',dob:'1990-01-01',gender:'Prefer not to say',mobile:'09170000000',email:'admin@sportivo.com',password:'admin123',status:'Active',warningCount:0,accountStanding:'Good Standing'}
 ],
 courts:[
  {id:'CT-1',name:'Badminton Court 1',sport:'Badminton',status:'Available',includedPlayers:6,maxPlayers:8,capacity:8,baseRate:350,additionalPlayerFee:75},
  {id:'CT-2',name:'Basketball Court 1',sport:'Basketball',status:'Available',includedPlayers:6,maxPlayers:12,capacity:12,baseRate:600,additionalPlayerFee:100},
  {id:'CT-3',name:'Volleyball Court 1',sport:'Volleyball',status:'Available',includedPlayers:6,maxPlayers:12,capacity:12,baseRate:550,additionalPlayerFee:100},
  {id:'CT-4',name:'Pickleball Court 1',sport:'Pickleball',status:'Available',includedPlayers:6,maxPlayers:8,capacity:8,baseRate:350,additionalPlayerFee:75},
  {id:'CT-5',name:'Badminton Court 2',sport:'Badminton',status:'Available',includedPlayers:6,maxPlayers:8,capacity:8,baseRate:350,additionalPlayerFee:75},
  {id:'CT-6',name:'Basketball Court 2',sport:'Basketball',status:'Available',includedPlayers:6,maxPlayers:12,capacity:12,baseRate:600,additionalPlayerFee:100},
  {id:'CT-7',name:'Volleyball Court 2',sport:'Volleyball',status:'Available',includedPlayers:6,maxPlayers:12,capacity:12,baseRate:550,additionalPlayerFee:100},
  {id:'CT-8',name:'Pickleball Court 2',sport:'Pickleball',status:'Available',includedPlayers:6,maxPlayers:8,capacity:8,baseRate:350,additionalPlayerFee:75}
 ],
 groups:[{id:'G-001',name:'Badminton Beginner A',sport:'Badminton',level:'Beginner',coachId:'C-1001',trainees:[],court:'CT-1',days:['Monday','Wednesday'],time:'16:00',duration:120,startDate:plusDays(-10),totalSessions:24,status:'Active'}],
 sessions:[
  {id:'S-001',groupId:'G-001',coachId:'C-1001',court:'CT-1',date:plusDays(1),time:'16:00',duration:120,status:'Confirmed',topic:'Footwork and recovery'},
  {id:'S-002',groupId:'G-001',coachId:'C-1001',court:'CT-1',date:plusDays(3),time:'16:00',duration:120,status:'Confirmed',topic:'Serve and return'}
 ],
 bookings:[
  {id:'BK-1001',userId:'U-1001',court:'CT-2',date:plusDays(1),time:'10:00',duration:120,purpose:'Casual Play',players:4,notes:'',status:'Confirmed',createdAt:new Date().toISOString(),attendanceConfirmed:true,rescheduleCount:0,checkedIn:false},
  {id:'BK-1002',userId:'U-1001',court:'CT-4',date:plusDays(2),time:'17:00',duration:60,purpose:'Practice',players:2,notes:'',status:'Pending',createdAt:new Date().toISOString(),attendanceConfirmed:false,rescheduleCount:0,checkedIn:false}
 ],
 attendance:[{id:'AT-1',traineeId:'U-1001',sessionId:'S-PREV',date:plusDays(-2),status:'Present',remarks:'On time',recordedBy:'C-1001'}],
 trainingPlans:[],
 progress:[{id:'PR-1',traineeId:'U-1001',coachId:'C-1001',date:plusDays(-5),technique:4,consistency:3,discipline:5,participation:4,average:4,assessment:'Very Good',remarks:'Shows steady control and follows instruction well.',nextFocus:'Backhand consistency'}],
 traineeApplications:[],
 appeals:[],
 announcements:[
  {id:'AN-1',title:'Court 2 Maintenance',message:'Court 2 will be unavailable from 1:00 PM to 4:00 PM on '+fmtDate(plusDays(5))+'.',audience:'All',date:plusDays(5),status:'Active'},
  {id:'AN-2',title:'Training Schedule Update',message:'Updated weekend training schedules are now available.',audience:'Trainees',date:plusDays(6),status:'Active'}
 ],
 notifications:[{id:'N-1',userId:'U-1001',title:'Booking Confirmed',message:'BK-1001 is confirmed. Please arrive before your schedule.',read:false,date:today()}],
 logs:[{id:'L-1',actor:'Administrator',action:'Confirmed booking BK-1001',module:'Bookings',date:today(),time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}],
 settings:{cancelHours:6,rescheduleHours:6,graceMinutes:15,restrictionDays:7,academyName:'SPORTIVO Management System',contact:'0917 123 4567',email:'info@sportivo.com'}
}}
function load(){let x=localStorage.getItem('sportivoV27')||localStorage.getItem('sportivoV26');if(!x){const s=defaultState();localStorage.setItem('sportivoV27',JSON.stringify(s));return s}try{const s=JSON.parse(x);if(Array.isArray(s.users)){s.users.forEach(u=>{const activeWarnings=Array.isArray(s.warnings)?s.warnings.filter(w=>w.userId===u.id&&w.status==='Active'):[];u.warningCount=activeWarnings.length;u.accountStanding=standingFromWarnings(u,s);if(u.warningCount<3)u.restrictedUntil=''});}return s}catch{const s=defaultState();save(s);return s}}
function save(s){
  localStorage.setItem('sportivoV27',JSON.stringify(s));
  if (window.syncToSupabase) window.syncToSupabase(s);
}

window.syncToSupabase = async function(state) {
  if (!window.supabaseClient) return;
  try {
    const { error } = await window.supabaseClient.from('state_storage').upsert({ id: true, data: state });
    if (error) console.error('Supabase sync error', error);
  } catch (err) {
    console.error('Supabase sync exception', err);
  }
};

window.initSupabaseSync = async function() {
  if (!window.supabaseClient) return;
  try {
    const { data, error } = await window.supabaseClient.from('state_storage').select('data').eq('id', true).single();
    if (data && data.data && Object.keys(data.data).length > 0) {
      localStorage.setItem('sportivoV27', JSON.stringify(data.data));
    }
  } catch (err) {
    console.error('Supabase init exception', err);
  }
};

function session(){try{return JSON.parse(sessionStorage.getItem('sportivoSessionV27'))}catch{return null}}
function setSession(x){sessionStorage.setItem('sportivoSessionV27',JSON.stringify(x))}
function currentUser(s=load()){const ss=session();return ss?s.users.find(u=>u.id===ss.userId):null}
function log(s,actor,action,module){s.logs.unshift({id:uid('L'),actor,action,module,date:today(),time:new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})})}
function notify(s,userId,title,message){s.notifications.unshift({id:uid('N'),userId,title,message,read:false,date:today()})}
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function modal(html){const b=$('#modalRoot');if(!b)return;b.innerHTML='<div class="modal">'+html+'</div>';b.classList.add('open')}
function closeModal(){$('#modalRoot')?.classList.remove('open')}
function calcAge(v){if(!v)return '';const d=new Date(v),n=new Date();let a=n.getFullYear()-d.getFullYear();const m=n.getMonth()-d.getMonth();if(m<0||(m===0&&n.getDate()<d.getDate()))a--;return a}
function statusBadge(v){const c=['Confirmed','Completed','Complete','Present','Approved','Active','Good Standing'].includes(v)?'success':['Pending','For Review','Warning','Booking Limited'].includes(v)?'pending':['Rejected','Cancelled','No-Show','Temporarily Restricted','Absent'].includes(v)?'danger':'sage';return `<span class="badge ${c}">${v}</span>`}
function userName(u){return u?`${u.first} ${u.last}`:'—'}
function roleName(u){if(!u)return '';if(u.role==='admin')return 'Administrator';if(u.role==='coach')return 'Coach';if(u.role==='trainee')return 'Trainee';return u.traineeAccess?'Trainee':'User'}
function overlap(t1,d1,t2,d2){const m=t=>Number(t.slice(0,2))*60+Number(t.slice(3,5));return m(t1)<m(t2)+Number(d2)&&m(t1)+Number(d1)>m(t2)}
function conflict(s,court,date,time,duration,ignore=''){if(s.sessions.some(x=>x.status==='Confirmed'&&x.court===court&&x.date===date&&overlap(time,duration,x.time,x.duration)))return 'This court is already used by a confirmed training session.';if(s.bookings.some(x=>x.id!==ignore&&['Confirmed','Pending'].includes(x.status)&&x.court===court&&x.date===date&&overlap(time,duration,x.time,x.duration)))return 'This court already has a booking/request for that time.';return ''}
function activeBookings(s,u){return s.bookings.filter(b=>b.userId===u.id&&['Pending','Confirmed'].includes(b.status))}
function standingFromWarnings(u,s){if(u.warningCount>=3){if(u.restrictedUntil&&today()<=u.restrictedUntil)return 'Temporarily Restricted';return 'Booking Limited'}if(u.warningCount===2)return 'Booking Limited';if(u.warningCount===1)return 'Warning';return 'Good Standing'}
function canBook(s,u){u.accountStanding=standingFromWarnings(u,s);if(u.accountStanding==='Temporarily Restricted')return `Booking is temporarily restricted until ${fmtDate(u.restrictedUntil)}.`;if(u.accountStanding==='Booking Limited'&&activeBookings(s,u).length>=1)return 'Your account is on booking limit. You may only keep one active booking at a time.';return ''}
function runNoShowSweep(){const s=load();let changed=false;const now=new Date();s.bookings.filter(b=>b.status==='Confirmed'&&!b.checkedIn).forEach(b=>{const dt=new Date(`${b.date}T${b.time}:00`);dt.setMinutes(dt.getMinutes()+s.settings.graceMinutes);if(now>dt){b.status='No-Show';b.releasedForWalkIn=true;b.noShowAt=new Date().toISOString();const u=s.users.find(x=>x.id===b.userId);notify(s,u.id,'No-Show Recorded',`${b.id} was released for walk-in after the ${s.settings.graceMinutes}-minute grace period.`);log(s,'System',`Auto-cancelled ${b.id} as No-Show`,'Bookings');changed=true}});if(changed)save(s)}

/* public */
function renderPublicAvailability(){const body=$('#publicScheduleBody');if(!body)return;const s=load();const rows=[...s.bookings.filter(b=>b.status==='Confirmed').map(b=>({date:b.date,time:b.time,court:b.court,type:'Court Booking',title:'Reserved'})),...s.sessions.filter(x=>x.status==='Confirmed').map(x=>({date:x.date,time:x.time,court:x.court,type:'Training',title:s.groups.find(g=>g.id===x.groupId)?.name||'Training'}))].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));body.innerHTML=rows.length?rows.map(r=>`<tr><td>${fmtDate(r.date)}</td><td>${time12(r.time)}</td><td>${r.court.replace('CT-','Court ')}</td><td>${r.type}</td><td>${r.title}</td><td>${statusBadge('Confirmed')}</td></tr>`).join(''):`<tr><td colspan="6">No confirmed schedules.</td></tr>`}
function publicInquiry(form){const fd=new FormData(form);toast('Inquiry submitted. Admin will review it.');form.reset()}


const PUBLIC_TRAINING=[
 {offset:0,time:'18:00',duration:60,sport:'Badminton',title:'Badminton Fundamentals',coach:'Kevin Reyes',court:'Court 1',level:'Beginner',slots:12},
 {offset:1,time:'08:30',duration:60,sport:'Badminton',title:'Badminton Beginner',coach:'Kevin Reyes',court:'Court 1',level:'Beginner',slots:10},
 {offset:1,time:'10:00',duration:60,sport:'Basketball',title:'Basketball Fundamentals',coach:'Marco Santos',court:'Court 2',level:'Beginner',slots:14},
 {offset:2,time:'09:00',duration:60,sport:'Pickleball',title:'Pickleball Starter',coach:'Lara Gomez',court:'Court 4',level:'Beginner',slots:8},
 {offset:3,time:'16:00',duration:90,sport:'Volleyball',title:'Volleyball Development',coach:'Angela Cruz',court:'Court 3',level:'Intermediate',slots:12},
 {offset:4,time:'16:00',duration:120,sport:'Badminton',title:'Badminton Beginner A',coach:'Kevin Reyes',court:'Court 1',level:'Beginner',slots:6},
 {offset:5,time:'18:00',duration:60,sport:'Basketball',title:'Basketball Skills',coach:'Marco Santos',court:'Court 2',level:'Intermediate',slots:10},
 {offset:6,time:'17:00',duration:90,sport:'Volleyball',title:'Volleyball Team Training',coach:'Angela Cruz',court:'Court 3',level:'Advanced',slots:8}
];
let publicTab='classes',publicDate=today(),publicBaseDate=today();
function plusDaysFrom(baseStr, n) {
  const d = new Date(baseStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function renderLandingTimetable(){
  const root=$('#publicTimetable'),strip=$('#publicDateStrip');
  if(!root||!strip)return;
  const d0=new Date(publicBaseDate+'T00:00:00');
  $('#publicMonthLabel').textContent=d0.toLocaleDateString('en-PH',{month:'short',year:'numeric'});
  const picker = $('#publicDatePicker');
  if (picker) picker.value = publicBaseDate;
  strip.innerHTML=[0,1,2,3,4,5,6].map(i=>{
    const d=plusDaysFrom(publicBaseDate, i),dt=new Date(d+'T00:00:00');
    return `<button type="button" class="${d===publicDate?'active':''}" data-public-date="${d}"><small>${dt.toLocaleDateString('en-PH',{weekday:'short'}).toUpperCase()}</small><b>${dt.getDate()}</b></button>`
  }).join('');
  $$('[data-public-date]').forEach(b=>b.addEventListener('click',()=>{
    publicDate=b.dataset.publicDate;
    renderLandingTimetable()
  }));
  const filters=$('#publicFilters');
  filters.style.display=publicTab==='classes'?'grid':'none';
  if(publicTab==='courts'){
    const s=load();
    root.innerHTML=`<div class="public-court-list">${s.courts.map(c=>`<article><div><span class="public-court-name">${c.name}</span><small>${c.sport}</small></div><div class="public-court-status"><span class="badge success">${c.status}</span><a class="btn btn-dark btn-sm" href="login.html?next=book">Book Now</a></div></article>`).join('')}</div>`;
    return;
  }
  const sport=$('#publicSportFilter')?.value||'',coach=$('#publicCoachFilter')?.value||'',level=$('#publicLevelFilter')?.value||'';
  const list=PUBLIC_TRAINING.filter(x=>{
    const classDay = new Date(plusDays(x.offset)+'T00:00:00').getDay();
    const selectDay = new Date(publicDate+'T00:00:00').getDay();
    return classDay === selectDay && (!sport||x.sport===sport) && (!coach||x.coach===coach) && (!level||x.level===level);
  });
  const dt=new Date(publicDate+'T00:00:00');
  root.innerHTML=`<div class="public-day-title"><strong>${publicDate===today()?'Today, ':''}${dt.toLocaleDateString('en-PH',{weekday:'short',day:'numeric',month:'short'})}</strong><span>${list.length} class${list.length===1?'':'es'}</span></div>${list.length?`<div class="public-class-list">${list.map(x=>`<article><div class="public-class-time"><strong>${time12(x.time)}</strong><small>${x.duration} mins</small></div><div class="public-class-main"><strong>${x.title}</strong><small>${x.coach}</small></div><div class="public-class-court"><strong>${x.sport}</strong><small>${x.court} · ${x.level}</small></div><div class="public-class-slots"><strong>${x.slots} slots</strong><small>available</small></div><a class="btn btn-dark btn-sm" href="login.html?next=training-application">Book Now</a></article>`).join('')}</div>`:`<div class="public-empty">No training classes scheduled for this date.</div>`}`;
}
function initLandingTimetable(){
  if(!$('#publicTimetable'))return;
  $('#prevWeekBtn')?.addEventListener('click', () => {
    publicBaseDate = plusDaysFrom(publicBaseDate, -7);
    publicDate = publicBaseDate;
    renderLandingTimetable();
  });
  $('#nextWeekBtn')?.addEventListener('click', () => {
    publicBaseDate = plusDaysFrom(publicBaseDate, 7);
    publicDate = publicBaseDate;
    renderLandingTimetable();
  });
  $('#publicDatePicker')?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val) {
      publicBaseDate = val;
      publicDate = val;
      renderLandingTimetable();
    }
  });
  $$('[data-public-tab]').forEach(b=>b.addEventListener('click',()=>{
    publicTab=b.dataset.publicTab;
    $$('[data-public-tab]').forEach(x=>x.classList.toggle('active',x===b));
    renderLandingTimetable()
  }));
  ['#publicSportFilter','#publicCoachFilter','#publicLevelFilter'].forEach(id=>$(id)?.addEventListener('change',renderLandingTimetable));
  renderLandingTimetable();
}

/* auth */

function authPageHref(page = 'login.html') {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const parentFolder = parts.length >= 2 ? parts[parts.length - 2] : '';
  const portalFolders = new Set(['user', 'trainee', 'coach', 'admin']);

  return portalFolders.has(parentFolder)
    ? `../${page}`
    : page;
}

function separatedPortalHome(user) {
  if (user.role === 'admin') return 'admin/dashboard.html';
  if (user.role === 'coach') return 'coach/dashboard.html';
  if (user.role === 'trainee' || user.traineeAccess) return 'trainee/dashboard.html';
  return 'user/dashboard.html';
}

function separatedPortalDestination(user, next) {
  const role = user.role === 'admin'
    ? 'admin'
    : user.role === 'coach'
      ? 'coach'
      : (user.role === 'trainee' || user.traineeAccess)
        ? 'trainee'
        : 'user';

  if ((role === 'user' || role === 'trainee') && next === 'book') {
    return `${role}/book-a-court.html`;
  }

  if (role === 'user' && (next === 'training' || next === 'training-application')) {
    return 'user/training-request.html';
  }

  return separatedPortalHome(user);
}

async function loginSubmit(event) {
  event.preventDefault();

  const state = load();
  const formData = new FormData(event.target);
  const email = String(formData.get('email')).trim().toLowerCase();
  const password = String(formData.get('password'));

  if (window.supabaseClient) {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.warn("Supabase auth failed:", error.message);
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return authStatus('Please confirm your email address before logging in.');
      }
      // Continue to local auth to support mock users (admin/coach)
    }
  }

  const user = state.users.find(item =>
    item.email.toLowerCase() === email && item.password === password
  );

  if (!user) {
    return authStatus('Invalid email or password.');
  }

  if (user.status !== 'Active') {
    return authStatus('This account is not active. Please contact SPORTIVO.');
  }

  setSession({ userId: user.id });

  const next = new URLSearchParams(location.search).get('next');
  location.href = separatedPortalDestination(user, next);
}
function authStatus(m){const x=$('#authStatus');if(x){x.textContent=m;x.classList.add('show')}else toast(m)}
async function registerSubmit(event) {
  event.preventDefault();

  const state = load();
  const formData = new FormData(event.target);

  if (formData.get('password') !== formData.get('confirm')) {
    return authStatus('Passwords do not match.');
  }

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password'));
  const role = formData.get('role') || 'user';

  if (state.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    return authStatus('Email is already registered.');
  }

  if (window.supabaseClient) {
    const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: formData.get('first'),
          last_name: formData.get('last'),
          role: role
        }
      }
    });

    if (authError) {
      return authStatus(authError.message);
    }
  }

  const id = uid('U');

  const user = {
    id,
    role: role,
    first: formData.get('first'),
    middle: formData.get('middle'),
    last: formData.get('last'),
    suffix: formData.get('suffix'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    mobile: formData.get('mobile'),
    email,
    password,
    status: 'Active',
    traineeAccess: role === 'trainee',
    warningCount: 0,
    accountStanding: 'Good Standing',
    restrictedUntil: '',
    address: {
      house: formData.get('house'),
      street: formData.get('street'),
      barangay: formData.get('barangay'),
      city: formData.get('city'),
      province: formData.get('province'),
      zip: formData.get('zip')
    },
    emergencyContact: null,
    guardian: null,
    trainingGroupIds: []
  };

  state.users.push(user);
  log(state, userName(user), 'Created account', 'Registration');
  save(state);

  const next = new URLSearchParams(location.search).get('next');
  location.href = 'login.html' + (next ? `?next=${next}&registered=true` : '?registered=true');
}
function forgotSubmit(e){e.preventDefault();const s=load(),fd=new FormData(e.target),u=s.users.find(x=>x.email.toLowerCase()===String(fd.get('email')).toLowerCase());if(!u)return authStatus('Email not found.');if(fd.get('password')!==fd.get('confirm'))return authStatus('Passwords do not match.');u.password=fd.get('password');save(s);authStatus('Password updated. You can now login.');setTimeout(()=>location.href='login.html',900)}

function togglePassword(button){
 const wrap=button.closest('.password-wrap'),input=wrap?.querySelector('input');
 if(!input)return;
 const show=input.type==='password';
 input.type=show?'text':'password';
 button.classList.toggle('is-visible',show);
 button.setAttribute('aria-label',show?'Hide password':'Show password');
 button.setAttribute('title',show?'Hide password':'Show password');
}
function bindAuth(){const dob=$('[name=dob]');if(dob){dob.addEventListener('change',()=>{const a=calcAge(dob.value);$('[name=age]').value=a;$('#guardianBox')?.classList.toggle('hidden',!(a!==''&&a<18))})}$('#loginForm')?.addEventListener('submit',loginSubmit);$('#registerForm')?.addEventListener('submit',registerSubmit);$('#forgotForm')?.addEventListener('submit',forgotSubmit);$$('[data-public-inquiry]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();publicInquiry(f)}));if(new URLSearchParams(location.search).get('registered')==='true'){authStatus('Account created successfully! Please check your email to verify your account before logging in.')}}

const NAV={
 user:[['dashboard','⌂','Dashboard'],['book','＋','Book a Court'],['bookings','▤','My Bookings'],['announcements','◉','Announcements']],
 trainee:[['training','◈','My Training'],['training-schedule','▦','Training Schedule'],['sessions','✓','My Sessions'],['attendance','▣','Attendance'],['progress','↗','Progress']],
 coach:[['dashboard','⌂','Dashboard'],['coach-requests','✦','Training Requests'],['coach-schedule','▦','My Schedule'],['coach-groups','◎','Training Groups'],['coach-trainees','◉','Trainee Management'],['coach-plans','▧','Training Plans'],['coach-attendance','✓','Attendance'],['coach-progress','↗','Progress Update']],
 admin:[['dashboard','⌂','Dashboard'],['users','◉','User Management'],['coach-access','○','Coach Management'],['master','▦','Master Schedule'],['courts','▦','Court Management'],['admin-bookings','▤','Court Bookings'],['admin-progress','↗','Progress Monitoring'],['admin-announcements','◉','Announcements'],['appeals','!','Appeals'],['reports','▤','Reports'],['logs','↶','Activity Logs'],['settings','⚙','Settings']]
};
function portalNav(u){if(u.role==='admin')return NAV.admin;if(u.role==='coach')return NAV.coach;return [...NAV.user,...(u.traineeAccess?NAV.trainee:[['training-application','◈','Training Request']])]} 
function ensurePortal(){
 if(!$('#portalRoot'))return;
 runNoShowSweep();
 const s=load(),u=currentUser(s);
 if(!u){location.href=authPageHref('login.html');return}
 const nav=portalNav(u);
 const initials = ((u.first || '').charAt(0) + (u.last || '').charAt(0)).toUpperCase() || 'SP';
 const profileRoleClass = `role-${u.role}`;

 $('#portalRoot').innerHTML = `
   <div class="portal-shell">
     <aside class="sidebar">
       <a class="brand" href="portal.html#dashboard" aria-label="SPORTIVO dashboard">
         <span class="brand-dots"><i></i><i></i><i></i></span>
         <strong>SPORTIVO</strong>
       </a>

       <button
         class="side-account profile-entry ${profileRoleClass}"
         id="profileEntry"
         type="button"
         aria-label="Open ${roleName(u)} profile"
       >
         <span class="profile-avatar" aria-hidden="true">${initials}</span>
         <span class="profile-copy">
           <strong>${userName(u)}</strong>
           <small>${roleName(u)}</small>
         </span>
         <span class="profile-arrow" aria-hidden="true">↗</span>
       </button>

       <div class="nav-label">MODULES</div>
       <nav class="side-nav">
         ${nav.map(n => `
           <button data-route="${n[0]}">
             <span class="ico">${n[1]}</span>
             <span>${n[2]}</span>
           </button>
         `).join('')}
       </nav>

       <div class="nav-label account-label">ACCOUNT</div>
       <nav class="side-nav account-nav">
         <button onclick="logoutConfirm()">
           <span class="ico">↪</span>
           <span>Logout</span>
         </button>
       </nav>
     </aside>

     <main class="portal-main">
       <header class="topbar">
         <div class="top-title"><h1 id="topTitle">Dashboard</h1></div>
         <label class="top-search">⌕<input id="portalSearch" placeholder="Search current records..."></label>
         <button class="icon-btn" id="bellBtn" aria-label="Notifications">♢</button>
       </header>
       <section class="portal-page" id="view"></section>
     </main>
   </div>
 `;
 $$('[data-route]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.route)));
 $('#profileEntry')?.addEventListener('click',()=>go('profile'));
 $('#bellBtn').addEventListener('click',toggleNotifications);
 $('#portalSearch').addEventListener('input',e=>{$$('.data-table tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(e.target.value.toLowerCase())?'':'none')});
 renderNotifications();
 go((location.hash||'#dashboard').slice(1),false)
}
function go(route,push=true){const s=load(),u=currentUser(s);const allowed=[...portalNav(u).map(x=>x[0]),'profile'];if(!allowed.includes(route))route='dashboard';if(push)location.hash=route;$$('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===route));const lab=route==='profile'?'Profile':(portalNav(u).find(x=>x[0]===route)?.[2]||'Dashboard');$('#topTitle').textContent=lab;$('#view').innerHTML=renderModule(u,route,s);bindModule(u,route)}
window.addEventListener('hashchange',()=>{if($('#portalRoot'))go((location.hash||'#dashboard').slice(1),false)});
function head(title,copy='',act=''){return `<div class="page-head"><div><h2>${title}</h2></div>${act}</div>`}
function stats(arr){return `<div class="grid grid-${Math.min(arr.length,4)}">${arr.map(x=>`<article class="card stat-card ${x[3]?'clickable':''}" ${x[3]?`onclick="go('${x[3]}')"`:''}><span>${x[0]}</span><strong>${x[1]}</strong>${x[2]?`<div class="muted small">${x[2]}</div>`:''}</article>`).join('')}</div>`}
function table(h,rows){return `<div class="table-wrap"><table class="data-table"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`}


function coachSport(coach){
  if(coach?.sport)return coach.sport;
  const spec=String(coach?.specialization||'').toLowerCase();
  return ['Badminton','Basketball','Volleyball','Pickleball'].find(s=>spec.includes(s.toLowerCase()))||'';
}
function coachesForSport(s,sport){
  return s.users.filter(x=>x.role==='coach'&&x.status==='Active'&&coachSport(x)===sport);
}
function coachLinks(c){
  return `<div class="coach-links">
    ${c?.messenger?`<a class="btn btn-light btn-sm" href="${c.messenger}" target="_blank" rel="noopener">Messenger</a>`:''}
    ${c?.facebook?`<a class="btn btn-light btn-sm" href="${c.facebook}" target="_blank" rel="noopener">Facebook</a>`:''}
    ${c?.instagram?`<a class="btn btn-light btn-sm" href="${c.instagram}" target="_blank" rel="noopener">Instagram</a>`:''}
    ${c?.mobile?`<a class="btn btn-light btn-sm" href="tel:${c.mobile}">Call ${c.mobile}</a>`:''}
  </div>`;
}
function emergencyInfo(u){
  return u.emergencyContact||{name:'',relationship:'',mobile:''};
}
function coachProfileCard(c,selectable=false){
  if(!c)return '<div class="notice">No coach is currently available for this sport.</div>';
  return `<article class="coach-request-card" data-coach-card="${c.id}">
    <div class="coach-request-avatar">${(c.first[0]+c.last[0]).toUpperCase()}</div>
    <div class="coach-request-copy"><strong>${userName(c)}</strong><span>${coachSport(c)} · ${c.specialization||'Coach'}</span><small>${c.experience||'SPORTIVO Coach'} · ${c.mobile||''}</small></div>
    <div class="coach-request-actions">${selectable?`<label class="coach-radio"><input type="radio" name="coachId" value="${c.id}" required> Select</label>`:''}<button class="btn btn-light btn-sm" type="button" onclick="openCoachDetails('${c.id}')">View Details</button></div>
  </article>`;
}
function openCoachDetails(id){
  const s=load(),c=s.users.find(x=>x.id===id&&x.role==='coach');if(!c)return;
  modal(`<h3>${userName(c)} · Coach Profile</h3>
    <div class="info-row"><span>Sport</span><strong>${coachSport(c)||'—'}</strong></div>
    <div class="info-row"><span>Specialization</span><strong>${c.specialization||'—'}</strong></div>
    <div class="info-row"><span>Experience</span><strong>${c.experience||'—'}</strong></div>
    <div class="info-row"><span>Email</span><strong>${c.email||'—'}</strong></div>
    <div class="info-row"><span>Mobile</span><strong>${c.mobile||'—'}</strong></div>
    <br>${coachLinks(c)}<br><button class="btn btn-dark full" onclick="closeModal()">Close</button>`);
}

function renderModule(u,r,s){if(u.role==='admin')return renderAdmin(r,s,u);if(u.role==='coach')return renderCoach(r,s,u);return renderUser(r,s,u)}
function announcementAgeDays(date) {
  const now = new Date(today() + 'T00:00:00');
  const item = new Date(date + 'T00:00:00');
  return Math.floor((now - item) / 86400000);
}

function userAnnouncements(state, user) {
  const items = state.announcements
    .filter(item => item.status === 'Active')
    .filter(item => item.audience === 'All' || (user.traineeAccess && item.audience === 'Trainees'))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const cards = items.map(item => {
    const isNew = announcementAgeDays(item.date) <= 7;
    const typeClass = isNew ? 'notification-new' : 'notification-previous';
    const typeLabel = isNew ? 'New' : 'Previous';

    return `
      <article class="card announcement-card ${typeClass}">
        <div class="announcement-meta">
          <span class="notification-dot ${typeClass}"></span>
          <span class="notification-label">${typeLabel}</span>
          <span class="muted small">${fmtDate(item.date)}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.message}</p>
      </article>
    `;
  }).join('');

  return head('Announcements') + `
    <div class="notification-legend card compact-card">
      <strong>Notification Legend</strong>
      <span><i class="notification-dot notification-new"></i> New notification</span>
      <span><i class="notification-dot notification-previous"></i> Previous notification</span>
    </div>
    <br>
    <div class="grid grid-2">${cards || '<div class="card"><p class="muted">No announcements available.</p></div>'}</div>
  `;
}

function userDashboard(state, user) {
  const myBookings = state.bookings.filter(booking => booking.userId === user.id);
  const next = myBookings
    .filter(booking => booking.status === 'Confirmed')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];

  const trainingSessions = user.traineeAccess
    ? state.sessions.filter(session =>
        session.status === 'Confirmed' &&
        state.groups.some(group => group.trainees.includes(user.id) && group.id === session.groupId)
      ).length
    : 0;

  return head('Dashboard') +
    stats([
      ['Confirmed Bookings', myBookings.filter(b => b.status === 'Confirmed').length, 'Official reservations', 'bookings'],
      ['Pending Requests', myBookings.filter(b => b.status === 'Pending').length, 'Waiting for Admin review', 'bookings'],
      ['Upcoming Sessions', trainingSessions, user.traineeAccess ? 'Training schedule' : 'No trainee access', user.traineeAccess ? 'training-schedule' : '']
    ]) + `
      ${Number(user.warningCount || 0) > 0 ? `
        <br>
        <article class="account-warning-card">
          <div class="warning-icon">!</div>
          <div>
            <span class="warning-eyebrow">ACCOUNT WARNING</span>
            <h3>${user.warningCount} active warning${Number(user.warningCount) === 1 ? '' : 's'}</h3>
            <p>Your booking privileges may be limited if additional violations are recorded. Please follow the academy schedule and booking policies.</p>
          </div>
          <strong class="warning-standing">${standingFromWarnings(user, state)}</strong>
        </article>
      ` : ''}
      <br>
      <div class="grid grid-2">
        <article class="card">
          <h3>Next Confirmed Booking</h3>
          ${next ? `
            <div class="info-row"><span>Reference</span><strong>${next.id}</strong></div>
            <div class="info-row"><span>Court</span><strong>${state.courts.find(c => c.id === next.court)?.name || next.court}</strong></div>
            <div class="info-row"><span>Date / Time</span><strong>${fmtDate(next.date)} · ${time12(next.time)}</strong></div>
            <div class="info-row"><span>Status</span><strong>${statusBadge(next.status)}</strong></div>
          ` : '<p class="muted">No confirmed booking.</p>'}
        </article>

        <article class="card dashboard-reminder-card">
          <h3>Booking Reminder</h3>
          <div class="info-row"><span>Grace Period</span><strong>${state.settings.graceMinutes} minutes</strong></div>
          <div class="info-row"><span>Cancellation</span><strong>${state.settings.cancelHours} hours before</strong></div>
          <div class="info-row"><span>Reschedule</span><strong>${state.settings.rescheduleHours} hours before</strong></div>
          <p class="reminder-text">Please arrive on time and submit schedule changes before the required notice period.</p>
        </article>
      </div>
    `;
}

function renderUser(route, state, user) {
  if (route === 'dashboard') return userDashboard(state, user);
  if (route === 'book') return bookingPage(state, user);
  if (route === 'bookings') return bookingsPage(state, user);
  if (route === 'announcements') return userAnnouncements(state, user);
  if (route === 'profile') return accountPage(state, user);
  if (route === 'training-application') return trainingApplicationPage(state, user);
  if (route === 'training') return traineeTraining(state, user);
  if (route === 'training-schedule') return traineeSchedule(state, user);
  if (route === 'sessions') return traineeSessions(state, user);
  if (route === 'progress') return traineeProgress(state, user);
  return userDashboard(state, user);
}

function bookingPage(s, u) {
  const selectedDate = plusDays(1);
  const emergency = emergencyInfo(u);
  const age = calcAge(u.dob);

  return head('Book a Court') + `
    <section class="card booking-user-card">
      <h3>User Information</h3>
      <div class="form-grid-3">
        <div class="field"><label>Full Name</label><input value="${userName(u)}" readonly></div>
        <div class="field"><label>Email</label><input value="${u.email || ''}" readonly></div>
        <div class="field"><label>Mobile</label><input value="${u.mobile || ''}" readonly></div>
        <div class="field"><label>Gender</label><input value="${u.gender || ''}" readonly></div>
        <div class="field"><label>Emergency Contact</label><input value="${emergency.name ? `${emergency.name} · ${emergency.mobile || ''}` : 'Not provided'}" readonly></div>
        ${age < 18 ? `<div class="field"><label>Guardian</label><input value="${u.guardian?.name || 'Required guardian information'}" readonly></div>` : ''}
      </div>
    </section>

    <section class="booking-calendar-layout">
      <article class="card mini-calendar-card">
        <div class="calendar-heading">
          <div><span class="eyebrow-mini">COURT AVAILABILITY</span><h3 id="bookingMonthLabel"></h3></div>
          <div class="calendar-nav"><button class="icon-btn" id="prevBookingMonth" type="button">‹</button><button class="icon-btn" id="nextBookingMonth" type="button">›</button></div>
        </div>
        <div class="calendar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
        <div id="bookingMiniCalendar" class="mini-calendar"></div>
        <div class="calendar-legends">
          <span><i class="legend-dot available"></i>Available</span>
          <span><i class="legend-dot busy"></i>Partially Booked</span>
          <span><i class="legend-dot full"></i>Fully Booked</span>
          <span><i class="legend-dot selected"></i>Selected</span>
        </div>
      </article>

      <article class="card availability-summary-card">
        <span class="eyebrow-mini">SELECTED DAY</span>
        <h3 id="selectedBookingDate">${fmtDate(selectedDate)}</h3>
        <div class="field"><label>Sport / Court Type</label><select id="courtTypeFilter"><option value="">All Sports</option><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select></div>
        <div id="availableTimeSummary">${availableTimeSummary(s, selectedDate, '')}</div>
      </article>
    </section>

    <section class="card timetable-card">
      <div class="timetable-heading"><div><span class="eyebrow-mini">DAILY TIMETABLE</span><h3>Courts & Time Slots</h3></div><span class="muted small">Click an available slot to fill the booking form.</span></div>
      <div id="timeTable">${timeGrid(s, selectedDate, '')}</div>
    </section>

    <section class="booking-layout">
      <form id="bookingForm" class="card">
        <h3>Appointment Information</h3>
        <div class="form-grid-3">
          <div class="field"><label>Date *</label><input name="date" id="bDate" type="date" min="${today()}" required></div>
          <div class="field"><label>Time *</label><input name="time" id="bTime" type="time" required></div>
          <div class="field"><label>Court *</label><select name="court" id="bCourt" required><option value="">Select a court</option>${s.courts.map(c => `<option value="${c.id}">${c.name} · ${c.sport}</option>`).join('')}</select></div>
        </div>
        <div class="form-grid-3">
          <div class="field"><label>Duration *</label><select name="duration" id="bDuration"><option value="60">1 Hour</option><option value="120">2 Hours</option><option value="180">3 Hours</option></select></div>
          <div class="field"><label>Purpose *</label><select name="purpose"><option>Casual Play</option><option>Practice</option><option>Friendly Match</option><option>Other</option></select></div>
          <div class="field"><label>Number of Players *</label><input name="players" id="bPlayers" type="number" min="1" max="20" value="2"></div>
        </div>
        <div id="bookingPriceSummary" class="booking-price-summary"></div>
        <div class="field"><label>Notes</label><textarea name="notes" placeholder="Optional appointment notes"></textarea></div>
        <button class="btn btn-dark full">Submit Booking for Admin Review</button>
      </form>

      <aside class="card booking-policy-card">
        <div class="policy-header">
          <div>
            <span class="eyebrow-mini">BOOKING GUIDE</span>
            <h3>Before you reserve</h3>
          </div>
        </div>

        <div class="policy-grid-modern">
          <article class="policy-item policy-confirm">
            <div class="policy-icon">✓</div>
            <div>
              <small>01 · CONFIRMATION</small>
              <strong>Admin approval first</strong>
              <p>Your selected slot stays <b>Pending</b> until an Admin confirms the reservation.</p>
            </div>
          </article>

          <article class="policy-item policy-cancel">
            <div class="policy-icon">×</div>
            <div>
              <small>02 · CANCELLATION</small>
              <strong>Cancel ahead of time</strong>
              <p>Send your cancellation at least <b>${s.settings.cancelHours} hours</b> before the appointment.</p>
            </div>
          </article>

          <article class="policy-item policy-reschedule">
            <div class="policy-icon">↻</div>
            <div>
              <small>03 · RESCHEDULE</small>
              <strong>One reschedule request</strong>
              <p>You may request one schedule change at least <b>${s.settings.rescheduleHours} hours</b> before your booking.</p>
            </div>
          </article>

          <article class="policy-item policy-noshow">
            <div class="policy-icon">!</div>
            <div>
              <small>04 · GRACE PERIOD</small>
              <strong>Check in on time</strong>
              <p>After <b>${s.settings.graceMinutes} minutes</b> without check-in, the reservation may be marked No-Show.</p>
            </div>
          </article>
        </div>

        <div class="policy-footer-note">
          <span class="policy-note-dot"></span>
          Court availability is finalized only after confirmation.
        </div>
      </aside>
    </section>`;
}

const BOOKING_TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

function slotState(s, court, date, time) {
  const training = s.sessions.find(x => x.status === 'Confirmed' && x.court === court.id && x.date === date && overlap(time, 60, x.time, x.duration));
  const booking = s.bookings.find(x => ['Confirmed','Pending'].includes(x.status) && x.court === court.id && x.date === date && overlap(time, 60, x.time, x.duration));
  if (training) return { cls: 'training', text: 'Training' };
  if (booking) return { cls: booking.status === 'Confirmed' ? 'confirmed' : 'pending', text: booking.status === 'Confirmed' ? 'Booked' : 'Under Review' };
  if (court.status !== 'Available') return { cls: 'maintenance', text: court.status };
  return { cls: 'available', text: 'Available' };
}

function filteredCourts(s, type = '') {
  return s.courts.filter(c => !type || c.sport.toLowerCase() === type.toLowerCase());
}

function timeGrid(s, date, type = '') {
  const courts = filteredCourts(s, type);

  if (!courts.length) {
    return '<div class="notice">No courts match this sport.</div>';
  }

  const rows = BOOKING_TIMES.map(time => {
    const slots = courts.map(court => {
      const state = slotState(s, court, date, time);
      const clickable = state.cls === 'available';

      return `
        <button
          type="button"
          class="court-slot-card ${state.cls}"
          ${clickable ? `data-slot data-date="${date}" data-time="${time}" data-court="${court.id}"` : 'disabled'}
        >
          <span class="court-slot-name">${court.name}</span>
          <small>${court.sport}</small>
          <strong>${state.text}</strong>
        </button>
      `;
    }).join('');

    return `
      <div class="timetable-time-row">
        <div class="timetable-time-label">
          <small>TIME</small>
          <strong>${time12(time)}</strong>
        </div>
        <div class="timetable-court-list">${slots}</div>
      </div>
    `;
  }).join('');

  return `<div class="organized-timetable">${rows}</div>`;
}

function availableTimeSummary(s, date, type = '') {
  const courts = filteredCourts(s, type);
  const rows = BOOKING_TIMES.map(time => {
    const free = courts.filter(c => slotState(s, c, date, time).cls === 'available');
    return free.length ? `<div class="available-time-row"><strong>${time12(time)}</strong><span>${free.length} court${free.length === 1 ? '' : 's'} available</span><small>${free.map(c => c.name).join(' · ')}</small></div>` : '';
  }).filter(Boolean);
  return rows.length ? rows.join('') : '<div class="notice">No available time slots for this selection.</div>';
}

function dayAvailability(s, date) {
  const courts = s.courts.filter(c => c.status === 'Available');
  const total = courts.length * BOOKING_TIMES.length;
  if (!total) return 'full';
  const free = BOOKING_TIMES.reduce((count, time) => count + courts.filter(c => slotState(s, c, date, time).cls === 'available').length, 0);
  if (free === 0) return 'full';
  if (free === total) return 'available';
  return 'busy';
}

function renderBookingCalendar(s, viewDate, selectedDate) {
  const root = $('#bookingMiniCalendar');
  if (!root) return;
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  $('#bookingMonthLabel').textContent = viewDate.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
  const first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push('<span class="calendar-empty"></span>');
  for (let day = 1; day <= last.getDate(); day++) {
    const d = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const past = d < today();
    const state = past ? 'past' : dayAvailability(s, d);
    cells.push(`<button type="button" class="calendar-day ${state} ${d === selectedDate ? 'is-selected' : ''}" data-booking-day="${d}" ${past ? 'disabled' : ''}><b>${day}</b><i></i></button>`);
  }
  root.innerHTML = cells.join('');
}

function bookingsPage(s,u){const rows=s.bookings.filter(b=>b.userId===u.id).map(b=>`<tr><td>${b.id}</td><td><b>${s.courts.find(c=>c.id===b.court)?.name||b.court}</b><br><span class="muted small">${s.courts.find(c=>c.id===b.court)?.sport||'—'}</span></td><td>${fmtDate(b.date)}<br>${time12(b.time)}</td><td>${b.duration/60} hr</td><td>${b.purpose}</td><td>${statusBadge(b.status)}</td><td>${b.status==='No-Show'&&u.warningCount?`<button class="btn btn-light btn-sm" onclick="openAppeal('${b.id}')">Apply Appeal</button>`:''}${['Pending','Confirmed'].includes(b.status)?`<button class="btn btn-light btn-sm" onclick="openBooking('${b.id}')">Details</button>`:''}${b.status==='Confirmed'?` <button class="btn btn-light btn-sm" onclick="requestReschedule('${b.id}')">Reschedule</button> <button class="btn btn-light btn-sm" onclick="cancelBooking('${b.id}')">Cancel</button>`:''}</td></tr>`);return head('My Bookings')+stats([['Active',s.bookings.filter(b=>b.userId===u.id&&['Pending','Confirmed'].includes(b.status)).length],['Warnings',u.warningCount||0,u.accountStanding||'Good Standing'],['No-Shows',s.bookings.filter(b=>b.userId===u.id&&b.status==='No-Show').length]])+`<br>${table(['Booking','Court / Type','Appointment','Duration','Purpose','Status','Actions'],rows)}`}
function accountPage(s, u) {
  const initials = ((u.first || '').charAt(0) + (u.last || '').charAt(0)).toUpperCase() || 'SP';
  const photo = u.photo || '';
  return head('Profile') + `
    <section class="card profile-summary-card">
      <div class="profile-photo-wrap">
        ${photo ? `<img class="profile-photo" src="${photo}" alt="${userName(u)}">` : `<div class="profile-summary-avatar">${initials}</div>`}
        <label class="photo-change-btn hidden" id="photoChangeButton">Change Photo<input id="profilePhotoInput" type="file" accept="image/*" hidden></label>
      </div>
      <div class="profile-summary-copy"><h3>${userName(u)}</h3><span>${roleName(u)}</span><small>${u.email}</small></div>
      <button type="button" class="btn btn-dark profile-edit-button" id="profileEditButton">Edit Profile</button>
    </section>

    <form id="accountForm" class="card profile-form-card" data-editing="false">
      <div class="profile-section-heading"><h3>Personal Information</h3><span>Click Edit Profile before changing your information.</span></div>
      <div class="form-grid-3">
        <div class="field"><label>First Name</label><input name="first" value="${u.first}" disabled></div>
        <div class="field"><label>Middle Name</label><input name="middle" value="${u.middle || ''}" disabled></div>
        <div class="field"><label>Last Name</label><input name="last" value="${u.last}" disabled></div>
        <div class="field"><label>Date of Birth</label><input name="dob" type="date" value="${u.dob || ''}" disabled></div>
        <div class="field"><label>Gender</label><input name="gender" value="${u.gender || ''}" disabled></div>
        <div class="field"><label>Mobile</label><input name="mobile" value="${u.mobile || ''}" disabled></div>
        <div class="field"><label>Email Address</label><input name="email" type="email" value="${u.email}" disabled></div>
      </div>
      <div class="profile-section-heading"><h3>Address</h3></div>
      <div class="form-grid-3">
        <div class="field"><label>House / Unit</label><input name="house" value="${u.address?.house || ''}" disabled></div>
        <div class="field"><label>Street</label><input name="street" value="${u.address?.street || ''}" disabled></div>
        <div class="field"><label>Barangay</label><input name="barangay" value="${u.address?.barangay || ''}" disabled></div>
        <div class="field"><label>City</label><input name="city" value="${u.address?.city || ''}" disabled></div>
        <div class="field"><label>Province</label><input name="province" value="${u.address?.province || ''}" disabled></div>
        <div class="field"><label>ZIP</label><input name="zip" value="${u.address?.zip || ''}" disabled></div>
      </div>
      <div class="profile-section-heading"><h3>Account</h3></div>
      <div class="form-grid-3">
        <div class="field"><label>Account Type</label><input value="${roleName(u)}" readonly></div>
        <div class="field"><label>Warnings</label><input value="${u.warningCount || 0}" readonly></div>
        <div class="field"><label>Standing</label><input value="${u.accountStanding || 'Good Standing'}" readonly></div>
      </div>
      <div class="actions profile-edit-actions hidden" id="profileEditActions">
        <button class="btn btn-dark" type="submit">Save Changes</button>
        <button class="btn btn-light" type="button" id="cancelProfileEdit">Cancel</button>
        <button type="button" class="btn btn-light" onclick="changePassword()">Change Password</button>
      </div>
    </form>`;
}

function trainingApplicationPage(state, user) {
  const pending = state.traineeApplications.find(item =>
    item.userId === user.id && item.status === 'Pending'
  );

  const rejected = state.traineeApplications
    .filter(item => item.userId === user.id && item.status === 'Rejected')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];

  const emergency = emergencyInfo(user);
  const age = calcAge(user.dob);
  const coaches = coachesForSport(state, 'Badminton');
  const enrolledSports = traineeGroups(state, user).map(group => group.sport);

  if (pending) {
    const coach = state.users.find(item => item.id === pending.coachId);

    return head('Training Request') + `
      <div class="grid grid-2">
        <article class="card">
          <h3>Current Request</h3>
          <div class="info-row"><span>Sport</span><strong>${pending.sport}</strong></div>
          <div class="info-row"><span>Training Level</span><strong>${pending.level}</strong></div>
          <div class="info-row"><span>Training Goal</span><strong>${pending.goal}${pending.goalOther ? ` · ${pending.goalOther}` : ''}</strong></div>
          <div class="info-row"><span>Preferred Schedule</span><strong>${pending.preference}</strong></div>
          <div class="info-row"><span>Coach</span><strong>${userName(coach)}</strong></div>
          <div class="info-row"><span>Status</span><strong>${statusBadge(pending.status)}</strong></div>

          <div class="notice reminder-box">
            <strong>Reminder</strong><br>
            Please reach out your selected coach for confirmation of your request
          </div>
          ${coachLinks(coach)}
        </article>

        <article class="card">
          <h3>Selected Coach</h3>
          ${coachProfileCard(coach, false)}
        </article>
      </div>
    `;
  }

  const isMinor = Boolean(user.dob) && age < 18;
  const guardianFields = isMinor ? `
    <div class="minor-guardian-panel">
      <div class="section-intro">
        <div>
          <small>MINOR TRAINEE REQUIREMENT</small>
          <h4>Guardian Details</h4>
        </div>
        <span class="age-pill">Age ${age}</span>
      </div>

      <p class="reminder-text">Because the trainee is below 18, provide a guardian contact before submitting the request.</p>

      <div class="form-grid-2">
        <div class="field">
          <label>Guardian Relationship *</label>
          <select name="guardianRelationship" required>
            <option value="">Select relationship</option>
            <option>Mother</option>
            <option>Father</option>
            <option>Legal Guardian</option>
            <option>Older Sibling</option>
            <option>Other Relative</option>
          </select>
        </div>

        <div class="field">
          <label>Guardian Full Name *</label>
          <input name="guardianName" value="${user.guardian?.name || ''}" required>
        </div>

        <div class="field">
          <label>Guardian Mobile *</label>
          <input name="guardianMobile" value="${user.guardian?.mobile || ''}" required>
        </div>

        <div class="field">
          <label>Guardian Email</label>
          <input name="guardianEmail" type="email" value="${user.guardian?.email || ''}">
        </div>
      </div>
    </div>
  ` : '';

  return head('Training Request', '', enrolledSports.length ? `<a class="btn btn-light training-back-button" href="my-training.html"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>Back to My Training</a>` : '') + `
    ${enrolledSports.length ? `
      <div class="notice reminder-box">
        <strong>Current Sports:</strong> ${[...new Set(enrolledSports)].join(', ')}.
        You may enroll in another program, including another training focus under the same sport.
      </div><br>
    ` : ''}

    ${rejected ? `
      <div class="notice reminder-box">
        <strong>Previous request:</strong> Rejected${rejected.rejectionReason ? ` · ${rejected.rejectionReason}` : ''}.
        You may submit a new request.
      </div><br>
    ` : ''}

    <form id="trainingAppForm" class="training-request-form">
      <section class="card">
        <h3>Trainee Information</h3>

        <div class="form-grid-3">
          <div class="field"><label>Full Name</label><input value="${userName(user)}" readonly></div>
          <div class="field"><label>Email</label><input value="${user.email || ''}" readonly></div>
          <div class="field"><label>Mobile Number</label><input value="${user.mobile || ''}" readonly></div>
          <div class="field"><label>Gender</label><input value="${user.gender || ''}" readonly></div>
          <div class="field"><label>Date of Birth</label><input value="${fmtDate(user.dob)}" readonly></div>
          <div class="field"><label>Age</label><input value="${age}" readonly></div>
        </div>

        <h4>Emergency Contact</h4>
        <div class="form-grid-3">
          <div class="field"><label>Name *</label><input name="emergencyName" value="${emergency.name || ''}" required></div>
          <div class="field"><label>Relationship *</label><input name="emergencyRelationship" value="${emergency.relationship || ''}" required></div>
          <div class="field"><label>Contact Number *</label><input name="emergencyMobile" value="${emergency.mobile || ''}" required></div>
        </div>

        ${guardianFields}
      </section>

      <section class="card">
        <h3>Training Preferences</h3>

        <div class="form-grid-2">
          <div class="field">
            <label>Sport *</label>
            <select name="sport" id="trainingSport" required>
              <option>Badminton</option>
              <option>Basketball</option>
              <option>Volleyball</option>
              <option>Pickleball</option>
            </select>
          </div>

          <div class="field">
            <label>Training Level *</label>
            <select name="level" required>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Hard / Advanced</option>
            </select>
          </div>

          <div class="field">
            <label>Preferred Schedule *</label>
            <select name="preference" required>
              <option>Weekday Morning</option>
              <option>Weekday Afternoon</option>
              <option>Weekday Evening</option>
              <option>Weekend</option>
              <option>Flexible</option>
            </select>
          </div>

          <div class="field">
            <label>Training Goal *</label>
            <select name="goal" id="trainingGoal" required>
              <option>Learn the Fundamentals</option>
              <option>Improve Skills and Technique</option>
              <option>Fitness and Conditioning</option>
              <option>Competition Preparation</option>
              <option>Confidence and Consistency</option>
              <option>Other</option>
            </select>
          </div>

          <div class="field">
            <label>Program / Session Focus *</label>
            <select name="topic" required>
              <option>Fundamentals</option>
              <option>Technique Development</option>
              <option>Conditioning</option>
              <option>Match Play</option>
              <option>Competition Preparation</option>
              <option>Specialized Session</option>
            </select>
          </div>
        </div>

        <div class="field hidden" id="trainingGoalOtherBox">
          <label>Specific Goal *</label>
          <textarea name="goalOther" placeholder="Describe your specific training goal."></textarea>
        </div>
      </section>

      <section class="card">
        <h3>Choose a Coach</h3>
        <div id="trainingCoachList" class="coach-request-list">
          ${coaches.map(coach => coachProfileCard(coach, true)).join('') || '<div class="notice reminder-box">No coach available.</div>'}
        </div>
      </section>

      <button class="btn btn-dark full" type="submit">Submit Training Request</button>
    </form>
  `;
}

function saveTrainingApp(event) {
  event.preventDefault();

  const state = load();
  const user = currentUser(state);
  const formData = new FormData(event.currentTarget);
  const sport = String(formData.get('sport') || '');
  const topic = String(formData.get('topic') || 'Fundamentals');
  const age = calcAge(user.dob);

  const duplicatePending = state.traineeApplications.some(item =>
    item.userId === user.id && item.sport === sport && (item.topic || 'Fundamentals') === topic && item.status === 'Pending'
  );


  if (duplicatePending) {
    return toast(`You already have a pending ${sport} training request.`);
  }


  if (age < 18) {
    user.guardian = {
      name: formData.get('guardianName'),
      relationship: formData.get('guardianRelationship'),
      mobile: formData.get('guardianMobile'),
      email: formData.get('guardianEmail') || ''
    };
  }

  user.emergencyContact = {
    name: formData.get('emergencyName'),
    relationship: formData.get('emergencyRelationship'),
    mobile: formData.get('emergencyMobile')
  };

  const request = {
    id: uid('TR'),
    userId: user.id,
    coachId: formData.get('coachId'),
    sport,
    topic,
    level: formData.get('level'),
    preference: formData.get('preference'),
    goal: formData.get('goal'),
    goalOther: formData.get('goal') === 'Other' ? formData.get('goalOther') : '',
    emergencyContact: user.emergencyContact,
    guardian: age < 18 ? user.guardian : null,
    date: today(),
    status: 'Pending'
  };

  if (!request.coachId) {
    return toast('Select a coach before submitting your request.');
  }

  state.traineeApplications.unshift(request);

  notify(
    state,
    request.coachId,
    'New Training Request',
    `${userName(user)} submitted a ${sport} training request.`
  );

  log(state, userName(user), `Submitted ${sport} training request`, 'Training Requests');
  save(state);
  toast('Training request submitted. Please contact your selected coach for confirmation.');
  go('training-application', false);
}

/* Trainee-specific rendering and filters are in assets/js/trainee.js. */


function coachTrainingRequests(s, coach) {
  const requests = s.traineeApplications
    .filter(request => request.coachId === coach.id)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const pendingCount = requests.filter(request => request.status === 'Pending').length;
  const approvedCount = requests.filter(request => request.status === 'Approved').length;

  const rows = requests.map(request => {
    const applicant = s.users.find(user => user.id === request.userId);

    return `
      <tr>
        <td>
          <b>${userName(applicant)}</b><br>
          <span class="muted small">${applicant?.email || ''} · ${applicant?.mobile || ''}</span>
        </td>
        <td>${request.sport}</td>
        <td>${request.level}</td>
        <td>${request.goal}${request.goalOther ? ` · ${request.goalOther}` : ''}</td>
        <td>${request.preference}</td>
        <td>${statusBadge(request.status)}</td>
        <td>
          <button class="btn btn-light btn-sm" onclick="viewTrainingApplicant('${request.id}')">View Details</button>
          ${request.status === 'Pending' ? `
            <button class="btn btn-dark btn-sm" onclick="approveTrainingRequest('${request.id}')">Confirm</button>
            <button class="btn btn-light btn-sm" onclick="rejectTrainingRequest('${request.id}')">Reject</button>
          ` : ''}
        </td>
      </tr>
    `;
  });

  return head('Training Requests') +
    stats([
      ['Pending', pendingCount],
      ['Approved', approvedCount]
    ]) +
    `<br>${table(['Applicant', 'Sport', 'Level', 'Goal', 'Schedule', 'Status', 'Actions'], rows)}`;
}
function viewTrainingApplicant(id){
  const s=load(),a=s.traineeApplications.find(x=>x.id===id),u=s.users.find(x=>x.id===a?.userId);if(!a||!u)return;const ec=emergencyInfo(u),age=calcAge(u.dob);
  modal(`<h3>${userName(u)} · Training Request</h3><div class="grid grid-2"><div><h4>Applicant Information</h4><div class="info-row"><span>Email</span><strong>${u.email}</strong></div><div class="info-row"><span>Mobile</span><strong>${u.mobile||'—'}</strong></div><div class="info-row"><span>Gender</span><strong>${u.gender||'—'}</strong></div><div class="info-row"><span>Age</span><strong>${age}</strong></div><div class="info-row"><span>Emergency Contact</span><strong>${ec.name||'—'} · ${ec.mobile||'—'}</strong></div>${age<18?`<div class="info-row"><span>Guardian</span><strong>${u.guardian?.name||'—'} · ${u.guardian?.mobile||'—'}</strong></div>`:''}</div><div><h4>Training Details</h4><div class="info-row"><span>Sport</span><strong>${a.sport}</strong></div><div class="info-row"><span>Level</span><strong>${a.level}</strong></div><div class="info-row"><span>Goal</span><strong>${a.goal}${a.goalOther?` · ${a.goalOther}`:''}</strong></div><div class="info-row"><span>Schedule</span><strong>${a.preference}</strong></div><div class="info-row"><span>Status</span><strong>${a.status}</strong></div></div></div><br><div class="actions">${a.status==='Pending'?`<button class="btn btn-dark" onclick="approveTrainingRequest('${a.id}')">Confirm Request</button><button class="btn btn-light" onclick="rejectTrainingRequest('${a.id}')">Reject</button>`:''}<button class="btn btn-light" onclick="closeModal()">Close</button></div>`);
}
function requestScheduleDefaults(preference){
  if(preference==='Weekday Morning')return {days:['Monday','Wednesday'],time:'09:00'};
  if(preference==='Weekday Afternoon')return {days:['Tuesday','Thursday'],time:'14:00'};
  if(preference==='Weekday Evening')return {days:['Monday','Wednesday'],time:'18:00'};
  if(preference==='Weekend')return {days:['Saturday'],time:'09:00'};
  return {days:['Monday','Wednesday'],time:'16:00'};
}
function approveTrainingRequest(id){
  const s=load(),coach=currentUser(s),a=s.traineeApplications.find(x=>x.id===id),u=s.users.find(x=>x.id===a?.userId);if(!a||!u||a.coachId!==coach.id)return;
  a.status='Approved';a.approvedDate=today();u.traineeAccess=true;u.role='trainee';u.emergencyContact=a.emergencyContact||u.emergencyContact;
  let group=s.groups.find(g=>g.coachId===coach.id&&g.sport===a.sport&&g.level===a.level&&g.status==='Active');
  if(!group){const defaults=requestScheduleDefaults(a.preference),court=s.courts.find(c=>c.sport.toLowerCase().includes(a.sport.toLowerCase()))||s.courts[0];group={id:uid('G'),name:`${a.sport} ${a.level} Group`,sport:a.sport,level:a.level,coachId:coach.id,trainees:[],court:court.id,days:defaults.days,time:defaults.time,duration:120,startDate:plusDays(3),totalSessions:24,status:'Active'};s.groups.push(group)}
  if(!group.trainees.includes(u.id)) group.trainees.push(u.id);
  u.trainingGroupIds = [...new Set([...(u.trainingGroupIds || []), group.id])];
  u.trainingGroupId = group.id;
  if(!s.sessions.some(q=>q.groupId===group.id)){[3,6,10,13].forEach((off,i)=>s.sessions.push({id:uid('S'),groupId:group.id,coachId:coach.id,court:group.court,date:plusDays(off),time:group.time,duration:group.duration,status:'Confirmed',topic:i===0?'Training orientation and fundamentals':'Progressive skills training'}))}
  notify(s,u.id,'Training Request Approved',`${userName(coach)} confirmed your ${a.sport} training request. Your account role is now Trainee and your training modules are available.`);log(s,userName(coach),`Approved training request ${id}`,'Training Requests');save(s);closeModal();toast('Training request confirmed. The user is now a Trainee.');go('coach-requests',false)
}
function rejectTrainingRequest(id){
  const s=load(),coach=currentUser(s),a=s.traineeApplications.find(x=>x.id===id);if(!a||a.coachId!==coach.id)return;const reason=prompt('Reason for rejecting this request:','Schedule or training capacity is currently unavailable.');if(reason===null)return;a.status='Rejected';a.rejectionReason=reason;notify(s,a.userId,'Training Request Update',`Your ${a.sport} training request was not approved. Reason: ${reason}`);save(s);closeModal();toast('Training request rejected.');go('coach-requests',false)
}

function coachDashboard(state, coach) {
  const groups = state.groups.filter(group => group.coachId === coach.id);
  const traineeIds = [...new Set(groups.flatMap(group => group.trainees))];
  const trainees = state.users.filter(user => traineeIds.includes(user.id));

  const sessions = state.sessions
    .filter(session => session.coachId === coach.id)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const upcoming = sessions.filter(session =>
    ['Confirmed', 'Ongoing'].includes(session.status) && session.date >= today()
  );

  const nextSessions = upcoming.slice(0, 5);

  const scheduleRows = nextSessions.map(session => {
    const group = state.groups.find(item => item.id === session.groupId);
    const court = state.courts.find(item => item.id === session.court);

    return `
      <tr>
        <td><b>${fmtDate(session.date)}</b></td>
        <td>${time12(session.time)}</td>
        <td>${group?.name || '—'}<br><span class="muted small">${group?.sport || '—'}</span></td>
        <td>${court?.name || session.court}</td>
        <td>${group?.trainees?.length || 0}</td>
        <td>${statusBadge(session.status)}</td>
      </tr>
    `;
  });

  return head('Coach Dashboard') +
    stats([
      ['Assigned Groups', groups.length],
      ['Assigned Trainees', trainees.length],
      ['Upcoming Sessions', upcoming.length],
      ['Progress Updates', state.progress.filter(record => record.coachId === coach.id).length]
    ]) +
    `
      <br>
      <section class="card coach-dashboard-schedule">
        <div class="section-heading-row">
          <div>
            <span class="eyebrow">SCHEDULE SUMMARY</span>
            <h3>My Next Training Sessions</h3>
          </div>
          <a class="btn btn-dark btn-sm" href="my-schedule.html">Open Full Schedule</a>
        </div>
        ${nextSessions.length
          ? table(['Date', 'Time', 'Training Group', 'Court', 'Trainees', 'Status'], scheduleRows)
          : '<div class="empty-state">No upcoming training sessions are currently scheduled.</div>'}
      </section>
    `;
}

function coachTrainingPlans(state, coach) {
  if (!Array.isArray(state.trainingPlans)) state.trainingPlans = [];

  const groups = state.groups.filter(group => group.coachId === coach.id);
  const traineeIds = [...new Set(groups.flatMap(group => group.trainees))];
  const trainees = state.users.filter(user => traineeIds.includes(user.id));
  const plans = state.trainingPlans.filter(plan => plan.coachId === coach.id);

  const rows = trainees.flatMap(trainee => {
    const traineeGroups = groups.filter(group => group.trainees.includes(trainee.id));

    return traineeGroups.map(group => {
      const plan = plans.find(item => item.traineeId === trainee.id && item.groupId === group.id);

      return `
        <tr>
          <td><b>${userName(trainee)}</b><br><span class="muted small">${trainee.email}</span></td>
          <td>${group.sport}</td>
          <td>${group.name}</td>
          <td>${plan?.phase || 'Not Set'}</td>
          <td>${plan?.weeklyFocus || '—'}</td>
          <td>${plan ? statusBadge(plan.status || 'Active') : '<span class="badge sage">Not Set</span>'}</td>
          <td>
            <button class="btn btn-dark btn-sm" onclick="editCoachTrainingPlan('${trainee.id}', '${group.id}')">
              ${plan ? 'Edit Plan' : 'Set Plan'}
            </button>
          </td>
        </tr>
      `;
    });
  });

  return head('Training Plans') +
  stats([
    ['Assigned Trainees', trainees.length],
    ['Plans Created', plans.length],
    ['Active Groups', groups.filter(group => group.status === 'Active').length]
  ]) +
  `<br>${table(['Trainee', 'Sport', 'Training Group', 'Phase', 'Weekly Focus', 'Status', 'Action'], rows)}`;
}


function trainingPlanSelect(name, label, options, currentValue = '', required = false, otherPlaceholder = 'Enter specific details...') {
  const current = String(currentValue || '').trim();
  const isPreset = options.includes(current);
  const selected = isPreset ? current : (current ? 'Other' : '');
  const requiredAttr = required ? 'required' : '';

  return `
    <div class="field full training-plan-choice">
      <label>${label}${required ? ' *' : ''}</label>
      <select name="${name}" data-plan-select="${name}" ${requiredAttr}>
        <option value="">Select an option</option>
        ${options.map(option => `
          <option value="${option}" ${selected === option ? 'selected' : ''}>${option}</option>
        `).join('')}
        <option value="Other" ${selected === 'Other' ? 'selected' : ''}>Other / Specific</option>
      </select>
      <textarea
        name="${name}Other"
        rows="3"
        class="plan-other-input ${selected === 'Other' ? '' : 'hidden'}"
        placeholder="${otherPlaceholder}"
      >${selected === 'Other' ? current : ''}</textarea>
    </div>
  `;
}

function trainingPlanValue(form, name) {
  const selected = String(form.get(name) || '').trim();
  const other = String(form.get(`${name}Other`) || '').trim();
  return selected === 'Other' ? other : selected;
}

function editCoachTrainingPlan(traineeId, groupId) {
  const state = load();
  const coach = currentUser(state);
  const trainee = state.users.find(user => user.id === traineeId);
  const group = state.groups.find(item => item.id === groupId && item.coachId === coach.id);

  if (!trainee || !group) return;
  if (!Array.isArray(state.trainingPlans)) state.trainingPlans = [];

  const existing = state.trainingPlans.find(plan =>
    plan.traineeId === traineeId && plan.groupId === groupId
  );

  modal(`
    <div class="modal-heading">
      <span class="eyebrow">DETAILED TRAINING PLAN</span>
      <h3>${userName(trainee)} · ${group.sport}</h3>
      <p class="muted">
        Create a complete training guide for the trainee. Saved information is reflected automatically
        in the trainee's My Training page.
      </p>
    </div>

    <form id="coachTrainingPlanForm" class="detailed-plan-form">
      <input type="hidden" name="traineeId" value="${traineeId}">
      <input type="hidden" name="groupId" value="${groupId}">

      <section class="plan-form-section">
        <div class="plan-form-section-head">
          <span class="plan-step">01</span>
          <div>
            <h4>Plan Overview</h4>
            <p>Set the overall direction, level, duration, and review schedule.</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Training Phase *</label>
            <select name="phase" required>
              ${['Foundation', 'Skill Development', 'Performance Building', 'Competition Preparation'].map(value => `
                <option ${existing?.phase === value ? 'selected' : ''}>${value}</option>
              `).join('')}
            </select>
          </div>

          <div class="field">
            <label>Plan Status *</label>
            <select name="status" required>
              ${['Active', 'On Hold', 'Completed'].map(value => `
                <option ${existing?.status === value ? 'selected' : ''}>${value}</option>
              `).join('')}
            </select>
          </div>

          <div class="field">
            <label>Current Training Level *</label>
            <select name="level" required>
              ${['Beginner', 'Intermediate', 'Advanced'].map(value => `
                <option ${existing?.level === value ? 'selected' : ''}>${value}</option>
              `).join('')}
            </select>
          </div>

          <div class="field">
            <label>Program Duration</label>
            <input name="programDuration" value="${existing?.programDuration || ''}" placeholder="Example: 8 weeks">
          </div>

          <div class="field">
            <label>Sessions Per Week</label>
            <select name="sessionsPerWeek">
              ${[1,2,3,4,5].map(value => `<option value="${value}" ${Number(existing?.sessionsPerWeek || 2) === value ? 'selected' : ''}>${value}</option>`).join('')}
            </select>
          </div>

          <div class="field">
            <label>Recommended Session Duration</label>
            <select name="sessionDuration">
              ${['60 minutes', '90 minutes', '120 minutes'].map(value => `
                <option ${existing?.sessionDuration === value ? 'selected' : ''}>${value}</option>
              `).join('')}
            </select>
          </div>

          <div class="field">
            <label>Plan Start Date</label>
            <input type="date" name="planStartDate" value="${existing?.planStartDate || ''}">
          </div>

          <div class="field">
            <label>Target Review Date</label>
            <input type="date" name="reviewDate" value="${existing?.reviewDate || ''}">
          </div>
        </div>
      </section>

      <section class="plan-form-section">
        <div class="plan-form-section-head">
          <span class="plan-step">02</span>
          <div>
            <h4>Goals & Development Priorities</h4>
            <p>Choose the trainee's development priorities. Select Other / Specific when the plan needs a custom instruction.</p>
          </div>
        </div>

        <div class="form-grid">
          ${trainingPlanSelect('goal', 'Main Training Goal', [
            'Build strong fundamentals',
            'Improve technique and consistency',
            'Improve game performance',
            'Prepare for competition',
            'Improve fitness and conditioning',
            'Return safely after a break or injury'
          ], existing?.goal, true, 'Write the trainee’s specific main training goal...')}

          ${trainingPlanSelect('weeklyFocus', 'Weekly Focus', [
            'Fundamentals and movement',
            'Technique repetition and consistency',
            'Game situations and decision-making',
            'Speed, agility and reaction',
            'Strength and endurance',
            'Recovery and controlled progression'
          ], existing?.weeklyFocus, true, 'Write the specific focus for this training week...')}

          ${trainingPlanSelect('technicalFocus', 'Technical Skills to Develop', [
            'Basic technique and mechanics',
            'Footwork and movement efficiency',
            'Control and accuracy',
            'Speed and execution',
            'Advanced sport-specific technique'
          ], existing?.technicalFocus, false, 'Specify the exact technical skills or mechanics to develop...')}

          ${trainingPlanSelect('tacticalFocus', 'Tactical / Game Strategy Focus', [
            'Positioning and court awareness',
            'Decision-making under pressure',
            'Offensive strategy',
            'Defensive strategy',
            'Team communication and coordination',
            'Match / game management'
          ], existing?.tacticalFocus, false, 'Describe the specific tactical or game strategy focus...')}

          ${trainingPlanSelect('physicalFocus', 'Physical Conditioning Focus', [
            'Agility and quickness',
            'Endurance',
            'Strength and power',
            'Balance and coordination',
            'Mobility and flexibility',
            'Reaction speed'
          ], existing?.physicalFocus, false, 'Specify the physical conditioning focus...')}

          ${trainingPlanSelect('mentalFocus', 'Mental / Discipline Focus', [
            'Confidence',
            'Focus and concentration',
            'Consistency and discipline',
            'Communication',
            'Composure under pressure',
            'Sportsmanship and responsibility'
          ], existing?.mentalFocus, false, 'Add a specific mental, behavior, or discipline goal...')}
        </div>
      </section>

      <section class="plan-form-section">
        <div class="plan-form-section-head">
          <span class="plan-step">03</span>
          <div>
            <h4>Session Structure</h4>
            <p>Select the standard structure for the trainee's sessions. Use Other / Specific for custom drills or routines.</p>
          </div>
        </div>

        <div class="form-grid">
          ${trainingPlanSelect('warmup', 'Warm-up Routine', [
            'Dynamic mobility and light cardio',
            'Sport-specific movement activation',
            'Footwork and coordination activation',
            'Mobility, balance and reaction warm-up',
            'Light technical warm-up with equipment'
          ], existing?.warmup, false, 'Specify the warm-up sequence, duration, or restrictions...')}

          ${trainingPlanSelect('mainDrills', 'Main Skill Drills', [
            'Fundamental technique drills',
            'Repetition and consistency drills',
            'Footwork and movement drills',
            'Accuracy and control drills',
            'Speed and reaction drills',
            'Advanced sport-specific drills'
          ], existing?.mainDrills, true, 'Write the specific drill, sets/repetitions, duration, and coaching cues...')}

          ${trainingPlanSelect('applicationDrills', 'Game / Application Drills', [
            'Partner application drills',
            'Conditioned game situations',
            'Point-play / scenario practice',
            'Small-sided game or scrimmage',
            'Full match / game simulation'
          ], existing?.applicationDrills, false, 'Specify the application drill or game situation...')}

          ${trainingPlanSelect('conditioning', 'Conditioning Component', [
            'Agility intervals',
            'Endurance intervals',
            'Strength circuit',
            'Speed and reaction circuit',
            'Sport-specific conditioning',
            'Low-impact conditioning'
          ], existing?.conditioning, false, 'Specify sets, work/rest intervals, intensity, or exercise details...')}

          ${trainingPlanSelect('cooldown', 'Cool-down / Recovery', [
            'Light movement and stretching',
            'Mobility and breathing recovery',
            'Hydration and recovery reminders',
            'Sport-specific recovery routine'
          ], existing?.cooldown, false, 'Specify the cool-down or recovery instructions...')}
        </div>
      </section>

      <section class="plan-form-section">
        <div class="plan-form-section-head">
          <span class="plan-step">04</span>
          <div>
            <h4>Milestones & Evaluation</h4>
            <p>Select how progress will be checked. Choose Other / Specific for measurable custom targets.</p>
          </div>
        </div>

        <div class="form-grid">
          ${trainingPlanSelect('shortTermMilestones', 'Short-term Milestones', [
            'Demonstrate correct basic technique',
            'Complete drills with improved consistency',
            'Improve movement and positioning',
            'Increase controlled repetitions',
            'Apply the target skill in guided play'
          ], existing?.shortTermMilestones, false, 'Specify a measurable short-term milestone and target date/week...')}

          ${trainingPlanSelect('longTermMilestones', 'Long-term Milestones', [
            'Perform skills consistently in game situations',
            'Advance to the next training level',
            'Complete a full game/match with correct application',
            'Meet competition-readiness standards',
            'Maintain target performance across multiple sessions'
          ], existing?.longTermMilestones, false, 'Specify a measurable long-term milestone and target date/week...')}

          ${trainingPlanSelect('evaluationCriteria', 'Evaluation Criteria', [
            'Technique quality',
            'Consistency and accuracy',
            'Game application and decision-making',
            'Physical performance',
            'Discipline and participation',
            'Combined coach assessment'
          ], existing?.evaluationCriteria, false, 'Specify the exact evaluation criteria, score, or performance standard...')}

          ${trainingPlanSelect('homePractice', 'Home Practice / Between-session Tasks', [
            'Mobility and stretching routine',
            'Footwork / movement practice',
            'Basic technique repetition',
            'Fitness and conditioning activity',
            'Video review / tactical study',
            'No assigned home practice'
          ], existing?.homePractice, false, 'Write a specific safe practice task for the trainee...')}
        </div>
      </section>

      <section class="plan-form-section">
        <div class="plan-form-section-head">
          <span class="plan-step">05</span>
          <div>
            <h4>Safety, Equipment & Coach Notes</h4>
            <p>Select standard requirements and use Other / Specific for personal instructions or comments.</p>
          </div>
        </div>

        <div class="form-grid">
          ${trainingPlanSelect('equipment', 'Required Equipment', [
            'Standard sport equipment',
            'Training shoes and sports attire',
            'Water bottle and towel',
            'Protective equipment',
            'Resistance band / conditioning equipment',
            'Academy-provided equipment only'
          ], existing?.equipment, false, 'List specific equipment, size, quantity, or items the trainee must bring...')}

          ${trainingPlanSelect('safetyNotes', 'Safety / Medical Considerations', [
            'Standard safety precautions',
            'Monitor hydration and rest breaks',
            'Reduce high-impact activity',
            'Modified training intensity',
            'Medical clearance / restriction on file',
            'No special restrictions reported'
          ], existing?.safetyNotes, false, 'Record the specific restriction, injury consideration, modification, or safety reminder...')}

          ${trainingPlanSelect('notes', 'Coach Instructions / Additional Notes', [
            'Follow standard coach instructions',
            'Emphasize consistency before increasing intensity',
            'Provide frequent technique corrections',
            'Monitor confidence and communication',
            'Review progress every two weeks',
            'Discuss progress with trainee after each review'
          ], existing?.notes, false, 'Enter specific coach comments, reminders, behavior expectations, or other instructions...')}
        </div>
      </section>

      <div class="modal-actions plan-modal-actions">
        <button class="btn btn-light" type="button" onclick="closeModal()">Cancel</button>
        <button class="btn btn-dark" type="submit">Save Detailed Training Plan</button>
      </div>
    </form>
  `);

  document.getElementById('coachTrainingPlanForm')?.addEventListener('submit', saveCoachTrainingPlan);

  document.querySelectorAll('[data-plan-select]').forEach(select => {
    const input = document.querySelector(`[name="${select.dataset.planSelect}Other"]`);
    if (!input) return;

    const syncOtherInput = () => {
      const showOther = select.value === 'Other';
      input.classList.toggle('hidden', !showOther);
      input.required = showOther && select.required;
      if (showOther) input.focus();
    };

    select.addEventListener('change', syncOtherInput);
  });
}

function saveCoachTrainingPlan(event) {
  event.preventDefault();

  const state = load();
  const coach = currentUser(state);
  const form = new FormData(event.target);
  const traineeId = form.get('traineeId');
  const groupId = form.get('groupId');
  const group = state.groups.find(item => item.id === groupId && item.coachId === coach.id);

  if (!group || !group.trainees.includes(traineeId)) {
    return toast('You can only manage plans for trainees assigned to your training groups.');
  }

  if (!Array.isArray(state.trainingPlans)) state.trainingPlans = [];

  let plan = state.trainingPlans.find(item =>
    item.traineeId === traineeId && item.groupId === groupId
  );

  const values = {
    coachId: coach.id,
    traineeId,
    groupId,
    sport: group.sport,

    phase: form.get('phase'),
    status: form.get('status'),
    level: form.get('level'),
    programDuration: form.get('programDuration') || '',
    sessionsPerWeek: Number(form.get('sessionsPerWeek') || 2),
    sessionDuration: form.get('sessionDuration') || '',
    planStartDate: form.get('planStartDate') || '',
    reviewDate: form.get('reviewDate') || '',

    goal: trainingPlanValue(form, 'goal'),
    weeklyFocus: trainingPlanValue(form, 'weeklyFocus'),
    technicalFocus: trainingPlanValue(form, 'technicalFocus'),
    tacticalFocus: trainingPlanValue(form, 'tacticalFocus'),
    physicalFocus: trainingPlanValue(form, 'physicalFocus'),
    mentalFocus: trainingPlanValue(form, 'mentalFocus'),

    warmup: trainingPlanValue(form, 'warmup'),
    mainDrills: trainingPlanValue(form, 'mainDrills'),
    applicationDrills: trainingPlanValue(form, 'applicationDrills'),
    conditioning: trainingPlanValue(form, 'conditioning'),
    cooldown: trainingPlanValue(form, 'cooldown'),

    shortTermMilestones: trainingPlanValue(form, 'shortTermMilestones'),
    longTermMilestones: trainingPlanValue(form, 'longTermMilestones'),
    evaluationCriteria: trainingPlanValue(form, 'evaluationCriteria'),
    homePractice: trainingPlanValue(form, 'homePractice'),

    equipment: trainingPlanValue(form, 'equipment'),
    safetyNotes: trainingPlanValue(form, 'safetyNotes'),
    notes: trainingPlanValue(form, 'notes'),
    updatedAt: new Date().toISOString()
  };

  if (plan) {
    Object.assign(plan, values);
  } else {
    plan = {
      id: uid('TP'),
      createdAt: new Date().toISOString(),
      ...values
    };
    state.trainingPlans.unshift(plan);
  }

  notify(
    state,
    traineeId,
    'Training Plan Updated',
    `${userName(coach)} updated your detailed ${group.sport} training plan. Open My Training to review it.`
  );

  log(
    state,
    userName(coach),
    `Updated detailed training plan for ${traineeId} (${group.sport})`,
    'Training Plans'
  );

  save(state);
  closeModal();
  toast('Detailed training plan saved and reflected on the trainee account.');
  go('coach-plans', false);
}

function renderCoach(r, s, u) {
  const gs = s.groups.filter(g => g.coachId === u.id);
  const ids = [...new Set(gs.flatMap(g => g.trainees))];
  const ts = s.users.filter(x => ids.includes(x.id));
  const sess = s.sessions.filter(x => x.coachId === u.id);

  if (r === 'dashboard') return coachDashboard(s, u);
  if (r === 'coach-requests') return coachTrainingRequests(s, u);
  if (r === 'coach-plans') return coachTrainingPlans(s, u);
  if (r === 'coach-schedule') return typeof coachScheduleView === 'function'
    ? coachScheduleView(s, u)
    : head('My Schedule') + table(
        ['Date', 'Time', 'Group', 'Court', 'Topic', 'Status'],
        sess.map(x => `<tr><td>${fmtDate(x.date)}</td><td>${time12(x.time)}</td><td>${s.groups.find(g => g.id === x.groupId)?.name || '—'}</td><td>${x.court.replace('CT-', 'Court ')}</td><td>${x.topic}</td><td>${statusBadge(x.status)}</td></tr>`)
      );
  if (r === 'coach-groups') {
    const cards = gs.map(g => {
      const trainees = g.trainees.map(id => s.users.find(user => user.id === id)).filter(Boolean);
      return `<article class="card">
        <div class="toolbar"><div><span class="eyebrow">${g.sport}</span><h3>${g.name}</h3></div>${statusBadge(g.status || 'Active')}</div>
        <div class="info-row"><span>Level</span><strong>${g.level || 'Beginner'}</strong></div>
        <div class="info-row"><span>Schedule</span><strong>${(g.days || []).join(' & ') || '—'} · ${time12(g.time)}</strong></div>
        <div class="info-row"><span>Court</span><strong>${g.court?.replace('CT-', 'Court ') || '—'}</strong></div>
        <div class="info-row"><span>Total Sessions</span><strong>${g.totalSessions || 0}</strong></div>
        <div class="info-row"><span>Trainees</span><strong>${trainees.length}</strong></div>
        <div class="notice" style="margin-top:14px">${trainees.map(t => userName(t)).join(', ') || 'No trainees assigned yet.'}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
          <button class="btn btn-light btn-sm" onclick="coachEditGroup('${g.id}')">Edit Group</button>
          <button class="btn btn-dark btn-sm" onclick="coachManageGroupTrainees('${g.id}')">Manage Trainees</button>
        </div>
      </article>`;
    }).join('');
    return head('Training Groups', '', `<button class="btn btn-dark" onclick="coachCreateGroup()">+ Create Training Group</button>`) +
      stats([['My Groups', gs.length], ['Assigned Trainees', ids.length], ['Active Sessions', sess.filter(x => x.status === 'Confirmed').length]]) +
      `<br><div class="grid grid-2">${cards || '<div class="card">No training groups yet.</div>'}</div>`;
  }
  if (r === 'coach-trainees') return head('Trainee Management') +
    stats([['Assigned Trainees', ts.length], ['My Groups', gs.length], ['Training Plans', (s.trainingPlans || []).filter(p => gs.some(g => g.id === p.groupId)).length]]) +
    `<br>` + table(
      ['Trainee', 'Sport / Group', 'Contact', 'Attendance Records', 'Latest Assessment', 'Actions'],
      ts.map(t => {
        const groupList = gs.filter(g => g.trainees.includes(t.id));
        const p = s.progress.filter(x => x.traineeId === t.id && x.coachId === u.id).sort((a, b) => b.date.localeCompare(a.date))[0];
        return `<tr>
          <td><strong>${userName(t)}</strong><br><span class="muted small">${t.id}</span></td>
          <td>${groupList.map(g => `${g.sport} · ${g.name}`).join('<br>') || '—'}</td>
          <td>${t.email}<br><span class="muted small">${t.mobile || '—'}</span></td>
          <td>${s.attendance.filter(a => a.traineeId === t.id).length}</td>
          <td>${p ? `${p.average.toFixed(1)}/5 · ${p.assessment}` : '—'}</td>
          <td><button class="btn btn-light btn-sm" onclick="coachTrainee('${t.id}')">View</button> <button class="btn btn-dark btn-sm" onclick="coachAssignTrainee('${t.id}')">Manage Group</button></td>
        </tr>`;
      })
    );
  if (r === 'coach-attendance') return head('Attendance Recording') + `<form id="coachAttendanceForm" class="card"><div class="form-grid-3"><div class="field"><label>Date *</label><input name="date" type="date" value="${today()}" required></div><div class="field"><label>Session *</label><select name="sessionId">${sess.map(x => `<option value="${x.id}">${x.id} · ${fmtDate(x.date)} ${time12(x.time)}</option>`).join('')}</select></div><div class="field"><label>Trainee *</label><select name="traineeId">${ts.map(t => `<option value="${t.id}">${userName(t)}</option>`).join('')}</select></div><div class="field"><label>Status *</label><select name="status"><option>Present</option><option>Absent</option><option>Late</option><option>Excused</option></select></div><div class="field full"><label>Remarks</label><input name="remarks" placeholder="Optional attendance remarks"></div></div><button class="btn btn-dark">Save Attendance</button></form>`;
  if (r === 'coach-progress') return head('Progress Update') + `<form id="coachProgressForm" class="card"><div class="form-grid-3"><div class="field"><label>Trainee *</label><select name="traineeId">${ts.map(t => `<option value="${t.id}">${userName(t)}</option>`).join('')}</select></div><div class="field"><label>Date *</label><input name="date" type="date" value="${today()}" required></div><div class="field"><label>Technique (1-5)</label><input name="technique" type="number" min="1" max="5" value="4"></div><div class="field"><label>Consistency (1-5)</label><input name="consistency" type="number" min="1" max="5" value="4"></div><div class="field"><label>Discipline (1-5)</label><input name="discipline" type="number" min="1" max="5" value="4"></div><div class="field"><label>Participation (1-5)</label><input name="participation" type="number" min="1" max="5" value="4"></div><div class="field full"><label>Remarks *</label><textarea name="remarks" rows="3" required></textarea></div><div class="field full"><label>Next Focus *</label><input name="nextFocus" required></div></div><button class="btn btn-dark">Save Progress Update</button></form>`;

  return head('Coach Portal');
}


function coachGroupForm(state, coach, group) {
  const courts = state.courts.filter(court => court.status === 'Available');
  modal(`
    <h3>${group ? 'Edit Training Group' : 'Create Training Group'}</h3>
    <form id="coachGroupForm">
      <div class="form-grid-2">
        <div class="field"><label>Group Name *</label><input name="name" value="${group?.name || ''}" required></div>
        <div class="field"><label>Sport *</label><select name="sport" required>${['Badminton','Basketball','Volleyball','Pickleball'].map(v=>`<option ${group?.sport===v?'selected':''}>${v}</option>`).join('')}</select></div>
        <div class="field"><label>Level *</label><select name="level">${['Beginner','Intermediate','Advanced'].map(v=>`<option ${group?.level===v?'selected':''}>${v}</option>`).join('')}</select></div>
        <div class="field"><label>Court *</label><select name="court">${courts.map(c=>`<option value="${c.id}" ${group?.court===c.id?'selected':''}>${c.name} · ${c.sport}</option>`).join('')}</select></div>
        <div class="field"><label>Days *</label><input name="days" value="${(group?.days || ['Monday','Wednesday']).join(', ')}" placeholder="Monday, Wednesday" required></div>
        <div class="field"><label>Time *</label><input name="time" type="time" value="${group?.time || '16:00'}" required></div>
        <div class="field"><label>Total Sessions</label><input name="totalSessions" type="number" min="1" value="${group?.totalSessions || 12}"></div>
        <div class="field"><label>Status</label><select name="status">${['Active','Inactive'].map(v=>`<option ${group?.status===v?'selected':''}>${v}</option>`).join('')}</select></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:18px"><button class="btn btn-dark" type="submit">Save Group</button><button class="btn btn-light" type="button" onclick="closeModal()">Cancel</button></div>
    </form>`);
  $('#coachGroupForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const fd = new FormData(event.target), current = load();
    let target = group ? current.groups.find(g => g.id === group.id) : null;
    if (!target) {
      target = {id: uid('GRP'), coachId: coach.id, trainees: [], startDate: today()};
      current.groups.push(target);
    }
    target.name = fd.get('name'); target.sport = fd.get('sport'); target.level = fd.get('level'); target.court = fd.get('court');
    target.days = String(fd.get('days')).split(',').map(x=>x.trim()).filter(Boolean); target.time = fd.get('time');
    target.totalSessions = Number(fd.get('totalSessions') || 0); target.status = fd.get('status'); target.coachId = coach.id;
    log(current, userName(coach), `${group ? 'Updated' : 'Created'} training group ${target.name}`, 'Training Groups');
    save(current); closeModal(); toast('Training group saved.'); location.reload();
  });
}
function coachCreateGroup(){const s=load(),u=currentUser(s);coachGroupForm(s,u,null)}
function coachEditGroup(id){const s=load(),u=currentUser(s),g=s.groups.find(x=>x.id===id&&x.coachId===u.id);if(g)coachGroupForm(s,u,g)}
function coachManageGroupTrainees(id){
  const s=load(),u=currentUser(s),g=s.groups.find(x=>x.id===id&&x.coachId===u.id); if(!g)return;
  const trainees=s.users.filter(x=>x.traineeAccess);
  modal(`<h3>Manage Trainees · ${g.name}</h3><form id="coachGroupTrainees"><div style="display:grid;gap:10px;max-height:360px;overflow:auto">${trainees.map(t=>`<label class="notice"><input type="checkbox" name="trainee" value="${t.id}" ${g.trainees.includes(t.id)?'checked':''}> <strong>${userName(t)}</strong> · ${t.email}</label>`).join('')||'No active trainees available.'}</div><div style="display:flex;gap:10px;margin-top:18px"><button class="btn btn-dark">Save Trainees</button><button class="btn btn-light" type="button" onclick="closeModal()">Cancel</button></div></form>`);
  $('#coachGroupTrainees')?.addEventListener('submit',e=>{e.preventDefault();const current=load(),target=current.groups.find(x=>x.id===id&&x.coachId===u.id);target.trainees=[...new FormData(e.target).getAll('trainee')];log(current,userName(u),`Updated trainees for ${target.name}`,'Trainee Management');save(current);closeModal();toast('Trainee assignments updated.');location.reload()});
}
function coachAssignTrainee(traineeId){
  const s=load(),u=currentUser(s),groups=s.groups.filter(g=>g.coachId===u.id),trainee=s.users.find(x=>x.id===traineeId); if(!trainee)return;
  modal(`<h3>Manage Group · ${userName(trainee)}</h3><form id="coachAssignTraineeForm"><div class="field"><label>Training Group *</label><select name="groupId">${groups.map(g=>`<option value="${g.id}" ${g.trainees.includes(traineeId)?'selected':''}>${g.sport} · ${g.name}</option>`).join('')}</select></div><button class="btn btn-dark" style="margin-top:16px">Assign Trainee</button></form>`);
  $('#coachAssignTraineeForm')?.addEventListener('submit',e=>{e.preventDefault();const current=load(),gid=new FormData(e.target).get('groupId');current.groups.filter(g=>g.coachId===u.id).forEach(g=>{g.trainees=g.trainees.filter(id=>id!==traineeId)});const target=current.groups.find(g=>g.id===gid&&g.coachId===u.id);if(target&&!target.trainees.includes(traineeId))target.trainees.push(traineeId);log(current,userName(u),`Assigned ${userName(trainee)} to ${target?.name||gid}`,'Trainee Management');save(current);closeModal();toast('Trainee group updated.');location.reload()});
}

function adminUsers(s){const users=s.users.filter(x=>['user','trainee'].includes(x.role));return head('User Management')+stats([['Registered Users',users.length],['Trainee Access',users.filter(x=>x.traineeAccess).length],['With Warnings',users.filter(x=>x.warningCount>0).length],['Restricted / Limited',users.filter(x=>['Booking Limited','Temporarily Restricted'].includes(standingFromWarnings(x,s))).length]])+`<br>${table(['User','Email / Mobile','Trainee Access','Warnings','Standing','Active Bookings','Actions'],users.map(x=>`<tr><td>${userName(x)}<br><span class="muted small">${x.id}</span></td><td>${x.email}<br>${x.mobile}</td><td>${x.traineeAccess?'Yes':'No'}</td><td>${x.warningCount||0}</td><td>${statusBadge(standingFromWarnings(x,s))}</td><td>${activeBookings(s,x).length}</td><td><button class="btn btn-light btn-sm" onclick="editUser('${x.id}')">Edit</button> ${x.traineeAccess?`<button class="btn btn-light btn-sm" onclick="toggleTrainee('${x.id}')">Remove Trainee</button>`:''} ${x.warningCount?`<button class="btn btn-light btn-sm" onclick="clearWarning('${x.id}')">Clear 1 Warning</button>`:''}</td></tr>`))}`}
function adminTrainees(s){const t=s.users.filter(x=>x.traineeAccess);return head('Trainee Management')+table(['Trainee','Training Group','Coach','Attendance','Latest Assessment','Action'],t.map(x=>{const g=s.groups.find(g=>g.trainees.includes(x.id)),c=s.users.find(u=>u.id===g?.coachId),a=s.attendance.filter(a=>a.traineeId===x.id),p=s.progress.filter(p=>p.traineeId===x.id).sort((a,b)=>b.date.localeCompare(a.date))[0];return `<tr><td>${userName(x)}</td><td>${g?.name||'Unassigned'}</td><td>${userName(c)}</td><td>${a.length} dated records</td><td>${p?`${p.average.toFixed(1)}/5 · ${p.assessment}`:'—'}</td><td><button class="btn btn-light btn-sm" onclick="traineeInfo('${x.id}')">View Trainee</button></td></tr>`}))}
function adminCoachAccess(s){const coaches=s.users.filter(x=>x.role==='coach');return head('Coach Management','Coach accounts and access.',`<button class="btn btn-dark" onclick="createCoachAccess()">Create Coach Account</button>`)+stats([['Active Coaches',coaches.filter(c=>c.status==='Active').length],['Training Groups',s.groups.length],['Assigned Trainees',s.groups.reduce((n,g)=>n+g.trainees.length,0)]])+`<br>${table(['Coach','Email','Mobile','Specialization','Status','Actions'],coaches.map(c=>`<tr><td>${userName(c)}</td><td>${c.email}</td><td>${c.mobile||'—'}</td><td>${c.specialization||'—'}</td><td>${statusBadge(c.status)}</td><td><button class="btn btn-light btn-sm" onclick="editUser('${c.id}')">Edit</button></td></tr>`))}`}
function adminMaster(s){const rows=[...s.bookings.filter(b=>b.status==='Confirmed').map(b=>({d:b.date,t:b.time,c:b.court,type:'Court Booking',name:b.id})),...s.sessions.filter(x=>x.status==='Confirmed').map(x=>({d:x.date,t:x.time,c:x.court,type:'Training',name:s.groups.find(g=>g.id===x.groupId)?.name||x.id}))].sort((a,b)=>(a.d+a.t).localeCompare(b.d+b.t));return head('Master Schedule')+table(['Date','Time','Court','Type','Schedule'],rows.map(x=>`<tr><td>${fmtDate(x.d)}</td><td>${time12(x.t)}</td><td>${x.c.replace('CT-','Court ')}</td><td>${x.type}</td><td>${x.name}</td></tr>`))}
function adminCourts(s){return head('Court Management','Manage court information and operational status.',`<button class="btn btn-dark" onclick="addCourt()">Add Court</button>`)+`<div class="grid grid-2">${s.courts.map((c,i)=>`<article class="card"><img style="width:100%;height:200px;object-fit:cover;border-radius:16px;margin-bottom:14px;filter:saturate(.65)" src="${[IMG.badminton,IMG.basketball,IMG.volleyball,IMG.pickleball][i%4]}"><h3>${c.name}</h3><div class="info-row"><span>Sport</span><strong>${c.sport}</strong></div><div class="info-row"><span>Status</span><strong>${statusBadge(c.status)}</strong></div><button class="btn btn-light btn-sm" onclick="editCourt('${c.id}')">Edit Court</button></article>`).join('')}</div>`}
function adminBookings(s){return head('Court Bookings')+table(['Booking','Player','Appointment','Court','Status','Actions'],s.bookings.map(b=>{const u=s.users.find(x=>x.id===b.userId);return `<tr><td>${b.id}</td><td>${userName(u)}<br><span class="muted small">${b.purpose} · ${b.players} player(s)</span></td><td>${fmtDate(b.date)}<br>${time12(b.time)} · ${b.duration/60}hr</td><td>${b.court.replace('CT-','Court ')}</td><td>${statusBadge(b.status)}${b.releasedForWalkIn?'<br><span class="badge sage">Released for Walk-in</span>':''}</td><td>${b.status==='Pending'?`<button class="btn btn-dark btn-sm" onclick="confirmBooking('${b.id}')">Confirm</button> <button class="btn btn-light btn-sm" onclick="rejectBooking('${b.id}')">Reject</button>`:b.status==='Confirmed'?`<button class="btn btn-light btn-sm" onclick="checkIn('${b.id}')">Check In</button>`:'—'}</td></tr>`}))}
function adminSessions(s){return head('Training Sessions','Admin controls final coach, court, date and time.',`<button class="btn btn-dark" onclick="newSession()">Create Session</button>`)+table(['Session','Group','Coach','Date','Time','Court','Topic','Status'],s.sessions.map(x=>`<tr><td>${x.id}</td><td>${s.groups.find(g=>g.id===x.groupId)?.name||'—'}</td><td>${userName(s.users.find(u=>u.id===x.coachId))}</td><td>${fmtDate(x.date)}</td><td>${time12(x.time)}</td><td>${x.court.replace('CT-','Court ')}</td><td>${x.topic}</td><td>${statusBadge(x.status)}</td></tr>`))}
function adminAttendance(s){return head('Attendance Management')+table(['Date','Trainee','Training Group','Session','Coach','Status','Remarks'],s.attendance.sort((a,b)=>b.date.localeCompare(a.date)).map(a=>{const t=s.users.find(x=>x.id===a.traineeId),g=s.groups.find(g=>g.trainees.includes(a.traineeId)),c=s.users.find(x=>x.id===a.recordedBy);return `<tr><td>${fmtDate(a.date)}</td><td>${userName(t)}</td><td>${g?.name||'—'}</td><td>${a.sessionId}</td><td>${userName(c)}</td><td>${statusBadge(a.status)}</td><td>${a.remarks||'—'}</td></tr>`}))}
function adminProgress(s){return head('Progress Monitoring')+table(['Date','Trainee','Coach','Technique','Consistency','Discipline','Participation','Overall Assessment','Remarks'],s.progress.sort((a,b)=>b.date.localeCompare(a.date)).map(p=>`<tr><td>${fmtDate(p.date)}</td><td>${userName(s.users.find(u=>u.id===p.traineeId))}</td><td>${userName(s.users.find(u=>u.id===p.coachId))}</td><td>${p.technique}/5</td><td>${p.consistency}/5</td><td>${p.discipline}/5</td><td>${p.participation}/5</td><td><b>${p.average.toFixed(1)}/5 · ${p.assessment}</b><br><span class="muted small">Next: ${p.nextFocus}</span></td><td>${p.remarks}</td></tr>`))}
function adminAnnouncements(s){return head('Announcement Management','Publish useful notices only.',`<button class="btn btn-dark" onclick="newAnnouncement()">New Announcement</button>`)+table(['Date','Title','Audience','Message','Status'],s.announcements.map(a=>`<tr><td>${fmtDate(a.date)}</td><td>${a.title}</td><td>${a.audience}</td><td>${a.message}</td><td>${statusBadge(a.status)}</td></tr>`))}
function adminAppeals(s){return head('Appeals')+table(['Appeal','User','Booking','Reason','Explanation','Date','Status','Actions'],s.appeals.map(a=>`<tr><td>${a.id}</td><td>${userName(s.users.find(u=>u.id===a.userId))}</td><td>${a.bookingId}</td><td>${a.reason}</td><td>${a.explanation}</td><td>${fmtDate(a.date)}</td><td>${statusBadge(a.status)}</td><td>${a.status==='For Review'?`<button class="btn btn-dark btn-sm" onclick="approveAppeal('${a.id}')">Approve</button> <button class="btn btn-light btn-sm" onclick="rejectAppeal('${a.id}')">Reject</button>`:'—'}</td></tr>`))}
function adminSettings(s){return head('System Settings')+`<form id="settingsForm" class="card"><div class="form-grid-3"><div class="field"><label>Cancellation Notice (hours)</label><input name="cancelHours" type="number" value="${s.settings.cancelHours}"></div><div class="field"><label>Reschedule Notice (hours)</label><input name="rescheduleHours" type="number" value="${s.settings.rescheduleHours}"></div><div class="field"><label>No-Show Grace (minutes)</label><input name="graceMinutes" type="number" value="${s.settings.graceMinutes}"></div><div class="field"><label>Restriction Days</label><input name="restrictionDays" type="number" value="${s.settings.restrictionDays}"></div><div class="field"><label>Contact Email</label><input name="email" type="email" value="${s.settings.email}"></div></div><button class="btn btn-dark">Save Settings</button> <button class="btn btn-light" type="button" onclick="resetDemo()">Reset Demo Data</button></form>`}
function bindModule(u, r) {
  if (r === 'book') bindBooking();
  if (r === 'training-application') bindTrainingRequest();
  if (r === 'profile') bindProfileEditor();
  if (['training','training-schedule','sessions','attendance','progress'].includes(r) && typeof bindTraineeSportFilter === 'function') bindTraineeSportFilter(r);
  if (r === 'coach-schedule' && typeof bindCoachSchedule === 'function') bindCoachSchedule();
  if (r === 'coach-attendance') $('#coachAttendanceForm')?.addEventListener('submit', saveCoachAttendance);
  if (r === 'coach-progress') $('#coachProgressForm')?.addEventListener('submit', saveCoachProgress);
  if (r === 'settings') $('#settingsForm')?.addEventListener('submit', saveSettings);
  if (u.role === 'admin' && typeof bindAdminModule === 'function') bindAdminModule(r);
}

function bindTrainingRequest(){
  const form=$('#trainingAppForm');if(!form)return;const sport=$('#trainingSport'),goal=$('#trainingGoal');
  const renderCoaches=()=>{const s=load(),list=coachesForSport(s,sport.value);$('#trainingCoachList').innerHTML=list.map(c=>coachProfileCard(c,true)).join('')||'<div class="notice">No active coach is available for this sport.</div>'};
  sport?.addEventListener('change',renderCoaches);
  goal?.addEventListener('change',()=>{const other=goal.value==='Other';$('#trainingGoalOtherBox')?.classList.toggle('hidden',!other);const ta=$('[name=goalOther]');if(ta)ta.required=other});
  form.addEventListener('submit',saveTrainingApp)
}

function bookingPriceDetails(state) {
  const courtId = $('#bCourt')?.value;
  const court = state.courts.find(item => item.id === courtId);

  if (!court) {
    return '<span>Select a court to view the estimated booking amount.</span>';
  }

  const durationHours = Number($('#bDuration')?.value || 60) / 60;
  const players = Number($('#bPlayers')?.value || 1);
  const includedPlayers = Number(court.includedPlayers || 6);
  const maxPlayers = Number(court.maxPlayers || court.capacity || 6);
  const fallbackRates = { Badminton: 350, Basketball: 600, Volleyball: 550, Pickleball: 350 };
  const baseRate = Number(court.baseRate || fallbackRates[court.sport] || 350);
  const additionalPlayerFee = Number(court.additionalPlayerFee || 75);
  const extraPlayers = Math.max(0, players - includedPlayers);
  const baseAmount = baseRate * durationHours;
  const extraAmount = extraPlayers * additionalPlayerFee;
  const total = baseAmount + extraAmount;

  return `
    <div>
      <span>Included Players</span>
      <strong>${includedPlayers}</strong>
    </div>
    <div>
      <span>Maximum Players</span>
      <strong>${maxPlayers}</strong>
    </div>
    <div>
      <span>Base Court Fee</span>
      <strong>₱${baseAmount.toLocaleString()}</strong>
    </div>
    <div>
      <span>Additional Players</span>
      <strong>${extraPlayers} × ₱${additionalPlayerFee.toLocaleString()}</strong>
    </div>
    <div class="booking-price-total">
      <span>Estimated Total</span>
      <strong>₱${total.toLocaleString()}</strong>
    </div>
  `;
}

function refreshBookingPrice() {
  const target = $('#bookingPriceSummary');
  if (!target) return;
  target.innerHTML = bookingPriceDetails(load());
}

function bindBooking() {
  let selectedDate = plusDays(1);
  let viewDate = new Date(selectedDate + 'T00:00:00');
  const type = () => $('#courtTypeFilter')?.value || '';

  const refresh = () => {
    const state = load();
    renderBookingCalendar(state, viewDate, selectedDate);
    $('#selectedBookingDate').textContent = fmtDate(selectedDate);
    $('#timeTable').innerHTML = timeGrid(state, selectedDate, type());
    $('#availableTimeSummary').innerHTML = availableTimeSummary(state, selectedDate, type());
    bindSlots();
    $$('[data-booking-day]').forEach(button => button.addEventListener('click', () => {
      selectedDate = button.dataset.bookingDay;
      $('#bDate').value = selectedDate;
      refresh();
    }));
  };

  $('#courtTypeFilter')?.addEventListener('change', refresh);
  $('#prevBookingMonth')?.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() - 1); refresh(); });
  $('#nextBookingMonth')?.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); refresh(); });
  $('#bDate')?.addEventListener('change', event => { selectedDate = event.target.value || selectedDate; viewDate = new Date(selectedDate + 'T00:00:00'); refresh(); });
  $('#bookingForm')?.addEventListener('submit', submitBooking);
  $('#bCourt')?.addEventListener('change', refreshBookingPrice);
  $('#bDuration')?.addEventListener('change', refreshBookingPrice);
  $('#bPlayers')?.addEventListener('input', refreshBookingPrice);
  refresh();
  refreshBookingPrice();
}

function bindSlots(){$$('[data-slot]').forEach(x=>x.addEventListener('click',()=>{$('#bDate').value=x.dataset.date;$('#bTime').value=x.dataset.time;$('#bCourt').value=x.dataset.court;refreshBookingPrice();toast('Available slot selected.')}))}
function submitBooking(e) {
  e.preventDefault();
  const s = load(), u = currentUser(s), block = canBook(s, u);
  if (block) return toast(block);
  const fd = new FormData(e.target), c = s.courts.find(x => x.id === fd.get('court')), duration = Number(fd.get('duration'));
  if (!c) return toast('Select a court from the timetable.');
  const conflictMessage = conflict(s, c.id, fd.get('date'), fd.get('time'), duration);
  if (conflictMessage) return toast(conflictMessage);
  const players = Number(fd.get('players'));
  const includedPlayers = Number(c.includedPlayers || 6);
  const maxPlayers = Number(c.maxPlayers || c.capacity || 6);
  if (players > maxPlayers) return toast(`This court allows a maximum of ${maxPlayers} players.`);
  const fallbackRates = { Badminton: 350, Basketball: 600, Volleyball: 550, Pickleball: 350 };
  const baseRate = Number(c.baseRate || fallbackRates[c.sport] || 350);
  const additionalPlayerFee = Number(c.additionalPlayerFee || 75);
  const extraPlayers = Math.max(0, players - includedPlayers);
  const estimatedAmount = (baseRate * (duration / 60)) + (extraPlayers * additionalPlayerFee);
  const booking = { id: uid('BK'), userId: u.id, court: c.id, date: fd.get('date'), time: fd.get('time'), duration, purpose: fd.get('purpose'), players, includedPlayers, extraPlayers, baseRate, additionalPlayerFee, estimatedAmount, notes: fd.get('notes'), status: 'Pending', createdAt: new Date().toISOString(), attendanceConfirmed: false, rescheduleCount: 0, checkedIn: false };
  s.bookings.push(booking);
  notify(s, u.id, 'Booking Submitted', `${booking.id} is pending Admin review.`);
  log(s, userName(u), `Submitted ${booking.id}`, 'Bookings');
  save(s);
  toast('Booking submitted for Admin review.');
  go('bookings');
}
function bindProfileEditor() {
  const form = $('#accountForm'), editButton = $('#profileEditButton'), actions = $('#profileEditActions'), photoButton = $('#photoChangeButton');
  if (!form) return;
  const editable = () => [...form.querySelectorAll('input[name]')].filter(input => !input.readOnly);
  const setEditing = on => {
    form.dataset.editing = String(on);
    editable().forEach(input => input.disabled = !on);
    actions?.classList.toggle('hidden', !on);
    photoButton?.classList.toggle('hidden', !on);
    editButton.textContent = on ? 'Editing Profile' : 'Edit Profile';
    editButton.disabled = on;
  };
  setEditing(false);
  editButton?.addEventListener('click', () => setEditing(true));
  $('#cancelProfileEdit')?.addEventListener('click', () => go('profile', false));
  $('#profilePhotoInput')?.addEventListener('change', saveProfilePhoto);
  form.addEventListener('submit', saveAccount);
  form.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); });
}

function saveProfilePhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return toast('Please choose an image file.');
  const reader = new FileReader();
  reader.onload = () => {
    const s = load(), u = currentUser(s);
    u.photo = reader.result;
    save(s);
    toast('Profile photo changed.');
    go('profile', false);
  };
  reader.readAsDataURL(file);
}

function saveAccount(e) {
  e.preventDefault();
  if (e.currentTarget.dataset.editing !== 'true') return toast('Click Edit Profile before making changes.');
  const s = load(), u = currentUser(s), fd = new FormData(e.currentTarget), newEmail = String(fd.get('email')).trim();
  if (s.users.some(x => x.id !== u.id && x.email.toLowerCase() === newEmail.toLowerCase())) return toast('That email is already in use.');
  ['first','middle','last','dob','gender','mobile'].forEach(key => u[key] = fd.get(key));
  u.email = newEmail;
  u.address = { house: fd.get('house'), street: fd.get('street'), barangay: fd.get('barangay'), city: fd.get('city'), province: fd.get('province'), zip: fd.get('zip') };
  log(s, userName(u), 'Updated account details', 'Account');
  save(s);
  toast('Account details saved.');
  go('profile', false);
}
function saveCoachAttendance(e){e.preventDefault();const s=load(),u=currentUser(s),fd=new FormData(e.target);let a=s.attendance.find(x=>x.traineeId===fd.get('traineeId')&&x.sessionId===fd.get('sessionId')&&x.date===fd.get('date'));if(a){a.status=fd.get('status');a.remarks=fd.get('remarks')}else s.attendance.unshift({id:uid('AT'),traineeId:fd.get('traineeId'),sessionId:fd.get('sessionId'),date:fd.get('date'),status:fd.get('status'),remarks:fd.get('remarks'),recordedBy:u.id});log(s,userName(u),'Recorded dated attendance','Attendance');save(s);toast('Attendance saved.')}
function assessment(avg){if(avg>=4.5)return 'Excellent';if(avg>=3.5)return 'Very Good';if(avg>=2.5)return 'Developing';if(avg>=1.5)return 'Needs Improvement';return 'Needs Support'}
function saveCoachProgress(event) {
  event.preventDefault();

  const s = load();
  const coach = currentUser(s);
  const formData = new FormData(event.target);
  const traineeId = formData.get('traineeId');

  const ratings = ['technique', 'consistency', 'discipline', 'participation']
    .map(key => Number(formData.get(key)));

  const average = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
  const group = s.groups.find(item => item.coachId === coach.id && item.trainees.includes(traineeId));

  s.progress.unshift({
    id: uid('PR'),
    traineeId,
    coachId: coach.id,
    groupId: group?.id || '',
    sport: group?.sport || '',
    date: formData.get('date'),
    technique: ratings[0],
    consistency: ratings[1],
    discipline: ratings[2],
    participation: ratings[3],
    average,
    assessment: assessment(average),
    remarks: formData.get('remarks'),
    nextFocus: formData.get('nextFocus')
  });

  notify(
    s,
    traineeId,
    'New Progress Assessment',
    `Your latest coach assessment is ${assessment(average)} (${average.toFixed(1)}/5).`
  );

  log(s, userName(coach), 'Submitted coach ratings', 'Progress');
  save(s);
  toast('Progress update saved.');
  event.target.reset();
}
function openBooking(id){const s=load(),b=s.bookings.find(x=>x.id===id);modal(`<h3>${b.id} · Appointment Details</h3><div class="info-row"><span>Court</span><strong>${b.court.replace('CT-','Court ')}</strong></div><div class="info-row"><span>Date / Time</span><strong>${fmtDate(b.date)} · ${time12(b.time)}</strong></div><div class="info-row"><span>Duration</span><strong>${b.duration/60} hour(s)</strong></div><div class="info-row"><span>Purpose</span><strong>${b.purpose}</strong></div><div class="info-row"><span>Players</span><strong>${b.players}</strong></div><div class="info-row"><span>Estimated Amount</span><strong>${typeof b.estimatedAmount==='number'?`₱${b.estimatedAmount.toLocaleString()}`:'Calculated from court pricing'}</strong></div><div class="info-row"><span>Booking Status</span><strong>${b.status}</strong></div><br><button class="btn btn-light full" onclick="closeModal()">Close</button>`)}
function cancelBooking(id){const s=load(),b=s.bookings.find(x=>x.id===id);const dt=new Date(`${b.date}T${b.time}:00`),hours=(dt-new Date())/36e5;if(hours<s.settings.cancelHours)return toast(`Cancellation must be at least ${s.settings.cancelHours} hours before the schedule.`);modal(`<h3>Cancel ${id}?</h3><p>The booking slot will be released.</p><div class="actions"><button class="btn btn-danger" onclick="confirmCancel('${id}')">Confirm Cancellation</button><button class="btn btn-light" onclick="closeModal()">Keep Booking</button></div>`)}
function confirmCancel(id){const s=load(),u=currentUser(s),b=s.bookings.find(x=>x.id===id);b.status='Cancelled';log(s,userName(u),`Cancelled ${id}`,'Bookings');save(s);closeModal();toast('Booking cancelled. The court slot has been released.');go('bookings',false)}
function requestReschedule(id){const s=load(),b=s.bookings.find(x=>x.id===id),dt=new Date(`${b.date}T${b.time}:00`),hours=(dt-new Date())/36e5;if(b.rescheduleCount>=1)return toast('Only one reschedule request is allowed.');if(hours<s.settings.rescheduleHours)return toast(`Reschedule requests must be at least ${s.settings.rescheduleHours} hours before the schedule.`);modal(`<h3>Request Reschedule</h3><p>Admin must approve the new appointment.</p><form onsubmit="saveReschedule(event,'${id}')"><div class="form-grid-2"><div class="field"><label>New Date</label><input name="date" type="date" min="${today()}" required></div><div class="field"><label>New Time</label><input name="time" type="time" required></div></div><div class="field"><label>Reason</label><textarea name="reason" required></textarea></div><button class="btn btn-dark full">Submit Request</button></form>`)}
function saveReschedule(e,id){e.preventDefault();const s=load(),u=currentUser(s),b=s.bookings.find(x=>x.id===id),fd=new FormData(e.target);b.rescheduleRequest={date:fd.get('date'),time:fd.get('time'),reason:fd.get('reason'),status:'For Review'};b.rescheduleCount++;notify(s,'A-1001','Reschedule Request',`${id} has a new reschedule request.`);log(s,userName(u),`Requested reschedule for ${id}`,'Bookings');save(s);closeModal();toast('Reschedule request sent to Admin.')}
function openAppeal(id){const s=load();const existing=s.appeals.find(a=>a.bookingId===id&&a.status==='For Review');if(existing)return toast('An appeal for this booking is already under review.');modal(`<h3>Apply for No-Show Appeal</h3><p>Only unavoidable circumstances are accepted for Admin review.</p><form onsubmit="saveAppeal(event,'${id}')"><div class="field"><label>Reason *</label><select name="reason"><option>Medical Emergency</option><option>Accident</option><option>Immediate Family Emergency</option><option>Force Majeure / Severe Weather</option><option>Other Unavoidable Circumstance</option></select></div><div class="field"><label>Explanation *</label><textarea name="explanation" required></textarea></div><button class="btn btn-dark full">Submit Appeal</button></form>`)}
function saveAppeal(e,id){e.preventDefault();const s=load(),u=currentUser(s),fd=new FormData(e.target);s.appeals.unshift({id:uid('AP'),userId:u.id,bookingId:id,reason:fd.get('reason'),explanation:fd.get('explanation'),date:today(),status:'For Review'});notify(s,'A-1001','No-Show Appeal',`${userName(u)} submitted an appeal for ${id}.`);log(s,userName(u),`Submitted appeal for ${id}`,'Appeals');save(s);closeModal();toast('Appeal submitted to Admin.')}
function cancelTrainingSession(id){const s=load(),q=s.sessions.find(x=>x.id===id);if(!q)return;const dt=new Date(`${q.date}T${q.time}:00`),hours=(dt-new Date())/36e5;if(hours<s.settings.cancelHours)return toast(`Cancellation must be at least ${s.settings.cancelHours} hours before training.`);modal(`<h3>Cancel Training Session</h3><p>Give a valid reason. The request will be sent to Admin for review.</p><form onsubmit="saveTrainingCancel(event,'${id}')"><div class="field"><label>Reason *</label><textarea name="reason" required minlength=5 placeholder="Explain why you cannot attend this session."></textarea></div><button class="btn btn-dark full">Submit Cancellation Request</button></form>`)}
function saveTrainingCancel(e,id){e.preventDefault();const s=load(),u=currentUser(s),q=s.sessions.find(x=>x.id===id),fd=new FormData(e.target);q.traineeCancelRequests=q.traineeCancelRequests||[];q.traineeCancelRequests.push({traineeId:u.id,reason:fd.get('reason'),status:'For Review',date:today()});notify(s,'A-1001','Training Cancellation Request',`${userName(u)} requested cancellation of ${id}.`);save(s);closeModal();toast('Cancellation request sent to Admin.');go('training-schedule',false)}
function requestTrainingReschedule(id){const s=load(),q=s.sessions.find(x=>x.id===id);if(!q)return;const dt=new Date(`${q.date}T${q.time}:00`),hours=(dt-new Date())/36e5;if(hours<s.settings.rescheduleHours)return toast(`Reschedule requests must be at least ${s.settings.rescheduleHours} hours before training.`);modal(`<h3>Reschedule Training Session</h3><p>Choose a preferred schedule and provide a valid reason. Admin approval is required.</p><form onsubmit="saveTrainingReschedule(event,'${id}')"><div class="form-grid-2"><div class="field"><label>Preferred Date *</label><input name="date" type="date" min="${today()}" required></div><div class="field"><label>Preferred Time *</label><input name="time" type="time" required></div></div><div class="field"><label>Reason *</label><textarea name="reason" required minlength=5></textarea></div><button class="btn btn-dark full">Submit Reschedule Request</button></form>`)}
function saveTrainingReschedule(e,id){e.preventDefault();const s=load(),u=currentUser(s),q=s.sessions.find(x=>x.id===id),fd=new FormData(e.target);q.traineeRescheduleRequests=q.traineeRescheduleRequests||[];q.traineeRescheduleRequests.push({traineeId:u.id,date:fd.get('date'),time:fd.get('time'),reason:fd.get('reason'),status:'For Review'});notify(s,'A-1001','Training Reschedule Request',`${userName(u)} requested a new schedule for ${id}.`);save(s);closeModal();toast('Reschedule request sent to Admin.');go('training-schedule',false)}
function logoutConfirm(){modal(`<h3>Log out?</h3><p>Your SPORTIVO session will end.</p><div class="actions"><button class="btn btn-dark" onclick="logoutNow()">Yes, Log Out</button><button class="btn btn-light" onclick="closeModal()">Cancel</button></div>`)}
function logoutNow() {
  sessionStorage.removeItem('sportivoSessionV27');
  window.location.href = authPageHref('login.html');
}
function renderNotifications(){let d=$('.notification-drawer');if(!d){d=document.createElement('aside');d.className='notification-drawer';document.body.appendChild(d)}const s=load(),u=currentUser(s);if(!u)return;const items=s.notifications.filter(n=>n.userId===u.id).slice(0,8);d.innerHTML=`<div style="display:flex;justify-content:space-between"><b>Notifications</b><button class="btn btn-light btn-sm" onclick="markRead()">Mark read</button></div><div style="margin-top:8px">${items.map(n=>`<div class="notification-item ${!n.read?'unread':''}"><strong>${n.title}</strong><p>${n.message}</p></div>`).join('')||'<p class="muted">No notifications.</p>'}</div>`;const unreadCount=s.notifications.filter(n=>n.userId===u.id&&!n.read).length;const bells=[document.getElementById('bellButton'),document.getElementById('bellBtn')];bells.forEach(bell=>{if(!bell)return;let badge=bell.querySelector('.bell-badge');if(unreadCount>0){if(!badge){badge=document.createElement('span');badge.className='bell-badge';bell.style.position='relative';bell.appendChild(badge)}badge.textContent=unreadCount}else{if(badge)badge.remove()}})}
function toggleNotifications(){$('.notification-drawer')?.classList.toggle('open')}function markRead(){const s=load(),u=currentUser(s);s.notifications.forEach(n=>{if(n.userId===u.id)n.read=true});save(s);renderNotifications();toast('Notifications marked as read.')}

/* admin actions */
function editUser(id){const s=load(),u=s.users.find(x=>x.id===id);modal(`<h3>Edit User Access</h3><form onsubmit="saveUserEdit(event,'${id}')"><div class="form-grid-2"><div class="field"><label>Full Name</label><input value="${userName(u)}" readonly></div><div class="field"><label>Email</label><input name="email" type="email" value="${u.email}"></div><div class="field"><label>Mobile</label><input name="mobile" value="${u.mobile||''}"></div><div class="field"><label>Status</label><select name="status"><option ${u.status==='Active'?'selected':''}>Active</option><option ${u.status==='Deactivated'?'selected':''}>Deactivated</option></select></div></div><button class="btn btn-dark full">Save</button></form>`)}
function saveUserEdit(e,id){e.preventDefault();const s=load(),u=s.users.find(x=>x.id===id),fd=new FormData(e.target),email=fd.get('email');if(s.users.some(x=>x.id!==id&&x.email.toLowerCase()===email.toLowerCase()))return toast('Email already in use.');u.email=email;u.mobile=fd.get('mobile');u.status=fd.get('status');log(s,'Administrator',`Updated ${u.id} access`,'Users');save(s);closeModal();go(location.hash.slice(1),false);toast('User updated.')}
function toggleTrainee(id){
  toast('Trainee role is controlled by the selected coach after a training request is confirmed.');
}
function clearWarning(id){const s=load(),u=s.users.find(x=>x.id===id);if(Array.isArray(s.warnings)){const w=s.warnings.find(x=>x.userId===id&&x.status==='Active');if(w)w.status='Cleared'}u.warningCount=s.warnings?s.warnings.filter(x=>x.userId===id&&x.status==='Active').length:Math.max(0,(u.warningCount||0)-1);u.accountStanding=standingFromWarnings(u,s);if(u.warningCount<3)u.restrictedUntil='';log(s,'Administrator',`Cleared one warning for ${u.id}`,'Users');save(s);go('users',false);toast('One warning cleared.')}
function traineeInfo(id){const s=load(),u=s.users.find(x=>x.id===id),a=s.attendance.filter(x=>x.traineeId===id).sort((x,y)=>y.date.localeCompare(x.date)),p=s.progress.filter(x=>x.traineeId===id).sort((x,y)=>y.date.localeCompare(x.date))[0];modal(`<h3>${userName(u)} · Trainee Information</h3><div class="info-row"><span>Email</span><strong>${u.email}</strong></div><div class="info-row"><span>Attendance Records</span><strong>${a.length}</strong></div><div class="info-row"><span>Latest Attendance</span><strong>${a[0]?`${fmtDate(a[0].date)} · ${a[0].status}`:'—'}</strong></div><div class="info-row"><span>Latest Assessment</span><strong>${p?`${p.average.toFixed(1)}/5 · ${p.assessment}`:'—'}</strong></div><br><button class="btn btn-light full" onclick="closeModal()">Close</button>`)}
function createCoachAccess(){modal(`<h3>Create Coach Account</h3><form onsubmit="saveCoachAccess(event)"><div class="form-grid-2"><div class="field"><label>First Name</label><input name="first" required></div><div class="field"><label>Last Name</label><input name="last" required></div><div class="field"><label>Email Address</label><input name="email" type="email" required></div><div class="field"><label>Mobile</label><input name="mobile" required></div><div class="field"><label>Specialization</label><input name="specialization" required></div><div class="field"><label>Temporary Password</label><input name="password" value="coach123" required></div></div><button class="btn btn-dark full">Create Coach Account</button></form>`)}
function saveCoachAccess(e){e.preventDefault();const s=load(),fd=new FormData(e.target),email=String(fd.get('email')).trim();if(s.users.some(u=>u.email.toLowerCase()===email.toLowerCase()))return toast('Email already exists.');s.users.push({id:uid('C'),role:'coach',first:fd.get('first'),middle:'',last:fd.get('last'),suffix:'',dob:'',gender:'',mobile:fd.get('mobile'),email,password:fd.get('password'),status:'Active',specialization:fd.get('specialization'),warningCount:0,accountStanding:'Good Standing'});log(s,'Administrator',`Created coach account ${email}`,'Coach Management');save(s);closeModal();go('coach-access',false);toast('Coach account created.')}
function newGroup(){const s=load(),coaches=s.users.filter(x=>x.role==='coach');modal(`<h3>Create Training Group</h3><form onsubmit="saveGroup(event)"><div class="form-grid-2"><div class="field"><label>Group Name</label><input name="name" required></div><div class="field"><label>Sport</label><select name="sport"><option>Badminton</option><option>Basketball</option><option>Volleyball</option><option>Pickleball</option></select></div><div class="field"><label>Coach</label><select name="coachId">${coaches.map(c=>`<option value="${c.id}">${userName(c)}</option>`).join('')}</select></div><div class="field"><label>Court</label><select name="court">${s.courts.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div><div class="field"><label>Days</label><input name="days" placeholder="Monday, Wednesday"></div><div class="field"><label>Time</label><input name="time" type="time"></div></div><button class="btn btn-dark full">Create Group</button></form>`)}
function saveGroup(e){e.preventDefault();const s=load(),fd=new FormData(e.target);s.groups.push({id:uid('G'),name:fd.get('name'),sport:fd.get('sport'),coachId:fd.get('coachId'),trainees:[],court:fd.get('court'),days:String(fd.get('days')).split(',').map(x=>x.trim()).filter(Boolean),time:fd.get('time'),duration:120,startDate:today(),totalSessions:24,status:'Active'});save(s);closeModal();go('groups',false);toast('Training group created.')}
function addCourt(){modal(`<h3>Add Court</h3><form onsubmit="saveCourt(event)"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Sport</label><input name="sport" required></div><button class="btn btn-dark full">Add Court</button></form>`)}
function saveCourt(e){e.preventDefault();const s=load(),fd=new FormData(e.target);s.courts.push({id:uid('CT'),name:fd.get('name'),sport:fd.get('sport'),status:'Available'});save(s);closeModal();go('courts',false);toast('Court added.')}
function editCourt(id){const s=load(),c=s.courts.find(x=>x.id===id);modal(`<h3>Edit ${c.name}</h3><form onsubmit="saveCourtEdit(event,'${id}')"><div class="field"><label>Status</label><select name="status"><option ${c.status==='Available'?'selected':''}>Available</option><option ${c.status==='Maintenance'?'selected':''}>Maintenance</option><option ${c.status==='Unavailable'?'selected':''}>Unavailable</option></select></div><button class="btn btn-dark full">Save</button></form>`)}
function saveCourtEdit(e,id){e.preventDefault();const s=load(),c=s.courts.find(x=>x.id===id),fd=new FormData(e.target);c.status=fd.get('status');save(s);closeModal();go('courts',false);toast('Court updated.')}
function confirmBooking(id){const s=load(),b=s.bookings.find(x=>x.id===id);const cf=conflict(s,b.court,b.date,b.time,b.duration,b.id);if(cf)return toast(cf);b.status='Confirmed';notify(s,b.userId,'Booking Confirmed',`${b.id} is confirmed. Arrive before the ${s.settings.graceMinutes}-minute grace period ends.`);log(s,'Administrator',`Confirmed ${id}`,'Bookings');save(s);go('admin-bookings',false);toast('Booking confirmed.')}
function rejectBooking(id){const s=load(),b=s.bookings.find(x=>x.id===id);b.status='Rejected';notify(s,b.userId,'Booking Rejected',`${id} was not approved.`);save(s);go('admin-bookings',false);toast('Booking rejected.')}
function checkIn(id){const s=load(),b=s.bookings.find(x=>x.id===id);b.checkedIn=true;b.status='Completed';log(s,'Administrator',`Checked in / completed ${id}`,'Bookings');save(s);go('admin-bookings',false);toast('Player checked in. Booking completed.')}
function manualNoShowCheck(){runNoShowSweep();go('dashboard',false);toast('No-show check completed.')}
function newSession(){const s=load();modal(`<h3>Create Training Session</h3><form onsubmit="saveSession(event)"><div class="field"><label>Group</label><select name="groupId">${s.groups.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></div><div class="field"><label>Court</label><select name="court">${s.courts.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div><div class="form-grid-2"><div class="field"><label>Date</label><input name="date" type="date" required></div><div class="field"><label>Time</label><input name="time" type="time" required></div></div><div class="field"><label>Topic</label><input name="topic" required></div><button class="btn btn-dark full">Create Session</button></form>`)}
function saveSession(e){e.preventDefault();const s=load(),fd=new FormData(e.target),g=s.groups.find(x=>x.id===fd.get('groupId')),date=fd.get('date'),time=fd.get('time'),court=fd.get('court');if(conflict(s,court,date,time,120))return toast('Court schedule conflict detected.');if(s.sessions.some(x=>x.status==='Confirmed'&&x.coachId===g.coachId&&x.date===date&&overlap(time,120,x.time,x.duration)))return toast('Coach schedule conflict detected.');if(s.sessions.some(x=>x.status==='Confirmed'&&x.groupId===g.id&&x.date===date&&overlap(time,120,x.time,x.duration)))return toast('Training group conflict detected.');s.sessions.push({id:uid('S'),groupId:g.id,coachId:g.coachId,court,date,time,duration:120,status:'Confirmed',topic:fd.get('topic')});save(s);closeModal();go('master',false);toast('Training session saved to the master schedule.')}
function newAnnouncement(){modal(`<h3>New Announcement</h3><form onsubmit="saveAnnouncement(event)"><div class="field"><label>Title</label><input name="title" required></div><div class="field"><label>Audience</label><select name="audience"><option>All</option><option>Trainees</option><option>Coaches</option></select></div><div class="field"><label>Message</label><textarea name="message" required></textarea></div><button class="btn btn-dark full">Publish</button></form>`)}
function saveAnnouncement(e){e.preventDefault();const s=load(),fd=new FormData(e.target);s.announcements.unshift({id:uid('AN'),title:fd.get('title'),message:fd.get('message'),audience:fd.get('audience'),date:today(),status:'Active'});save(s);closeModal();go('admin-announcements',false);toast('Announcement published.')}
function approveAppeal(id){const s=load(),a=s.appeals.find(x=>x.id===id),u=s.users.find(x=>x.id===a.userId);a.status='Approved';if(Array.isArray(s.warnings)){const w=s.warnings.find(x=>x.id===a.warningId||(a.bookingId&&x.bookingId===a.bookingId));if(w)w.status='Approved'}u.warningCount=s.warnings?s.warnings.filter(x=>x.userId===u.id&&x.status==='Active').length:Math.max(0,(u.warningCount||0)-1);u.accountStanding=standingFromWarnings(u,s);if(u.warningCount<3)u.restrictedUntil='';notify(s,u.id,'Appeal Approved',`Your appeal for ${a.bookingId} was approved and one warning was removed.`);log(s,'Administrator',`Approved appeal ${id}`,'Appeals');save(s);go('appeals',false);toast('Appeal approved. Warning removed.')}
function rejectAppeal(id){const s=load(),a=s.appeals.find(x=>x.id===id);a.status='Rejected';notify(s,a.userId,'Appeal Rejected',`Your appeal for ${a.bookingId} was not approved.`);save(s);go('appeals',false);toast('Appeal rejected.')}
function saveSettings(e){e.preventDefault();const s=load(),fd=new FormData(e.target);['cancelHours','rescheduleHours','graceMinutes','restrictionDays'].forEach(k=>s.settings[k]=Number(fd.get(k)));s.settings.email=fd.get('email');save(s);toast('Settings saved.')}
function coachTrainee(id){traineeInfo(id)}
function exportCSV(){const s=load(),rows=[['Type','Reference','Date','Status'],...s.bookings.map(b=>['Booking',b.id,b.date,b.status]),...s.attendance.map(a=>['Attendance',a.id,a.date,a.status]),...s.progress.map(p=>['Progress',p.id,p.date,p.assessment])];const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='sportivo-report.csv';a.click();URL.revokeObjectURL(a.href)}
function resetDemo() {
  localStorage.removeItem('sportivoV26');
  sessionStorage.removeItem('sportivoSessionV27');
  window.location.href = authPageHref('login.html');
}

window.addEventListener('DOMContentLoaded',()=>{bindAuth();renderPublicAvailability();initLandingTimetable();ensurePortal();if($('#portalRoot'))setInterval(()=>{runNoShowSweep()},60000);$('#modalRoot')?.addEventListener('click',e=>{if(e.target.id==='modalRoot')closeModal()})});
