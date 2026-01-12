// Note: This file uses the "Public Anon Key". It is safe to expose in the browser
// because the database is protected by Row Level Security (RLS) policies.
// Public users can only READ videos. Only authenticated Admins can ADD/DELETE.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const fallbackVideos = [
    {
        id: "_JtW3_G4uZk",
        title: "Schnelligkeitstraining im Ring",
    },
    {
        id: "bHQqvYy5KYo",
        title: "Teamwork beim Pratzentraining",
    },
    {
        id: "VYOjWnS4cMY",
        title: "Footwork-Highlights",
    },
];

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const grid = document.querySelector("[data-media-grid]");
const emptyState = document.querySelector("[data-media-empty]");
const statusNote = document.querySelector("[data-media-status]");

const YOUTUBE_THUMB_BASE = "https://img.youtube.com/vi";

const normalizeText = (value) => (value || "").toString().trim();

const extractYouTubeId = (value) => {
    const input = normalizeText(value);
    if (!input) return "";

    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
    }

    try {
        const url = new URL(input);
        if (url.hostname === "youtu.be") {
            return url.pathname.replace("/", "").slice(0, 11);
        }
        if (url.hostname.includes("youtube.com")) {
            const videoId = url.searchParams.get("v");
            if (videoId) return videoId.slice(0, 11);
            const parts = url.pathname.split("/").filter(Boolean);
            const embedIndex = parts.indexOf("embed");
            if (embedIndex >= 0 && parts[embedIndex + 1]) {
                return parts[embedIndex + 1].slice(0, 11);
            }
        }
    } catch (error) {
        return "";
    }

    return "";
};

const buildThumbnail = (id) => `${YOUTUBE_THUMB_BASE}/${id}/hqdefault.jpg`;

const setStatus = (message = "") => {
    if (statusNote) {
        statusNote.textContent = message;
    }
};

const renderVideos = (videos) => {
    if (!grid) return;
    grid.innerHTML = "";

    if (!videos.length) {
        if (emptyState) {
            emptyState.classList.add("is-visible");
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.remove("is-visible");
    }

    videos.forEach((video) => {
        const card = document.createElement("article");
        card.className = "card media-card";
        card.dataset.videoId = video.id;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "media-thumb";
        button.setAttribute("aria-label", `Video abspielen: ${video.title}`);

        const img = document.createElement("img");
        img.src = buildThumbnail(video.id);
        img.alt = video.title;
        img.loading = "lazy";

        const overlay = document.createElement("span");
        overlay.className = "media-play";
        overlay.innerHTML = `
      <span class="media-play-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5.5L18 12L8 18.5V5.5Z" fill="currentColor" />
        </svg>
      </span>
    `;

        button.append(img, overlay);

        const meta = document.createElement("div");
        meta.className = "media-meta";
        const title = document.createElement("h3");
        title.textContent = video.title;
        meta.appendChild(title);

        card.append(button, meta);
        grid.appendChild(card);
    });
};

const buildEmbed = (videoId) => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = "YouTube Video Player";
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    return iframe;
};

const handleGridClick = (event) => {
    const button = event.target.closest(".media-thumb");
    if (!button) return;
    const card = button.closest(".media-card");
    if (!card) return;
    const videoId = card.dataset.videoId;
    if (!videoId) return;

    const embed = document.createElement("div");
    embed.className = "media-embed";
    embed.appendChild(buildEmbed(videoId));
    button.replaceWith(embed);
};

const normalizeVideoList = (rows) =>
    rows
        .map((row) => {
            const videoId = row.video_id || extractYouTubeId(row.video_url);
            if (!videoId) return null;
            return {
                id: videoId,
                title: normalizeText(row.title) || "Fightclub Highlight",
                createdAt: row.created_at,
            };
        })
        .filter(Boolean);

const fetchSupabaseVideos = async () => {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from("media_videos")
        .select("id, title, video_url, video_id, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        setStatus("Videos konnten nicht geladen werden.");
        return [];
    }

    setStatus("");
    return normalizeVideoList(data || []);
};

const loadVideos = async () => {
    let videos = [];

    if (supabase) {
        videos = await fetchSupabaseVideos();
    }

    if (!videos.length) {
        videos = fallbackVideos.map((video) => ({
            id: video.id,
            title: normalizeText(video.title) || "Fightclub Highlight",
        }));
    }

    renderVideos(videos);
};

const subscribeToVideos = () => {
    if (!supabase) return;

    supabase
        .channel("media_videos")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "media_videos" },
            () => loadVideos()
        )
        .subscribe();
};

if (grid) {
    grid.addEventListener("click", handleGridClick);
    loadVideos();
    subscribeToVideos();
}
