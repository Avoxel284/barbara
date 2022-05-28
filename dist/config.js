"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebug = exports.getKey = void 0;
const SoundCloud_1 = require("./services/SoundCloud");
const keys = {
    soundcloudClientId: "",
};
async function getKey(key) {
    if (key == "soundcloudClientId")
        return await (0, SoundCloud_1.getClientId)();
    return "";
}
exports.getKey = getKey;
function isDebug() {
    return true;
}
exports.isDebug = isDebug;
(async () => {
    if (!keys.soundcloudClientId) {
        keys.soundcloudClientId = await (0, SoundCloud_1.getClientId)();
    }
})();
//# sourceMappingURL=config.js.map