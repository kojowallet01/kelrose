const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const newsletterForm = document.querySelector(".footer-newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = newsletterForm.querySelector("input[type='email']");
    if (!emailInput || !emailInput.value.trim()) return;
    alert("Thanks for subscribing! Exclusive tour deals are on the way.");
    newsletterForm.reset();
  });
}

const destinationCards = document.querySelectorAll(".dest-card");
const historyModal = document.querySelector("#history-modal");
const modalTitle = document.querySelector("#modal-title");
const modalText = document.querySelector("#modal-text");
const modalTag = document.querySelector("#modal-tag");
const modalImg1 = document.querySelector("#modal-img1");
const modalImg2 = document.querySelector("#modal-img2");
const historyClose = document.querySelector("#history-close");

if (destinationCards.length && historyModal && modalTitle && modalText && historyClose) {
  const openModal = (card) => {
    const destination = card.dataset.destination || "Destination Story";
    const history = card.dataset.history || "";
    const tag = card.dataset.tag || "";
    const img1 = card.dataset.img1 || "";
    const img2 = card.dataset.img2 || "";

    modalTitle.textContent = destination;
    modalText.textContent = history;
    if (modalTag) { modalTag.textContent = tag; modalTag.style.display = tag ? "" : "none"; }
    if (modalImg1) { modalImg1.src = img1; modalImg1.alt = destination + " photo 1"; }
    if (modalImg2) { modalImg2.src = img2; modalImg2.alt = destination + " photo 2"; }

    historyModal.classList.add("open");
    historyModal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    historyModal.classList.remove("open");
    historyModal.setAttribute("aria-hidden", "true");
  };

  destinationCards.forEach((card) => {
    const showHistory = () => {
      destinationCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      openModal(card);
    };
    card.addEventListener("click", showHistory);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showHistory(); }
    });
  });

  historyClose.addEventListener("click", closeModal);
  historyModal.addEventListener("click", (e) => { if (e.target === historyModal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && historyModal.classList.contains("open")) closeModal();
  });
}

const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length) {
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-question");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach((entry) => entry.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

const bookingForm = document.querySelector("#booking-form");
const itineraryChips = document.querySelectorAll(".itinerary-chip");
const packageCards = Array.from(document.querySelectorAll(".pricing .price-card"));
const packageFilter = document.querySelector("#package-filter");
const packageSort = document.querySelector("#package-sort");
const packageModal = document.querySelector("#package-modal");
const packageClose = document.querySelector("#package-close");
const packageModalTitle = document.querySelector("#package-modal-title");
const packageModalMeta = document.querySelector("#package-modal-meta");
const packageModalBody = document.querySelector("#package-modal-body");
const packageModalList = document.querySelector("#package-modal-list");
const packageDetailsButtons = document.querySelectorAll(".package-details-btn");

const packageDetailsData = {
  cape: {
    title: "Cape Coast, Elmina & Kakum",
    meta: "3 Days | Culture Focus | ★ 4.8 (214 reviews)",
    body: "A compact heritage journey covering Ghana's most important coastal history sites with rainforest adventure.",
    points: [
      "Day 1: Accra to Cape Coast, guided castle tours",
      "Day 2: Elmina community and cultural experiences",
      "Day 3: Kakum canopy walk and return to Accra",
    ],
  },
  mole: {
    title: "Mole National Park Safari",
    meta: "3 Days | Wildlife Focus | ★ 4.9 (176 reviews)",
    body: "A northern Ghana wildlife package designed for elephant sightings and authentic savannah lodge stays.",
    points: [
      "Day 1: Transfer to Mole with Larabanga stop",
      "Day 2: Morning and evening game drives",
      "Day 3: Final safari and return transfer",
    ],
  },
  adventure: {
    title: "10-Day Adventure & Culture",
    meta: "10 Days | Culture + Adventure | ★ 4.7 (139 reviews)",
    body: "A deeper Ghana circuit combining city life, castles, rainforest, mountains, and waterfall experiences.",
    points: [
      "Accra city heritage and art markets",
      "Cape Coast/Elmina history and Kakum canopy",
      "Volta highlands, Amedzofe, and Wli waterfalls",
    ],
  },
};

if (itineraryChips.length) {
  itineraryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });
  });
}

if (packageCards.length && packageFilter && packageSort) {
  const applyPackageView = () => {
    const filterValue = packageFilter.value;
    const sortValue = packageSort.value;

    let visibleCards = packageCards.filter((card) => {
      const duration = Number(card.dataset.duration || 0);
      const category = card.dataset.category || "";
      if (filterValue === "short") return duration <= 4;
      if (filterValue === "long") return duration >= 5;
      if (filterValue === "culture") return category === "culture";
      if (filterValue === "wildlife") return category === "wildlife";
      return true;
    });

    visibleCards.sort((a, b) => {
      if (sortValue === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortValue === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortValue === "rating-high") return Number(b.dataset.rating) - Number(a.dataset.rating);
      return Number(a.dataset.popularity) - Number(b.dataset.popularity);
    });

    const pricingGrid = document.querySelector(".pricing");
    if (!pricingGrid) return;

    packageCards.forEach((card) => {
      card.style.display = visibleCards.includes(card) ? "" : "none";
    });

    visibleCards.forEach((card) => pricingGrid.appendChild(card));
  };

  packageFilter.addEventListener("change", applyPackageView);
  packageSort.addEventListener("change", applyPackageView);
  applyPackageView();
}

if (packageDetailsButtons.length && packageModal && packageClose && packageModalTitle && packageModalMeta && packageModalBody && packageModalList) {
  const openPackageModal = (packageKey) => {
    const data = packageDetailsData[packageKey];
    if (!data) return;

    packageModalTitle.textContent = data.title;
    packageModalMeta.textContent = data.meta;
    packageModalBody.textContent = data.body;
    packageModalList.innerHTML = data.points.map((item) => `<li>${item}</li>`).join("");
    packageModal.classList.add("open");
    packageModal.setAttribute("aria-hidden", "false");
  };

  const closePackageModal = () => {
    packageModal.classList.remove("open");
    packageModal.setAttribute("aria-hidden", "true");
  };

  packageDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".price-card");
      if (!card) return;
      openPackageModal(card.dataset.package);
    });
  });

  packageClose.addEventListener("click", closePackageModal);
  packageModal.addEventListener("click", (event) => {
    if (event.target === packageModal) closePackageModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && packageModal.classList.contains("open")) closePackageModal();
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = bookingForm.querySelector("input[name='name']");
    const packageInput = bookingForm.querySelector("select[name='package']");
    const selectedPrefs = Array.from(document.querySelectorAll(".itinerary-chip.active"))
      .map((chip) => chip.dataset.value)
      .filter(Boolean);

    const guestName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Traveler";
    const selectedPackage = packageInput && packageInput.value ? packageInput.value : "your selected tour";
    const prefsText = selectedPrefs.length ? ` Preferences: ${selectedPrefs.join(", ")}.` : "";

    alert(`Thanks ${guestName}! Your booking request for ${selectedPackage} has been received.${prefsText} Kelrose Tours will contact you within 24 hours.`);
    bookingForm.reset();
    itineraryChips.forEach((chip) => chip.classList.remove("active"));
  });
}

// ── Sticky nav ──
const mainNav = document.getElementById("main-nav");
if (mainNav) {
  window.addEventListener("scroll", () => {
    mainNav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

// ── Back to top ──
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  backToTop.addEventListener("click", scrollTop);
  backToTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scrollTop(); }
  });
}

// ── Scroll reveal ──
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => observer.observe(el));
}

// ── Gallery lightbox ──
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
let currentGalleryIndex = 0;

const openLightbox = (index) => {
  currentGalleryIndex = index;
  const item = galleryItems[index];
  const img = item.querySelector("img");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = item.dataset.caption || "";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
};

const showPrev = () => openLightbox((currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length);
const showNext = () => openLightbox((currentGalleryIndex + 1) % galleryItems.length);

if (galleryItems.length && lightbox) {
  galleryItems.forEach((item, i) => {
    item.setAttribute("tabindex", "0");
    item.addEventListener("click", () => openLightbox(i));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
}

// ── Currency converter ──
const usdInput = document.getElementById("usd-amount");
const ghsResult = document.getElementById("ghs-result");
const currencyRate = document.getElementById("currency-rate");

let usdToGhs = null;

const updateConversion = () => {
  if (!usdToGhs || !usdInput) return;
  const usd = parseFloat(usdInput.value) || 0;
  ghsResult.textContent = (usd * usdToGhs).toLocaleString("en-GH", { maximumFractionDigits: 2 });
};

if (usdInput && ghsResult && currencyRate) {
  fetch("https://open.er-api.com/v6/latest/USD")
    .then((res) => res.json())
    .then((data) => {
      usdToGhs = data.rates && data.rates.GHS ? data.rates.GHS : 15.5;
      currencyRate.textContent = `1 USD = ${usdToGhs.toFixed(2)} GHS (live rate)`;
      updateConversion();
    })
    .catch(() => {
      usdToGhs = 15.5;
      currencyRate.textContent = "1 USD ≈ 15.50 GHS (estimated rate)";
      updateConversion();
    });

  usdInput.addEventListener("input", updateConversion);
}

// ── 4th package details ──
if (typeof packageDetailsData !== "undefined") {
  packageDetailsData.ashanti = {
    title: "Ashanti Kingdom Expedition",
    meta: "4 Days | Culture Focus | ★ 4.8 (98 reviews)",
    body: "A deep dive into the royal heritage of the Asante people, visiting palaces, craft villages, and sacred sites.",
    points: [
      "Day 1: Accra to Kumasi, Manhyia Palace Museum",
      "Day 2: Kente weaving village and Bonwire craft tour",
      "Day 3: Okomfo Anokye Sword site and Kejetia Market",
      "Day 4: Cultural farewell and return transfer",
    ],
  };
}
