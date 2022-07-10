"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeSearch = exports.YouTube = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./parse");
const util_1 = require("../../lib/util");
async function YouTube(url) {
    url = url.trim();
    let videoId;
    if (url.includes("youtu.be/"))
        videoId = url.split("youtu.be/")[1].split(/(\?|\/|&)/)[0];
    else if (url.includes("youtube.com/embed/"))
        videoId = url.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0];
    else if (url.includes("youtube.com/shorts/"))
        videoId = url.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0];
    else
        videoId = (url.split("watch?v=")[1] ?? url.split("&v=")[1]).split(/(\?|\/|&)/)[0];
    if (!videoId)
        throw new Error("Given URL is not a valid YouTube URL");
    const { data: html } = await axios_1.default
        .get(`https://www.youtube.com/watch?v=${videoId}&has_verified=1`, {
        headers: {
            "accept-language": "en-US;q=0.9",
            Cookie: "",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
        },
    })
        .catch((err) => {
        throw err;
    });
    if (html.includes("Our systems have detected unusual traffic from your computer network."))
        throw new Error("YouTube detected we're a bot.. thanks youtube.");
    return (0, parse_1.MusicTrackFromYouTube)(html);
}
exports.YouTube = YouTube;
async function YouTubeSearch(query, limit = 10, type = "video") {
    let results = [];
    let url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    if (url.indexOf("&sp=") === -1) {
        url += "&sp=";
        switch (type) {
            case "playlist": {
                url += `EgIQAw%253D%253D`;
            }
            case "video": {
                url += `EgIQAQ%253D%253D`;
            }
        }
    }
    (0, util_1.debugLog)(url);
    const { data: html } = await axios_1.default
        .get(url, {
        headers: { "accept-language": "en-US;q=0.9" },
    })
        .catch((err) => {
        throw err;
    });
    if (html.includes("Our systems have detected unusual traffic from your computer network"))
        throw new Error("YouTube detected we're a bot");
    const data = JSON.parse(html
        .split("var ytInitialData = ")?.[1]
        ?.split(";</script>")[0]
        .split(/;\s*(var|const|let)\s/)[0]);
    const items = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.flatMap((s) => s.itemSectionRenderer?.contents);
    for (const item of items) {
        if (limit && results.length >= limit)
            break;
        if (!item || (!item.videoRenderer && !item.channelRenderer && !item.playlistRenderer))
            continue;
        (0, util_1.debugLog)(type);
        switch (type) {
            case "video": {
                const result = (0, parse_1.MusicTrackFromYouTubeSearch)(item);
                if (result)
                    results.push(result);
                break;
            }
            case "playlist": {
                const result = (0, parse_1.MusicPlaylistFromYouTube)(item);
                break;
            }
            default:
                throw new Error("Unknown type");
                break;
        }
    }
    (0, util_1.debugLog)(results);
    return results;
}
exports.YouTubeSearch = YouTubeSearch;
//# sourceMappingURL=index.js.map