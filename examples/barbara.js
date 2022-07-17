const barbara = require("../dist");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

barbara.setKey("CONFIG_DEBUG", true);
barbara.setKey("GENIUS_TOKEN", "MilVK-zUawQ4t2K-zSrhck04-kFElh4wus5WthsA9-MYEl0TQ3XPy-W0ltxY4LSJ");

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
})();
