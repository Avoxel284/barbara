"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebug = exports.getKey = void 0;
const SoundCloud_1 = require("./services/SoundCloud");
async function getKey(key) {
    if (key == "soundcloudClientId")
        return await (0, SoundCloud_1.getClientId)();
}
exports.getKey = getKey;
function isDebug() {
    return true;
}
exports.isDebug = isDebug;
//# sourceMappingURL=config.js.map