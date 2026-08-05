const TIKTOK_API_KEY = ""; 
const IG_API_KEY = "";     
const YT_API_KEY = "";     
const SPOTIFY_API_KEY = ""; 

async function downloadTikTok(url) {
    if (!url) {
        throw new Error("URL TikTok tidak boleh kosong!");
    }
    
    try {
        // Membersihkan dan memastikan URL terpampang valid untuk di-fetch
        const cleanUrl = url.trim();
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`;
        
        const response = await fetch(apiUrl);
        const resJson = await response.json();

        if (resJson.code === 0 && resJson.data) {
            const data = resJson.data;
            return {
                status: "success",
                platform: "tiktok",
                url: cleanUrl,
                title: data.title || "Video TikTok Tanpa Watermark",
                author: data.author?.nickname || "Creator",
                video_hd: data.hdplay || data.play, 
                audio_mp3: data.music
            };
        } else {
            throw new Error(resJson.msg || "Gagal mengambil data dari server TikTok.");
        }
    } catch (error) {
        console.error("Error TikTok API:", error);
        return { status: "error", message: error.message };
    }
}

async function downloadMedia(fileUrl, filename, buttonElement) {
    if (!fileUrl) {
        alert("Link unduhan tidak tersedia!");
        return;
    }

    // Mengubah link embed Instagram menjadi link halaman asli, lalu arahkan 
    // agar browser mendownload/menyimpan kontennya langsung
    let targetDownloadUrl = fileUrl;
    if (fileUrl.includes('/embed')) {
        targetDownloadUrl = fileUrl.replace(/\/embed\/?$/, '');
    }

    const originalContent = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Menyiapkan Unduhan...`;

    try {
        // Memaksa download menggunakan elemen anchor HTML5 attribute download
        const a = document.createElement('a');
        a.href = targetDownloadUrl;
        a.target = '_blank';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (err) {
        window.open(targetDownloadUrl, '_blank');
    } finally {
        setTimeout(() => {
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalContent;
        }, 2000);
    }
}

async function downloadYouTube(url) { return { url, status: "pending" }; }
async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
