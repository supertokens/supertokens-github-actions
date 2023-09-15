import Github from "@actions/github";
import fs from "fs";
import path from "path";

console.log("Environment variables:");
console.log("OWNER: " + process.env.INPUT_GITHUB_OWNER);
console.log("--------------");
console.log("");
console.log("");

async function start() {
    const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
    const tags = (await octokit.rest.repos.listTags({
        owner: process.env.INPUT_GITHUB_OWNER,
        repo: "docs"
    })).data;

    console.log(process.cwd());
    console.log(fs.readdirSync(path.resolve(process.cwd(), "../../../")));
}

start();