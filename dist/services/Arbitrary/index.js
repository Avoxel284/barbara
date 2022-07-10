"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFile = exports.AUDIOFILE_URL_PATTERN = void 0;
const lib_1 = require("../../lib");
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../../lib/util");
const music_metadata_1 = __importDefault(require("music-metadata"));
const acceptedFileExtensions = ["mp3", "mp4", "ogg", "wav"];
exports.AUDIOFILE_URL_PATTERN = new RegExp(`^(https?):\/\/(www.)?(.*?)\.(${acceptedFileExtensions.join("|")})$`);
async function AudioFile(url, reqOptions) {
    url = url.trim();
    if (!url)
        throw new Error("Given AudioFile URL is null!");
    if (!url.match(exports.AUDIOFILE_URL_PATTERN))
        throw new Error("Given AudioFile URL is invalid or not an audio file.");
    const { data, headers } = await axios_1.default
        .get(url, { responseType: "stream", ...reqOptions })
        .catch((err) => {
        throw err;
    });
    (0, util_1.debugLog)(`AudioFile Content Type: ${headers["content-type"]}`);
    const meta = await music_metadata_1.default.parseStream(data);
    return new lib_1.MusicTrack({
        name: url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/)?.[0] || url,
        url: url,
        thumbnail: "",
        duration: meta.format.duration || 0,
        live: false,
        service: lib_1.Service.audiofile,
        audio: [
            {
                url: url,
                bitrate: meta.format.bitrate,
                mimeType: headers["content-type"],
                protocol: "progressive??",
                duration: meta.format.duration || 0,
                codec: meta.format.codec,
            },
        ],
        author: {},
        originalData: data,
    });
}
exports.AudioFile = AudioFile;
//# sourceMappingURL=index.js.map