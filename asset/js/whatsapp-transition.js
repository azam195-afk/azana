(function () {
  const overlayId = 'wa-loading-overlay';
  const modalId = 'wa-order-modal';
  const styleId = 'wa-order-modal-style';
  const redirectDelay = 2000;
  const serviceOptions = [
    'Penjernih Foto',
    'Hapus Background',
    'Magic Eraser',
    'Video Editing',
    'Desain Grafis',
  ];

  let activeLink = null;

  function createOverlay() {
    injectModalStyles();

    let overlay = document.getElementById(overlayId);
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.className = 'wa-loading-overlay';
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
            <div class="wa-loading-card" role="status">
                <div class="wa-loading-ring">
                    <i class="fab fa-whatsapp"></i>
                </div>
                <p class="wa-loading-title">Menghubungkan ke WhatsApp Azana...</p>
                <p class="wa-loading-subtitle">Tunggu sebentar, admin siap bantu pesanan kamu.</p>
                <div class="wa-loading-bar"><span></span></div>
            </div>
        `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function injectModalStyles() {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
            .wa-loading-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                background:
                    radial-gradient(circle at 30% 20%, rgba(0, 242, 254, 0.22), transparent 30%),
                    radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.24), transparent 35%),
                    rgba(5, 5, 8, 0.86);
                backdrop-filter: blur(18px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.28s ease;
            }
            .wa-loading-overlay.is-visible {
                opacity: 1;
                pointer-events: auto;
            }
            .wa-loading-card {
                width: min(92vw, 360px);
                border: 1px solid rgba(255, 255, 255, 0.14);
                border-radius: 1.5rem;
                padding: 2rem 1.5rem;
                text-align: center;
                color: #fff;
                background: linear-gradient(145deg, rgba(19, 19, 26, 0.92), rgba(5, 5, 8, 0.94));
                box-shadow: 0 0 40px rgba(0, 242, 254, 0.18), 0 0 70px rgba(168, 85, 247, 0.14);
                transform: translateY(12px) scale(0.98);
                transition: transform 0.28s ease;
            }
            .wa-loading-overlay.is-visible .wa-loading-card {
                transform: translateY(0) scale(1);
            }
            .wa-loading-ring {
                width: 76px;
                height: 76px;
                margin: 0 auto 1rem;
                display: grid;
                place-items: center;
                border-radius: 999px;
                color: #25D366;
                font-size: 2.2rem;
                background: rgba(37, 211, 102, 0.1);
                border: 1px solid rgba(37, 211, 102, 0.28);
                box-shadow: 0 0 26px rgba(37, 211, 102, 0.25);
                position: relative;
            }
            .wa-loading-ring::before {
                content: '';
                position: absolute;
                inset: -7px;
                border-radius: inherit;
                border: 2px solid transparent;
                border-top-color: #00f2fe;
                border-right-color: #a855f7;
                animation: wa-spin 1s linear infinite;
            }
            .wa-loading-title {
                font-size: 0.95rem;
                font-weight: 800;
                letter-spacing: 0.02em;
            }
            .wa-loading-subtitle {
                margin-top: 0.5rem;
                font-size: 0.72rem;
                color: #94a3b8;
                line-height: 1.55;
            }
            .wa-loading-bar {
                width: 100%;
                height: 4px;
                margin-top: 1.25rem;
                overflow: hidden;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.1);
            }
            .wa-loading-bar span {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #00f2fe, #25D366, #a855f7);
                transform-origin: left;
                animation: wa-progress 2s ease forwards;
            }
            body.wa-loading-active {
                overflow: hidden;
            }
            @keyframes wa-spin {
                to { transform: rotate(360deg); }
            }
            @keyframes wa-progress {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
            }
            .wa-order-modal {
                position: fixed;
                inset: 0;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.25rem;
                background:
                    radial-gradient(circle at 20% 20%, rgba(0, 242, 254, 0.24), transparent 28%),
                    radial-gradient(circle at 80% 85%, rgba(168, 85, 247, 0.26), transparent 34%),
                    rgba(5, 5, 8, 0.78);
                backdrop-filter: blur(18px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.25s ease;
            }
            .wa-order-modal.is-visible {
                opacity: 1;
                pointer-events: auto;
            }
            .wa-order-panel {
                width: min(94vw, 440px);
                color: #f8fafc;
                border: 1px solid rgba(0, 242, 254, 0.35);
                border-radius: 1.75rem;
                background:
                    linear-gradient(145deg, rgba(19, 19, 26, 0.96), rgba(5, 5, 8, 0.96)) padding-box,
                    linear-gradient(135deg, rgba(0, 242, 254, 0.65), rgba(168, 85, 247, 0.65)) border-box;
                box-shadow:
                    0 0 42px rgba(0, 242, 254, 0.18),
                    0 0 72px rgba(168, 85, 247, 0.16);
                padding: 1.4rem;
                transform: translateY(14px) scale(0.98);
                transition: transform 0.25s ease;
            }
            .wa-order-modal.is-visible .wa-order-panel {
                transform: translateY(0) scale(1);
            }
            .wa-order-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            .wa-order-kicker {
                margin: 0 0 0.3rem;
                color: #00f2fe;
                font-size: 0.66rem;
                font-weight: 800;
                letter-spacing: 0.24em;
                text-transform: uppercase;
            }
            .wa-order-title {
                margin: 0;
                font-size: 1.28rem;
                font-weight: 900;
                line-height: 1.15;
                text-transform: uppercase;
            }
            .wa-order-subtitle {
                margin: 0.55rem 0 0;
                color: #94a3b8;
                font-size: 0.78rem;
                line-height: 1.55;
            }
            .wa-order-close {
                width: 2.4rem;
                height: 2.4rem;
                flex: 0 0 auto;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 0.9rem;
                color: #cbd5e1;
                background: rgba(255, 255, 255, 0.05);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .wa-order-close:hover {
                color: #050508;
                background: #00f2fe;
                box-shadow: 0 0 18px rgba(0, 242, 254, 0.3);
            }
            .wa-order-form {
                display: grid;
                gap: 0.85rem;
            }
            .wa-order-field label {
                display: block;
                margin-bottom: 0.38rem;
                color: #e2e8f0;
                font-size: 0.7rem;
                font-weight: 800;
                letter-spacing: 0.12em;
                text-transform: uppercase;
            }
            .wa-order-field input,
            .wa-order-field select,
            .wa-order-field textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 1rem;
                color: #fff;
                background: rgba(10, 10, 15, 0.78);
                outline: none;
                padding: 0.85rem 0.95rem;
                font: inherit;
                font-size: 0.88rem;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .wa-order-field select option {
                background: #0a0a0f;
                color: #fff;
            }
            .wa-order-field textarea {
                min-height: 110px;
                resize: vertical;
            }
            .wa-order-field input:focus,
            .wa-order-field select:focus,
            .wa-order-field textarea:focus {
                border-color: rgba(0, 242, 254, 0.7);
                box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.12), 0 0 22px rgba(168, 85, 247, 0.12);
            }
            .wa-order-submit {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.55rem;
                width: 100%;
                margin-top: 0.35rem;
                border: 0;
                border-radius: 1rem;
                color: #050508;
                background: linear-gradient(90deg, #00f2fe, #25D366, #a855f7);
                padding: 0.95rem 1rem;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                cursor: pointer;
                box-shadow: 0 0 24px rgba(0, 242, 254, 0.22);
                transition: transform 0.2s ease, filter 0.2s ease;
            }
            .wa-order-submit:hover {
                filter: brightness(1.08);
                transform: translateY(-1px);
            }
            body.wa-modal-active {
                overflow: hidden;
            }
        `;

    document.head.appendChild(style);
  }

  function createOrderModal() {
    let modal = document.getElementById(modalId);
    if (modal) return modal;

    injectModalStyles();

    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'wa-order-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
            <div class="wa-order-panel" role="dialog" aria-modal="true" aria-labelledby="wa-order-title">
                <div class="wa-order-header">
                    <div>
                        <p class="wa-order-kicker">Form Order Pintar</p>
                        <h2 id="wa-order-title" class="wa-order-title">Brief Pesanan Azana</h2>
                        <p class="wa-order-subtitle">Isi detail singkat dulu, nanti pesan WhatsApp otomatis tersusun rapi buat admin.</p>
                    </div>
                    <button class="wa-order-close" type="button" aria-label="Tutup form order">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                <form class="wa-order-form">
                    <div class="wa-order-field">
                        <label for="wa-order-name">Nama</label>
                        <input id="wa-order-name" name="name" type="text" autocomplete="name" placeholder="Nama kamu" required>
                    </div>
                    <div class="wa-order-field">
                        <label for="wa-order-service">Jenis Layanan</label>
                        <select id="wa-order-service" name="service" required>
                            <option value="" disabled selected>Pilih layanan</option>
                            ${serviceOptions.map(service => `<option value="${service}">${service}</option>`).join('')}
                        </select>
                    </div>
                    <div class="wa-order-field">
                        <label for="wa-order-message">Pesan/Request Singkat</label>
                        <textarea id="wa-order-message" name="message" placeholder="Contoh: foto mau dijernihkan dan warna dibuat lebih cerah." required></textarea>
                    </div>
                    <button class="wa-order-submit" type="submit">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i>
                        Kirim ke WhatsApp
                    </button>
                </form>
            </div>
        `;

    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeOrderModal();
    });

    modal.querySelector('.wa-order-close').addEventListener('click', closeOrderModal);
    modal.querySelector('form').addEventListener('submit', handleOrderSubmit);
    document.body.appendChild(modal);
    return modal;
  }

  function showOverlay() {
    const overlay = createOverlay();
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.classList.add('wa-loading-active');
  }

  function openOrderModal(link) {
    activeLink = link;
    const modal = createOrderModal();
    const form = modal.querySelector('form');
    form.reset();
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-visible');
    document.body.classList.add('wa-modal-active');
    window.setTimeout(() => modal.querySelector('#wa-order-name')?.focus(), 80);
  }

  function closeOrderModal() {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('wa-modal-active');
  }

  function buildOrderMessage(form) {
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();

    return `Halo Azana! Nama saya ${name}, saya ingin pesan ${service}. Detail: ${message}`;
  }

  function buildWhatsAppUrl(link, message) {
    const href = link.getAttribute('href') || '';
    const url = new URL(href, window.location.href);
    url.searchParams.set('text', message);
    return url.toString();
  }

  function redirectToWhatsApp(link, message) {
    const targetUrl = buildWhatsAppUrl(link, message);
    const shouldOpenNewTab = link.target === '_blank';

    window.setTimeout(() => {
      if (shouldOpenNewTab) {
        window.open(targetUrl, '_blank', 'noopener');
        document.getElementById(overlayId)?.classList.remove('is-visible');
        document.getElementById(overlayId)?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('wa-loading-active');
        return;
      }

      window.location.href = targetUrl;
    }, redirectDelay);
  }

  function handleOrderSubmit(event) {
    event.preventDefault();
    if (!activeLink) return;

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const orderMessage = buildOrderMessage(form);
    const link = activeLink;
    closeOrderModal();
    showOverlay();
    redirectToWhatsApp(link, orderMessage);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeOrderModal();
  });

  document.addEventListener('click', function (event) {
    const link = event.target.closest('[data-wa-transition]');
    if (!link) return;

    event.preventDefault();
    openOrderModal(link);
  });
}());
