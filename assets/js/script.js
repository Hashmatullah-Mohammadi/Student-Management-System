const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#site-search");
const toast = document.querySelector(".toast");

const savedTheme = localStorage.getItem("northstar-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

if (themeToggle) {
  setTheme(savedTheme || preferredTheme);
}

function setTheme(theme) {
  body.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.content = theme === "dark" ? "#101827" : "#f7f8fc";
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("northstar-theme", nextTheme);
  });
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu",
    );
    navigation.classList.toggle("open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation
        .querySelectorAll(".nav-link")
        .forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

if (searchToggle && searchPanel && searchInput) {
  searchToggle.addEventListener("click", () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) searchInput.focus();
  });

  const searchClose = searchPanel.querySelector(".search-close");
  if (searchClose) {
    searchClose.addEventListener("click", () => {
      searchPanel.hidden = true;
      clearSearch();
      searchToggle.focus();
    });
  }
}

function clearSearch() {
  document
    .querySelectorAll(".search-match")
    .forEach((element) => element.classList.remove("search-match"));
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    clearSearch();
    const query = searchInput.value.trim().toLocaleLowerCase();
    const status = document.querySelector(".search-status");
    if (!query) {
      if (status) status.textContent = "Search headings and page content.";
      return;
    }
    const matches = [
      ...document.querySelectorAll("main h1, main h2, main h3, main p"),
    ].filter((element) =>
      element.textContent.toLocaleLowerCase().includes(query),
    );
    if (status) {
      status.textContent = matches.length
        ? `${matches.length} matching section${matches.length === 1 ? "" : "s"} found.`
        : "No matching content found.";
    }
    if (matches[0]) {
      const section = matches[0].closest("section") || matches[0];
      section.classList.add("search-match");
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

const storyCards = [...document.querySelectorAll(".story-quote")];
const storyDots = [...document.querySelectorAll(".quote-dot")];
let currentStory = 0;

if (storyCards.length) {
  function showStory(index) {
    currentStory = (index + storyCards.length) % storyCards.length;
    storyCards.forEach((story, storyIndex) =>
      story.classList.toggle("active", storyIndex === currentStory),
    );
    storyDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentStory);
      dot.setAttribute("aria-pressed", String(dotIndex === currentStory));
    });
    const storyCurrent = document.querySelector(".story-current");
    if (storyCurrent) {
      storyCurrent.textContent = String(currentStory + 1).padStart(2, "0");
    }
  }

  const storyPrev = document.querySelector(".story-prev");
  const storyNext = document.querySelector(".story-next");
  if (storyPrev) {
    storyPrev.addEventListener("click", () => showStory(currentStory - 1));
  }
  if (storyNext) {
    storyNext.addEventListener("click", () => showStory(currentStory + 1));
  }
  storyDots.forEach((dot, index) =>
    dot.addEventListener("click", () => showStory(index)),
  );
}

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#newsletter-email");
    if (!email || !email.reportValidity()) return;
    const newsletterStatus = document.querySelector(".newsletter-status");
    if (newsletterStatus) {
      newsletterStatus.textContent = "Thanks for joining us. Watch your inbox.";
    }
    email.value = "";
    showToast("You're on the list. Thanks for joining us!");
  });
}

document.querySelectorAll('a[href="#get-started"]').forEach((link) => {
  if (link.closest(".cta-section, .footer-links")) return;
  link.addEventListener("click", () =>
    showToast("Thanks for your interest. Reach us at hello@northstar.school."),
  );
});

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
