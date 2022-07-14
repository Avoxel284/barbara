/**
 * Avoxel284 2022
 * Barbara Music Module / Arbitrary
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";

export function MusicTrackFromAudioFile(data: any) {
	return new MusicTrack({
		name: data.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/)?.[0] || data.url,
		url: data.url,
		thumbnail: "",
		// thumbnail: Buffer.from(meta?.common?.picture?.[0]?.data),
		duration: data.meta.format.duration || 0,
		live: false,
		service: Service.audiofile,
		audio: [
			{
				url: data.url,
				bitrate: data.meta.format.bitrate,
				mimeType: data.headers["content-type"],
				protocol: "progressive??",
				duration: data.meta.format.duration || 0,
				codec: data.meta.format.codec,
			},
		],
		author: {},
		originalData: data,
	});
}
