(function () {
  const CLIPDROP_API_KEY = window.AZANA_API_KEYS?.CLIPDROP || localStorage.getItem('AZANA_CLIPDROP_API_KEY') || '';

  const ENDPOINTS = {
    sketch: 'https://clipdrop-api.co/sketch-to-image/v1',
    style: 'https://clipdrop-api.co/reimagine/v1',
    relight: 'https://clipdrop-api.co/relight/v1'
  };

  const STYLE_PROMPTS = {
    cartoon: 'Transform this photo into a clean cartoon illustration style, vibrant colors, smooth vector look, keep the original subject identity.',
    anime: 'Transform this photo into a polished anime style portrait, expressive eyes, clean line art, cinematic colors, keep the original composition.',
    cyberpunk: 'Transform this photo into a cyberpunk style image, neon magenta and cyan lights, futuristic atmosphere, high detail.',
    render3d: 'Transform this photo into a premium 3D render style, soft studio lighting, detailed textures, modern CGI look.'
  };

  const RELIGHT_PRESETS = {
    front: {
      label: 'Front Flash',
      prompt: 'Clean white front flash studio lighting, bright editorial look.',
      lights: [{ x: 0, y: 0, z: 1.6, color: '#ffffff', intensity: 1.25 }]
    },
    neon: {
      label: 'Neon Side',
      prompt: 'Cinematic neon side lighting with blue and red glow, moody cyber studio look.',
      lights: [
        { x: -1.2, y: 0.2, z: 0.8, color: '#00f2fe', intensity: 1.1 },
        { x: 1.2, y: 0.1, z: 0.8, color: '#ff2d95', intensity: 1.05 }
      ]
    },
    golden: {
      label: 'Golden Hour',
      prompt: 'Warm golden hour sunlight from the upper corner, soft cinematic shadows.',
      lights: [{ x: -0.65, y: -0.85, z: 1.35, color: '#ffb347', intensity: 1.15 }]
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function initFooter() {
    const footer = $('#footer');
    if (!footer) return;
    fetch(footer.dataset.src || 'components/footer-ai.html')
      .then((response) => response.text())
      .then((html) => { footer.innerHTML = html; })
      .catch(() => { footer.innerHTML = ''; });
  }

  function initNeuralBackground() {
    const canvas = $('#neural-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#00f2fe', '#bc13fe'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() * 0.5) - 0.25;
        this.speedY = (Math.random() * 0.5) - 0.25;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      let total = (canvas.width * canvas.height) / 9500;
      if (total > 130) total = 130;
      for (let i = 0; i < total; i += 1) particles.push(new Particle());
    }

    function connect() {
      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a; b < particles.length; b += 1) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = (dx * dx) + (dy * dy);
          if (distance < 9000) {
            ctx.strokeStyle = `rgba(0, 242, 254, ${1 - distance / 9000})`;
            ctx.lineWidth = 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connect();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
  }

  function blobFromCanvas(canvas, type = 'image/png', quality = 0.95) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Gagal menyiapkan gambar dari canvas.'));
      }, type, quality);
    });
  }

  async function readError(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json().catch(() => ({}));
      return data.error || data.message || `Request gagal (${response.status}).`;
    }
    const text = await response.text().catch(() => '');
    return text || `Request gagal (${response.status}).`;
  }

  async function callClipdrop(endpoint, formData, extraHeaders = {}) {
    if (!CLIPDROP_API_KEY) throw new Error('API key Clipdrop belum dikonfigurasi oleh admin.');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': CLIPDROP_API_KEY,
        accept: 'image/png',
        ...extraHeaders
      },
      body: formData
    });
    if (!response.ok) throw new Error(await readError(response));
    return response.blob();
  }

  function setStatus(message, type = 'info') {
    const status = $('#tool-status');
    if (!status) return;
    const color = type === 'error' ? 'text-red-300' : type === 'success' ? 'text-neon-cyan' : 'text-slate-400';
    status.className = `min-h-[1.25rem] text-[10px] uppercase tracking-[0.2em] ${color}`;
    status.textContent = message;
  }

  function showResult(blob, filename) {
    const resultArea = $('#result-area');
    const resultImage = $('#result-image');
    const download = $('#btn-download');
    const url = URL.createObjectURL(blob);
    resultImage.src = url;
    download.href = url;
    download.download = filename;
    resultArea.classList.remove('hidden');
    resultArea.classList.add('flex');
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setStatus('Selesai. Gambar siap diunduh.', 'success');
  }

  function setBusy(button, busyText, defaultText, isBusy) {
    if (!button) return;
    button.disabled = isBusy;
    button.innerHTML = isBusy ? `<i class="fas fa-spinner fa-spin mr-2"></i>${busyText}` : defaultText;
  }

  function previewFile(input, imageSelector, labelSelector) {
    const file = input.files?.[0];
    if (!file) return null;
    const image = $(imageSelector);
    const label = $(labelSelector);
    if (image) {
      image.src = URL.createObjectURL(file);
      image.classList.remove('hidden');
    }
    if (label) label.textContent = file.name;
    return file;
  }

  function initUploadTool(tool) {
    const upload = $('#image-upload');
    const process = $('#btn-process');
    const defaultText = process?.innerHTML || '';
    let selectedFile = null;
    let selectedStyle = 'cartoon';
    let selectedLight = 'front';

    if (!upload || !process) return;

    upload.addEventListener('change', () => {
      selectedFile = previewFile(upload, '#preview-image', '#upload-label');
      setStatus(selectedFile ? 'Foto berhasil dimuat. Pilih efek lalu proses.' : '');
    });

    $$('.choice-btn').forEach((button) => {
      button.addEventListener('click', () => {
        $$('.choice-btn').forEach((item) => item.classList.remove('active-choice'));
        button.classList.add('active-choice');
        selectedStyle = button.dataset.style || selectedStyle;
        selectedLight = button.dataset.light || selectedLight;
        if (tool === 'relight' && RELIGHT_PRESETS[selectedLight]) {
          const lights = RELIGHT_PRESETS[selectedLight].lights.map((light) => `${light.color} x:${light.x} y:${light.y} z:${light.z}`).join(' | ');
          setStatus(`${RELIGHT_PRESETS[selectedLight].label}: ${lights}`);
        }
      });
    });

    process.addEventListener('click', async () => {
      if (!selectedFile) {
        setStatus('Upload foto terlebih dahulu.', 'error');
        return;
      }
      setBusy(process, 'MEMPROSES...', defaultText, true);
      setStatus('Mengirim gambar ke Clipdrop...');
      try {
        const formData = new FormData();
        formData.append('image_file', selectedFile);

        if (tool === 'style') {
          const prompt = STYLE_PROMPTS[selectedStyle] || STYLE_PROMPTS.cartoon;
          formData.append('prompt', prompt);
          formData.append('style', selectedStyle);
          const blob = await callClipdrop(ENDPOINTS.style, formData);
          showResult(blob, `azana-${selectedStyle}.png`);
        }

        if (tool === 'relight') {
          const preset = RELIGHT_PRESETS[selectedLight] || RELIGHT_PRESETS.front;
          formData.append('prompt', preset.prompt);
          formData.append('lights', JSON.stringify(preset.lights));
          preset.lights.forEach((light, index) => {
            formData.append(`light_${index}_x`, String(light.x));
            formData.append(`light_${index}_y`, String(light.y));
            formData.append(`light_${index}_z`, String(light.z));
            formData.append(`light_${index}_color`, light.color);
            formData.append(`light_${index}_intensity`, String(light.intensity));
          });
          const blob = await callClipdrop(ENDPOINTS.relight, formData);
          showResult(blob, `azana-relight-${selectedLight}.png`);
        }
      } catch (error) {
        setStatus(error.message, 'error');
      } finally {
        setBusy(process, 'MEMPROSES...', defaultText, false);
      }
    });
  }

  function initSketchTool() {
    const sketchCanvas = $('#sketch-canvas');
    const upload = $('#sketch-upload');
    const promptInput = $('#prompt-input');
    const clear = $('#btn-clear');
    const process = $('#btn-process');
    if (!sketchCanvas || !process) return;

    const ctx = sketchCanvas.getContext('2d');
    const defaultText = process.innerHTML;
    let isDrawing = false;
    let brushSize = 7;

    function resetCanvas() {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, sketchCanvas.width, sketchCanvas.height);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setStatus('Canvas siap. Buat sketsa atau upload gambar sketsa.');
    }

    function point(event) {
      const rect = sketchCanvas.getBoundingClientRect();
      const source = event.touches?.[0] || event;
      return {
        x: (source.clientX - rect.left) * (sketchCanvas.width / rect.width),
        y: (source.clientY - rect.top) * (sketchCanvas.height / rect.height)
      };
    }

    function start(event) {
      event.preventDefault();
      isDrawing = true;
      const pos = point(event);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(event) {
      if (!isDrawing) return;
      event.preventDefault();
      const pos = point(event);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function end() {
      isDrawing = false;
    }

    sketchCanvas.addEventListener('mousedown', start);
    sketchCanvas.addEventListener('mousemove', draw);
    sketchCanvas.addEventListener('mouseup', end);
    sketchCanvas.addEventListener('mouseleave', end);
    sketchCanvas.addEventListener('touchstart', start, { passive: false });
    sketchCanvas.addEventListener('touchmove', draw, { passive: false });
    sketchCanvas.addEventListener('touchend', end, { passive: false });

    $$('.brush-btn').forEach((button) => {
      button.addEventListener('click', () => {
        brushSize = Number(button.dataset.size || 7);
        ctx.lineWidth = brushSize;
        $$('.brush-btn').forEach((item) => item.classList.remove('active-choice'));
        button.classList.add('active-choice');
      });
    });

    clear?.addEventListener('click', resetCanvas);

    upload?.addEventListener('change', () => {
      const file = upload.files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        resetCanvas();
        const ratio = Math.min(sketchCanvas.width / img.width, sketchCanvas.height / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        const x = (sketchCanvas.width - width) / 2;
        const y = (sketchCanvas.height - height) / 2;
        ctx.drawImage(img, x, y, width, height);
        setStatus('Sketsa upload berhasil dimuat. Tambahkan prompt lalu proses.');
      };
      img.src = URL.createObjectURL(file);
    });

    process.addEventListener('click', async () => {
      const prompt = promptInput?.value.trim() || '';
      if (prompt.length < 3) {
        setStatus('Isi Prompt Deskripsi minimal 3 karakter.', 'error');
        return;
      }
      setBusy(process, 'MEMBUAT GAMBAR...', defaultText, true);
      setStatus('Mengirim sketsa ke Clipdrop...');
      try {
        const sketchBlob = await blobFromCanvas(sketchCanvas, 'image/png');
        const formData = new FormData();
        formData.append('image_file', sketchBlob, 'azana-sketch.png');
        formData.append('prompt', prompt);
        const blob = await callClipdrop(ENDPOINTS.sketch, formData);
        showResult(blob, 'azana-sketch-to-image.png');
      } catch (error) {
        setStatus(error.message, 'error');
      } finally {
        setBusy(process, 'MEMBUAT GAMBAR...', defaultText, false);
      }
    });

    resetCanvas();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFooter();
    initNeuralBackground();
    const page = document.body.dataset.tool;
    if (page === 'sketch') initSketchTool();
    if (page === 'style' || page === 'relight') initUploadTool(page);
  });
}());
