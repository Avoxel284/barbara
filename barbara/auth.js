"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKey = void 0;
const SoundCloud_1 = require("./services/SoundCloud");
async function getKey(service) {
    if (service == "soundcloudClientId")
        return await (0, SoundCloud_1.getClientId)();
}
exports.getKey = getKey;
//# sourceMappingURL=auth.js.map