// script.js – TechLanka Laptops
// Production-ready, minified mindset. 
// Features: Search, Filter by price, Sort by price, Contact form handler, Mobile menu toggle.
// Lazy loading already in HTML, this adds dynamic filtering/sorting.

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ---------- GLOBAL: Mobile Menu Toggle (simple) ----------
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      mainNav.classList.toggle('active');
    });
  }

  // ---------- FILTER & SORT (only on pages with laptop grid & toolbar) ----------
  const laptopGrid = document.getElementById('laptopGrid');
  if (laptopGrid) {
    const searchInput = document.getElementById('searchInput');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const sortSelect = document.getElementById('sortSelect');

    // Get all cards as array
    let cards = Array.from(document.querySelectorAll('.laptop-card'));

    // ---------- RENDER FUNCTION (filter + sort) ----------
    function renderLaptops() {
      // 1. Filter by search term (case-insensitive, name attribute)
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
        // default: restore original order (based on initial array order)
        filtered.sort((a, b) => cards.indexOf(a) - cards.indexOf(b));
      }

      // 4. Reorder DOM
      laptopGrid.innerHTML = '';
      filtered.forEach(card => laptopGrid.appendChild(card));
    }

    // Attach event listeners if elements exist
    if (searchInput) searchInput.addEventListener('input', renderLaptops);
    if (minPrice) minPrice.addEventListener('input', renderLaptops);
    if (maxPrice) maxPrice.addEventListener('input', renderLaptops);
    if (sortSelect) sortSelect.addEventListener('change', renderLaptops);

    // Initial render (ensures default order)
    renderLaptops();
  }

  // ---------- CONTACT FORM HANDLER (prevent default, show success) ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Simulate form submission – In production, use fetch or similar
      alert('Thank you for contacting TechLanka! We will reply within 24 hours.');
      contactForm.reset();
    });
  }

  // ---------- ADD LAZY LOADING TO ANY IMAGES MISSING ATTRIBUTE (fallback) ----------
  const allImages = document.querySelectorAll('img:not([loading])');
  allImages.forEach(img => img.setAttribute('loading', 'lazy'));

  // ---------- ENSURE ALL PRICES DISPLAY IN LKR FORMAT (already hardcoded, but data attribute is raw) ----------
  // Optional: format numbers with commas – but we keep as is, already done in static HTML.
  // Consistency: can reformat if needed.
});