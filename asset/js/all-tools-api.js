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

    // Mengubah link embed Instagram kembali menjadi link postingan asli
    let targetUrl = fileUrl;
    if (targetUrl.includes('/embed')) {
        targetUrl = targetUrl.replace(/\/embed\/?$/, '');
    }

    const originalContent = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Menyiapkan Unduhan...`;

    try {
        // Menggunakan layanan downloader instan publik berbasis web secara otomatis 
        // agar browser langsung mendownload file mentahnya ke HP lu
        const directDownloadLink = `https://co.wuk.sh/api/json`;
        
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(directDownloadLink)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: targetUrl, vQuality: "max" })
        });
        
        const data = await response.json();
        const finalMediaUrl = data.url || data.picker?.[0]?.url || targetUrl;

        // Eksekusi download file
        const res = await fetch(finalMediaUrl);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = 'instagram_video.mp4';
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    } catch (err) {
        // Fallback darurat jika ada kendala jaringan, arahkan ke tab unduh langsung
        window.open(`https://saveig.app/en?url=${encodeURIComponent(targetUrl)}`, '_blank');
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
