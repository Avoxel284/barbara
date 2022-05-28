const barbara = require("../dist");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

(async () => {
	barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKeys("SOUNDCLOUD_CLIENTID"));

	let mt = await barbara.SoundCloud("https://soundcloud.com/onumi/baddest");
	console.log(mt);
	// let mt2 = await barbara.SoundCloudSearch("geoxor higher");
	// mt2 = mt2[0];
	// console.log(mt2);

	// console.log(await barbara.SoundCloudSearch("geoxor", 2, "tracks"));
	await mt.sing();
	// console.log(await mt2.sing(1));

	// console.log(await barbara.YouTubeSearch("bruh sfx", 5, "video").catch(console.error));
	// console.log(await barbara.YouTube("https://www.youtube.com/watch?v=dQw4w9WgXcQ").catch(console.error))
})();
