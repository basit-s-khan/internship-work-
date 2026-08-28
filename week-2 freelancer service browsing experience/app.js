const SERVICES = [
  {id:"web-1",name:"Alex Johnson",role:"Full Stack Developer",avatar:"assets/alex.svg",title:"I will build a modern, scalable web application",category:"Web Development",price:35,rating:4.9,reviews:128,desc:"Production-ready websites and web apps built with clean architecture, responsive UI, and modern JavaScript.",tags:["React","Node.js","MongoDB"],delivery:"5–7 days",jobs:86},
  {id:"design-1",name:"Sophia Martinez",role:"UI/UX Designer",avatar:"assets/sophia.svg",title:"I will design a premium UI/UX for your digital product",category:"Graphic Design",price:30,rating:4.8,reviews:96,desc:"Polished interfaces, design systems, prototypes, and user flows that make your product easier to use.",tags:["Figma","Adobe XD","UI/UX"],delivery:"3–5 days",jobs:74},
  {id:"mobile-1",name:"Daniel Kim",role:"Mobile App Developer",avatar:"assets/daniel.svg",title:"I will build a high-quality Flutter mobile application",category:"Mobile App Development",price:40,rating:4.9,reviews:87,desc:"Cross-platform mobile apps with smooth performance, scalable architecture, and Firebase integration.",tags:["Flutter","Dart","Firebase"],delivery:"7–10 days",jobs:61},
  {id:"marketing-1",name:"Emily Turner",role:"Digital Marketing Expert",avatar:"assets/emily.svg",title:"I will grow your brand with a complete digital strategy",category:"Digital Marketing",price:25,rating:4.8,reviews:112,desc:"Data-driven campaigns covering SEO, paid advertising, social media, and conversion optimization.",tags:["SEO","Google Ads","SMM"],delivery:"3–7 days",jobs:119},
  {id:"data-1",name:"Noah Williams",role:"Data Analyst",avatar:"assets/noah.svg",title:"I will turn your raw data into actionable insights",category:"Data Analysis",price:28,rating:4.7,reviews:63,desc:"Clean dashboards, exploratory analysis, reports, and business insights from messy datasets.",tags:["Python","SQL","Power BI"],delivery:"3–5 days",jobs:52},
  {id:"web-2",name:"Olivia Brown",role:"Frontend Engineer",avatar:"assets/olivia.svg",title:"I will create a fast responsive React frontend",category:"Web Development",price:32,rating:4.9,reviews:74,desc:"Pixel-accurate responsive frontend development with reusable components and accessibility in mind.",tags:["React","TypeScript","CSS"],delivery:"4–6 days",jobs:68},
  {id:"mobile-2",name:"Liam Davis",role:"iOS Developer",avatar:"assets/liam.svg",title:"I will develop your iOS app from idea to App Store",category:"Mobile App Development",price:45,rating:4.8,reviews:41,desc:"Native iOS experiences with clean Swift code, polished interactions, and App Store readiness.",tags:["Swift","iOS","API"],delivery:"7–12 days",jobs:39},
  {id:"design-2",name:"Mia Wilson",role:"Brand Designer",avatar:"assets/mia.svg",title:"I will create a complete visual identity for your brand",category:"Graphic Design",price:38,rating:5.0,reviews:54,desc:"A cohesive brand identity including logo direction, typography, color systems, and social assets.",tags:["Branding","Illustrator","Logo"],delivery:"5–8 days",jobs:47}
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function serviceCard(s){
  return `<article class="service-card">
    <div class="service-cover">
      <div class="cover-icon">${s.category==="Web Development"?"&lt;/&gt;":s.category==="Graphic Design"?"✦":s.category==="Mobile App Development"?"▯":s.category==="Data Analysis"?"▥":"⌁"}</div>
      <span class="category-pill">${s.category}</span>
    </div>
    <div class="service-body">
      <div class="seller"><img src="${s.avatar}" alt="${s.name} profile image"><div><strong>${s.name}</strong><span>${s.role}</span></div></div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.desc}</p>
      <div class="service-meta"><span class="rating">★ ${s.rating}</span><span>${s.reviews} reviews</span></div>
      <div class="tags">${s.tags.map(t=>`<span>${t}</span>`).join("")}</div>
      <div class="service-bottom"><span class="price">From $${s.price}/hr</span><a class="view-btn" href="service.html?id=${encodeURIComponent(s.id)}">View Service →</a></div>
    </div>
  </article>`;
}

function initMobileNav(){
  const toggle = $(".menu-toggle"), nav = $(".nav-links");
  if(!toggle) return;
  toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",open)});
  $$(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
}

function initSearch(){
  const form=$("#homeSearchForm");
  if(!form) return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const q=$("#homeSearch").value.trim();
    const c=$("#homeCategory").value;
    const params=new URLSearchParams();
    if(q) params.set("q",q); if(c) params.set("category",c);
    location.href=`services.html?${params}`;
  });
}

function initBrowse(){
  const grid=$("#serviceGrid");
  if(!grid) return;

  const params=new URLSearchParams(location.search);
  const state={q:params.get("q")||"",category:params.get("category")||"All Categories",sort:"relevance"};

  const input=$("#browseSearch"), category=$("#categoryFilter"), sort=$("#sortFilter"), count=$("#resultCount");

  input.value=state.q; category.value=state.category;

  function render(){
    let list=SERVICES.filter(s=>{
      const text=`${s.name} ${s.title} ${s.role} ${s.category} ${s.tags.join(" ")}`.toLowerCase();
      return (!state.q||text.includes(state.q.toLowerCase())) && (state.category==="All Categories"||s.category===state.category);
    });
    if(state.sort==="low") list.sort((a,b)=>a.price-b.price);
    if(state.sort==="high") list.sort((a,b)=>b.price-a.price);
    if(state.sort==="rating") list.sort((a,b)=>b.rating-a.rating||b.reviews-a.reviews);
    count.textContent=`${list.length} service${list.length===1?"":"s"} found`;
    grid.innerHTML=list.length?list.map(serviceCard).join(""):`<div class="empty"><h3>No services found</h3><p>Try a different search term or category.</p></div>`;
  }

  input.addEventListener("input",()=>{state.q=input.value;render()});
  category.addEventListener("change",()=>{state.category=category.value;render()});
  sort.addEventListener("change",()=>{state.sort=sort.value;render()});
  $$(".chip").forEach(chip=>chip.addEventListener("click",()=>{state.category=chip.dataset.category;category.value=state.category;$$(".chip").forEach(c=>c.classList.remove("active"));chip.classList.add("active");render()}));
  render();
}

function initDetails(){
  const target=$("#detailRoot");
  if(!target) return;
  const id=new URLSearchParams(location.search).get("id");
  const service=SERVICES.find(s=>s.id===id);
  if(!service){
    target.innerHTML=`<div class="empty"><h3>Service not found</h3><p>The service may have been removed or the link is invalid.</p><a class="btn btn-primary" href="services.html" style="margin-top:15px">Back to Services</a></div>`;
    return;
  }

  target.innerHTML=`<div class="detail-grid">
    <article class="detail-main">
      <div class="detail-cover"><div class="cover-big">${service.category==="Web Development"?"&lt;/&gt;":service.category==="Graphic Design"?"✦":service.category==="Mobile App Development"?"▯":service.category==="Data Analysis"?"▥":"⌁"}</div></div>
      <div class="detail-content">
        <div class="detail-seller"><img src="${service.avatar}" alt="${service.name} profile image"><div><h1>${service.title}</h1><p>${service.name} · ${service.role}</p></div></div>
        <div class="detail-rating">★ ${service.rating} <span style="color:#94A3B8">(${service.reviews} reviews)</span></div>
        <h2>About this service</h2><p>${service.desc} I focus on maintainable implementation, clear communication, and a polished final experience.</p>
        <h2>What's included</h2>
        <div class="feature-list">${service.tags.map(t=>`<div><b>✓</b>${t} included</div>`).join("")}<div><b>✓</b>Responsive delivery</div><div><b>✓</b>Source files</div></div>
      </div>
    </article>
    <aside class="detail-side">
      <div class="price-box"><small>Starting price</small><strong>$${service.price}<small>/hr</small></strong></div>
      <div class="side-actions">
        <button class="btn btn-primary btn-full" id="contactSeller">Contact Freelancer</button>
        <button class="btn btn-outline btn-full save-button" id="saveService">♡ Save Service</button>
      </div>
      <div class="side-info"><div><span>Category</span><b>${service.category}</b></div><div><span>Delivery</span><b>${service.delivery}</b></div><div><span>Completed jobs</span><b>${service.jobs}+</b></div><div><span>Reviews</span><b>${service.reviews}</b></div></div>
    </aside>
  </div>`;

  $("#saveService").addEventListener("click",e=>{e.currentTarget.classList.toggle("saved");e.currentTarget.textContent=e.currentTarget.classList.contains("saved")?"✓ Saved":"♡ Save Service"});
  $("#contactSeller").addEventListener("click",()=>openContact(service));
}

function openContact(service){
  const modal=$("#contactModal");
  if(!modal)return;
  $("#contactTitle").textContent=`Message ${service.name}`;
  $("#contactMessage").value=`Hi ${service.name}, I'm interested in your "${service.title}" service.`;
  modal.classList.add("open");document.body.classList.add("modal-open");
}
function closeModals(){
  $$(".modal").forEach(m=>m.classList.remove("open"));document.body.classList.remove("modal-open");
}

function initModals(){
  $$(".modal .modal-bg,.modal .close").forEach(x=>x.addEventListener("click",closeModals));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModals()});
  const form=$("#contactForm");
  if(form) form.addEventListener("submit",e=>{e.preventDefault();$("#contactFeedback").textContent="Message saved as a demo. Connect this form to your backend or messaging API.";});
}

function initNewsletter(){
  const form=$("#newsletterForm");
  if(form) form.addEventListener("submit",e=>{e.preventDefault();$("#newsletterMessage").textContent="Thanks — you're on the list!";form.reset()});
}

document.addEventListener("DOMContentLoaded",()=>{
  initMobileNav();initSearch();initBrowse();initDetails();initModals();initNewsletter();
});
