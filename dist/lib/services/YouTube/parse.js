"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylistFromYouTube = exports.MusicTrackFromYouTube = void 0;
const lib_1 = require("../../lib");
function MusicTrackFromYouTube(data) {
    return new lib_1.MusicTrack({
        url: `https://www.youtube.com/watch?v=${data.videoId}`,
        id: data.videoId,
        name: data.title,
        duration: Number(data.lengthSeconds),
        thumbnail: data.videoThumbnails[0].url,
        author: {
            name: data.author,
            id: data.authorId,
            url: `https://www.youtube.com/${data.authorUrl}`,
            avatar: data.authorThumbnails
                ? data.authorThumbnails[data?.authorThumbnails?.length - 1]
                : "",
        },
        audio: data.adaptiveFormats
            ? data.adaptiveFormats
                .filter((f) => f.audioQuality != null)
                .map((f) => {
                return {
                    url: f.url,
                    quality: f.audioQuality,
                    mimeType: f.type.split(";")[0],
                    bitrate: f.bitrate,
                };
            })
            : null,
        live: data.liveNow,
        service: lib_1.Service.youtube,
        originalData: data,
    });
}
exports.MusicTrackFromYouTube = MusicTrackFromYouTube;
function MusicPlaylistFromYouTube(data) {
}
exports.MusicPlaylistFromYouTube = MusicPlaylistFromYouTube;
//# sourceMappingURL=parse.js.map