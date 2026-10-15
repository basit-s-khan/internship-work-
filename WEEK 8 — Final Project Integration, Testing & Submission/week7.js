const W7_FAVORITES_KEY = "paklaunce_week7_favorites";
const W7_ROLE_KEY = "paklaunce_week7_dashboard_role";
const W7_FREELANCER_ID = "current-profile";

function w7Escape(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[character]);
}

function w7Toast(message) {
  const element = document.querySelector("#w7Toast") || document.querySelector(".toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(window.__w7Toast);
  window.__w7Toast = setTimeout(() => element.classList.remove("show"), 2400);
}

function w7ReadFavorites() {
  const saved = localStorage.getItem(W7_FAVORITES_KEY);
  if (saved === null) return [];
  const favorites = JSON.parse(saved);
  if (!Array.isArray(favorites) || favorites.some(item =>
    !item || !["service", "freelancer"].includes(item.kind) || typeof item.id !== "string"
  )) {
    throw new Error("Saved favorites data is invalid.");
  }
  return favorites;
}

function w7WriteFavorites(favorites) {
  localStorage.setItem(W7_FAVORITES_KEY, JSON.stringify(favorites));
}

function w7FavoriteId(kind, id) {
  return `${kind}:${id}`;
}

function w7IsFavorite(kind, id, favorites = w7ReadFavorites()) {
  const target = w7FavoriteId(kind, String(id));
  return favorites.some(item => w7FavoriteId(item.kind, item.id) === target);
}

function w7ToggleFavorite(kind, id) {
  const key = String(id);
  const favorites = w7ReadFavorites();
  const exists = w7IsFavorite(kind, key, favorites);
  const updated = exists
    ? favorites.filter(item => !(item.kind === kind && item.id === key))
    : [...favorites, { kind, id: key }];
  w7WriteFavorites(updated);
  w7Toast(exists ? "Removed from favorites" : "Added to favorites");
  w7RenderFavorites();
  w7UpdateFavoriteButtons();
}

function w7ServiceData() {
  return services().map(service => ({ ...service, id: String(service.id) }));
}

function w7JobData() {
  return jobsLoad();
}

function w7Projects() {
  return getProjects();
}

function w7Reviews() {
  return getReviews();
}

function w7Conversations() {
  return getConversations();
}

function w7DeliveryDays(service) {
  const days = Number.parseInt(String(service.delivery || ""), 10);
  return Number.isFinite(days) ? days : Number.POSITIVE_INFINITY;
}

function w7ExperienceYears(person) {
  const years = Number.parseFloat(String(person.experience || "").match(/\d+(?:\.\d+)?/)?.[0] || "0");
  return Number.isFinite(years) ? years : 0;
}

function w7ReadSearchFilters() {
  return {
    term: (document.querySelector("#w7Query")?.value || "").trim().toLowerCase(),
    type: document.querySelector("#w7Type")?.value || "All",
    category: document.querySelector("#w7Category")?.value || "All",
    minimum: Number(document.querySelector("#w7MinPrice")?.value || 0),
    maximum: Number(document.querySelector("#w7MaxPrice")?.value || 0),
    rating: Number(document.querySelector("#w7Rating")?.value || 0),
    delivery: Number(document.querySelector("#w7Delivery")?.value || 0),
    experience: Number(document.querySelector("#w7Experience")?.value || 0),
    sort: document.querySelector("#w7Sort")?.value || "newest"
  };
}

function w7TextMatches(text, term) {
  return !term || String(text || "").toLowerCase().includes(term);
}

function w7PriceMatches(price, filters) {
  return (!filters.minimum || price >= filters.minimum) &&
    (!filters.maximum || price <= filters.maximum);
}

function w7ServiceMatches(service, filters, person) {
  const text = [service.title, service.category, service.description, ...(service.skills || []),
    person.name, person.title, person.bio, ...(person.skills || [])].join(" ");
  return w7TextMatches(text, filters.term) &&
    (filters.category === "All" || service.category === filters.category) &&
    w7PriceMatches(Number(service.price) || 0, filters) &&
    (Number(service.rating) || 0) >= filters.rating &&
    (!filters.delivery || w7DeliveryDays(service) <= filters.delivery) &&
    w7ExperienceYears(person) >= filters.experience;
}

function w7JobMatches(job, filters) {
  const text = [job.title, job.category, job.description, job.client, job.location, ...(job.skills || [])].join(" ");
  const minimum = Number(job.budgetMin) || 0;
  const maximum = Number(job.budgetMax) || minimum;
  const budgetMatches = (!filters.minimum || maximum >= filters.minimum) &&
    (!filters.maximum || minimum <= filters.maximum);
  return w7TextMatches(text, filters.term) &&
    (filters.category === "All" || job.category === filters.category) &&
    budgetMatches && filters.rating === 0 && filters.delivery === 0 && filters.experience === 0;
}

function w7SortServices(list, sort) {
  const sorted = [...list];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  else if (sort === "popular") sorted.sort((a, b) => b.reviews - a.reviews);
  else sorted.sort((a, b) => Number(b.id) - Number(a.id));
  return sorted;
}

function w7SortJobs(list, sort) {
  const sorted = [...list];
  if (sort === "price-asc") sorted.sort((a, b) => a.budgetMin - b.budgetMin);
  else if (sort === "price-desc") sorted.sort((a, b) => b.budgetMax - a.budgetMax);
  else if (sort === "popular") sorted.sort((a, b) => b.proposals - a.proposals);
  else if (sort === "rating") sorted.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  else sorted.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  return sorted;
}

function w7FavoriteButton(kind, id) {
  let saved = false;
  try {
    saved = w7IsFavorite(kind, String(id));
  } catch (error) {
    console.error("Unable to read saved favorites.", error);
    return `<button class="btn w7-favorite" type="button" disabled>Favorites unavailable</button>`;
  }
  return `<button class="btn w7-favorite" type="button" data-favorite-kind="${kind}" data-favorite-id="${w7Escape(id)}" aria-pressed="${saved}">${saved ? "♥ Saved" : "♡ Save"}</button>`;
}

function w7BrowseServiceCard(service, person) {
  return `<article class="card service-card">
    <div class="service-thumb">✦</div>
    <div class="top"><img class="avatar" src="assets/profile.svg" alt=""><div><strong>${w7Escape(person.name)}</strong><div class="muted">${w7Escape(person.title)}</div></div></div>
    <h3>${w7Escape(service.title)}</h3><span class="tag">${w7Escape(service.category)}</span>
    <div class="pill-row">${(service.skills || []).map(skill => `<span class="tag">${w7Escape(skill)}</span>`).join("")}</div>
    <div><span class="rating">★ ${Number(service.rating).toFixed(1)}</span> <span class="muted">(${service.reviews} reviews)</span></div>
    <div class="w7-card-meta"><strong>$${Number(service.price).toLocaleString()}</strong><span>${w7Escape(service.delivery || "Delivery not set")}</span></div>
    <div class="card-actions"><a class="btn primary" href="service.html?id=${encodeURIComponent(service.id)}">View service</a>${w7FavoriteButton("service", service.id)}</div>
  </article>`;
}

function w7FreelancerCard(person, servicesForPerson) {
  const skills = [...new Set(servicesForPerson.flatMap(service => service.skills || []))];
  const categories = [...new Set(servicesForPerson.map(service => service.category))];
  const startingAt = Math.min(...servicesForPerson.map(service => Number(service.price) || 0));
  return `<article class="card w7-person-card">
    <div class="top"><img class="avatar lg" src="assets/profile.svg" alt=""><div><h3>${w7Escape(person.name)}</h3><p class="muted">${w7Escape(person.title)}</p></div></div>
    <p class="muted">${w7Escape(person.bio)}</p>
    <div class="pill-row">${categories.map(category => `<span class="tag">${w7Escape(category)}</span>`).join("")}</div>
    <div class="pill-row">${skills.map(skill => `<span class="tag">${w7Escape(skill)}</span>`).join("")}</div>
    <div class="w7-card-meta"><span class="rating">★ ${Number(person.rating).toFixed(1)} (${person.reviews} reviews)</span><span>${w7ExperienceYears(person)}+ years</span><strong>From $${startingAt}</strong></div>
    <div class="card-actions"><a class="btn" href="profile.html">View profile</a>${w7FavoriteButton("freelancer", W7_FREELANCER_ID)}</div>
  </article>`;
}

function w7BrowseJobCard(job) {
  return `<article class="card job-card">
    <div class="job-top"><span class="tag">${w7Escape(job.category)}</span><span class="muted">${w7Escape(job.posted || "Recently posted")}</span></div>
    <h3>${w7Escape(job.title)}</h3><p class="muted job-description">${w7Escape(job.description)}</p>
    <div class="pill-row">${(job.skills || []).map(skill => `<span class="tag">${w7Escape(skill)}</span>`).join("")}</div>
    <div class="job-meta"><div><span class="muted">Budget</span><strong>$${Number(job.budgetMin).toLocaleString()}–$${Number(job.budgetMax).toLocaleString()}</strong></div><div><span class="muted">Proposals</span><strong>${Number(job.proposals) || 0}</strong></div><div><span class="muted">Location</span><strong>${w7Escape(job.location)}</strong></div></div>
    <div class="card-actions"><a class="btn primary" href="job.html?id=${encodeURIComponent(job.id)}">View job</a><a class="btn" href="submit-proposal.html?job=${encodeURIComponent(job.id)}">Apply</a></div>
  </article>`;
}

function w7SetEmpty(container, message) {
  container.innerHTML = `<div class="card empty w7-empty">${w7Escape(message)}</div>`;
}

function w7RenderBrowse() {
  const serviceBox = document.querySelector("#w7Services");
  if (!serviceBox) return;
  const person = profile();
  const filters = w7ReadSearchFilters();
  if (filters.minimum && filters.maximum && filters.minimum > filters.maximum) {
    document.querySelector("#w7ResultSummary").textContent = "Minimum price cannot be higher than maximum price.";
    [serviceBox, document.querySelector("#w7Freelancers"), document.querySelector("#w7Jobs")]
      .forEach(box => w7SetEmpty(box, "Correct the price range to see results."));
    return;
  }
  const serviceData = w7ServiceData();
  const matchingServices = w7SortServices(
    serviceData.filter(service => w7ServiceMatches(service, filters, person)), filters.sort
  );
  const profileMatches = w7TextMatches(
    [person.name, person.title, person.bio, ...(person.skills || []),
      ...serviceData.flatMap(service => [service.title, service.category, ...(service.skills || [])])].join(" "), filters.term
  );
  const matchingFreelancerServices = serviceData.filter(service =>
    profileMatches && w7ServiceMatches(service, { ...filters, term: "" }, person)
  );
  const matchingJobs = w7SortJobs(w7JobData().filter(job => w7JobMatches(job, filters)), filters.sort);
  const showServices = filters.type === "All" || filters.type === "Services";
  const showFreelancers = filters.type === "All" || filters.type === "Freelancers";
  const showJobs = filters.type === "All" || filters.type === "Jobs";
  const servicesGroup = document.querySelector("#w7ServiceGroup");
  const freelancersGroup = document.querySelector("#w7FreelancerGroup");
  const jobsGroup = document.querySelector("#w7JobGroup");
  servicesGroup.hidden = !showServices;
  freelancersGroup.hidden = !showFreelancers;
  jobsGroup.hidden = !showJobs;
  if (showServices) {
    if (matchingServices.length) serviceBox.innerHTML = matchingServices.map(service => w7BrowseServiceCard(service, person)).join("");
    else w7SetEmpty(serviceBox, "No services match these filters. Try broadening your search.");
  }
  const freelancersBox = document.querySelector("#w7Freelancers");
  if (showFreelancers) {
    if (matchingFreelancerServices.length) freelancersBox.innerHTML = w7FreelancerCard(person, matchingFreelancerServices);
    else w7SetEmpty(freelancersBox, "No freelancers match these filters. Try broadening your search.");
  }
  const jobsBox = document.querySelector("#w7Jobs");
  if (showJobs) {
    if (matchingJobs.length) jobsBox.innerHTML = matchingJobs.map(w7BrowseJobCard).join("");
    else {
      const message = filters.rating || filters.delivery || filters.experience
        ? "Job listings do not include rating, delivery-time or experience data. Clear those filters to include jobs."
        : "No jobs match these filters. Try broadening your search.";
      w7SetEmpty(jobsBox, message);
    }
  }
  const count = (showServices ? matchingServices.length : 0) +
    (showFreelancers && matchingFreelancerServices.length ? 1 : 0) +
    (showJobs ? matchingJobs.length : 0);
  document.querySelector("#w7ResultSummary").textContent = `${count} result${count === 1 ? "" : "s"} found`;
  w7UpdateFavoriteButtons();
}

function w7PopulateCategories() {
  const select = document.querySelector("#w7Category");
  if (!select) return;
  const previous = new URLSearchParams(location.search).get("category");
  const categories = [...new Set([...w7ServiceData(), ...w7JobData()].map(item => item.category).filter(Boolean))].sort();
  select.innerHTML = `<option value="All">All categories</option>${categories.map(category =>
    `<option value="${w7Escape(category)}">${w7Escape(category)}</option>`
  ).join("")}`;
  if (categories.includes(previous)) select.value = previous;
}

function w7InitBrowse() {
  const form = document.querySelector("#marketplaceSearch");
  if (!form) return;
  w7PopulateCategories();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || params.get("search");
  if (query) document.querySelector("#w7Query").value = query;
  ["#w7Query", "#w7Type", "#w7Category", "#w7MinPrice", "#w7MaxPrice", "#w7Rating", "#w7Delivery", "#w7Experience", "#w7Sort"]
    .forEach(selector => document.querySelector(selector)?.addEventListener("input", w7RenderBrowse));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const filters = w7ReadSearchFilters();
    if (filters.minimum && filters.maximum && filters.minimum > filters.maximum) {
      document.querySelector("#w7ResultSummary").textContent = "Minimum price cannot be higher than maximum price.";
      document.querySelector("#w7MinPrice").focus();
      return;
    }
    w7RenderBrowse();
  });
  form.addEventListener("reset", () => setTimeout(w7RenderBrowse));
  w7RenderBrowse();
}

function w7UpdateFavoriteButtons() {
  let favorites;
  try {
    favorites = w7ReadFavorites();
  } catch (error) {
    console.error(error);
    const summary = document.querySelector("#w7ResultSummary");
    if (summary) summary.textContent = "Favorite storage could not be read. Check browser storage settings.";
    return;
  }
  document.querySelectorAll(".w7-favorite[data-favorite-kind][data-favorite-id]").forEach(button => {
    const isSaved = w7IsFavorite(button.dataset.favoriteKind, button.dataset.favoriteId, favorites);
    button.setAttribute("aria-pressed", String(isSaved));
    button.textContent = isSaved ? "♥ Saved" : "♡ Save";
  });
}

function w7FavoriteServiceCard(service) {
  const person = profile();
  return `<article class="card service-card"><div class="service-thumb">✦</div>
    <div class="top"><img class="avatar" src="assets/profile.svg" alt=""><div><strong>${w7Escape(person.name)}</strong><div class="muted">${w7Escape(person.title)}</div></div></div>
    <h3>${w7Escape(service.title)}</h3><span class="tag">${w7Escape(service.category)}</span>
    <div><span class="rating">★ ${Number(service.rating).toFixed(1)}</span> <span class="muted">(${service.reviews} reviews)</span></div>
    <div class="w7-card-meta"><strong>$${Number(service.price).toLocaleString()}</strong><span>${w7Escape(service.delivery)}</span></div>
    <div class="card-actions"><a class="btn primary" href="service.html?id=${encodeURIComponent(service.id)}">View service</a>${w7FavoriteButton("service", service.id)}</div>
  </article>`;
}

function w7FavoriteFreelancerCard() {
  const person = profile();
  return `<article class="card w7-person-card"><div class="top"><img class="avatar lg" src="assets/profile.svg" alt=""><div><h3>${w7Escape(person.name)}</h3><p class="muted">${w7Escape(person.title)}</p></div></div>
    <p class="muted">${w7Escape(person.bio)}</p><div class="pill-row">${person.skills.map(skill => `<span class="tag">${w7Escape(skill)}</span>`).join("")}</div>
    <div class="w7-card-meta"><span class="rating">★ ${Number(person.rating).toFixed(1)} (${person.reviews} reviews)</span><span>${w7ExperienceYears(person)}+ years</span></div>
    <div class="card-actions"><a class="btn" href="profile.html">View profile</a>${w7FavoriteButton("freelancer", W7_FREELANCER_ID)}</div>
  </article>`;
}

function w7RenderFavorites() {
  const serviceBox = document.querySelector("#w7FavoriteServices");
  const freelancerBox = document.querySelector("#w7FavoriteFreelancers");
  if (!serviceBox || !freelancerBox) return;
  try {
    const favorites = w7ReadFavorites();
    const serviceData = w7ServiceData();
    const savedServices = favorites.filter(item => item.kind === "service")
      .map(item => serviceData.find(service => service.id === item.id)).filter(Boolean);
    const savedFreelancers = favorites.some(item => item.kind === "freelancer" && item.id === W7_FREELANCER_ID);
    if (savedServices.length) serviceBox.innerHTML = savedServices.map(w7FavoriteServiceCard).join("");
    else w7SetEmpty(serviceBox, "No saved services yet. Browse the marketplace and save a service to keep it here.");
    if (savedFreelancers) freelancerBox.innerHTML = w7FavoriteFreelancerCard();
    else w7SetEmpty(freelancerBox, "No saved freelancers yet. Save a freelancer from Advanced Search.");
  } catch (error) {
    console.error("Unable to load saved favorites.", error);
    w7SetEmpty(serviceBox, "Favorites could not be loaded. Your browser storage may be unavailable or invalid.");
    w7SetEmpty(freelancerBox, "Favorites could not be loaded. Your browser storage may be unavailable or invalid.");
  }
  w7UpdateFavoriteButtons();
}

function w7MarketplaceStats() {
  const servicesList = w7ServiceData();
  const jobsList = w7JobData();
  const projects = w7Projects();
  const reviews = w7Reviews();
  const profileIds = new Set([profile().name]);
  const ratingCount = reviews.length || servicesList.length;
  const ratingTotal = reviews.length
    ? reviews.reduce((total, review) => total + (Number(review.rating) || 0), 0)
    : servicesList.reduce((total, service) => total + (Number(service.rating) || 0), 0);
  const projectValue = projects.reduce((total, project) => total + (Number(project.budget) || 0), 0);
  return [
    ["Listings", servicesList.length + jobsList.length],
    ["Services", servicesList.length],
    ["Freelancers", profileIds.size],
    ["Open jobs", jobsList.length],
    ["Average rating", ratingCount ? `${(ratingTotal / ratingCount).toFixed(1)} / 5` : "No ratings"],
    ["Orders", projects.length],
    ["Projects", projects.length],
    ["Project value", `$${projectValue.toLocaleString()}`]
  ];
}

function w7RenderStats(element) {
  if (!element) return;
  const stats = w7MarketplaceStats();
  element.innerHTML = stats.map(([label, value]) =>
    `<div class="card w7-stat-card"><strong>${w7Escape(value)}</strong><span class="muted">${w7Escape(label)}</span></div>`
  ).join("");
  const byLabel = Object.fromEntries(stats);
  const freelancerCount = document.querySelector("#marketplaceFreelancerCount");
  const serviceCount = document.querySelector("#marketplaceServiceCount");
  const rating = document.querySelector("#marketplaceRating");
  if (freelancerCount) freelancerCount.textContent = byLabel.Freelancers;
  if (serviceCount) serviceCount.textContent = byLabel.Services;
  if (rating) rating.textContent = String(byLabel["Average rating"]).replace(" / 5", "/5");
}

function w7EmptyLine(message) {
  return `<div class="w7-list-empty">${w7Escape(message)}</div>`;
}

function w7DashboardEntry(title, detail, link) {
  return `<a class="w7-dashboard-entry" href="${w7Escape(link)}"><span><strong>${w7Escape(title)}</strong><small>${w7Escape(detail)}</small></span><b>→</b></a>`;
}

function w7RenderDashboard() {
  const root = document.querySelector("#dashboardMetrics");
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const role = params.get("role") === "client" ? "client" :
    (params.get("role") === "freelancer" ? "freelancer" : (localStorage.getItem(W7_ROLE_KEY) || "freelancer"));
  const person = profile();
  const servicesList = w7ServiceData();
  const jobsList = w7JobData();
  const projects = w7Projects();
  const proposals = proposalsLoad();
  const reviews = w7Reviews();
  const conversations = w7Conversations();
  const roleProjects = role === "freelancer"
    ? projects.filter(project => project.freelancer === person.name || project.freelancerRole)
    : projects.filter(project => project.client === person.name || project.clientRole === "Client");
  const freelancerEarnings = projects
    .filter(project => project.status === "Completed" && project.freelancer === person.name)
    .reduce((total, project) => total + (Number(project.budget) || 0), 0);
  const roleProjectValue = role === "client"
    ? roleProjects.reduce((total, project) => total + (Number(project.budget) || 0), 0)
    : freelancerEarnings;
  const filteredReviews = role === "freelancer"
    ? reviews.filter(review => review.recipient === person.name)
    : reviews.filter(review => review.reviewer === person.name);
  const roleLabel = role === "freelancer" ? "Freelancer" : "Client";
  document.querySelector("#dashboardTitle").textContent = `${roleLabel} dashboard`;
  document.querySelector("#dashboardIdentity").textContent = `Viewing as ${person.name} · ${roleLabel}`;
  document.querySelectorAll(".w7-role-switch [data-role]").forEach(button => {
    const active = button.dataset.role === role;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const metricValues = [
    ["Services", servicesList.length],
    [role === "freelancer" ? "Open jobs" : "Posted jobs", jobsList.length],
    [role === "freelancer" ? "Proposals sent" : "Proposals received", role === "freelancer" ? proposals.length : jobsList.reduce((n, job) => n + (Number(job.proposals) || 0), 0)],
    ["Orders", roleProjects.length],
    ["Projects", roleProjects.length],
    [role === "freelancer" ? "Earnings" : "Project value", `$${roleProjectValue.toLocaleString()}`],
    [role === "freelancer" ? "Reviews received" : "Reviews written", filteredReviews.length],
    ["Messages", conversations.length]
  ];
  root.innerHTML = metricValues.map(([label, value]) =>
    `<div class="card w7-metric-card"><span class="muted">${w7Escape(label)}</span><strong>${w7Escape(value)}</strong></div>`
  ).join("");
  const serviceList = document.querySelector("#dashboardServices");
  serviceList.innerHTML = servicesList.length
    ? servicesList.slice(0, 4).map(service => w7DashboardEntry(service.title, `${service.category} · $${service.price} · ★ ${service.rating}`, `service.html?id=${encodeURIComponent(service.id)}`)).join("")
    : w7EmptyLine("No services are available yet.");
  const jobList = document.querySelector("#dashboardJobs");
  jobList.innerHTML = jobsList.length
    ? [...jobsList].sort((a, b) => new Date(b.posted) - new Date(a.posted)).slice(0, 4)
      .map(job => w7DashboardEntry(job.title, `${job.category} · $${job.budgetMin}–$${job.budgetMax} · ${job.proposals} proposals`, `job.html?id=${encodeURIComponent(job.id)}`)).join("")
    : w7EmptyLine("No jobs are available yet.");
  const proposalList = document.querySelector("#dashboardProposals");
  if (role === "freelancer") {
    proposalList.innerHTML = proposals.length
      ? proposals.slice(0, 4).map(proposal => w7DashboardEntry(
        proposal.jobTitle || proposal.title || "Proposal submitted",
        [proposal.status || "Submitted", proposal.price ? `$${proposal.price}` : ""].filter(Boolean).join(" · "),
        "my-proposals.html"
      )).join("")
      : w7EmptyLine("You have not submitted any proposals yet.");
  } else {
    proposalList.innerHTML = jobsList.length
      ? jobsList.slice(0, 4).map(job => w7DashboardEntry(job.title, `${Number(job.proposals) || 0} proposal${job.proposals === 1 ? "" : "s"} received`, `job.html?id=${encodeURIComponent(job.id)}`)).join("")
      : w7EmptyLine("No proposals have been received yet.");
  }
  const projectList = document.querySelector("#dashboardProjects");
  projectList.innerHTML = roleProjects.length
    ? roleProjects.slice(0, 4).map(project => w7DashboardEntry(
      project.title, `${project.status} · $${Number(project.budget).toLocaleString()} · ${project.progress}% complete`,
      `project.html?id=${encodeURIComponent(project.id)}`
    )).join("")
    : w7EmptyLine("No orders or projects are available in this view.");
  const reviewList = document.querySelector("#dashboardReviews");
  reviewList.innerHTML = filteredReviews.length
    ? filteredReviews.slice(0, 4).map(review => w7DashboardEntry(
      review.project || "Project review", `★ ${review.rating} · ${role === "freelancer" ? `From ${review.reviewer}` : `For ${review.recipient}`}`,
      "reviews.html"
    )).join("")
    : w7EmptyLine(role === "freelancer" ? "No reviews have been received yet." : "You have not written any reviews yet.");
  const messageList = document.querySelector("#dashboardMessages");
  messageList.innerHTML = conversations.length
    ? conversations.slice(0, 4).map(conversation => {
      const latest = conversation.messages?.at(-1)?.text || "Open this conversation";
      const unread = Number(conversation.unread) || 0;
      return w7DashboardEntry(conversation.name, `${unread ? `${unread} unread · ` : ""}${latest}`, `messages.html?conversation=${encodeURIComponent(conversation.id)}`);
    }).join("")
    : w7EmptyLine("No conversations are available yet.");
  w7RenderStats(document.querySelector("#dashboardMarketplaceStats"));
}

function w7InitDashboard() {
  if (!document.querySelector("#dashboardMetrics")) return;
  document.querySelectorAll(".w7-role-switch [data-role]").forEach(button => {
    button.addEventListener("click", () => {
      localStorage.setItem(W7_ROLE_KEY, button.dataset.role);
      history.replaceState(null, "", `dashboard.html?role=${button.dataset.role}`);
      w7RenderDashboard();
    });
  });
  w7RenderDashboard();
}

document.addEventListener("click", event => {
  const button = event.target.closest(".w7-favorite[data-favorite-kind][data-favorite-id]");
  if (!button) return;
  event.preventDefault();
  try {
    w7ToggleFavorite(button.dataset.favoriteKind, button.dataset.favoriteId);
  } catch (error) {
    console.error("Unable to save favorite.", error);
    w7Toast("Favorite could not be saved. Check browser storage and try again.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("nav.links, nav.nav-links").forEach(navigation => {
    [["browse.html", "Advanced Search"], ["dashboard.html", "Dashboard"]].forEach(([href, label]) => {
      if (navigation.querySelector(`a[href="${href}"]`)) return;
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      link.dataset.week7Navigation = "true";
      if (location.pathname.endsWith(href)) link.classList.add("active");
      navigation.append(link);
    });
  });
  w7InitBrowse();
  w7RenderFavorites();
  w7InitDashboard();
  w7UpdateFavoriteButtons();
  w7RenderStats(document.querySelector("#marketplaceStats"));
});
