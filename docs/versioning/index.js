import Github from "@actions/github";
import { readdirSync } from "fs";
import fetch from "node-fetch";
import path from "path";
import { pipeline } from "stream";
import tar from "tar";

console.log("Environment variables:");
console.log("OWNER: " + process.env.INPUT_GITHUB_OWNER);
console.log("--------------");
console.log("");
console.log("");

const httpClient = new HttpClient.HttpClient();

async function start() {
    const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
    // const tags = (await octokit.rest.repos.listTags({
    //     owner: process.env.INPUT_GITHUB_OWNER,
    //     repo: "docs"
    // })).data;

    // download entire repo from github
    const downloadURL = `http://github.com/${process.env.INPUT_GITHUB_OWNER}/docs/archive/master.tar.gz`;

    const downloadResponse = await fetch(downloadURL);
    await pipeline(
        downloadResponse.body,
        tar.extract({
            strict: true,
            filter: (path) => {
                if (path.includes("codeTypeChecking")) {
                    return true;
                }

                return false;
            },
        }, [])
    )

    readdirSync(path.resolve(process.cwd(), "./"));
}

start();