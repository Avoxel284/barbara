"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylistFromSoundCloud = exports.MusicTrackFromSoundCloud = void 0;
const lib_1 = require("../../lib");
const config_1 = require("../../lib/config");
function MusicTrackFromSoundCloud(data) {
    const clientId = (0, config_1.getKey)("SOUNDCLOUD_CLIENTID");
    return new lib_1.MusicTrack({
        name: data.title,
        url: data.url || data.permalink_url,
        id: data.id,
        duration: Number(data.duration) / 1000,
        author: {
            url: data?.user?.permalink_url,
            name: data?.user?.username,
            avatar: data?.user?.avatar_url,
            id: data?.user?.id,
            verified: data?.user?.verified,
        },
        explicit: false,
        queuedBy: null,
        playlisted: false,
        thumbnail: data.artwork_url
            ? data.artwork_url?.replace(/-large\.jpg/g, "-t300x300.jpg")
            : undefined,
        service: lib_1.Service.soundcloud,
        audio: data.media.transcodings.map((a) => {
            return {
                url: a.url + `?client_id=${clientId}`,
                quality: a.quality,
                duration: a.duration,
                protocol: a.format?.protocol,
                mimeType: a.format?.mime_type?.split(";")[0],
            };
        }),
        originalData: data,
    });
}
exports.MusicTrackFromSoundCloud = MusicTrackFromSoundCloud;
function MusicPlaylistFromSoundCloud(data) {
    const clientId = (0, config_1.getKey)("SOUNDCLOUD_CLIENTID");
    return new lib_1.MusicPlaylist({
        name: data.title,
        url: data.url || data.permalink_url,
        id: data.id,
        duration: Number(data.duration) / 1000,
        authors: {
            url: data?.user?.permalink_url,
            name: data?.user?.username,
            avatar: data?.user?.avatar_url,
            id: data?.user?.id,
        },
        thumbnail: data.artwork_url
            ? data.artwork_url?.replace(/-large\.jpg/g, "-t300x300.jpg")
            : undefined,
        service: lib_1.Service.soundcloud,
        isAlbum: data.set_type === "album",
        tracks: data.tracks
            .filter((t) => t?.title?.length > 0)
            .map((m) => {
            m = MusicTrackFromSoundCloud(m);
            m.playlisted = true;
            return m;
        }),
        originalData: data,
    });
}
exports.MusicPlaylistFromSoundCloud = MusicPlaylistFromSoundCloud;
//# sourceMappingURL=parse.js.map