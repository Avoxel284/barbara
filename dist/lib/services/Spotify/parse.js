"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylistFromSpotify = exports.MusicTrackFromSpotify = void 0;
const lib_1 = require("../../lib");
function MusicTrackFromSpotify(data) {
    return new lib_1.MusicTrack({
        name: data.name,
        url: data.external_urls.spotify,
        id: data.id,
        duration: Number(data.duration_ms) / 1000,
        author: data.artists.map((artist) => {
            return {
                url: artist.external_urls.spotify,
                name: artist.name,
                id: artist.id,
            };
        }),
        thumbnail: data?.album?.images?.[0],
        service: lib_1.Service.spotify,
        explicit: data.explicit,
        originalData: data,
    });
}
exports.MusicTrackFromSpotify = MusicTrackFromSpotify;
function MusicPlaylistFromSpotify(data, isAlbum = false) {
    return new lib_1.MusicPlaylist({
        name: data.name,
        url: data.external_urls.spotify,
        id: data.id,
        duration: Number(data.duration_ms) / 1000,
        authors: {
            url: data.owner.external_urls.spotify,
            name: data.owner.display_name,
            id: data.owner.id,
        },
        thumbnail: data?.images?.[0],
        service: lib_1.Service.spotify,
        isAlbum: isAlbum,
        tracks: data?.tracks.map((d) => {
            MusicTrackFromSpotify(d);
        }),
        originalData: data,
    });
}
exports.MusicPlaylistFromSpotify = MusicPlaylistFromSpotify;
//# sourceMappingURL=parse.js.map