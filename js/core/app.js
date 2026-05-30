const componentTargets = document.querySelectorAll('[data-component]');

async function loadComponent(target) {
  const name = target.dataset.component;
  const response = await fetch(`components/${name}/${name}.html`, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Komponen ${name} tidak ditemukan.`);
  target.innerHTML = await response.text();
}

function markCurrentPage() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) link.setAttribute('aria-current', 'page');
  });
}

function setupMenu() {
  const button = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  button?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
}

function setupTheme() {
  const storedTheme = localStorage.getItem('AZANA_THEME');
  if (storedTheme) document.documentElement.dataset.theme = storedTheme;
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('AZANA_THEME', nextTheme);
  });
}

function setupPortfolio() {
  const grid = document.querySelector('[data-portfolio-grid]');
  if (!grid) return;
  const items = [
    '20240830_215126.jpg', '20240914_132128.jpg', '20241004_204521.jpg', '20250630_030802.png',
    '20250630_031054.png', '20250630_032021.png', '20250807_195307.png', '20250822_014131.png',
    '20260307_115429.png', '20260319_233158.png', '20260329_104746.png', 'Dark Purple Man Of The Match Football Sport Instagram Post_20250812_230433_0000.png', 'Green and White Traditional Wedding Banner Tarik_20260328_155820_0000.png', 'IMG_20251209_204833_372.jpg', 'Putih.png', 'White and Green Watercolor Wedding Banner Tarik_20260328_162624_0000.png'
  ];
  grid.replaceChildren(...items.map((item) => {
    const image = document.createElement('img');
    image.src = `assets/images/portfolio/${encodeURIComponent(item)}`;
    image.alt = `Portofolio desain AZANA ${item.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '')}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 360;
    image.height = 360;
    return image;
  }));
}

async function init() {
  await Promise.all([...componentTargets].map(loadComponent));
  markCurrentPage();
  setupMenu();
  setupTheme();
  setupPortfolio();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => undefined);
}

init().catch((error) => {
  const alert = document.createElement('div');
  alert.setAttribute('role', 'alert');
  alert.className = 'container card card-body';
  alert.textContent = `Gagal memuat komponen situs: ${error.message}`;
  document.body.prepend(alert);
});
