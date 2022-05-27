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
	const thumbnail =
		data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails - 1];
	const avatar =
		data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail
			.thumbnails[0];

	return new MusicTrack({
		url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
		name: data.videoRenderer.title.runs[0].text,
		id: data.videoRenderer.videoId,
		// description: data.videoRenderer.detailedMetadataSnippets?.[0].snippetText.runs.length
		// 	? data.videoRenderer.detailedMetadataSnippets[0].snippetText.runs
		// 			.map((run: any) => run.text)
		// 			.join("")
		// 	: "",
		duration: duration ? duration.simpleText : null, // TODO: invert
		durationTimestamp: duration ? getTimeFromSeconds(duration.simpleText) : 0,
		thumbnail: { url: thumbnail },
		author: {
			id: channel.navigationEndpoint.browseEndpoint.browseId || null,
			name: channel.text || null,
			url: `https://www.youtube.com${
				channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
				channel.navigationEndpoint.commandMetadata.webCommandMetadata.url
			}`,
			avatar: avatar,
		},
		live: duration ? false : true,
		originalData: data,
	});
}

/**
 * Parse a MusicPlaylist from YouTube data.
 * Some code was ripped from play-dl 
 */
export function MusicPlaylistFromYouTube(data: any) {
	
}
