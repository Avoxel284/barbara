"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicTrackFromAudioFile = void 0;
const lib_1 = require("../../lib");
const util_1 = require("../../lib/util");
function MusicTrackFromAudioFile(data) {
    (0, util_1.debugLog)(data.meta);
    return new lib_1.MusicTrack({
        name: data?.meta?.common?.title ||
            data.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g)?.[0] ||
            data.url,
        url: data.url,
        thumbnail: "",
        duration: data.meta.format.duration || 0,
        live: false,
        service: lib_1.Service.audiofile,
        audio: [
            {
                url: data.url,
                mimeType: data.headers["content-type"],
                protocol: "progressive",
                duration: data?.meta?.format?.duration,
                codec: data?.meta?.format?.codec,
            },
        ],
        author: {
            name: data?.meta?.common?.artist || "Not sure",
        },
        originalData: data,
    });
}
exports.MusicTrackFromAudioFile = MusicTrackFromAudioFile;
//# sourceMappingURL=parse.js.map