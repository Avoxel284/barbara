#!/usr/bin/env node

return console.log(`Feature not fully implemented. Come back later`);

// Avoxel284 2022
// Barbara Music NPX tools

const inquirer = import("inquirer").then((bruhWtfIsThis) => {
	return bruhWtfIsThis;
});
const fs = require("fs");
const genConfig = require("./genConfig");

// colour codes because cant be bothered to use chalk
const cc = {
	bG: "\u001b[32;1m",
	bR: "\u001b[31;1m",
	bB: "\u001b[34;1m",
	0: "\u001b[0m",
};

console.log(`${cc["bB"]}Barbara Music Module Tools${cc[0]}`);
inquirer
	.prompt([
		{
			type: "list",
			name: "menu",
			message: "Choose an option:",
			choices: ["Authenticate and generate configuration file"],
		},
	])
	.then((ans) => {
		if (ans.menu === "Authenticate and generate configuration file") {
			console.log(`Please enter configuration details. Leave blank if not applicable.`);
			genConfig();
		}
	});
