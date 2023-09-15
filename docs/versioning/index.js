import Github from "@actions/github";
import { readFileSync, readdirSync } from "fs";
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

    const jsPackageJsonPath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/jsEnv/package.json");
    const jsEnvPackageJson = JSON.parse(readFileSync(jsPackageJsonPath, "utf-8"));
    
    const jsDependencies = jsEnvPackageJson.dependencies;
    const authReactVersion = jsDependencies["supertokens-auth-react"];
    const nodeVersion = jsDependencies["supertokens-node"];
    const node7Version = jsDependencies["supertokens-node7"];
    const reactNativeVersion = jsDependencies["supertokens-react-native"];
    const webJsVersion = jsDependencies["supertokens-web-js"];
    const webjsScriptVersion = jsDependencies["supertokens-web-js-script"];
    const websiteVersion = jsDependencies["supertokens-website"];
    const websiteScriptVersion = jsDependencies["supertokens-website-script"];

    if (authReactVersion.includes("github:")) {
        throw new Error("supertokens-auth-react is not using a released version of the SDK.");
    }

    if (reactNativeVersion.includes("github:")) {
        throw new Error("supertokens-react-native is not using a released version of the SDK.");
    }

    if (nodeVersion.includes("github:") || node7Version.includes("github:")) {
        throw new Error("supertokens-node OR node7 is not using a released version of the SDK.");
    }

    if (webJsVersion.includes("github:") || webjsScriptVersion.includes("github:")) {
        throw new Error("supertokens-web-js OR web-js-script is not using a released version of the SDK.");
    }

    if (websiteVersion.includes("github:") || websiteScriptVersion.includes("github:")) {
        throw new Error("supertokens-website OR website-script is not using a released version of the SDK.");
    }
}

start();