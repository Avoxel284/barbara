import { getTimeFromSeconds } from "../util";

export interface SearchOptions {
	/** Service to search track on */
	service: Service;
}

export interface InfoOptions {
	/** Amount of results to return */
	length: number;
}

/** Type of media - Is it a MusicTrack or MusicPlaylist? */
export type BarbaraType = MusicTrack | MusicPlaylist;

export enum Service {
	spotify,
	youtube,
	soundcloud,
	audiofile,
}

enum AudioQuality {
	low,
	medium,
	high,
}

interface Audio {
	url: string;
	quality: AudioQuality;
}

interface Thumbnail {
	/** Thumbnail URL */
	url: string;
}

interface Author {
	/** Public page URL */
	url: string;
	/** Avatar/Profile picture/Channel icon URL */
	avatar: string;
	/** Name of author */
	name: string;
	/** ID of author */
	id: string;
}

export class MusicTrack {
	/** Friendly URL of the track (e.g. https://youtube.com/watch?v=videoid) */
	url?: string;

	/** Name of the track */
	name?: string;

	/** ID of user that queued/played the track */
	queuedBy?: string;

	/** Duration of the track **in seconds** */
	duration?: number;

	/** Duration of the track **in timestamp** */
	durationTimestamp?: string;

	/** Has the track been playlisted? */
	playlisted?: boolean;

	/** Service providing track */
	service?: Service;

	/** Thumbnail of the track */
	thumbnail?: Thumbnail;

	/** Array of media urls */
	audio?: Array<Audio>;

	/** Author of music track. For example, a YouTube channel or SoundCloud user profile */
	author?: Author;

	/**
	 * An object that represents a music track
	 *
	 * @param {Object} data Internal data parameter, will come back to this later
	 */
	constructor(data: any = {}) {
		this.url = data.url;
		this.name = data.name;
		this.queuedBy = data.queuedBy;
		this.duration = data.duration;
		this.durationTimestamp = getTimeFromSeconds(data.duration);
		this.playlisted = data.playlisted;
		this.service = data.service;
		this.audio = data.audio;
		this.author = data.author;
	}
}

export class MusicPlaylist {
	/** Friendly URL of the playlist */
	url?: string;

	/** Name of the playlist */
	name?: string;

	/** Is the playlist an album? */
	isAlbum?: boolean;

	/** Array of MusicTracks in playlist */
	tracks?: Array<MusicTrack>;

	/** Author of playlist. For example, a YouTube channel or SoundCloud user profile */
	author?: Author;

	constructor(data: any = {}) {
		this.url = data.url;
		this.name = data.name;
		this.isAlbum = data.isAlbum;
		this.tracks = data.tracks;
	}
}
