"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylist = exports.MusicTrack = exports.Service = void 0;
const util_1 = require("../util");
var Service;
(function (Service) {
    Service[Service["spotify"] = 0] = "spotify";
    Service[Service["youtube"] = 1] = "youtube";
    Service[Service["soundcloud"] = 2] = "soundcloud";
    Service[Service["audiofile"] = 3] = "audiofile";
})(Service = exports.Service || (exports.Service = {}));
var AudioQuality;
(function (AudioQuality) {
    AudioQuality[AudioQuality["low"] = 0] = "low";
    AudioQuality[AudioQuality["medium"] = 1] = "medium";
    AudioQuality[AudioQuality["high"] = 2] = "high";
})(AudioQuality || (AudioQuality = {}));
class MusicTrack {
    constructor(data = {}) {
        this.url = data.url;
        this.name = data.name;
        this.queuedBy = data.queuedBy;
        this.duration = data.duration;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration);
        this.playlisted = data.playlisted;
        this.service = data.service;
        this.audio = data.audio;
        this.author = data.author;
    }
}
exports.MusicTrack = MusicTrack;
class MusicPlaylist {
    constructor(data = {}) {
        this.url = data.url;
        this.name = data.name;
        this.isAlbum = data.isAlbum;
        this.tracks = data.tracks;
    }
}
exports.MusicPlaylist = MusicPlaylist;
//# sourceMappingURL=index.js.map