import { MusicTrack } from "../../classes";
import { getTimeFromSeconds } from "../../util";

/**
 * Parse a MusicTrack from YouTube data.
 * Some code was ripped from play-dl
 */
export function MusicTrackFromYouTube(data: any) {
	if (!data || !data.videoRenderer) throw new Error("No data given");

	const channel = data.videoRenderer.ownerText.runs[0];
	const badge = data.videoRenderer.ownerBadges?.[0]?.metadataBadgeRenderer?.style?.toLowerCase();
	const duration = data.videoRenderer.lengthText;

	return new MusicTrack({
		url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
		name: data.videoRenderer.title.runs[0].text,
		id: data.videoRenderer.videoId,
		// description: data.videoRenderer.detailedMetadataSnippets?.[0].snippetText.runs.length
		// 	? data.videoRenderer.detailedMetadataSnippets[0].snippetText.runs
		// 			.map((run: any) => run.text)
		// 			.join("")
		// 	: "",
		duration: duration ? duration.simpleText : null,
		durationTimestamp: duration ? getTimeFromSeconds(duration.simpleText) : 0,
		thumbnails: data.videoRenderer.thumbnail.thumbnails,
		channel: {
			id: channel.navigationEndpoint.browseEndpoint.browseId || null,
			name: channel.text || null,
			url: `https://www.youtube.com${
				channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
				channel.navigationEndpoint.commandMetadata.webCommandMetadata.url
			}`,
			icons:
				data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer
					.thumbnail.thumbnails,
			verified: Boolean(badge?.includes("verified")),
			artist: Boolean(badge?.includes("artist")),
		},
		uploadedAt: data.videoRenderer.publishedTimeText?.simpleText ?? null,
		upcoming: data.videoRenderer.upcomingEventData?.startTime
			? new Date(parseInt(data.videoRenderer.upcomingEventData.startTime) * 1000)
			: undefined,
		views: data.videoRenderer.viewCountText?.simpleText?.replace(/\D/g, "") ?? 0,
		live: duration ? false : true,
	});
}

export function MusicPlaylistFromYouTube(data: any) {}
