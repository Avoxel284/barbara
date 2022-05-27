"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecondsFromTime = exports.getTimeFromSeconds = exports.getRandomInt = void 0;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function getTimeFromSeconds(time) {
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
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