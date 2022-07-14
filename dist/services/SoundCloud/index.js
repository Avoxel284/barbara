"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundCloud_Validate = exports.SoundCloud_Search = exports.SoundCloud_Info = exports.SOUNDCLOUD_URL_PATTERN = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./parse");
const config_1 = require("../../lib/config");
exports.SOUNDCLOUD_URL_PATTERN = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;
async function SoundCloud_Info(url) {
    let clientId = await (0, config_1.getKey)("SOUNDCLOUD_CLIENTID");
    url = url.trim();
    if (!url.match(exports.SOUNDCLOUD_URL_PATTERN))
        throw new Error(`Given URL is not a valid SoundCloud URL`);
    const { data } = await axios_1.default
        .get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
        .catch((err) => {
        throw err;
    });
    if (data.kind === "track") {
        return (0, parse_1.MusicTrackFromSoundCloud)(data);
    }
    if (data.kind === "playlist") {
        return (0, parse_1.MusicPlaylistFromSoundCloud)(data);
    }
    throw new Error("SoundCloud returned unknown resource.");
}
exports.SoundCloud_Info = SoundCloud_Info;
async function SoundCloud_Search(query, limit = 20, type = "tracks") {
    let clientId = await (0, config_1.getKey)("SOUNDCLOUD_CLIENTID");
    if (!clientId)
        throw new Error("SoundCloud Client ID is not set!");
    if (!query)
        throw new Error("No query given!");
    const { data } = await axios_1.default
        .get(`https://api-v2.soundcloud.com/search/${type}?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=${limit}`)
        .catch((err) => {
        throw err;
    });
    if (type === "tracks") {
        return data.collection.map((d) => (0, parse_1.MusicTrackFromSoundCloud)(d));
    }
    if (type === "albums" || type === "playlists") {
        return data.collection.map((d) => (0, parse_1.MusicPlaylistFromSoundCloud)(d));
    }
    throw new Error("SoundCloud returned unknown resource.");
}
exports.SoundCloud_Search = SoundCloud_Search;
function SoundCloud_Validate(url) {
    return url.match(exports.SOUNDCLOUD_URL_PATTERN);
}
exports.SoundCloud_Validate = SoundCloud_Validate;
//# sourceMappingURL=index.js.map