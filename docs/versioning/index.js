import Github from "@actions/github";
import { readdirSync } from "fs";
import fetch from "node-fetch";
import path from "path";
import tar from "tar";
import stream from "node:stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

console.log("Environment variables:");
console.log("OWNER: " + process.env.INPUT_GITHUB_OWNER);
console.log("--------------");
console.log("");
console.log("");

async function start() {
    const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
    // const tags = (await octokit.rest.repos.listTags({
    //     owner: process.env.INPUT_GITHUB_OWNER,
    //     repo: "docs"
    // })).data;

    // download entire repo from github
    const downloadURL = `https://github.com/${process.env.INPUT_GITHUB_OWNER}/docs/archive/master.tar.gz`;
    console.log("Downloading from: " + downloadURL);

    const downloadResponse = await fetch(downloadURL);
    console.log("Repsonse", downloadResponse.status, downloadResponse.statusText)
    await pipeline(
        downloadResponse.body,
        tar.extract({
            filter: (path) => {
                if (path.includes("codeTypeChecking")) {
                    return true;
                }

                return false;
            },
        }, [])
    )

    pipeline(
        downloadResponse.body,
        tar.extract(
            {
                strict: true,
                filter: (path, _) => {
                    if (path.includes("codeTypeChecking")) {
                        return true;
                    }
    
                    return false;
                },
            },
        )
    );

    readdirSync(path.resolve(process.cwd(), "./"));
}

start();