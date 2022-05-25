"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarbaraStream = exports.MusicPlaylist = exports.MusicTrack = exports.Service = void 0;
const util_1 = require("../util");
const prism_media_1 = __importDefault(require("prism-media"));
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../auth");
let clientId = (0, auth_1.getKey)("soundcloudClientId");
var Service;
(function (Service) {
    Service["spotify"] = "spotify";
    Service["youtube"] = "youtube";
    Service["soundcloud"] = "soundcloud";
    Service["audiofile"] = "audiofile";
})(Service = exports.Service || (exports.Service = {}));
class MusicTrack {
    constructor(data = {}) {
        this.url = data.url || "";
        this.name = data.name || "Unnamed MusicTrack";
        this.thumbnail = data.thumbnail;
        this.queuedBy = data.queuedBy;
        this.duration = data.duration || 0;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration || 0);
        this.playlisted = data.playlisted || false;
        this.service = data.service;
        this.audio = data.audio;
        this.author = data.author;
        this.originalData = data.originalData;
    }
    async sing(seek = 0, extraArgs) {
        if (seek < 0 || seek > this.duration)
            throw new Error("Seek is out of range of track");
        const args = [
            "-ss",
            seek,
            "-i",
            (await this.bestAudio()).url,
            "-ac",
            "2",
        ];
        if (extraArgs)
            args.push(...extraArgs);
        return new prism_media_1.default.FFmpeg({ args: args });
    }
    async bestAudio() {
        if (this.audio == undefined || this.audio?.length == 0)
            throw new Error("MusicTrack does not contain any audios");
        if (this.service === Service.spotify) {
            throw new Error("Spotify does not provide streaming, thus cannot return best audio");
        }
        if (this.service === Service.soundcloud) {
            console.log(this.audio);
            let best = this.audio
                .filter((a) => (a.mimeType ? a.mimeType.includes("audio/mpeg") : false))
                .filter((a) => a.protocol?.includes("progressive"))
                .filter((a) => a.quality
                ? a.quality.includes("sq") || a.quality.includes("medium") || a.quality.includes("low")
                : false)?.[0];
            console.log(best);
            let { data } = await axios_1.default.get(`${best.url}`).catch((err) => {
                throw err;
            });
            best.url = data.url;
            return best;
        }
        if (this.service === Service.youtube) {
            return this.audio[0];
        }
        return {};
    }
}
exports.MusicTrack = MusicTrack;
class MusicPlaylist {
    constructor(data = {}) {
        this.url = data.url;
        this.name = data.name;
        this.duration = data.duration;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration);
        this.isAlbum = data.isAlbum;
        this.tracks = data.tracks;
        this.service = data.service;
        this.thumbnail = data.thumbnail;
        this.author = data.author;
        this.originalData = data.originalData;
    }
}
exports.MusicPlaylist = MusicPlaylist;
class BarbaraStream {
    constructor(data = {}) {
        this.url = data.url;
        this.stream = data.stream;
        this.service = data.service;
    }
}
exports.BarbaraStream = BarbaraStream;
//# sourceMappingURL=index.js.map