document.addEventListener('DOMContentLoaded', () => {
  // 1. Choreographed Scroll & First-Load Entrance Observer
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => revealObserver.observe(el));

  // 2. Smooth Scroll Navigation for "About Me" and "Resources" buttons
  const scrollButtons = document.querySelectorAll('.nav-scroll-btn');
  scrollButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-scroll-target');
      const targetSection = document.querySelector(targetSelector);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 3. Subtle Mouse Parallax for Floating Botanical-Tech SVGs
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  window.addEventListener(
    'mousemove',
    (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0.02;
        const moveX = deltaX * speed;
        const moveY = deltaY * speed;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    },
    { passive: true }
  );

  // 4. Touch / Keyboard Accessibility for Flip Cards
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (card.classList.contains('is-resource')) {
          e.preventDefault();
          navigateToRepoPage(card.dataset.href);
        } else {
          e.preventDefault();
          card.classList.toggle('is-flipped');
        }
      }
    });
  });
});

// 5. Resource Card Redirect Handler (Navigates to pages within GitHub repo)
let toastTimeout;
function navigateToRepoPage(url) {
  if (!url) return;

  const toast = document.getElementById('repo-toast');
  const toastMsg = document.getElementById('repo-toast-msg');

  if (toast && toastMsg) {
    if (url.startsWith('#')) {
      toastMsg.textContent = 'Template placeholder! Set data-href="./resources/your-page.html" to link a repo file.';
    } else {
      toastMsg.textContent = `Opening ${url} in your GitHub repository...`;
    }

    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2800);
  }

  // Perform actual navigation for real relative repo paths
  if (!url.startsWith('#')) {
    setTimeout(() => {
      window.location.href = url;
    }, 350);
  }
}