(function () {
    const overlayId = 'wa-loading-overlay';
    const redirectDelay = 2000;

    function createOverlay() {
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

    function showOverlay() {
        const overlay = createOverlay();
        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('is-visible');
        document.body.classList.add('wa-loading-active');
    }

    function redirectToWhatsApp(link) {
        const targetUrl = link.href;
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

    document.addEventListener('click', function (event) {
        const link = event.target.closest('[data-wa-transition]');
        if (!link) return;

        event.preventDefault();
        showOverlay();
        redirectToWhatsApp(link);
    });
}());
