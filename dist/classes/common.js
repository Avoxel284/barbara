"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylist = exports.MusicTrack = exports.Service = void 0;
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
        this.playlisted = data.playlisted;
        this.service = data.service;
    }
}
exports.MusicTrack = MusicTrack;
class MusicPlaylist {
    constructor(url, tracks, name, isAlbum) {
        this.url = url;
        this.name = name;
        this.isAlbum = isAlbum;
        this.tracks = tracks;
    }
}
exports.MusicPlaylist = MusicPlaylist;
//# sourceMappingURL=common.js.map