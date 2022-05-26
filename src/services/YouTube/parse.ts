export function MusicTrackFromYouTube (data: any){
	if (!data) throw new Error("No data given");
    if (!options) options = { type: 'video', limit: 0 };
    else if (!options.type) options.type = 'video';
    const hasLimit = typeof options.limit === 'number' && options.limit > 0;
    options.unblurNSFWThumbnails ??= false;

    const data = html
        .split('var ytInitialData = ')?.[1]
        ?.split(';</script>')[0]
        .split(/;\s*(var|const|let)\s/)[0];
    const json_data = JSON.parse(data);
    const results = [];
    const details =
        json_data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.flatMap(
            (s: any) => s.itemSectionRenderer?.contents
        );
    for (const detail of details) {
        if (hasLimit && results.length === options.limit) break;
        if (!detail || (!detail.videoRenderer && !detail.channelRenderer && !detail.playlistRenderer)) continue;
        switch (options.type) {
            case 'video': {
                const parsed = parseVideo(detail);
                if (parsed) {
                    if (options.unblurNSFWThumbnails) parsed.thumbnails.forEach(unblurThumbnail);
                    results.push(parsed);
                }
                break;
            }
            case 'channel': {
                const parsed = parseChannel(detail);
                if (parsed) results.push(parsed);
                break;
            }
            case 'playlist': {
                const parsed = parsePlaylist(detail);
                if (parsed) {
                    if (options.unblurNSFWThumbnails && parsed.thumbnail) unblurThumbnail(parsed.thumbnail);
                    results.push(parsed);
                }
                break;
            }
            default:
                throw new Error(`Unknown search type: ${options.type}`);
        }
    }
    return results;
}

export function MusicPlaylistFromYouTube(data: any){
	
}