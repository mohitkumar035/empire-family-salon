(() => {
  'use strict';

  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const year = document.querySelector('#year');
  const revealItems = document.querySelectorAll('.reveal');
  const bookingModal = document.querySelector('#booking-modal');
  const bookingForm = document.querySelector('#booking-form');
  const bookingService = document.querySelector('#booking-service');
  const formSuccess = document.querySelector('#form-success');
  const successName = document.querySelector('#success-name');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let galleryIndex = 0;

  if (year) year.textContent = new Date().getFullYear();

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 35);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.classList.remove('is-open');
    primaryNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('is-open');
    primaryNav?.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  primaryNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
    observer.observe(item);
  });

  document.querySelectorAll('.filter-button').forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
      const filter = filterButton.dataset.filter;
      document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('is-active', button === filterButton));
      document.querySelectorAll('.service-card').forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  const openBooking = (serviceName = '') => {
    if (!bookingModal) return;
    if (bookingForm) bookingForm.hidden = false;
    if (formSuccess) formSuccess.hidden = true;
    if (bookingService && serviceName) bookingService.value = serviceName;
    bookingModal.classList.add('is-open');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    bookingModal.querySelector('input')?.focus();
  };
  const closeBooking = () => {
    if (!bookingModal) return;
    bookingModal.classList.remove('is-open');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-open-booking]').forEach((button) => button.addEventListener('click', () => openBooking()));
  document.querySelectorAll('.service-book').forEach((button) => button.addEventListener('click', () => openBooking(button.dataset.bookService)));
  document.querySelectorAll('[data-close-booking]').forEach((button) => button.addEventListener('click', closeBooking));
  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = bookingForm.elements.name.value.trim();
    if (successName) successName.textContent = name.split(' ')[0] || 'there';
    bookingForm.hidden = true;
    if (formSuccess) formSuccess.hidden = false;
  });

  const showGalleryImage = (index) => {
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    if (!item || !lightboxImage) return;
    lightboxImage.src = item.dataset.gallerySrc;
    lightboxImage.alt = item.dataset.galleryAlt || '';
    if (lightboxCaption) lightboxCaption.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${item.dataset.galleryAlt || 'Empire gallery'}`;
  };
  const openLightbox = (index) => {
    showGalleryImage(index);
    lightbox?.classList.add('is-open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };
  galleryItems.forEach((item) => item.addEventListener('click', () => openLightbox(Number(item.dataset.galleryIndex))));
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  document.querySelector('.lightbox-next')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));

  const today = new Date().getDay();
  const todayRow = document.querySelector(`.hours-list [data-day="${today}"]`);
  todayRow?.classList.add('is-today');
  const todayNote = document.querySelector('#today-note');
  if (todayNote) todayNote.textContent = `Today · ${todayRow?.querySelector('strong')?.textContent || '9:00 AM — 11:30 PM'}`;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      closeBooking();
      closeMenu();
    }
    if (lightbox?.classList.contains('is-open') && event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
    if (lightbox?.classList.contains('is-open') && event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
  });
})();