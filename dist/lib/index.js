"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.MusicPlaylist = exports.MusicTrack = exports.Service = void 0;
const util_1 = require("./util");
const prism_media_1 = __importDefault(require("prism-media"));
const axios_1 = __importDefault(require("axios"));
var Service;
(function (Service) {
    Service["spotify"] = "spotify";
    Service["youtube"] = "youtube";
    Service["soundcloud"] = "soundcloud";
    Service["audiofile"] = "audiofile";
})(Service = exports.Service || (exports.Service = {}));
class MusicTrack {
    constructor(data) {
        this.name = data.name || "Unnamed MusicTrack";
        this.url = data.url;
        this.id = data.id;
        this.thumbnail = data.thumbnail;
        this.duration = data.duration || 0;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration || 0);
        this.live = data.live || false;
        this.playlisted = data.playlisted || false;
        this.service = data.service;
        this.audio = data.audio || [];
        if (!Array.isArray(data?.author))
            data.author = [data.author];
        this.author = data.author;
        this.metadata = {
            queuedBy: data.queuedBy || null,
            explicit: data.explicit || false,
        };
        this.originalData = data.originalData;
    }
    async resource(seek = 0, extraArgs) {
        if (this.duration === 0)
            throw "Track duration is 0";
        if (seek < 0 || seek > this.duration)
            throw "Seek is out of range for track";
        const args = [
            "-ss",
            seek,
            "-i",
            (await this.bestAudio()).url,
            "-f",
            "opus",
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
            throw new Error("Spotify does not provide streaming, thus cannot return audio." +
                " Try searching for a similar track on a different service.");
        }
        if (this.service === Service.soundcloud) {
            (0, util_1.debugLog)(this.audio);
            let best = this.audio
                .filter((a) => (a.mimeType ? a.mimeType.includes("audio/mpeg") : false))
                .filter((a) => a.protocol?.includes("progressive"))
                .filter((a) => a.quality
                ? a.quality.includes("sq") || a.quality.includes("medium") || a.quality.includes("low")
                : false)?.[0];
            (0, util_1.debugLog)(best);
            let { data } = await axios_1.default.get(`${best.url}`).catch((err) => {
                throw err;
            });
            best.url = data.url;
            return best;
        }
        if (this.service === Service.youtube) {
            return this.audio[0];
        }
        if (this.service === Service.audiofile) {
            return this.audio[0];
        }
        throw new Error("An error occurred when attempting to find best audio");
    }
    setQueuedBy(queuedBy) {
        this.metadata.queuedBy = queuedBy;
        return this;
    }
    async fetchFullTrack() {
        if (this.service === Service.youtube) {
        }
    }
}
exports.MusicTrack = MusicTrack;
class MusicPlaylist {
    constructor(data) {
        this.url = data.url;
        this.name = data.name;
        this.id = data.id;
        this.duration = data.duration;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration);
        this.isAlbum = data.isAlbum || false;
        this.tracks = data.tracks || [];
        this.service = data.service;
        this.thumbnail = data.thumbnail;
        if (!Array.isArray(data?.author))
            data.author = [data.author];
        this.author = data.author;
        this.metadata = {
            queuedBy: data.queuedBy,
            collaborative: data.collaborative || false,
        };
        this.originalData = data.originalData;
    }
    setQueuedBy(queuedBy) {
        this.metadata.queuedBy = queuedBy;
        return this;
    }
}
exports.MusicPlaylist = MusicPlaylist;
class Queue {
    constructor(data = {}) { }
}
exports.Queue = Queue;
//# sourceMappingURL=index.js.map