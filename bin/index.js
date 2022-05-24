"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundCloud = exports.Service = exports.MusicTrack = exports.info = exports.search = void 0;
const classes_1 = require("./classes");
Object.defineProperty(exports, "MusicTrack", { enumerable: true, get: function () { return classes_1.MusicTrack; } });
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return classes_1.Service; } });
const SoundCloud_1 = require("./services/SoundCloud");
Object.defineProperty(exports, "SoundCloud", { enumerable: true, get: function () { return SoundCloud_1.SoundCloud; } });
async function search(keywords, options) {
    return keywords;
}
exports.search = search;
async function info(url, options) { }
exports.info = info;
//# sourceMappingURL=index.js.map