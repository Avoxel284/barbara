const barbara = require("../dist");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

(async () => {
	// let mt = await barbara.SoundCloud("https://soundcloud.com/onumi/baddest");
	// let mt2 = await barbara.SoundCloudSearch("geoxor higher");
	// mt2 = mt2[0];
	// console.log(mt2);

	// console.log(await barbara.SoundCloudSearch("geoxor", 2, "albums"));
	// console.log(await mt.sing(30));
	// console.log(await mt2.sing(1));

	// console.log(await barbara.YouTubeSearch("bruh sfx", 5, "video").catch(console.error));
	console.log(await barbara.YouTube("https://www.youtube.com/watch?v=dQw4w9WgXcQ").catch(console.error))
})();
