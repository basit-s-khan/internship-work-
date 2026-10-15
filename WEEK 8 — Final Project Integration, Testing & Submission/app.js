const KEY='paklaunce_week3';
const defaultProfile={name:'Basit Khan',title:'Full-Stack Developer',bio:'I build fast, scalable and polished web applications for startups and growing businesses across Pakistan.',skills:['JavaScript','React','Node.js','PHP','MySQL'],experience:'3+ years',rating:4.9,reviews:128,location:'Pakistan'};
const defaultServices=[
{id:1,title:'I will build a modern responsive website',category:'Web Development',description:'Professional responsive website with clean UI, fast performance and deployment support.',price:150,delivery:'5 days',skills:['HTML','CSS','JavaScript'],rating:4.9,reviews:72},
{id:2,title:'I will design a premium brand identity',category:'Graphic Design',description:'Complete visual identity including logo concepts, colors and brand assets.',price:80,delivery:'4 days',skills:['Figma','Branding','Illustrator'],rating:4.8,reviews:44},
{id:3,title:'I will create a cross-platform mobile app',category:'Mobile App Development',description:'Flutter mobile application with clean architecture and responsive interfaces.',price:250,delivery:'10 days',skills:['Flutter','Dart','Firebase'],rating:5,reviews:31}
];
function load(){return JSON.parse(localStorage.getItem(KEY)||'{}')}function save(d){localStorage.setItem(KEY,JSON.stringify(d))}function profile(){return {...defaultProfile,...load().profile}}function services(){return load().services||defaultServices}function setServices(s){const d=load();d.services=s;save(d)}
function toast(msg){const t=document.querySelector('.toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function escapeHTML(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}
function nav(active){document.querySelectorAll('.links a').forEach(a=>a.classList.toggle('active',a.dataset.page===active))}
function serviceCard(s){return `<article class="card service-card"><div class="service-thumb">✦</div><div class="top"><img class="avatar" src="assets/profile.svg" alt="Profile"><div><strong>${escapeHTML(profile().name)}</strong><div class="muted" style="font-size:12px">${escapeHTML(profile().title)}</div></div></div><h3 style="margin:0">${escapeHTML(s.title)}</h3><span class="tag">${escapeHTML(s.category)}</span><div class="pill-row">${s.skills.map(x=>`<span class="tag">${escapeHTML(x)}</span>`).join('')}</div><div><span class="rating">★ ${s.rating}</span> <span class="muted">(${s.reviews} reviews)</span></div><div style="display:flex;justify-content:space-between;align-items:center"><div><span class="muted">Starting at</span><div class="price">$${s.price}</div></div><span class="muted">${escapeHTML(s.delivery)}</span></div><div class="card-actions"><a class="btn primary" href="service.html?id=${s.id}">View Service</a><a class="btn" href="freelancer.html">Profile</a><button class="btn w7-favorite" type="button" data-favorite-kind="service" data-favorite-id="${s.id}" aria-pressed="false">♡ Save</button></div></article>`}
function renderServices(){const box=document.querySelector('#serviceGrid');if(!box)return;let list=services();const q=(document.querySelector('#search')?.value||'').toLowerCase();const cat=document.querySelector('#category')?.value||'All';const sort=document.querySelector('#sort')?.value||'default';if(q)list=list.filter(s=>(s.title+' '+s.category+' '+s.skills.join(' ')).toLowerCase().includes(q));if(cat!=='All')list=list.filter(s=>s.category===cat);if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='rating')list.sort((a,b)=>b.rating-a.rating);box.innerHTML=list.length?list.map(serviceCard).join(''):`<div class="card empty" style="grid-column:1/-1">No services match your search.</div>`}
function initMarketplace(){nav('services');['search','category','sort'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderServices));renderServices()}
function fillProfile(){const p=profile();document.querySelectorAll('[data-profile-name]').forEach(e=>e.textContent=p.name);document.querySelectorAll('[data-profile-title]').forEach(e=>e.textContent=p.title);document.querySelectorAll('[data-profile-bio]').forEach(e=>e.textContent=p.bio);document.querySelectorAll('[data-profile-rating]').forEach(e=>e.textContent=p.rating);document.querySelectorAll('[data-profile-reviews]').forEach(e=>e.textContent=p.reviews);const skills=document.querySelector('#profileSkills');if(skills)skills.innerHTML=p.skills.map(s=>`<span class="tag">${escapeHTML(s)}</span>`).join('')}
function initProfile(){nav('profile');fillProfile();const p=profile();const s=services();const grid=document.querySelector('#profileServices');if(grid)grid.innerHTML=s.map(serviceCard).join('')}
function initEdit(){nav('profile');const p=profile();['name','title','bio','experience','location'].forEach(k=>{const e=document.getElementById(k);if(e)e.value=p[k]||''});document.getElementById('skills').value=p.skills.join(', ');document.getElementById('profileForm').addEventListener('submit',e=>{e.preventDefault();const p={...profile(),name:name.value.trim(),title:title.value.trim(),bio:bio.value.trim(),experience:experience.value.trim(),location:location.value.trim(),skills:skills.value.split(',').map(x=>x.trim()).filter(Boolean)};if(!p.name||!p.title||!p.bio){document.getElementById('formError').style.display='block';return}document.getElementById('formError').style.display='none';const d=load();d.profile=p;save(d);toast('Profile updated successfully');setTimeout(()=>location.href='profile.html',500)})}
function initCreate(){nav('create');document.getElementById('serviceForm').addEventListener('submit',e=>{e.preventDefault();let valid=true;document.querySelectorAll('[required]').forEach(x=>{if(!x.value.trim()){valid=false}});if(!valid){document.getElementById('formError').style.display='block';return}document.getElementById('formError').style.display='none';const s={id:Date.now(),title:serviceTitle.value.trim(),category:serviceCategory.value,description:serviceDescription.value.trim(),price:Number(servicePrice.value),delivery:delivery.value,skills:serviceSkills.value.split(',').map(x=>x.trim()).filter(Boolean),rating:5,reviews:0};const list=services();list.unshift(s);setServices(list);toast('Service published successfully');setTimeout(()=>location.href='my-services.html',500)})}
function initMyServices(){nav('myservices');const box=document.querySelector('#myServices');function render(){const list=services();box.innerHTML=list.map(s=>`<article class="card" style="display:grid;grid-template-columns:150px 1fr auto;gap:18px;align-items:center"><div class="service-thumb">✦</div><div><span class="tag">${escapeHTML(s.category)}</span><h3>${escapeHTML(s.title)}</h3><div class="muted">$${s.price} · ${s.delivery} · ★ ${s.rating}</div></div><div class="card-actions"><a class="btn" href="service.html?id=${s.id}">View</a><button class="btn danger" data-delete="${s.id}">Delete</button></div></article>`).join('');box.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this service?')){setServices(services().filter(s=>s.id!=b.dataset.delete));render();toast('Service deleted')}})}render()}
function initDetail(){const id=Number(new URLSearchParams(location.search).get('id'));const s=services().find(x=>x.id===id)||services()[0];if(!s)return;document.querySelector('#detailTitle').textContent=s.title;document.querySelector('#detailDescription').textContent=s.description;document.querySelector('#detailCategory').textContent=s.category;document.querySelector('#detailPrice').textContent='$'+s.price;document.querySelector('#detailDelivery').textContent=s.delivery;document.querySelector('#detailRating').textContent='★ '+s.rating+' ('+s.reviews+' reviews)';document.querySelector('#detailSkills').innerHTML=s.skills.map(x=>`<span class="tag">${escapeHTML(x)}</span>`).join('');document.querySelector('#contactBtn').onclick=()=>document.querySelector('#contactModal').classList.add('show');document.querySelector('#closeModal').onclick=()=>document.querySelector('#contactModal').classList.remove('show')}
function initHome(){nav('home');document.querySelector('#homeServices')?.replaceChildren(...services().slice(0,3).map(s=>{const d=document.createElement('div');d.innerHTML=serviceCard(s);return d.firstElementChild}));document.querySelector('#homeSearch')?.addEventListener('submit',e=>{e.preventDefault();location.href='browse.html?q='+encodeURIComponent(homeQuery.value)});if(window.jobsLoad&&document.querySelector('#homeJobs'))document.querySelector('#homeJobs').innerHTML=jobsLoad().slice(0,2).map(jobCard).join('')}
document.addEventListener('DOMContentLoaded',()=>{fillProfile();if(document.body.dataset.page==='home')initHome();if(document.body.dataset.page==='services')initMarketplace();if(document.body.dataset.page==='profile')initProfile();if(document.body.dataset.page==='edit')initEdit();if(document.body.dataset.page==='create')initCreate();if(document.body.dataset.page==='myservices')initMyServices();if(document.body.dataset.page==='detail')initDetail();if(document.body.dataset.page==='jobs')initJobs();if(document.body.dataset.page==='jobdetail')initJobDetail();if(document.body.dataset.page==='postjob')initPostJob();if(document.body.dataset.page==='proposal')initProposal();if(document.body.dataset.page==='proposals')initProposals()});



/* =========================
   WEEK 5 — ORDERS & PROJECTS
   ========================= */
const DEFAULT_PROJECTS = [
  {
    id:"PKL-1001",
    title:"Modern E-commerce Website",
    client:"Ayesha Khan",
    freelancer:"Alex Johnson",
    clientRole:"Client",
    freelancerRole:"Full Stack Developer",
    avatar:"assets/alex.svg",
    category:"Web Development",
    budget:1250,
    deadline:"2026-09-30",
    status:"In Progress",
    progress:62,
    description:"Build a responsive e-commerce storefront with product discovery, cart flow, checkout UI, and a clean admin-ready architecture.",
    milestones:[
      {id:"m1",title:"Project setup & architecture",due:"Sep 14",done:true},
      {id:"m2",title:"Responsive storefront",due:"Sep 20",done:true},
      {id:"m3",title:"Cart & checkout flow",due:"Sep 26",done:true},
      {id:"m4",title:"Testing & final delivery",due:"Sep 30",done:false}
    ],
    delivery:{status:"Not Submitted",note:"Final delivery will appear here when the freelancer submits the completed work."},
    activity:[
      {icon:"✓",title:"Milestone completed",text:"Cart & checkout flow marked complete."},
      {icon:"↗",title:"Project updated",text:"Progress moved to 62%."},
      {icon:"@",title:"Message",text:"Client sent a new project note."}
    ]
  },
  {
    id:"PKL-1002",
    title:"Brand Identity & Social Media Kit",
    client:"Hamza Malik",
    freelancer:"Sophia Martinez",
    clientRole:"Client",
    freelancerRole:"UI/UX Designer",
    avatar:"assets/sophia.svg",
    category:"Graphic Design",
    budget:650,
    deadline:"2026-09-24",
    status:"Submitted",
    progress:100,
    description:"Create a complete visual identity with logo direction, typography, color system, and a reusable social media kit.",
    milestones:[
      {id:"m1",title:"Creative direction",due:"Sep 15",done:true},
      {id:"m2",title:"Logo concepts",due:"Sep 18",done:true},
      {id:"m3",title:"Social media kit",due:"Sep 22",done:true},
      {id:"m4",title:"Final files & handoff",due:"Sep 24",done:true}
    ],
    delivery:{status:"Submitted",note:"Final brand package submitted for client review. Awaiting approval."},
    activity:[
      {icon:"↑",title:"Delivery submitted",text:"Final brand package was submitted."},
      {icon:"✓",title:"All milestones complete",text:"Project reached 100% progress."},
      {icon:"@",title:"Message",text:"Freelancer added final handoff notes."}
    ]
  },
  {
    id:"PKL-1003",
    title:"Analytics Dashboard & Reports",
    client:"Sara Ahmed",
    freelancer:"Noah Williams",
    clientRole:"Client",
    freelancerRole:"Data Analyst",
    avatar:"assets/noah.svg",
    category:"Data Analysis",
    budget:800,
    deadline:"2026-10-05",
    status:"Pending",
    progress:10,
    description:"Create a business analytics dashboard from sales data with KPI reporting, trend analysis, and exportable summaries.",
    milestones:[
      {id:"m1",title:"Data audit & requirements",due:"Sep 25",done:true},
      {id:"m2",title:"Dashboard prototype",due:"Sep 29",done:false},
      {id:"m3",title:"Reports & insights",due:"Oct 3",done:false},
      {id:"m4",title:"Final handoff",due:"Oct 5",done:false}
    ],
    delivery:{status:"Not Submitted",note:"The project has not reached the delivery stage yet."},
    activity:[
      {icon:"→",title:"Order created",text:"Proposal was accepted and project opened."},
      {icon:"@",title:"Kickoff note",text:"Client provided initial data files."}
    ]
  },
  {
    id:"PKL-1004",
    title:"Flutter Fitness App",
    client:"Usman Shah",
    freelancer:"Daniel Kim",
    clientRole:"Client",
    freelancerRole:"Mobile App Developer",
    avatar:"assets/daniel.svg",
    category:"Mobile App Development",
    budget:1800,
    deadline:"2026-08-28",
    status:"Completed",
    progress:100,
    description:"Cross-platform fitness application with onboarding, workout plans, progress tracking, and Firebase-backed user data.",
    milestones:[
      {id:"m1",title:"App architecture",due:"Aug 10",done:true},
      {id:"m2",title:"Core mobile screens",due:"Aug 17",done:true},
      {id:"m3",title:"Firebase integration",due:"Aug 24",done:true},
      {id:"m4",title:"Store-ready handoff",due:"Aug 28",done:true}
    ],
    delivery:{status:"Approved",note:"Delivery approved by the client. Project completed successfully."},
    activity:[
      {icon:"✓",title:"Project completed",text:"Client approved final delivery."},
      {icon:"★",title:"Review received",text:"Client left a 5-star review."}
    ]
  }
];

function getProjects(){
  try{
    const stored=JSON.parse(localStorage.getItem("paklaunce_projects")||"null");
    return Array.isArray(stored)&&stored.length ? stored : DEFAULT_PROJECTS;
  }catch(e){return DEFAULT_PROJECTS}
}
function saveProjects(projects){localStorage.setItem("paklaunce_projects",JSON.stringify(projects))}
function projectStatusClass(status){
  return status==="In Progress"?"status-progress":status==="Submitted"?"status-submitted":status==="Completed"?"status-completed":status==="Cancelled"?"status-cancelled":"status-pending";
}
function projectIcon(category){
  return category==="Web Development"?"&lt;/&gt;":category==="Graphic Design"?"✦":category==="Mobile App Development"?"▯":category==="Data Analysis"?"▥":"⌁";
}
function prettyDate(date){
  const d=new Date(date+"T00:00:00");
  if(Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"});
}
function projectCard(p){
  return `<article class="project-card">
    <div class="project-card-top">
      <div class="project-title-row"><div class="project-icon">${projectIcon(p.category)}</div><div><h3>${p.title}</h3><div class="project-client">${p.client} → ${p.freelancer}</div></div></div>
      <span class="status-badge ${projectStatusClass(p.status)}">${p.status}</span>
    </div>
    <p class="project-card-desc">${p.description}</p>
    <div class="project-meta-grid">
      <div class="project-meta-box"><small>Budget</small><b>$${p.budget.toLocaleString()}</b></div>
      <div class="project-meta-box"><small>Deadline</small><b>${prettyDate(p.deadline)}</b></div>
      <div class="project-meta-box"><small>Category</small><b>${p.category.replace(" Development"," Dev.")}</b></div>
      <div class="project-meta-box"><small>Milestones</small><b>${p.milestones.filter(m=>m.done).length}/${p.milestones.length}</b></div>
    </div>
    <div class="progress-block"><div class="progress-head"><span>Project progress</span><b>${p.progress}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${p.progress}%"></div></div></div>
    <div class="project-card-footer"><small>Order ID: ${p.id}</small><a class="project-link" href="project.html?id=${encodeURIComponent(p.id)}">Open Project →</a></div>
  </article>`;
}

function initProjectsPage(){
  const grid=$("#projectGrid"); if(!grid)return;
  const projects=getProjects();
  const filter=$("#projectStatusFilter");
  const role=$("#projectRoleFilter");
  function render(){
    let list=projects;
    if(filter.value!=="All") list=list.filter(p=>p.status===filter.value);
    if(role.value==="Client") list=list.filter(p=>p.clientRole==="Client");
    if(role.value==="Freelancer") list=list.filter(p=>p.freelancerRole);
    $("#projectCount").textContent=`${list.length} project${list.length===1?"":"s"} found`;
    grid.innerHTML=list.length?list.map(projectCard).join(""):`<div class="empty-projects"><h3>No projects in this view</h3><p>Change the filter to see other orders.</p></div>`;
  }
  filter.addEventListener("change",render);role.addEventListener("change",render);render();

  const all=projects.length, active=projects.filter(p=>["Pending","In Progress","Submitted"].includes(p.status)).length, completed=projects.filter(p=>p.status==="Completed").length;
  $("#summaryTotal").textContent=all;$("#summaryActive").textContent=active;$("#summaryCompleted").textContent=completed;
  const totalValue=projects.reduce((n,p)=>n+p.budget,0);$("#summaryValue").textContent="$"+totalValue.toLocaleString();
  const upcoming=[...projects].filter(p=>p.status!=="Completed"&&p.status!=="Cancelled").sort((a,b)=>a.deadline.localeCompare(b.deadline)).slice(0,3);
  $("#deadlineList").innerHTML=upcoming.map(p=>`<div class="deadline-item"><div><b>${p.title}</b><span>${p.status}</span></div><span class="deadline-date">${prettyDate(p.deadline)}</span></div>`).join("");
}

function renderTimeline(status){
  const steps=["Pending","In Progress","Submitted","Completed"];
  const current=status==="Cancelled"?-1:steps.indexOf(status);
  return steps.map((s,i)=>`<div class="timeline-step ${i<current?"done":""} ${i===current?"current":""}"><div class="timeline-dot">${i<current?"✓":i+1}</div><span>${s}</span></div>`).join("");
}

function projectDetailMarkup(p, role){
  const completed=p.milestones.filter(m=>m.done).length;
  const isClient=role==="client";
  return `<div class="detail-project-header">
    <div><div class="kicker">ORDER / PROJECT ${p.id}</div><h1>${p.title}</h1><p>${p.description}</p></div>
    <div class="detail-header-actions">
      <div class="role-switch"><button data-role="client" class="${isClient?"active":""}">Client View</button><button data-role="freelancer" class="${!isClient?"active":""}">Freelancer View</button></div>
      <span class="status-badge ${projectStatusClass(p.status)}">${p.status}</span>
    </div>
  </div>
  <div class="detail-project-grid">
    <div class="detail-project-main">
      <section class="project-panel"><h2>Project Status</h2><div class="status-timeline">${renderTimeline(p.status)}</div></section>
      <section class="project-panel"><h2>Overall Progress</h2><div class="overall-progress"><div class="progress-circle" style="--progress:${p.progress}"><strong>${p.progress}%</strong></div><div class="progress-copy"><h3>${p.progress===100?"Ready for final review":"Project is moving forward"}</h3><p>${completed} of ${p.milestones.length} milestones completed. Keep the next task moving to stay on schedule.</p></div></div></section>
      <section class="project-panel"><h2>Milestones & Tasks</h2><div class="milestone-list" id="milestoneList">${p.milestones.map(m=>`<div class="milestone ${m.done?"completed":""}" data-mid="${m.id}"><button class="milestone-check" aria-label="Toggle milestone">${m.done?"✓":"○"}</button><div><h4>${m.title}</h4><p>Project task and delivery checkpoint</p></div><time>${m.due}</time></div>`).join("")}</div></section>
      <section class="project-panel"><h2>Delivery & Submission</h2><div class="delivery-box ${p.delivery.status!=="Not Submitted"?"submitted":""}"><h3>${p.delivery.status==="Approved"?"✓ Delivery approved":p.delivery.status==="Submitted"?"Delivery submitted for review":"Ready when the work is complete"}</h3><p>${p.delivery.note}</p><div class="delivery-actions">${isClient&&p.delivery.status==="Submitted"?`<button class="btn btn-primary" id="approveDelivery">Approve Delivery</button><button class="btn btn-outline" id="requestChanges">Request Changes</button>`:!isClient&&p.delivery.status==="Not Submitted"&&p.progress>=50?`<button class="btn btn-primary" id="submitDelivery">Submit Delivery</button>`:`<button class="btn btn-outline" id="deliveryInfo">View Delivery Status</button>`}</div><div class="delivery-note" id="deliveryNote"></div></div></section>
      <section class="project-panel"><h2>Recent Activity</h2><div class="activity-list">${p.activity.map(a=>`<div class="activity"><div class="activity-icon">${a.icon}</div><div><b>${a.title}</b><span>${a.text}</span></div></div>`).join("")}</div></section>
    </div>
    <aside class="detail-project-side">
      <section class="project-panel"><h2>${isClient?"Freelancer":"Client"}</h2><div class="person-row"><div class="person-avatar"><img src="${p.avatar}" alt="${isClient?p.freelancer:p.client}"></div><div><strong>${isClient?p.freelancer:p.client}</strong><span>${isClient?p.freelancerRole:"Client"}</span></div></div></section>
      <section class="project-panel"><h2>Project Information</h2><div class="project-side-stat"><span>Order ID</span><b>${p.id}</b></div><div class="project-side-stat"><span>Budget</span><b>$${p.budget.toLocaleString()}</b></div><div class="project-side-stat"><span>Deadline</span><b>${prettyDate(p.deadline)}</b></div><div class="project-side-stat"><span>Category</span><b>${p.category}</b></div><div class="project-side-stat"><span>Milestones</span><b>${completed}/${p.milestones.length}</b></div></section>
      <section class="project-panel"><h2>${isClient?"Client Controls":"Freelancer Controls"}</h2><p>${isClient?"Review milestones, approve submitted delivery, or request changes from the freelancer.":"Update milestone progress and submit your final delivery when the project is ready for review."}</p><div style="margin-top:12px"><button class="btn btn-outline btn-full" id="markNext">${isClient?"Mark Project In Review":"Complete Next Milestone"}</button></div></section>
    </aside>
  </div>`;
}

function initProjectDetail(){
  const root=$("#projectDetailRoot"); if(!root)return;
  const id=new URLSearchParams(location.search).get("id")||"PKL-1001";
  let projects=getProjects();let project=projects.find(p=>p.id===id)||projects[0];let role="client";

  function render(){
    root.innerHTML=projectDetailMarkup(project,role);
    $$("#milestoneList .milestone-check").forEach(btn=>btn.addEventListener("click",()=>{
      const item=btn.closest(".milestone");const m=project.milestones.find(x=>x.id===item.dataset.mid);m.done=!m.done;
      project.progress=Math.round(project.milestones.filter(x=>x.done).length/project.milestones.length*100);
      if(project.progress===100 && project.status==="In Progress") project.status="Submitted";
      projects=projects.map(x=>x.id===project.id?project:x);saveProjects(projects);render();
    }));
    $$(".role-switch button").forEach(btn=>btn.addEventListener("click",()=>{role=btn.dataset.role;render()}));
    const submit=$("#submitDelivery");
    if(submit)submit.addEventListener("click",()=>{
      project.delivery={status:"Submitted",note:"Final delivery submitted for client review. Awaiting approval."};project.status="Submitted";project.progress=100;
      project.activity.unshift({icon:"↑",title:"Delivery submitted",text:"Freelancer submitted the final project delivery."});saveProjects(projects);addWeek6Notification({type:"Projects",icon:"↑",title:"Delivery submitted",text:`Final delivery for ${project.title} is ready for review.`,href:`project.html?id=${encodeURIComponent(project.id)}`});render();
    });
    const approve=$("#approveDelivery");
    if(approve)approve.addEventListener("click",()=>{
      project.delivery={status:"Approved",note:"Delivery approved by the client. Project completed successfully."};project.status="Completed";project.progress=100;
      project.activity.unshift({icon:"✓",title:"Project completed",text:"Client approved the final delivery."});saveProjects(projects);addWeek6Notification({type:"Projects",icon:"★",title:"Project completed",text:`${project.title} is complete. You can now leave a review.`,href:`reviews.html?project=${encodeURIComponent(project.id)}`});render();
    });
    const changes=$("#requestChanges");
    if(changes)changes.addEventListener("click",()=>{$("#deliveryNote").textContent="Change request recorded for this demo. The freelancer can now update the milestones.";});
    const next=$("#markNext");
    if(next)next.addEventListener("click",()=>{
      if(role==="freelancer"){
        const m=project.milestones.find(x=>!x.done);if(m)m.done=true;
        project.progress=Math.round(project.milestones.filter(x=>x.done).length/project.milestones.length*100);
        if(project.progress===100)project.status="Submitted";
        project.activity.unshift({icon:"✓",title:"Milestone updated",text:"A project milestone was marked complete."});
      }else{
        project.activity.unshift({icon:"◉",title:"Project reviewed",text:"Client marked the project for review."});
      }
      saveProjects(projects);render();
    });
    const info=$("#deliveryInfo");
    if(info)info.addEventListener("click",()=>{$("#deliveryNote").textContent=`Current delivery state: ${project.delivery.status}.`;});
  }
  render();
}

document.addEventListener("DOMContentLoaded",()=>{initProjectsPage();initProjectDetail();});

/* =========================
   WEEK 6 — MESSAGING, NOTIFICATIONS, REVIEWS
   ========================= */
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const WEEK6_MESSAGES_KEY = "paklaunce_week6_messages";
const WEEK6_NOTIFICATIONS_KEY = "paklaunce_week6_notifications";
const WEEK6_REVIEWS_KEY = "paklaunce_week6_reviews";

const DEFAULT_CONVERSATIONS = [
  {id:"c1",name:"Alex Johnson",avatar:"assets/alex.svg",role:"Full Stack Developer",projectId:"PKL-1001",project:"Modern E-commerce Website",unread:2,messages:[
    {from:"them",text:"I finished the cart and checkout flow. Please review it when you have a moment.",time:"10:18 AM",date:"Today"},
    {from:"me",text:"Great. I’ll check the responsive behavior and send notes.",time:"10:26 AM",date:"Today"},
    {from:"them",text:"Perfect — I also pushed the mobile fixes from yesterday’s feedback.",time:"11:02 AM",date:"Today"}
  ]},
  {id:"c2",name:"Sophia Martinez",avatar:"assets/sophia.svg",role:"UI/UX Designer",projectId:"PKL-1002",project:"Brand Identity & Social Media Kit",unread:1,messages:[
    {from:"me",text:"The logo direction looks strong. Can you package the final social templates too?",time:"Yesterday",date:"Yesterday"},
    {from:"them",text:"Yes. The full brand package is submitted and ready for approval.",time:"Yesterday",date:"Yesterday"}
  ]},
  {id:"c3",name:"Noah Williams",avatar:"assets/noah.svg",role:"Data Analyst",projectId:"PKL-1003",project:"Analytics Dashboard & Reports",unread:0,messages:[
    {from:"them",text:"I’ve completed the data audit and mapped the KPI requirements.",time:"Sep 22",date:"Sep 22"},
    {from:"me",text:"Thanks. Please prioritize revenue trends and monthly comparisons in the prototype.",time:"Sep 22",date:"Sep 22"}
  ]},
  {id:"c4",name:"Daniel Kim",avatar:"assets/daniel.svg",role:"Mobile App Developer",projectId:"PKL-1004",project:"Flutter Fitness App",unread:0,messages:[
    {from:"me",text:"The final build is approved. Excellent work on the handoff.",time:"Aug 28",date:"Aug 28"},
    {from:"them",text:"Thank you! I’m glad the project went smoothly.",time:"Aug 28",date:"Aug 28"}
  ]}
];

const DEFAULT_NOTIFICATIONS = [
  {id:"n1",type:"Messages",icon:"✉",title:"New message from Alex Johnson",text:"Perfect — I also pushed the mobile fixes from yesterday’s feedback.",time:"2 min ago",unread:true,href:"messages.html?conversation=c1"},
  {id:"n2",type:"Projects",icon:"✓",title:"Proposal accepted",text:"Your proposal for Modern E-commerce Website was accepted and the project is now active.",time:"1 day ago",unread:true,href:"project.html?id=PKL-1001"},
  {id:"n3",type:"Projects",icon:"▶",title:"Project started",text:"Analytics Dashboard & Reports has moved into the project workspace.",time:"3 days ago",unread:false,href:"project.html?id=PKL-1003"},
  {id:"n4",type:"Projects",icon:"★",title:"Project completed",text:"Flutter Fitness App was completed successfully. You can now leave a review.",time:"Aug 28",unread:true,href:"reviews.html?project=PKL-1004"},
  {id:"n5",type:"Reviews",icon:"★",title:"New review received",text:"A 5-star review was added to your marketplace reputation.",time:"Aug 29",unread:false,href:"reviews.html"}
];

const DEFAULT_REVIEWS = [
  {id:"r1",projectId:"PKL-1004",project:"Flutter Fitness App",reviewer:"Usman Shah",avatar:"assets/profile.svg",rating:5,text:"Daniel delivered a polished Flutter app, communicated clearly throughout the project, and handled the final handoff professionally.",date:"29 Aug 2026",recipient:"Daniel Kim"},
  {id:"r2",projectId:"PKL-0908",project:"Business Landing Page",reviewer:"Mia Ahmed",avatar:"assets/mia.svg",rating:5,text:"Fast communication, clean implementation and excellent attention to responsive details. The project was delivered ahead of schedule.",date:"16 Aug 2026",recipient:"Basit Khan"},
  {id:"r3",projectId:"PKL-0871",project:"Marketing Dashboard",reviewer:"Liam Khan",avatar:"assets/liam.svg",rating:4,text:"Very good collaboration and strong final result. A few revisions were needed, but communication stayed clear and professional.",date:"02 Aug 2026",recipient:"Noah Williams"}
];

function week6Read(key, fallback){try{const data=JSON.parse(localStorage.getItem(key)||"null");return Array.isArray(data)?data:fallback.map(x=>(typeof structuredClone==="function"?structuredClone(x):JSON.parse(JSON.stringify(x))))}catch(e){return JSON.parse(JSON.stringify(fallback))}}
function week6Write(key,data){localStorage.setItem(key,JSON.stringify(data))}
function getConversations(){return week6Read(WEEK6_MESSAGES_KEY,DEFAULT_CONVERSATIONS)}
function saveConversations(data){week6Write(WEEK6_MESSAGES_KEY,data)}
function getNotifications(){return week6Read(WEEK6_NOTIFICATIONS_KEY,DEFAULT_NOTIFICATIONS)}
function saveNotifications(data){week6Write(WEEK6_NOTIFICATIONS_KEY,data)}
function getReviews(){return week6Read(WEEK6_REVIEWS_KEY,DEFAULT_REVIEWS)}
function saveReviews(data){week6Write(WEEK6_REVIEWS_KEY,data)}
function week6Toast(message){let el=$("#globalToast")||$(".toast");if(!el){el=document.createElement("div");el.className="toast";document.body.appendChild(el)}el.textContent=message;el.classList.add("show");clearTimeout(window.__w6toast);window.__w6toast=setTimeout(()=>el.classList.remove("show"),2200)}
function addWeek6Notification(notification){const list=getNotifications();list.unshift({id:"n"+Date.now(),time:"Just now",unread:true,...notification});saveNotifications(list);updateWeek6NavCounts()}
function updateWeek6NavCounts(){const unreadMessages=getConversations().reduce((n,c)=>n+(c.unread||0),0);const unreadNotifications=getNotifications().filter(n=>n.unread).length;$$('#messageNavCount').forEach(el=>{el.textContent=unreadMessages;el.dataset.zero=String(unreadMessages===0)});$$('#notificationNavCount').forEach(el=>{el.textContent=unreadNotifications;el.dataset.zero=String(unreadNotifications===0)})}

function initMessages(){
  const listEl=$("#conversationList");if(!listEl)return;
  let conversations=getConversations();let currentId=new URLSearchParams(location.search).get("conversation")||conversations[0]?.id;let query="";
  const shell=$(".messaging-shell"), active=$("#chatActive"), empty=$("#chatEmpty");
  function lastMessage(c){return c.messages[c.messages.length-1]||{text:"No messages yet",time:""}}
  function renderList(){const filtered=conversations.filter(c=>(c.name+" "+c.project+" "+lastMessage(c).text).toLowerCase().includes(query.toLowerCase()));$("#conversationSummary").textContent=`${conversations.length} conversations · ${conversations.reduce((n,c)=>n+(c.unread||0),0)} unread`;listEl.innerHTML=filtered.length?filtered.map(c=>{const last=lastMessage(c);return `<button class="conversation-item ${c.id===currentId?"active":""}" data-conversation="${c.id}"><img src="${c.avatar}" alt=""><div class="conversation-copy"><div class="conversation-name">${escapeHTML(c.name)} ${c.unread?'<span class="unread-dot"></span>':''}</div><div class="conversation-last">${escapeHTML(last.text)}</div></div><div><div class="conversation-time">${escapeHTML(last.time)}</div>${c.unread?`<span class="conversation-badge">${c.unread}</span>`:""}</div></button>`}).join(""):`<div class="notification-empty">No conversations match your search.</div>`;$$('[data-conversation]',listEl).forEach(btn=>btn.onclick=()=>openConversation(btn.dataset.conversation,true))}
  function renderChat(){const c=conversations.find(x=>x.id===currentId);if(!c){active.hidden=true;empty.hidden=false;return}empty.hidden=true;active.hidden=false;$("#chatAvatar").src=c.avatar;$("#chatName").textContent=c.name;$("#chatProject").textContent=c.project;$("#openProjectLink").href=`project.html?id=${encodeURIComponent(c.projectId)}`;let lastDate="";$("#chatMessages").innerHTML=c.messages.map(m=>{const divider=m.date!==lastDate?`<div class="day-divider">${escapeHTML(m.date||"")}</div>`:"";lastDate=m.date;return `${divider}<div class="message-row ${m.from==="me"?"me":""}"><img class="message-avatar" src="${m.from==="me"?'assets/profile.svg':c.avatar}" alt=""><div class="message-bubble">${escapeHTML(m.text)}<span class="message-meta">${escapeHTML(m.time||"")}</span></div></div>`}).join("");$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight}
  function openConversation(id,mobile){currentId=id;const c=conversations.find(x=>x.id===id);if(c)c.unread=0;saveConversations(conversations);renderList();renderChat();updateWeek6NavCounts();if(mobile)shell.classList.add("mobile-chat")}
  $("#conversationSearch").addEventListener("input",e=>{query=e.target.value;renderList()});
  $("#backConversations").onclick=()=>shell.classList.remove("mobile-chat");
  $("#newConversationBtn").onclick=()=>week6Toast("Choose a freelancer or project to start a new conversation.");
  $("#messageForm").addEventListener("submit",e=>{e.preventDefault();const input=$("#messageInput"),text=input.value.trim();if(!text){$("#messageHint").textContent="Type a message before sending.";return}const c=conversations.find(x=>x.id===currentId);if(!c)return;const now=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});c.messages.push({from:"me",text,time:now,date:"Today"});input.value="";$("#messageHint").textContent="Message sent · Press Enter to send";saveConversations(conversations);renderList();renderChat();week6Toast("Message sent")});
  $("#messageInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();$("#messageForm").requestSubmit()}});
  renderList();openConversation(currentId,false);
}

function initNotifications(){
  const listEl=$("#notificationList");if(!listEl)return;let notifications=getNotifications(),filter="All";
  function render(){let list=notifications;if(filter==="Unread")list=list.filter(n=>n.unread);else if(filter!=="All")list=list.filter(n=>n.type===filter);$("#notificationUnreadTotal").textContent=notifications.filter(n=>n.unread).length;listEl.innerHTML=list.length?list.map(n=>`<article class="notification-item ${n.unread?"unread":""}" data-notification="${n.id}"><div class="notification-icon">${n.icon}</div><div><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.text)}</p></div><span class="notification-time">${escapeHTML(n.time)}</span></article>`).join(""):`<div class="notification-empty">No notifications in this view.</div>`;$$('[data-notification]',listEl).forEach(item=>item.onclick=()=>{const n=notifications.find(x=>x.id===item.dataset.notification);n.unread=false;saveNotifications(notifications);updateWeek6NavCounts();render();setTimeout(()=>{if(n.href)location.href=n.href},120)})}
  $$(".filter-chip").forEach(btn=>btn.onclick=()=>{$$(".filter-chip").forEach(x=>x.classList.remove("active"));btn.classList.add("active");filter=btn.dataset.filter;render()});
  $("#markAllRead").onclick=()=>{notifications.forEach(n=>n.unread=false);saveNotifications(notifications);updateWeek6NavCounts();render();week6Toast("All notifications marked as read")};render();
}

function stars(rating){return "★".repeat(rating)+"☆".repeat(5-rating)}
function initReviews(){
  const listEl=$("#reviewList");if(!listEl)return;let reviews=getReviews(),rating=0;const projects=getProjects().filter(p=>p.status==="Completed");const select=$("#reviewProject");
  select.innerHTML=projects.length?projects.map(p=>`<option value="${p.id}">${escapeHTML(p.title)} · ${p.id}</option>`).join(""):`<option value="">No completed projects</option>`;const requested=new URLSearchParams(location.search).get("project");if(requested&&projects.some(p=>p.id===requested))select.value=requested;
  function selectedProject(){return projects.find(p=>p.id===select.value)}
  function alreadyReviewed(){return reviews.some(r=>r.projectId===select.value&&r.reviewer==="You")}
  function renderEligibility(){const p=selectedProject();const box=$("#reviewEligibility");if(!p){box.innerHTML='<div class="eligibility-note warn">Complete a project before leaving a review.</div>';return}box.innerHTML=alreadyReviewed()?'<div class="eligibility-note warn">You already reviewed this project. Your existing review is shown below.</div>':`<div class="eligibility-note">Reviewing ${escapeHTML(p.freelancer)} for ${escapeHTML(p.title)}.</div>`}
  function renderReviews(){const avg=reviews.length?reviews.reduce((n,r)=>n+r.rating,0)/reviews.length:0;$("#averageRating").textContent=avg.toFixed(1);$("#reviewSummaryText").textContent=`${reviews.length} review${reviews.length===1?"":"s"} · ${avg.toFixed(1)} average rating`;listEl.innerHTML=reviews.length?reviews.map(r=>`<article class="review-card"><div class="review-card-head"><div class="reviewer"><img src="${r.avatar}" alt=""><div><strong>${escapeHTML(r.reviewer)}</strong><span>${escapeHTML(r.project)}</span></div></div><div class="review-stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div></div><p>${escapeHTML(r.text)}</p><div class="review-card-foot"><span>For ${escapeHTML(r.recipient||"Freelancer")}</span><time>${escapeHTML(r.date)}</time></div></article>`).join(""):`<div class="notification-empty">No reviews yet.</div>`}
  function setRating(value){rating=value;$$('#starPicker button').forEach(b=>b.classList.toggle('active',Number(b.dataset.rating)<=rating));const labels=["","Poor","Fair","Good","Very good","Excellent"];$("#ratingLabel").textContent=rating?`${rating}/5 · ${labels[rating]}`:"Select 1–5 stars"}
  $$("#starPicker button").forEach(btn=>btn.onclick=()=>setRating(Number(btn.dataset.rating)));select.addEventListener("change",()=>{renderEligibility();$("#reviewMessage").textContent=""});$("#reviewText").addEventListener("input",e=>$("#reviewChars").textContent=`${e.target.value.length} / 600`);
  $("#reviewForm").addEventListener("submit",e=>{e.preventDefault();const msg=$("#reviewMessage"),text=$("#reviewText").value.trim(),p=selectedProject();msg.className="form-message";if(!p){msg.textContent="No completed project is available to review.";msg.classList.add("error");return}if(alreadyReviewed()){msg.textContent="You already submitted a review for this project.";msg.classList.add("error");return}if(!rating){msg.textContent="Please select a star rating.";msg.classList.add("error");return}if(text.length<15){msg.textContent="Please write at least 15 characters about your experience.";msg.classList.add("error");return}const date=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});reviews.unshift({id:"r"+Date.now(),projectId:p.id,project:p.title,reviewer:"You",avatar:"assets/profile.svg",rating,text,date,recipient:p.freelancer});saveReviews(reviews);addWeek6Notification({type:"Reviews",icon:"★",title:"Review submitted",text:`Your ${rating}-star review for ${p.title} was published.`,href:"reviews.html"});$("#reviewText").value="";$("#reviewChars").textContent="0 / 600";setRating(0);msg.textContent="Review submitted successfully.";msg.classList.add("success");renderEligibility();renderReviews();week6Toast("Review published")});
  renderEligibility();renderReviews();
}

function injectWeek6ProjectActions(){
  const root=$("#projectDetailRoot");if(!root)return;const id=new URLSearchParams(location.search).get("id")||"PKL-1001";const project=getProjects().find(p=>p.id===id);if(!project)return;
  const side=$(".detail-project-side",root);if(!side||$(".week6-actions",side))return;const panel=document.createElement("section");panel.className="project-panel week6-actions";panel.innerHTML=`<h2>Communication & Feedback</h2><p>Keep project conversations and reputation connected to this contract.</p><div class="project-communication-actions"><a class="btn btn-outline" href="messages.html?conversation=${project.id==='PKL-1001'?'c1':project.id==='PKL-1002'?'c2':project.id==='PKL-1003'?'c3':'c4'}">Open Messages</a>${project.status==='Completed'?`<a class="btn btn-primary" href="reviews.html?project=${encodeURIComponent(project.id)}">Leave a Review</a>`:`<a class="btn btn-outline" href="notifications.html">Notifications</a>`}</div><div class="week6-project-note">Week 6 workflow: Message → Notification → Completion → Review.</div>`;side.appendChild(panel)
}

function initWeek6ProjectObserver(){const root=$("#projectDetailRoot");if(!root)return;injectWeek6ProjectActions();new MutationObserver(()=>injectWeek6ProjectActions()).observe(root,{childList:true,subtree:true})}

document.addEventListener("DOMContentLoaded",()=>{updateWeek6NavCounts();initMessages();initNotifications();initReviews();initWeek6ProjectObserver();$$(`.menu-toggle`).forEach(btn=>btn.addEventListener(`click`,()=>{const nav=btn.parentElement.querySelector(`.nav-links`);if(!nav)return;const open=nav.classList.toggle(`mobile-open`);btn.setAttribute(`aria-expanded`,String(open))}))});
