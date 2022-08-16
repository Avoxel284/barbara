"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFile_Validate = exports.AudioFile_Info = exports.AUDIOFILE_URL_PATTERN = void 0;
const axios_1 = __importDefault(require("axios"));
const util_1 = require("../../lib/util");
const parse_1 = require("./parse");
const music_metadata_1 = __importDefault(require("music-metadata"));
const acceptedFileExtensions = ["mp3", "mp4", "ogg", "wav"];
exports.AUDIOFILE_URL_PATTERN = new RegExp(`^(https?):\/\/(www.)?(.*?)\.(${acceptedFileExtensions.join("|")})$`);
async function AudioFile_Info(url, reqOptions) {
    url = url.trim();
    if (!url)
        throw "Given AudioFile URL is null!";
    const { data, headers } = await axios_1.default
        .get(url, { responseType: "stream", ...reqOptions })
        .catch((err) => {
        throw err;
    });
    if (!data)
        throw "Audio file does not contain any data";
    (0, util_1.debugLog)(`AudioFile Content Type: ${headers["content-type"]}`);
    return (0, parse_1.MusicTrackFromAudioFile)({
        url: url,
        data: data,
        headers: headers,
        meta: await music_metadata_1.default.parseStream(data, undefined, { duration: true }),
    });
}
exports.AudioFile_Info = AudioFile_Info;
function AudioFile_Validate(url) {
    return url.match(exports.AUDIOFILE_URL_PATTERN);
}
exports.AudioFile_Validate = AudioFile_Validate;
//# sourceMappingURL=index.js.map