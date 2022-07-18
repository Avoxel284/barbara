"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecondsFromTime = exports.getTimeFromSeconds = exports.warnLog = exports.debugLog = exports.getRandomInt = void 0;
const config_1 = require("./config");
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function debugLog(...content) {
    if (!(0, config_1.getKey)("CONFIG_DEBUG"))
        return;
    console.log(`\u001b[36;1m[ Barbara Debug ]\u001b[0m`, arguments[0]);
    for (let i = 1; arguments.length > i; i++) {
        console.log(arguments[i]);
    }
}
exports.debugLog = debugLog;
function warnLog(...content) {
    console.log(`\u001b[33m[ Barbara Warning ]\u001b[0m`, arguments[0]);
    for (let i = 1; arguments.length > i; i++) {
        console.log(arguments[i]);
    }
}
exports.warnLog = warnLog;
function getTimeFromSeconds(time) {
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    let ret = "";
    if (hrs > 0)
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
exports.getTimeFromSeconds = getTimeFromSeconds;
function getSecondsFromTime(time) {
    if (!time)
        return 0;
    const args = time.split(":");
    switch (args.length) {
        case 3:
            return parseInt(args[0]) * 60 * 60 + parseInt(args[1]) * 60 + parseInt(args[2]);
            break;
        case 2:
            return parseInt(args[0]) * 60 + parseInt(args[1]);
            break;
        default:
            return parseInt(args[0]);
            break;
    }
}
exports.getSecondsFromTime = getSecondsFromTime;
//# sourceMappingURL=util.js.map