import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../classes";
import axios from "axios";
import {
	MusicPlaylistFromYouTube,
	MusicTrackFromYouTube,
	MusicTrackFromYouTubeSearch,
} from "./parse";
import { isDebug } from "../../config";

/**
 * Returns {@link MusicTrack} or {@link MusicPlaylist} from a given YouTube URL
 * Some code was ripped from play-dl
 */
export async function YouTube(url: string): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();
	// if (!url.match(YOUTUBE_URL_PATTERN)) throw new Error(`Given URL is not a valid YouTube URL`);

	let videoId;
	if (url.includes("youtu.be/")) {
		videoId = url.split("youtu.be/")[1].split(/(\?|\/|&)/)[0];
	} else if (url.includes("youtube.com/embed/")) {
		videoId = url.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0];
	} else if (url.includes("youtube.com/shorts/")) {
		videoId = url.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0];
	} else {
		videoId = (url.split("watch?v=")[1] ?? url.split("&v=")[1]).split(/(\?|\/|&)/)[0];
	}
	if (!videoId) throw new Error("Given URL is not a valid YouTube URL");

	const { data: html } = await axios
		.get(`https://www.youtube.com/watch?v=${videoId}&has_verified=1`, {
			headers: {
				"accept-language": "en-US;q=0.9",
				Cookie: "",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
			},
		})
		.catch((err: Error) => {
			throw err;
		});

	if (html.includes("Our systems have detected unusual traffic from your computer network."))
		throw new Error("YouTube detected we're a bot.. thanks youtube.");

	// 	const rawChapters =
	// 	initial_response.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer.playerBar?.multiMarkersPlayerBarRenderer.markersMap.find(
	// 		(m: any) => m.key === "DESCRIPTION_CHAPTERS"
	// 	)?.value?.chapters;
	// const chapters: VideoChapter[] = [];
	// if (rawChapters) {
	// 	for (const { chapterRenderer } of rawChapters) {
	// 		chapters.push({
	// 			title: chapterRenderer.title.simpleText,
	// 			timestamp: parseSeconds(chapterRenderer.timeRangeStartMillis / 1000),
	// 			seconds: chapterRenderer.timeRangeStartMillis / 1000,
	// 			thumbnails: chapterRenderer.thumbnail.thumbnails,
	// 		});
	// 	}
	// }

	return MusicTrackFromYouTube(html);

	// -------------

	// let upcomingDate;
	// if (upcoming) {
	// 	if (microformat.liveBroadcastDetails.startTimestamp)
	// 		upcomingDate = new Date(microformat.liveBroadcastDetails.startTimestamp);
	// 	else {
	// 		const timestamp =
	// 			player_response.playabilityStatus.liveStreamability.liveStreamabilityRenderer.offlineSlate
	// 				.liveStreamOfflineSlateRenderer.scheduledStartTime;
	// 		upcomingDate = new Date(parseInt(timestamp) * 1000);
	// 	}
	// }
	// const video_details = new YouTubeVideo({
	// 	id: vid.videoId,
	// 	title: vid.title,
	// 	description: vid.shortDescription,
	// 	duration: Number(vid.lengthSeconds),
	// 	duration_raw: parseSeconds(vid.lengthSeconds),
	// 	uploadedAt: microformat.publishDate,
	// 	liveAt: microformat.liveBroadcastDetails?.startTimestamp,
	// 	upcoming: upcomingDate,
	// 	thumbnails: vid.thumbnail.thumbnails,
	// 	channel: {
	// 		name: vid.author,
	// 		id: vid.channelId,
	// 		url: `https://www.youtube.com/channel/${vid.channelId}`,
	// 		verified: Boolean(badge?.includes("verified")),
	// 		artist: Boolean(badge?.includes("artist")),
	// 		icons: ownerInfo?.thumbnail?.thumbnails || undefined,
	// 	},
	// 	views: vid.viewCount,
	// 	tags: vid.keywords,
	// 	likes: parseInt(
	// 		initial_response.contents.twoColumnWatchNextResults.results.results.contents
	// 			.find((content: any) => content.videoPrimaryInfoRenderer)
	// 			?.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons?.find(
	// 				(button: any) => button.toggleButtonRenderer.defaultIcon.iconType === "LIKE"
	// 			)
	// 			?.toggleButtonRenderer.defaultText.accessibility?.accessibilityData.label.replace(
	// 				/\D+/g,
	// 				""
	// 			) ?? 0
	// 	),
	// 	live: vid.isLiveContent,
	// 	private: vid.isPrivate,
	// 	discretionAdvised,
	// 	music,
	// 	chapters,
	// });
	// let format = [];
	// if (!upcoming) {
	// 	format.push(...(player_response.streamingData.formats ?? []));
	// 	format.push(...(player_response.streamingData.adaptiveFormats ?? []));

	// 	// get the formats for the android player for legacy videos
	// 	// fixes the stream being closed because not enough data
	// 	// arrived in time for ffmpeg to be able to extract audio data
	// 	if (parseAudioFormats(format).length === 0 && !options.htmldata) {
	// 		format = await getAndroidFormats(vid.videoId, cookieJar, body);
	// 	}
	// }
	// const LiveStreamData = {
	// 	isLive: video_details.live,
	// 	dashManifestUrl: player_response.streamingData?.dashManifestUrl ?? null,
	// 	hlsManifestUrl: player_response.streamingData?.hlsManifestUrl ?? null,
	// };
	// return {
	// 	LiveStreamData,
	// 	html5player,
	// 	format,
	// 	video_details,
	// 	related_videos: related,
	// };
}

/**
 * Searches for a YouTube video or playlist and returns an array of {@link MusicTrack} or {@link MusicPlaylist}
 * Some code was ripped from play-dl
 */
export async function YouTubeSearch(
	query: string,
	limit: number,
	type: "video" | "playlist" = "video"
): Promise<BarbaraType[]> {
	let results: BarbaraType[] = [];
	let url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

	if (url.indexOf("&sp=") === -1) {
		url += "&sp=";
		switch (type) {
			case "playlist": {
				url += `EgIQAw%253D%253D`;
			}
			case "video": {
				url += `EgIQAQ%253D%253D`;
			}
		}
	}

	console.log(url);

	const { data: html } = await axios
		.get(url, {
			headers: { "accept-language": "en-US;q=0.9" },
		})
		.catch((err: Error) => {
			throw err;
		});

	if (html.includes("Our systems have detected unusual traffic from your computer network"))
		throw new Error("YouTube detected we're a bot");

	const data = JSON.parse(
		html
			.split("var ytInitialData = ")?.[1]
			?.split(";</script>")[0]
			.split(/;\s*(var|const|let)\s/)[0]
	);
	const items =
		data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.flatMap(
			(s: any) => s.itemSectionRenderer?.contents
		);
	for (const item of items) {
		if (limit && results.length >= limit) break;
		if (!item || (!item.videoRenderer && !item.channelRenderer && !item.playlistRenderer)) continue;

		if (isDebug()) console.log(type);
		switch (type) {
			case "video": {
				const result = MusicTrackFromYouTubeSearch(item);
				if (result) results.push(result);
				break;
			}
			case "playlist": {
				const result = MusicPlaylistFromYouTube(item);
				if (result) results.push(result);
				break;
			}
			default:
				throw new Error("Unknown type");
				break;
		}
	}

	if (isDebug()) console.log(results);
	return results;
}
