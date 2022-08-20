"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylistFromSpotify = exports.MusicTrackFromSpotify = void 0;
const axios_1 = __importDefault(require("axios"));
const lib_1 = require("../../lib");
const config_1 = require("../../lib/config");
const util_1 = require("../../lib/util");
function MusicTrackFromSpotify(data) {
    return new lib_1.MusicTrack({
        name: data.name,
        url: data.external_urls?.spotify,
        id: data.id,
        duration: Number(data.duration_ms) / 1000,
        author: data.artists.map((artist) => {
            return {
                url: artist.external_urls?.spotify,
                name: artist.name,
                id: artist.id,
            };
        }),
        thumbnail: data?.album?.images?.[0]?.url,
        service: lib_1.Service.spotify,
        explicit: data.explicit,
        originalData: data,
    });
}
exports.MusicTrackFromSpotify = MusicTrackFromSpotify;
async function MusicPlaylistFromSpotify(data, isAlbum = false) {
    (0, util_1.debugLog)(`Creating new Spotify playlist :: isAlbum = ${isAlbum}`, data);
    const tracks = [];
    async function fetchTracks(nextPageUrl) {
        if (nextPageUrl) {
            let { data } = await axios_1.default.get(nextPageUrl, {
                headers: {
                    Authorization: `${(0, config_1.getKey)("SPOTIFY_TOKENTYPE")} ${(0, config_1.getKey)("SPOTIFY_ACCESSTOKEN")}`,
                },
            });
            if (data.offset >= 500)
                return;
            if (data.tracks?.next)
                fetchTracks(data.tracks.next);
            tracks.push(...data?.items?.map((d) => MusicTrackFromSpotify(d.track)));
        }
        else {
            if (typeof data.tracks?.next == "string")
                await fetchTracks(data.tracks.next);
            tracks.push(...data?.tracks?.items?.map((d) => MusicTrackFromSpotify(d.track)));
        }
    }
    await fetchTracks();
    return new lib_1.MusicPlaylist({
        name: data.name,
        url: data.external_urls?.spotify,
        id: data.id,
        duration: Number(data.duration_ms) / 1000,
        authors: {
            url: data.owner.external_urls?.spotify,
            name: data.owner.display_name,
            id: data.owner.id,
        },
        thumbnail: data?.images?.[0]?.url,
        service: lib_1.Service.spotify,
        isAlbum: isAlbum,
        tracks: tracks,
        originalData: data,
    });
}
exports.MusicPlaylistFromSpotify = MusicPlaylistFromSpotify;
//# sourceMappingURL=parse.js.map