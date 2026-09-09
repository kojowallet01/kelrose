// ═══════════════════════════════════════════════════════════════
// KELROSE TOURS — MODERN TRAVEL PLATFORM CLIENT SCRIPT
// ═══════════════════════════════════════════════════════════════

// ── 1. Toast Notification System ──
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : "toast-info"}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── 2. Mobile Navigation & Sticky Header ──
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const mainNav = document.getElementById("main-nav");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Sticky header on scroll
if (mainNav) {
  window.addEventListener("scroll", () => {
    mainNav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

// Nav Scrollspy: Highlight current active section in nav
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const trackedSections = Array.from(navAnchors).map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + 180;
  trackedSections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");
    if (scrollPos >= top && scrollPos < top + height) {
      navAnchors.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    }
  });
}, { passive: true });

// ── 3. Back to Top Button ──
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 350);
  }, { passive: true });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  backToTop.addEventListener("click", scrollToTop);
}

// ── 4. Tour Category Filtering (Pills & Hero Search) ──
const pillButtons = document.querySelectorAll(".pill-btn");
const tourCards = Array.from(document.querySelectorAll(".tours-grid .tour-card"));

function filterToursBy(category) {
  tourCards.forEach((card) => {
    const cat = card.dataset.category || "";
    const matches = category === "all" || cat === category;
    card.style.display = matches ? "" : "none";
  });
}

if (pillButtons.length && tourCards.length) {
  pillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      pillButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterToursBy(btn.dataset.filter);
    });
  });
}

// Airbnb-Style Hero Search Action
const heroSearchAction = document.getElementById("hero-search-action");
const filterDestSelect = document.getElementById("filter-destination-select");
const filterDurationSelect = document.getElementById("filter-duration-select");
const filterStyleSelect = document.getElementById("filter-style-select");

if (heroSearchAction) {
  heroSearchAction.addEventListener("click", (e) => {
    const styleVal = filterStyleSelect ? filterStyleSelect.value : "all";
    const destVal = filterDestSelect ? filterDestSelect.value : "all";
    const durVal = filterDurationSelect ? filterDurationSelect.value : "all";

    let targetFilter = "all";
    if (styleVal !== "all") {
      targetFilter = styleVal;
    } else if (destVal !== "all") {
      targetFilter = destVal;
    } else if (durVal === "long") {
      targetFilter = "long";
    }

    // Sync pill button
    pillButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === targetFilter);
    });

    filterToursBy(targetFilter);
    showToast("Displaying tours matching your search criteria", "success");
  });
}

// ── 5. Interactive Map & Region Dossier ──
const routeData = {
  accra: {
    tag: "Gateway Hub",
    transit: "✈️ Kotoka International Airport (ACC)",
    title: "Accra & The Atlantic Coast",
    desc: "Ghana's energetic ocean capital where historic British, Danish, and Dutch colonial forts meet vibrant art galleries, live highlife music, and fresh seafood restaurants.",
    dist: "0 km (Starting Hub)",
    season: "All Year (Peak: Dec - Jan)",
    sights: [
      "Independence Square & Black Star Monument",
      "Jamestown harbor and British lighthouse walking tour",
      "Makola Market & contemporary artists' studios (Gallery 1957)",
    ],
    btnText: "Explore Tours in Accra & Central Region &rarr;",
    packageKey: "adventure",
  },
  cape: {
    tag: "UNESCO World Heritage",
    transit: "🚗 2.5 - 3 Hours Scenic Coastal Drive",
    title: "Cape Coast, Elmina & Kakum",
    desc: "The historic soul of West Africa. Explore the moving ramparts and dungeons of Cape Coast Castle and Elmina Castle, followed by the exhilarating canopy walk suspended in Kakum rainforest.",
    dist: "148 km West of Accra",
    season: "Nov - April (Sunny Coastline)",
    sights: [
      "Cape Coast Castle & historical slave museum",
      "Elmina 1482 Portuguese fortress & fishing harbor",
      "Kakum National Park 350m suspended canopy bridges",
    ],
    btnText: "View Cape Coast Tour ($606) &rarr;",
    packageKey: "cape",
  },
  kumasi: {
    tag: "Ashanti Royal Kingdom",
    transit: "🚗 4 Hours Drive or 45-Min Domestic Flight",
    title: "Kumasi & Asante Cultural Capital",
    desc: "The sovereign heart of the Asante Kingdom and the Golden Stool. Filled with living royal customs, legendary tales, sacred sites, and master craft villages.",
    dist: "250 km Northwest of Accra",
    season: "Oct - March (Festival Season)",
    sights: [
      "Manhyia Palace Museum & royal court gardens",
      "Bonwire village authentic royal Kente handweaving",
      "Kejetia Market (West Africa's largest trading maze)",
    ],
    btnText: "View Ashanti Kingdom Tour ($890) &rarr;",
    packageKey: "ashanti",
  },
  mole: {
    tag: "Wild Savanna Safari",
    transit: "✈️ 1-Hr Flight to Tamale + 2-Hr Private Safari Drive",
    title: "Mole National Park & Northern Savanna",
    desc: "Ghana's premier protected wildlife sanctuary spanning 4,500 sq km. Home to savanna elephants, antelopes, baboons, and the ancient 14th-century Larabanga mud-and-reed mosque.",
    dist: "650 km North of Accra",
    season: "Dec - April (Prime Elephant Tracking)",
    sights: [
      "Morning walking safaris with armed park wildlife rangers",
      "Golden hour game drives & cliffside pool views",
      "14th-century Larabanga ancient mud-and-reed mosque",
    ],
    btnText: "View Mole Safari Tour ($1,450) &rarr;",
    packageKey: "mole",
  },
  volta: {
    tag: "Mountain Rainforest",
    transit: "🚗 3.5 Hours Scenic Highland Drive",
    title: "Volta Region & Wli Waterfalls",
    desc: "Lush tropical ridges bordering Togo, crystal clear mountain streams, cocoa farms, and West Africa's tallest waterfall surrounded by thousands of wild fruit bats.",
    dist: "220 km Northeast of Accra",
    season: "All Year (Lush in May - Oct)",
    sights: [
      "Wli Waterfalls lower cascade tropical hike",
      "Mount Afadja peak hike & mountain mist views",
      "Lake Volta boat cruise & Akosombo Dam viewpoint",
    ],
    btnText: "View 10-Day Complete Circuit &rarr;",
    packageKey: "adventure",
  },
};

const mapPins = document.querySelectorAll(".map-pin");
const mapRegionTag = document.getElementById("map-region-tag");
const mapRegionTransit = document.getElementById("map-region-transit");
const mapRegionTitle = document.getElementById("map-region-title");
const mapRegionDesc = document.getElementById("map-region-desc");
const mapRegionDist = document.getElementById("map-region-dist");
const mapRegionSeason = document.getElementById("map-region-season");
const mapRegionSights = document.getElementById("map-region-sights");
const mapRegionBtn = document.getElementById("map-region-btn");

let currentActiveRegion = "accra";

function selectMapRegion(regionKey) {
  const data = routeData[regionKey];
  if (!data) return;

  currentActiveRegion = regionKey;

  mapPins.forEach((pin) => {
    pin.classList.toggle("active", pin.dataset.region === regionKey);
  });

  if (mapRegionTag) mapRegionTag.textContent = data.tag;
  if (mapRegionTransit) mapRegionTransit.textContent = data.transit;
  if (mapRegionTitle) mapRegionTitle.textContent = data.title;
  if (mapRegionDesc) mapRegionDesc.textContent = data.desc;
  if (mapRegionDist) mapRegionDist.textContent = data.dist;
  if (mapRegionSeason) mapRegionSeason.textContent = data.season;

  if (mapRegionSights) {
    mapRegionSights.innerHTML = data.sights.map((s) => `<li>${s}</li>`).join("");
  }

  if (mapRegionBtn) {
    mapRegionBtn.innerHTML = data.btnText;
    mapRegionBtn.onclick = (e) => {
      e.preventDefault();
      selectPackageAndScroll(data.packageKey);
    };
  }
}

if (mapPins.length) {
  mapPins.forEach((pin) => {
    pin.addEventListener("click", () => selectMapRegion(pin.dataset.region));
    pin.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectMapRegion(pin.dataset.region);
      }
    });
  });
}

// ── 6. Photo Gallery & Lightbox ──
const galleryCards = Array.from(document.querySelectorAll(".gallery-modern-grid .gallery-item-card"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let currentGalleryIndex = 0;

const openLightbox = (index) => {
  if (!galleryCards.length || !lightbox || !lightboxImg) return;
  currentGalleryIndex = index;
  const item = galleryCards[index];
  const img = item.querySelector("img");
  if (!img) return;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || "Ghana travel photograph";
  if (lightboxCaption) {
    lightboxCaption.textContent = item.dataset.caption || "";
  }

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const showPrevLightbox = () => {
  const prevIdx = (currentGalleryIndex - 1 + galleryCards.length) % galleryCards.length;
  openLightbox(prevIdx);
};

const showNextLightbox = () => {
  const nextIdx = (currentGalleryIndex + 1) % galleryCards.length;
  openLightbox(nextIdx);
};

if (galleryCards.length && lightbox) {
  galleryCards.forEach((card, idx) => {
    card.addEventListener("click", () => openLightbox(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrevLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", showNextLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrevLightbox();
    if (e.key === "ArrowRight") showNextLightbox();
  });
}

// ── 7. Detailed Tour Itinerary Modal ──
const packageModal = document.getElementById("package-modal");
const packageClose = document.getElementById("package-close");
const packageModalTitle = document.getElementById("package-modal-title");
const packageModalMeta = document.getElementById("package-modal-meta");
const packageModalBadge = document.getElementById("package-modal-badge");
const packageModalBody = document.getElementById("package-modal-body");
const packageModalTimeline = document.getElementById("package-modal-timeline");
const packageModalBookBtn = document.getElementById("package-modal-book-btn");
const packageModalCloseBtn = document.getElementById("package-modal-close-btn");

const packageDetailsButtons = document.querySelectorAll(".package-details-btn");
const choosePlanButtons = document.querySelectorAll(".choose-plan-btn");

const packageDetailsData = {
  cape: {
    title: "Cape Coast, Elmina & Kakum Rainforest",
    meta: "3 Days / 2 Nights • Heritage & Nature • ★ 4.9 (214 reviews)",
    badge: "Top Rated Cultural Tour",
    body: "An essential pilgrimage for travelers wanting to understand West Africa's history while experiencing virgin coastal rainforest. Led by certified historian guides with comfortable private AC transport.",
    packageKey: "cape",
    days: [
      {
        dayNum: "Day 1",
        title: "Accra Departure & Cape Coast Castle Tour",
        meals: "Included: Lunch & Welcome Dinner",
        details: "Depart Accra via private air-conditioned vehicle. Enjoy a guided tour of Cape Coast Castle, exploring the historic ramparts, slave dungeons, and the poignant 'Door of No Return'. Check in at an oceanfront hotel.",
      },
      {
        dayNum: "Day 2",
        title: "Elmina Castle Fortress & Historic Fishing Harbor",
        meals: "Included: Breakfast & Lunch",
        details: "Morning walking tour through ancient Elmina, visiting the 1482 fortress of São Jorge da Mina. Meet local fishermen at the bustling lagoon harbor, watch wooden canoe carving, and enjoy fresh coconut water.",
      },
      {
        dayNum: "Day 3",
        title: "Kakum Rainforest Canopy Walkway & Return to Accra",
        meals: "Included: Breakfast & Lunch",
        details: "Hike into Kakum National Park to experience the exhilarating 350-meter canopy walkway high above the forest floor. Learn about native medicinal plants from our ranger, followed by a scenic lunch and return transfer to Accra.",
      },
    ],
  },
  mole: {
    title: "Mole National Park Wild Elephant Safari",
    meta: "3 Days / 2 Nights • Wildlife Safari • ★ 4.95 (176 reviews)",
    badge: "Premier Wildlife Experience",
    body: "Experience close encounters with wild African savanna elephants and enjoy breathtaking rim-cliff lodge sunsets in Ghana's flagship wildlife sanctuary.",
    packageKey: "mole",
    days: [
      {
        dayNum: "Day 1",
        title: "Flight from Accra to Tamale & Ancient Larabanga Mosque",
        meals: "Included: Lunch & Dinner",
        details: "Morning 1-hour flight from Accra to Tamale. Meet your private northern safari director and journey through scenic savanna to the 14th-century Larabanga mud-and-reed mosque. Check into Mole Safari Lodge.",
      },
      {
        dayNum: "Day 2",
        title: "Sunrise Walking Elephant Safari & Afternoon Game Drive",
        meals: "Included: Breakfast, Lunch, Dinner",
        details: "Dawn walking safari accompanied by armed wildlife rangers for safe, close encounters with elephants, antelopes, baboons, and wild warthogs. Relax by the infinity pool during midday heat. Depart on 4x4 open-top vehicle game drive at golden hour.",
      },
      {
        dayNum: "Day 3",
        title: "Morning Bush Walk, Shea Butter Village & Flight to Accra",
        meals: "Included: Breakfast & Lunch",
        details: "Final early morning animal tracking and bird watching. Visit a local women's organic Shea butter cooperative in Larabanga before transfer back to Tamale Airport for your return flight to Accra.",
      },
    ],
  },
  adventure: {
    title: "The Grand Ghana Expedition (10-Day Circuit)",
    meta: "10 Days / 9 Nights • Heritage, Safari & Waterfalls • ★ 4.88 (139 reviews)",
    badge: "Complete Ghana Odyssey",
    body: "The ultimate expedition covering every iconic region: Accra city life, Cape Coast slave castles, Kakum rainforest, royal Ashanti Kumasi, and Volta mountain waterfalls.",
    packageKey: "adventure",
    days: [
      {
        dayNum: "Days 1 - 2",
        title: "Accra Heritage, Jamestown Lighthouse & Arts",
        meals: "Included: Daily Breakfast & Welcome Dinner",
        details: "Airport pickup, check-in to boutique hotel. Comprehensive city tour: Black Star Square, Kwame Nkrumah Memorial Park, Jamestown boxing gyms and colonial lighthouse, and contemporary African art galleries.",
      },
      {
        dayNum: "Days 3 - 4",
        title: "Cape Coast Castle & Kakum Rainforest Canopy",
        meals: "Included: Daily Breakfast & Lunch",
        details: "Coastal journey to UNESCO slave castles (Cape Coast and Elmina). Walk the treetop suspension bridges at Kakum National Park and experience coastal seaside hospitality.",
      },
      {
        dayNum: "Days 5 - 6",
        title: "Ashanti Kingdom, Manhyia Palace & Royal Kente Weaving",
        meals: "Included: Daily Breakfast & Lunch",
        details: "Drive inland to royal Kumasi. Guided visit to Manhyia Palace Museum, the legendary Okomfo Anokye Sword site, and hands-on royal Kente weaving in Bonwire artisan village.",
      },
      {
        dayNum: "Days 7 - 8",
        title: "Volta Highlands, Wli Waterfalls & Mountain Mist",
        meals: "Included: Daily Breakfast & Lunch",
        details: "Scenic highland drive into the Volta mountain range. Hike through lush tropical rainforest to Wli Waterfalls (West Africa's tallest waterfall) and Lake Volta boat cruise.",
      },
      {
        dayNum: "Days 9 - 10",
        title: "Beach Celebration, Farewell Dinner & Departure",
        meals: "Included: Daily Breakfast & Farewell Dinner",
        details: "Return to Accra for coastal sunset dinner, souvenir shopping at the National Arts Centre, and guaranteed seamless transfer to Kotoka International Airport.",
      },
    ],
  },
  ashanti: {
    title: "Ashanti Royal Kingdom & Artisan Guilds",
    meta: "4 Days / 3 Nights • Royal Asante Heritage • ★ 4.92 (98 reviews)",
    badge: "Living Royal Culture",
    body: "A deep dive into the royal civilization of the Asante Kingdom, exploring sovereign palaces, sacred legends, and artisan craft villages.",
    packageKey: "ashanti",
    days: [
      {
        dayNum: "Day 1",
        title: "Accra to Kumasi & Manhyia Palace Museum",
        meals: "Included: Lunch & Dinner",
        details: "Scenic morning drive past lush forest reserves into Kumasi. Tour the Manhyia Palace Museum, former residence of Asante kings, learning the history of Yaa Asantewaa and the Golden Stool. Check into 4-star Kumasi hotel.",
      },
      {
        dayNum: "Day 2",
        title: "Royal Craft Villages: Bonwire Kente & Ntonso Adinkra",
        meals: "Included: Breakfast & Lunch",
        details: "Full-day artisan exploration. Learn master loom weaving in Bonwire (home of Kente), then stamp your own traditional Adinkra cloth using natural bark dye in Ntonso craft village.",
      },
      {
        dayNum: "Day 3",
        title: "Okomfo Anokye Sword Site & Kejetia Mega Market",
        meals: "Included: Breakfast & Lunch",
        details: "Witness the unmovable sword driven into the earth by legendary priest Okomfo Anokye over 300 years ago. Guided walk through Kejetia Market for spices, beads, and brass casting.",
      },
      {
        dayNum: "Day 4",
        title: "Lake Bosomtwe Sacred Crater & Return to Accra",
        meals: "Included: Breakfast & Lunch",
        details: "Morning visit to Lake Bosomtwe, Ghana's only natural meteorite crater lake sacred to the Ashanti people. Scenic lunch by the lake before returning in comfort to Accra.",
      },
    ],
  },
};

let currentModalPackageKey = "cape";

function openPackageModal(packageKey) {
  const data = packageDetailsData[packageKey];
  if (!data || !packageModal) return;

  currentModalPackageKey = packageKey;
  if (packageModalTitle) packageModalTitle.textContent = data.title;
  if (packageModalMeta) packageModalMeta.textContent = data.meta;
  if (packageModalBadge) packageModalBadge.textContent = data.badge;
  if (packageModalBody) packageModalBody.textContent = data.body;

  if (packageModalTimeline) {
    packageModalTimeline.innerHTML = data.days.map((day) => `
      <div class="itinerary-day-card">
        <div class="itinerary-day-header">
          <div class="itinerary-day-left">
            <span class="day-num">${day.dayNum}</span>
            <strong class="day-header-title">${day.title}</strong>
          </div>
          <span class="day-meals">${day.meals}</span>
        </div>
        <div class="day-details">${day.details}</div>
      </div>
    `).join("");
  }

  packageModal.classList.add("open");
  packageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePackageModal() {
  if (!packageModal) return;
  packageModal.classList.remove("open");
  packageModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function selectPackageAndScroll(packageKey) {
  closePackageModal();
  const bookPackageSelect = document.getElementById("book-package");
  const bookingSection = document.getElementById("booking");

  if (bookPackageSelect && packageKey) {
    bookPackageSelect.value = packageKey;
    bookPackageSelect.focus();
  }

  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
    const pkgName = packageDetailsData[packageKey] ? packageDetailsData[packageKey].title : packageKey;
    showToast(`Selected "${pkgName}". Please enter your dates.`, "success");
  }
}

if (packageDetailsButtons.length) {
  packageDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pkgKey = button.dataset.package || (button.closest(".tour-card") && button.closest(".tour-card").dataset.package);
      if (pkgKey) openPackageModal(pkgKey);
    });
  });
}

if (choosePlanButtons.length) {
  choosePlanButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pkgKey = btn.dataset.package || (btn.closest(".tour-card") && btn.closest(".tour-card").dataset.package);
      if (pkgKey) selectPackageAndScroll(pkgKey);
    });
  });
}

if (packageClose) packageClose.addEventListener("click", closePackageModal);
if (packageModalCloseBtn) packageModalCloseBtn.addEventListener("click", closePackageModal);

if (packageModalBookBtn) {
  packageModalBookBtn.addEventListener("click", () => {
    selectPackageAndScroll(currentModalPackageKey);
  });
}

if (packageModal) {
  packageModal.addEventListener("click", (e) => {
    if (e.target === packageModal) closePackageModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && packageModal.classList.contains("open")) closePackageModal();
  });
}

// ── 8. Live Currency Converter ──
const currencySourceVal = document.getElementById("currency-source-val");
const currencySourceSelect = document.getElementById("currency-source-select");
const currencyTargetSelect = document.getElementById("currency-target-select");
const currencyOutputVal = document.getElementById("currency-output-val");
const currencySwap = document.getElementById("currency-swap");
const currencyRateText = document.getElementById("currency-rate");

let exchangeRates = {
  USD: 1.0,
  GHS: 15.65,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
};

function convertCurrency() {
  if (!currencySourceVal || !currencyOutputVal || !currencySourceSelect || !currencyTargetSelect) return;

  const amount = parseFloat(currencySourceVal.value) || 0;
  const source = currencySourceSelect.value;
  const target = currencyTargetSelect.value;

  const sourceInUSD = amount / (exchangeRates[source] || 1);
  const result = sourceInUSD * (exchangeRates[target] || 1);

  currencyOutputVal.textContent = result.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currencyRateText) {
    const oneSourceInTarget = (1 / (exchangeRates[source] || 1)) * (exchangeRates[target] || 1);
    currencyRateText.textContent = `1 ${source} ≈ ${oneSourceInTarget.toFixed(2)} ${target}`;
  }
}

fetch("https://open.er-api.com/v6/latest/USD")
  .then((res) => res.json())
  .then((data) => {
    if (data && data.rates) {
      if (data.rates.GHS) exchangeRates.GHS = data.rates.GHS;
      if (data.rates.EUR) exchangeRates.EUR = data.rates.EUR;
      if (data.rates.GBP) exchangeRates.GBP = data.rates.GBP;
      if (data.rates.CAD) exchangeRates.CAD = data.rates.CAD;
    }
    convertCurrency();
  })
  .catch(() => {
    convertCurrency();
  });

if (currencySourceVal && currencySourceSelect && currencyTargetSelect) {
  currencySourceVal.addEventListener("input", convertCurrency);
  currencySourceSelect.addEventListener("change", convertCurrency);
  currencyTargetSelect.addEventListener("change", convertCurrency);
}

if (currencySwap) {
  currencySwap.addEventListener("click", () => {
    const temp = currencySourceSelect.value;
    currencySourceSelect.value = currencyTargetSelect.value;
    currencyTargetSelect.value = temp;
    convertCurrency();
  });
}

// ── 9. FAQ Accordion ──
const faqEntries = document.querySelectorAll(".faq-entry");

if (faqEntries.length) {
  faqEntries.forEach((entry) => {
    const header = entry.querySelector(".faq-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isOpen = entry.classList.contains("open");

      faqEntries.forEach((e) => {
        e.classList.remove("open");
        const btn = e.querySelector(".faq-header");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        entry.classList.add("open");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ── 10. Booking Form & Confirmation Voucher Modal ──
const bookingForm = document.getElementById("booking-form");
const voucherModal = document.getElementById("booking-voucher-modal");
const voucherCloseBtn = document.getElementById("voucher-close-btn");
const voucherRef = document.getElementById("voucher-ref");
const voucherGuestName = document.getElementById("voucher-guest-name");
const voucherTourName = document.getElementById("voucher-tour-name");
const voucherTravelersCount = document.getElementById("voucher-travelers-count");
const voucherWhatsappLink = document.getElementById("voucher-whatsapp-link");

function openBookingVoucher(data) {
  if (!voucherModal) return;

  const randNum = Math.floor(1000 + Math.random() * 9000);
  const refCode = `KEL-GH-${randNum}`;

  if (voucherRef) voucherRef.textContent = refCode;
  if (voucherGuestName) voucherGuestName.textContent = data.name;
  if (voucherTourName) voucherTourName.textContent = data.tour;
  if (voucherTravelersCount) voucherTravelersCount.textContent = `${data.travelers} Guest${data.travelers > 1 ? "s" : ""}`;

  if (voucherWhatsappLink) {
    const waMsg = encodeURIComponent(`Hello Kelrose Tours! I submitted tour inquiry #${refCode} for ${data.name} (${data.tour}, ${data.travelers} guests). Looking forward to the itinerary proposal!`);
    voucherWhatsappLink.href = `https://wa.me/233302007890?text=${waMsg}`;
  }

  voucherModal.classList.add("open");
  voucherModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeBookingVoucher() {
  if (!voucherModal) return;
  voucherModal.classList.remove("open");
  voucherModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (voucherCloseBtn) voucherCloseBtn.addEventListener("click", closeBookingVoucher);
if (voucherModal) {
  voucherModal.addEventListener("click", (e) => {
    if (e.target === voucherModal) closeBookingVoucher();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && voucherModal.classList.contains("open")) closeBookingVoucher();
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("book-name");
    const packageSelect = document.getElementById("book-package");
    const travelersInput = document.getElementById("book-travelers");

    const guestName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Valued Guest";
    const selectedTourText = packageSelect && packageSelect.selectedIndex >= 0
      ? packageSelect.options[packageSelect.selectedIndex].text
      : "Custom Private Tour";
    const travelers = travelersInput ? parseInt(travelersInput.value) || 2 : 2;

    openBookingVoucher({
      name: guestName,
      tour: selectedTourText,
      travelers: travelers,
    });

    bookingForm.reset();
  });
}

// ── Initialize on load ──
document.addEventListener("DOMContentLoaded", () => {
  selectMapRegion("accra");
  convertCurrency();
});
