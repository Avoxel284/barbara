"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeSearch = exports.YouTube = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./parse");
async function YouTube(url) {
    url = url.trim();
    if (!url.match(SOUNDCLOUD_URL_PATTERN))
        throw new Error(`Given URL is not a valid SoundCloud URL`);
    const { data } = await axios_1.default
        .get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
        .catch((err) => {
        throw err;
    });
    if (data.kind === "track")
        return MusicTrackFromSoundCloud(data);
    else if (data.kind === "playlist")
        return MusicPlaylistFromSoundCloud(data);
    else
        throw new Error("SoundCloud returned unknown resource");
}
exports.YouTube = YouTube;
async function YouTubeSearch(query, limit, type = "video") {
    let results = [];
    let url = `https://www.youtube.com/results?search_query=${query}`;
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
    const { data } = await axios_1.default
        .get(url, {
        headers: { "accept-language": "en-US;q=0.9" },
    })
        .catch((err) => {
        throw err;
    });
    if (data.contains("Our systems have detected unusual traffic from your computer network"))
        throw new Error("YouTube detected we're a bot");
    if (type === "video")
        data.collection.forEach((d) => results.push((0, parse_1.MusicTrackFromYouTube)(d)));
    else if (type === "playlist")
        data.collection.forEach((d) => results.push((0, parse_1.MusicPlaylistFromYouTube)(d)));
    else {
        throw new Error("Unknown SoundCloud resource type");
    }
    return results;
}
exports.YouTubeSearch = YouTubeSearch;
//# sourceMappingURL=index.js.map