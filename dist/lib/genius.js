"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGeniusSongLyrics = exports.searchGeniusSong = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const util_1 = require("./util");
const LYRICS_CACHE = {};
async function searchGeniusSong(query) {
    if (!(0, config_1.getKey)("GENIUS_TOKEN"))
        throw "Genius is not authenticated! (Token is null)";
    const { data } = await axios_1.default
        .get(`https://api.genius.com/search?q=${query}`, {
        headers: {
            Authorization: `Bearer ${(0, config_1.getKey)("GENIUS_TOKEN")}`,
            Accept: "application/json",
        },
    })
        .catch((err) => {
        throw err;
    });
    (0, util_1.debugLog)(`Searching for song on Genius :: query: ${query}`);
    (0, util_1.debugLog)(`Genius "hits":`, data?.response?.hits);
    let song = data?.response?.hits[0];
    if (song?.type != "song")
        return;
    song = song.result;
    return {
        lyrics: undefined,
        url: song.url,
        pyongs: song.pyongs_count,
        title: song.full_title,
        name: song.name,
        artist: {
            name: song.primary_artist.name,
            url: song.primary_artist.url,
            avatar: song.primary_artist.image_url,
            id: song.primary_artist.id,
            verified: song.primary_artist.is_verified,
        },
        thumbnail: song.song_art_image_url,
        id: song.id,
        lyricsState: song.lyrics_state,
    };
}
exports.searchGeniusSong = searchGeniusSong;
async function fetchGeniusSongLyrics(url) {
    (0, util_1.debugLog)(`Genius Extract Song Lyrics URL: ${url}`);
    if (!url)
        return null;
    if ((0, config_1.getKey)("GENIUS_LYRICSCACHING") === true && LYRICS_CACHE[url])
        return LYRICS_CACHE[url];
    let { data } = await axios_1.default.get(url).catch((err) => {
        throw err;
    });
    let json = data.split("window.__PRELOADED_STATE__ = JSON.parse('")[1].split("');")[0];
    if (!json)
        return null;
    try {
        json = JSON.parse(json.replace(/\\/g, ""));
    }
    catch (err) {
        (0, util_1.debugLog)(json);
        (0, util_1.debugLog)(err);
        json = null;
    }
    (0, util_1.debugLog)(json);
    if (!json)
        return null;
    let lyrics = json?.songPage?.lyricsData?.body?.children?.[0]?.children.filter((l) => {
        return typeof l == "string";
    });
    if ((0, config_1.getKey)("GENIUS_LYRICSCACHING") === true)
        LYRICS_CACHE[url] = lyrics;
    return lyrics;
}
exports.fetchGeniusSongLyrics = fetchGeniusSongLyrics;
//# sourceMappingURL=genius.js.map