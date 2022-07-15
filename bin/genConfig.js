// Avoxel284 2022

const fs = require("fs");
const inquirer = import("inquirer");
const path = require("path");

const questions = [
	{
		type: "input",
		name: "filepath",
		message: "Enter a filepath to save config relative to current working directory",
		validate(val) {
			if (!val || fs.existsSync(path.join(process.cwd, val)))
				return "A file already exists at the given file path:" + path.join(process.cwd, val);
			return true;
		},
	},
	{
		type: "input",
		name: "SOUNDCLOUD_CLIENTID",
		message: "Enter a filepath to save config relative to current working directory",
	},
	{
		type: "input",
		name: "filepath",
		message: "Enter a filepath to save config relative to current working directory",
	},
	{
		type: "input",
		name: "filepath",
		message: "Enter a filepath to save config relative to current working directory",
	},
];

module.exports = () => {
	inquirer.prompt(questions).then(async (ans) => {
		console.log(`Processing...`);
		console.log(ans);

		let data = {
			SOUNDCLOUD_CLIENTID: ans.SOUNDCLOUD_CLIENTID,
		};

		try {
			for (let v in ans) {
				console.log(v);
			}

			fs.writeFile(path.join(process.cwd, val), JSON.stringify(data));
		} catch (err) {
			console.log(`An error occurred when attempting to create configuration file:`);
			throw err;
		}
		console.log(`${cc["bG"]}Successfully generated configuration file!${cc[0]}`);
	});
};
