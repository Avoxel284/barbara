/**
 * Avoxel284 2022
 * Barbara Music Module / Arbitrary
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";
import axios from "axios";
import { getKey } from "../../lib/config";
import { debugLog } from "../../lib/util";
import metadata from "music-metadata";

const acceptedFileExtensions: string[] = ["mp3", "mp4", "ogg", "wav"];

/** Pattern for validating Audio file URLs */
export const AUDIOFILE_URL_PATTERN = new RegExp(
	`^(https?):\/\/(www.)?(.*?)\.(${acceptedFileExtensions.join("|")})$`
);

/**
 * Returns {@link MusicTrack} with data from a given audio file URL
 *
 * @param reqOptions Additional options to pass to Axios when creating request (Refer to Axios documentation)
 */
export async function AudioFile(url: string, reqOptions: any): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();
	if (!url) throw new Error("Given AudioFile URL is null!");
	if (!url.match(AUDIOFILE_URL_PATTERN))
		throw new Error("Given AudioFile URL is invalid or not an audio file.");
	// debugLog(data);

	const { data, headers } = await axios
		.get(url, { responseType: "stream", ...reqOptions })
		.catch((err) => {
			throw err;
		});
	debugLog(`AudioFile Content Type: ${headers["content-type"]}`);
	const meta = await metadata.parseStream(data);

	return new MusicTrack({
		name: url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/)?.[0] || url,
		url: url,
		thumbnail: "",
		// thumbnail: Buffer.from(meta?.common?.picture?.[0]?.data),
		duration: meta.format.duration || 0,
		live: false,
		service: Service.audiofile,
		audio: [
			{
				url: url,
				bitrate: meta.format.bitrate,
				mimeType: headers["content-type"],
				protocol: "progressive??",
				duration: meta.format.duration || 0,
				codec: meta.format.codec,
			},
		],
		author: {},
		originalData: data,
	});
}
