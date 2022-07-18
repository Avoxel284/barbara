const barbara = require("../dist");
require("dotenv").config();

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

barbara.setKey("CONFIG_DEBUG", true);
barbara.setKey("GENIUS_TOKEN", "");
barbara.setKey("SPOTIFY_CLIENTID", process.env.SPOTIFY_CLIENTID);
barbara.setKey("SPOTIFY_CLIENTSECRET", process.env.SPOTIFY_SECRET);

(async () => {
	// barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKey("SOUNDCLOUD_CLIENTID"));
	// console.log(`set client id`);

	// let mt = await barbara.info("https://soundcloud.com/onumi/baddest");
	// console.log(mt);

	// barbara.search("auughhhh", { type: "videos", service: barbara.Service.youtube });
	// let info = await barbara.info("https://www.youtube.com/watch?v=qdoKxRaZcwM");
	// console.log(info.bestAudio());

	// barbara.searchGeniusSong("ducky leave").then(async (song)=>{
	// 	console.log(song)
	// 	console.log(await barbara.extractSongLyrics(song.url));

	// }).catch(console.error);

	// console.log(await barbara.fetchGeniusSongLyrics("https://genius.com/Ducky-leave-lyrics"));

	setTimeout(async () => {
		await barbara.info(
			"https://open.spotify.com/playlist/3LpW72MY6ELoySVSEEWptR?si=23d9b1fb8a0a402e"
		);
	}, 4000);
})();
