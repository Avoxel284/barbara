/**
 * Returns a random integer
 * @param min Random integer minimum
 * @param max Random integer maximum
 */
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a timestamp such as `3:10`, `45:32` or `132:44:19` from a given amount of seconds
 */
export function getTimeFromSeconds(time: number) {
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
