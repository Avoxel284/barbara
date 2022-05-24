import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../classes";
const axios = require("axios").default;

let clientId = "";

/** URL pattern for SoundCloud - ripped from play-dl */
const SOUNDCLOUD_URL_PATTERN =
	/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;

/**
 * Returns a free client ID - ripped from play-dl
 */
export async function getClientId(): Promise<string> {
	const { data } = await axios.get("https://soundcloud.com/").catch((err: Error) => {
		throw err;
	});
	const urls: string[] = [];
	data.split('<script crossorigin src="').forEach((r: string) => {
		if (r.startsWith("https")) urls.push(r.split('"')[0]);
	});
	const { data: data2 } = await axios.get(urls[urls.length - 1]).catch((err: Error) => {
		throw err;
	});
	return data2.split(',client_id:"')[1].split('"')[0];
}

/**
 * Returns MusicTrack or MusicPlaylist with information from SoundCloud
 */
export async function SoundCloud(url: string): Promise<BarbaraType> {
	clientId = await getClientId();
	console.log(clientId);

	url = url.trim();
	if (!url.match(SOUNDCLOUD_URL_PATTERN))
		throw new Error(`Given URL is not a valid SoundCloud URL`);
	const { data } = await axios
		.get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
		.catch((err: Error) => {
			throw err;
		});

	if (data.kind == "track") {
		return new MusicTrack({
			name: data.title,
			url: data.permalink_url,
			duration: Number(data.duration) / 1000,
			author: {
				url: data.user.permalink_url,
				name: data.user.username,
				avatar: data.user.avatar_url,
				id: data.user.id,
			},
			thumbnail: { url: data.artwork_url },
			service: Service.soundcloud,
		});
	} else if (data.kind == "playlist") {
		return new MusicPlaylist({
			name: data.title,
			url: data.permalink_url,
			duration: Number(data.duration) / 1000,
			author: {
				url: data.user.permalink_url,
				name: data.user.username,
				avatar: data.user.avatar_url,
				id: data.user.id,
			},
			thumbnail: { url: data.artwork_url },
			service: Service.soundcloud,
		});
	} else {
		throw new Error("SoundCloud returned unknown resource");
	}
}
