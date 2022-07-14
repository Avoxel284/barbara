/**
 * Avoxel284 2022
 * Barbara Music Module
 */

import { getKey } from "./config";

/**
 * Returns a random integer between two given integers
 * @param min Minimum
 * @param max Maximum
 */
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Debug logging function for internal use
 *
 * @param content Parameter that can accept variable amount of content that gets logged
 */
export function debugLog(...content: any) {
	if (!getKey("CONFIG_DEBUG")) return;
	console.log(`\u001b[36;1m[ Barbara Debug ]\u001b[0m`, arguments[0]);
	for (let i = 1; arguments.length > i; i++) {
		console.log(arguments[i]);
	}
}

/**
 * Returns a timestamp such as `3:10`, `45:32` or `132:44:19` from a given amount of seconds
 */
export function getTimeFromSeconds(time: number) {
	let hrs = ~~(time / 3600);
	let mins = ~~((time % 3600) / 60);
	let secs = ~~time % 60;
	let ret = "";
	if (hrs > 0) ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}

/**
 * Returns seconds from a given timestamp such as `3:10`, `45:32` or `132:44:19`
 */
export function getSecondsFromTime(time: string) {
	if (!time) return 0;
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
