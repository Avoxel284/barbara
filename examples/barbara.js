const barbara = require("../dist");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

(async () => {
	let mt = await barbara.SoundCloud("https://soundcloud.com/onumi/baddest");
	// console.log(await barbara.SoundCloudSearch("geoxor", 2, "albums"));
	console.log(await mt.sing(30));
})();
