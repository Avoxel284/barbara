"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundCloudSearch = exports.SoundCloud = exports.getClientId = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./parse");
let clientId = "";
const SOUNDCLOUD_URL_PATTERN = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;
async function getClientId() {
    const { data } = await axios_1.default.get("https://soundcloud.com/").catch((err) => {
        throw err;
    });
    const urls = [];
    data.split('<script crossorigin src="').forEach((r) => {
        if (r.startsWith("https"))
            urls.push(r.split('"')[0]);
    });
    const { data: data2 } = await axios_1.default.get(urls[urls.length - 1]).catch((err) => {
        throw err;
    });
    return data2.split(',client_id:"')[1].split('"')[0];
}
exports.getClientId = getClientId;
async function SoundCloud(url) {
    clientId = await getClientId();
    console.log(clientId);
    url = url.trim();
    if (!url.match(SOUNDCLOUD_URL_PATTERN))
        throw new Error(`Given URL is not a valid SoundCloud URL`);
    const { data } = await axios_1.default
        .get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
        .catch((err) => {
        throw err;
    });
    if (data.kind === "track")
        return (0, parse_1.MusicTrackFromSoundCloud)(data);
    else if (data.kind === "playlist")
        return (0, parse_1.MusicPlaylistFromSoundCloud)(data);
    else
        throw new Error("SoundCloud returned unknown resource");
}
exports.SoundCloud = SoundCloud;
async function SoundCloudSearch(query, limit, type = "tracks") {
    clientId = await getClientId();
    console.log(clientId);
    let results = [];
    const { data } = await axios_1.default
        .get(`https://api-v2.soundcloud.com/search/${type}?q=${query}&client_id=${clientId}&limit=${limit}`)
        .catch((err) => {
        throw err;
    });
    if (type === "tracks")
        data.collection.forEach((d) => results.push((0, parse_1.MusicTrackFromSoundCloud)(d)));
    else if (type === "albums" || type === "playlists")
        data.collection.forEach((d) => results.push((0, parse_1.MusicPlaylistFromSoundCloud)(d)));
    else {
        throw new Error("Unknown SoundCloud resource type");
    }
    return results;
}
exports.SoundCloudSearch = SoundCloudSearch;
//# sourceMappingURL=index.js.map