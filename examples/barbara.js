const barbara = require("../barbara/");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

(async () => {
	console.log(await barbara.SoundCloud("https://soundcloud.com/onumi/baddest"));
})();
