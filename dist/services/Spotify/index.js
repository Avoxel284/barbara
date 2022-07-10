"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifySearch = exports.Spotify = exports.SPOTIFY_URL_PATTERN = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./parse");
const config_1 = require("../../lib/config");
exports.SPOTIFY_URL_PATTERN = /^((https:)?\/\/)?open.spotify.com\/(track|album|playlist)\//;
async function Spotify(url) {
    url = url.trim();
    if (!url.match(exports.SPOTIFY_URL_PATTERN))
        throw new Error(`Given URL is not a valid Spotify URL`);
    if (url.includes("track/")) {
        const trackId = url.split("track/")[1].split("&")[0].split("?")[0];
        const { data } = await axios_1.default
            .get(`https://api.spotify.com/v1/tracks/${trackId}?market=${(0, config_1.getKey)("SPOTIFY_MARKETCODE")}`, {
            headers: {
                Authorization: `${(0, config_1.getKey)("SPOTIFY_TOKENTYPE")} ${(0, config_1.getKey)("SPOTIFY_ACCESSTOKEN")}`,
            },
        })
            .catch((err) => {
            throw err;
        });
        return (0, parse_1.MusicTrackFromSpotify)(data);
    }
    if (url.includes("playlist/")) {
        const playlistId = url.split("playlist/")[1].split("&")[0].split("?")[0];
        const { data } = await axios_1.default
            .get(`https://api.spotify.com/v1/playlists/${playlistId}?market=${(0, config_1.getKey)("SPOTIFY_MARKETCODE")}`, {
            headers: {
                Authorization: `${(0, config_1.getKey)("SPOTIFY_TOKENTYPE")} ${(0, config_1.getKey)("SPOTIFY_ACCESSTOKEN")}`,
            },
        })
            .catch((err) => {
            throw err;
        });
        return (0, parse_1.MusicPlaylistFromSpotify)(data);
    }
    if (url.includes("album/")) {
        const albumID = url.split("album/")[1].split("&")[0].split("?")[0];
        const { data } = await axios_1.default
            .get(`https://api.spotify.com/v1/albums/${albumID}?market=${(0, config_1.getKey)("SPOTIFY_MARKETCODE")}`, {
            headers: {
                Authorization: `${(0, config_1.getKey)("SPOTIFY_TOKENTYPE")} ${(0, config_1.getKey)("SPOTIFY_ACCESSTOKEN")}`,
            },
        })
            .catch((err) => {
            throw err;
        });
        return (0, parse_1.MusicPlaylistFromSpotify)(data, true);
    }
    throw new Error("Spotify returned unknown resource.");
}
exports.Spotify = Spotify;
async function SpotifySearch(query, limit = 5, type = "track") {
    if (!query)
        throw new Error("No query given!");
    if (limit > 50 || limit < 0)
        throw "Limit is out of range for Spotify (0 - 50)";
    const { data } = await axios_1.default
        .get(`https://api.spotify.com/v1/search?type=${type}&q=${query}&limit=${limit}&market=${(0, config_1.getKey)("SPOTIFY_MARKETCODE")}`, {
        headers: {
            Authorization: `${(0, config_1.getKey)("SPOTIFY_TOKENTYPE")} ${(0, config_1.getKey)("SPOTIFY_ACCESSTOKEN")}`,
        },
    })
        .catch((err) => {
        throw err;
    });
    if (type === "track") {
        return data.tracks.items.map((d) => (0, parse_1.MusicTrackFromSpotify)(d));
    }
    if (type === "playlist") {
        return data.tracks.items.map((d) => (0, parse_1.MusicPlaylistFromSpotify)(d));
    }
    if (type === "album") {
        return data.tracks.items.map((d) => (0, parse_1.MusicPlaylistFromSpotify)(d, true));
    }
    throw new Error("Spotify returned unknown resource.");
}
exports.SpotifySearch = SpotifySearch;
//# sourceMappingURL=index.js.map