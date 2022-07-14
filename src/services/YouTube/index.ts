/**
 * Avoxel284 2022
 * Barbara Music Module / YouTube
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";
import axios from "axios";
import { MusicPlaylistFromYouTube, MusicTrackFromYouTube } from "./parse";
import { debugLog } from "../../lib/util";
import { getKey } from "../../lib/config";

const PLAYLIST_ID_PATTERN = /^(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}$/;
const PLAYLIST_URL_PATTERN =
	/^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?(youtube\.com)\/(?:(playlist|watch))(.*)?((\?|\&)list=)(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}(.*)?$/;
const VIDEO_URL_PATTERN =
	/^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|shorts\/|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

/**
 * Returns {@link MusicTrack} or {@link MusicPlaylist} from a given YouTube URL
 */
export async function YouTube_Info(url: string): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();

	let videoId;
	if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split(/(\?|\/|&)/)[0];
	else if (url.includes("youtube.com/embed/"))
		videoId = url.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0];
	else if (url.includes("youtube.com/shorts/"))
		videoId = url.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0];
	else if (url.includes("youtube.com/playlist?list="))
		videoId = url.split("youtube.com/playlist?list=")[1].split(/(\?|\/|&)/)[0];
	else videoId = (url.split("watch?v=")[1] ?? url.split("&v=")[1]).split(/(\?|\/|&)/)[0];

	let { data } = await axios.get(
		`${getKey("YOUTUBE_INVIDIOUSSITE")}/api/v1/videos/${videoId}`
	);

	return MusicTrackFromYouTube(data);
}

/**
 * Searches for a YouTube video or playlist and returns an array of {@link MusicTrack} or {@link MusicPlaylist}
 * Some code was ripped from play-dl
 */
export async function YouTube_Search(
	query: string,
	limit: number = 10,
	type: "video" | "playlist" = "video"
): Promise<MusicTrack[] | MusicPlaylist[]> {
	let { data } = await axios.get(
		`${getKey("YOUTUBE_INVIDIOUSSITE")}/api/v1/search?q=${encodeURIComponent(
			query
		)}&type=${type}`
	);

	return data.map(MusicTrackFromYouTube);
}

/**
 * Check a URL and validate if it is a YouTube URL
 */
export function YouTube_Validate(url: string) {
	if (url.match(PLAYLIST_URL_PATTERN)) return true;
	if (url.match(VIDEO_URL_PATTERN)) return true;
}