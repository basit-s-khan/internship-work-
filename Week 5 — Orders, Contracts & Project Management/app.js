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
function serviceCard(s){return `<article class="card service-card"><div class="service-thumb">✦</div><div class="top"><img class="avatar" src="assets/profile.svg" alt="Profile"><div><strong>${escapeHTML(profile().name)}</strong><div class="muted" style="font-size:12px">${escapeHTML(profile().title)}</div></div></div><h3 style="margin:0">${escapeHTML(s.title)}</h3><span class="tag">${escapeHTML(s.category)}</span><div class="pill-row">${s.skills.map(x=>`<span class="tag">${escapeHTML(x)}</span>`).join('')}</div><div><span class="rating">★ ${s.rating}</span> <span class="muted">(${s.reviews} reviews)</span></div><div style="display:flex;justify-content:space-between;align-items:center"><div><span class="muted">Starting at</span><div class="price">$${s.price}</div></div><span class="muted">${escapeHTML(s.delivery)}</span></div><div class="card-actions"><a class="btn primary" href="service.html?id=${s.id}">View Service</a><a class="btn" href="freelancer.html">Profile</a></div></article>`}
function renderServices(){const box=document.querySelector('#serviceGrid');if(!box)return;let list=services();const q=(document.querySelector('#search')?.value||'').toLowerCase();const cat=document.querySelector('#category')?.value||'All';const sort=document.querySelector('#sort')?.value||'default';if(q)list=list.filter(s=>(s.title+' '+s.category+' '+s.skills.join(' ')).toLowerCase().includes(q));if(cat!=='All')list=list.filter(s=>s.category===cat);if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='rating')list.sort((a,b)=>b.rating-a.rating);box.innerHTML=list.length?list.map(serviceCard).join(''):`<div class="card empty" style="grid-column:1/-1">No services match your search.</div>`}
function initMarketplace(){nav('services');['search','category','sort'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderServices));renderServices()}
function fillProfile(){const p=profile();document.querySelectorAll('[data-profile-name]').forEach(e=>e.textContent=p.name);document.querySelectorAll('[data-profile-title]').forEach(e=>e.textContent=p.title);document.querySelectorAll('[data-profile-bio]').forEach(e=>e.textContent=p.bio);document.querySelectorAll('[data-profile-rating]').forEach(e=>e.textContent=p.rating);document.querySelectorAll('[data-profile-reviews]').forEach(e=>e.textContent=p.reviews);const skills=document.querySelector('#profileSkills');if(skills)skills.innerHTML=p.skills.map(s=>`<span class="tag">${escapeHTML(s)}</span>`).join('')}
function initProfile(){nav('profile');fillProfile();const p=profile();const s=services();const grid=document.querySelector('#profileServices');if(grid)grid.innerHTML=s.map(serviceCard).join('')}
function initEdit(){nav('profile');const p=profile();['name','title','bio','experience','location'].forEach(k=>{const e=document.getElementById(k);if(e)e.value=p[k]||''});document.getElementById('skills').value=p.skills.join(', ');document.getElementById('profileForm').addEventListener('submit',e=>{e.preventDefault();const p={...profile(),name:name.value.trim(),title:title.value.trim(),bio:bio.value.trim(),experience:experience.value.trim(),location:location.value.trim(),skills:skills.value.split(',').map(x=>x.trim()).filter(Boolean)};if(!p.name||!p.title||!p.bio){document.getElementById('formError').style.display='block';return}document.getElementById('formError').style.display='none';const d=load();d.profile=p;save(d);toast('Profile updated successfully');setTimeout(()=>location.href='profile.html',500)})}
function initCreate(){nav('create');document.getElementById('serviceForm').addEventListener('submit',e=>{e.preventDefault();let valid=true;document.querySelectorAll('[required]').forEach(x=>{if(!x.value.trim()){valid=false}});if(!valid){document.getElementById('formError').style.display='block';return}document.getElementById('formError').style.display='none';const s={id:Date.now(),title:serviceTitle.value.trim(),category:serviceCategory.value,description:serviceDescription.value.trim(),price:Number(servicePrice.value),delivery:delivery.value,skills:serviceSkills.value.split(',').map(x=>x.trim()).filter(Boolean),rating:5,reviews:0};const list=services();list.unshift(s);setServices(list);toast('Service published successfully');setTimeout(()=>location.href='my-services.html',500)})}
function initMyServices(){nav('myservices');const box=document.querySelector('#myServices');function render(){const list=services();box.innerHTML=list.map(s=>`<article class="card" style="display:grid;grid-template-columns:150px 1fr auto;gap:18px;align-items:center"><div class="service-thumb">✦</div><div><span class="tag">${escapeHTML(s.category)}</span><h3>${escapeHTML(s.title)}</h3><div class="muted">$${s.price} · ${s.delivery} · ★ ${s.rating}</div></div><div class="card-actions"><a class="btn" href="service.html?id=${s.id}">View</a><button class="btn danger" data-delete="${s.id}">Delete</button></div></article>`).join('');box.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this service?')){setServices(services().filter(s=>s.id!=b.dataset.delete));render();toast('Service deleted')}})}render()}
function initDetail(){const id=Number(new URLSearchParams(location.search).get('id'));const s=services().find(x=>x.id===id)||services()[0];if(!s)return;document.querySelector('#detailTitle').textContent=s.title;document.querySelector('#detailDescription').textContent=s.description;document.querySelector('#detailCategory').textContent=s.category;document.querySelector('#detailPrice').textContent='$'+s.price;document.querySelector('#detailDelivery').textContent=s.delivery;document.querySelector('#detailRating').textContent='★ '+s.rating+' ('+s.reviews+' reviews)';document.querySelector('#detailSkills').innerHTML=s.skills.map(x=>`<span class="tag">${escapeHTML(x)}</span>`).join('');document.querySelector('#contactBtn').onclick=()=>document.querySelector('#contactModal').classList.add('show');document.querySelector('#closeModal').onclick=()=>document.querySelector('#contactModal').classList.remove('show')}
function initHome(){nav('home');document.querySelector('#homeServices')?.replaceChildren(...services().slice(0,3).map(s=>{const d=document.createElement('div');d.innerHTML=serviceCard(s);return d.firstElementChild}));document.querySelector('#homeSearch')?.addEventListener('submit',e=>{e.preventDefault();location.href='services.html?q='+encodeURIComponent(homeQuery.value)});if(window.jobsLoad&&document.querySelector('#homeJobs'))document.querySelector('#homeJobs').innerHTML=jobsLoad().slice(0,2).map(jobCard).join('')}
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
      project.activity.unshift({icon:"↑",title:"Delivery submitted",text:"Freelancer submitted the final project delivery."});saveProjects(projects);render();
    });
    const approve=$("#approveDelivery");
    if(approve)approve.addEventListener("click",()=>{
      project.delivery={status:"Approved",note:"Delivery approved by the client. Project completed successfully."};project.status="Completed";project.progress=100;
      project.activity.unshift({icon:"✓",title:"Project completed",text:"Client approved the final delivery."});saveProjects(projects);render();
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
