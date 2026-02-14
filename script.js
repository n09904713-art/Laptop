// script.js – TechLanka Laptops (with dynamic admin additions)
// Features: Search, Filter by price, Sort, Dynamic laptop loading from localStorage, Mobile menu, Contact form.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ---------- MOBILE MENU TOGGLE ----------
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      mainNav.classList.toggle('active');
    });
  }

  // ---------- LOAD DYNAMIC LAPTOPS FROM LOCALSTORAGE ----------
  function loadDynamicLaptops() {
    // Determine current page category based on URL
    const path = window.location.pathname;
    let category = null;
    if (path.includes('gaming-laptops')) category = 'gaming';
    else if (path.includes('student-laptops')) category = 'student';
    else if (path.includes('business-laptops')) category = 'business';
    // For index.html (home), we show all categories? The home page currently shows a mix.
    // We'll decide to show all dynamic laptops on home page.
    // Home page has no category filter, so we'll show all.

    const laptops = JSON.parse(localStorage.getItem('techlanka_laptops')) || [];
    if (laptops.length === 0) return;

    // Filter by category if not home
    let filtered = laptops;
    if (category && path !== '/' && !path.includes('index')) {
      filtered = laptops.filter(lap => lap.category === category);
    }

    // Get the laptop grid
    const grid = document.getElementById('laptopGrid');
    if (!grid) return;

    // For each filtered laptop, create a card and append
    filtered.forEach(lap => {
      const card = createLaptopCard(lap);
      grid.appendChild(card);
    });
  }

  // Helper to create a laptop card element from laptop object
  function createLaptopCard(lap) {
    const article = document.createElement('article');
    article.className = 'laptop-card';
    article.setAttribute('data-name', lap.dataName || lap.name);
    article.setAttribute('data-price', lap.dataPrice || lap.price);

    // Build specs HTML
    const specsHTML = `
      <p><i class="fas fa-microchip"></i> ${lap.processor || 'N/A'}</p>
      <p><i class="fas fa-memory"></i> ${lap.ram || 'N/A'}</p>
      <p><i class="fas fa-database"></i> ${lap.storage || 'N/A'}</p>
      <p><i class="fas fa-tv"></i> ${lap.gpu || 'N/A'}</p>
      <p><i class="fas fa-display"></i> ${lap.display || 'N/A'}</p>
      <p><i class="fas fa-battery-three-quarters"></i> ${lap.battery || 'N/A'}</p>
    `;

    // Build star rating
    let stars = '';
    const full = Math.floor(lap.rating);
    const half = lap.rating % 1 >= 0.5 ? 1 : 0;
    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
    if (half) stars += '<i class="fas fa-star-half-alt"></i>';
    const empty = 5 - full - half;
    for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';

    article.innerHTML = `
      <div class="card-img">
        <img src="${lap.image || 'https://placehold.co/600x400/1e1e1e/3b82f6?text=Laptop'}" alt="${lap.name}" loading="lazy">
      </div>
      <div class="card-content">
        <h3>${lap.name}</h3>
        <div class="specs">
          ${specsHTML}
        </div>
        <div class="price-rating">
          <span class="price">LKR ${lap.price.toLocaleString()}</span>
          <div class="rating">${stars} ${lap.rating}</div>
        </div>
        <a href="#" class="btn-buy"><i class="fas fa-shopping-cart"></i> Buy Now</a>
      </div>
    `;
    return article;
  }

  // Load dynamic laptops immediately
  loadDynamicLaptops();

  // ---------- FILTER & SORT (dynamic version) ----------
  const laptopGrid = document.getElementById('laptopGrid');
  if (laptopGrid) {
    const searchInput = document.getElementById('searchInput');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortSelect = document.getElementById('sortSelect');

    // Get all cards (static + dynamic) each time
    function getCurrentCards() {
      return Array.from(document.querySelectorAll('.laptop-card'));
    }

    function renderLaptops() {
      let cards = getCurrentCards();

      // 1. Filter by search term
      const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
      let filtered = cards.filter(card => {
        const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
        return name.includes(searchTerm);
      });

      // 2. Filter by price range
      const minVal = minPrice ? parseFloat(minPrice.value) || 0 : 0;
      const maxVal = maxPrice ? parseFloat(maxPrice.value) || 300000 : 300000;
      filtered = filtered.filter(card => {
        const price = parseFloat(card.dataset.price) || 0;
        return price >= minVal && price <= maxVal;
      });

      // 3. Sort
      const sortBy = sortSelect ? sortSelect.value : 'default';
      if (sortBy === 'low-high') {
        filtered.sort((a, b) => (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0));
      } else if (sortBy === 'high-low') {
        filtered.sort((a, b) => (parseFloat(b.dataset.price) || 0) - (parseFloat(a.dataset.price) || 0));
      } else {
        // default: restore original order (based on initial appearance)
        // We need a way to preserve original order. Since we have static and dynamic,
        // we can rely on the current DOM order as "original" before any filter.
        // But after filtering, the order changes. To revert to default, we need to
        // re-append all cards in the original order. We'll store the original order
        // once at the beginning.
        if (!window.originalCardsOrder) {
          window.originalCardsOrder = cards.map(card => card); // clone array
        }
        filtered.sort((a, b) => window.originalCardsOrder.indexOf(a) - window.originalCardsOrder.indexOf(b));
      }

      // 4. Reorder DOM
      laptopGrid.innerHTML = '';
      filtered.forEach(card => laptopGrid.appendChild(card));
    }

    // Attach event listeners
    if (searchInput) searchInput.addEventListener('input', renderLaptops);
    if (minPrice) minPrice.addEventListener('input', renderLaptops);
    if (maxPrice) maxPrice.addEventListener('input', renderLaptops);
    if (sortSelect) sortSelect.addEventListener('change', renderLaptops);

    // Initial render (capture original order)
    window.originalCardsOrder = getCurrentCards();
    renderLaptops();
  }

  // ---------- CONTACT FORM HANDLER ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for contacting TechLanka! We will reply within 24 hours.');
      contactForm.reset();
    });
  }

  // ---------- LAZY LOADING FALLBACK ----------
  const allImages = document.querySelectorAll('img:not([loading])');
  allImages.forEach(img => img.setAttribute('loading', 'lazy'));
});