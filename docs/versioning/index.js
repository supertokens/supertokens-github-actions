import Github from "@actions/github";
import { readdirSync } from "fs";
import path from "path";
console.log("Environment variables:");
console.log("OWNER:", process.env.INPUT_GITHUB_OWNER);
console.log("GITHUB WORKSPACE:", process.env.GITHUB_WORKSPACE);
console.log("CURRENT WORKING DIRECTORY", process.cwd());
console.log("--------------");
console.log("");
console.log("");

async function start() {
    // const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
    // const tags = (await octokit.rest.repos.listTags({
    //     owner: process.env.INPUT_GITHUB_OWNER,
    //     repo: "docs"
    // })).data;

    console.log(readdirSync(path.resolve(process.cwd(), "./")))
}

start();