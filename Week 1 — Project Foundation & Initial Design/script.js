const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* Search tabs */
const searchTabs = document.querySelectorAll(".search-tab");
const searchInput = document.querySelector("#searchInput");
const searchMessage = document.querySelector("#searchMessage");

searchTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    searchTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const mode = tab.dataset.search;
    searchInput.placeholder =
      mode === "services"
        ? "What service are you looking for?"
        : "Search by freelancer name or skill";
  });
});

document.querySelector("#searchForm").addEventListener("submit", e => {
  e.preventDefault();

  const query = searchInput.value.trim();
  const category = document.querySelector("#categorySelect").value;

  if (!query && !category) {
    searchMessage.textContent = "Enter a service, freelancer, or choose a category to search.";
    return;
  }

  searchMessage.textContent =
    `Searching CODIORA for ${query ? `"${query}"` : "services"}${category ? ` in ${category}` : ""}...`;

  setTimeout(() => {
    searchMessage.textContent = "Demo search complete — connect this form to your backend/API.";
  }, 900);
});

/* Category cards */
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      searchInput.value = card.dataset.category;
      document.querySelector("#categorySelect").value = card.dataset.category;
      document.querySelector("#searchForm").scrollIntoView({ behavior: "smooth", block: "center" });
      searchInput.focus();
    }
  });
});

/* Favorite buttons */
document.querySelectorAll(".favorite").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
    button.textContent = button.classList.contains("active") ? "♥" : "♡";
  });
});

/* Auth modal */
const modal = document.querySelector("#authModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalSubmit = document.querySelector("#modalSubmit");
const authMessage = document.querySelector("#authMessage");

function openModal(type) {
  const register = type === "register";
  modalTitle.textContent = register ? "Create Your Account" : "Welcome Back";
  modalText.textContent = register
    ? "Join CODIORA and start building your next opportunity."
    : "Log in to continue to CODIORA.";
  modalSubmit.textContent = register ? "Create Account" : "Login";
  authMessage.textContent = "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", () => openModal(button.dataset.modal));
});

document.querySelector(".modal-close").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

document.querySelector("#authForm").addEventListener("submit", e => {
  e.preventDefault();
  authMessage.textContent = "Demo submitted successfully. Connect this form to your authentication API.";
});

/* Newsletter */
document.querySelector("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  document.querySelector("#newsletterMessage").textContent =
    "Thanks — you're on the list!";
  e.target.reset();
});

/* Active navigation based on scroll */
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll('.nav-links > a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => item.classList.remove("active"));
      const current = document.querySelector(`.nav-links > a[href="#${entry.target.id}"]`);
      if (current) current.classList.add("active");
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => observer.observe(section));
