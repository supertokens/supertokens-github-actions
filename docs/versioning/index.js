import Github from "@actions/github";
import { readFileSync, readdirSync } from "fs";
import path from "path";
console.log("Environment variables:");
console.log("OWNER:", process.env.INPUT_GITHUB_OWNER);
console.log("--------------");
console.log("");
console.log("");

class UnreleasedSDKError extends Error {
    status = "UNRELEASED_SDK"

    constructor(message) {
        super(message);
        this.name = "UnreleasedSDKError";
    }
}

function getJsEnvDependencies() {
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

    if (authReactVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-auth-react is not using a released version of the SDK.");
    }

    if (reactNativeVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-react-native is not using a released version of the SDK.");
    }

    if (nodeVersion.includes("git") || node7Version.includes("git")) {
        throw new UnreleasedSDKError("supertokens-node OR node7 is not using a released version of the SDK.");
    }

    if (webJsVersion.includes("github") || webjsScriptVersion.includes("github")) {
        throw new UnreleasedSDKError("supertokens-web-js OR web-js-script is not using a released version of the SDK.");
    }

    if (websiteVersion.includes("git") || websiteScriptVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-website OR website-script is not using a released version of the SDK.");
    }

    return {
        authReactVersion,
        nodeVersion,
        webJsVersion,
        websiteVersion,
        reactNativeVersion,
    };
}

function getGolangVersion() {
    const packagePath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/goEnv/go.mod");

    const fileContents = readFileSync(packagePath, "utf-8");
    const lines = fileContents.split("\n");

    let supertokensVersionLine = lines.find((line) => line.includes("supertokens/supertokens-golang"));

    if (supertokensVersionLine === undefined) {
        throw new Error("Error reading version for golang");
    }

    supertokensVersionLine = supertokensVersionLine.trim();

    const parts = supertokensVersionLine.split(" ");

    if (parts.length !== 2) {
        throw new Error("Invalid version for supertokens-golang");
    }

    const version = parts[1].trim();

    if (version.includes("git")) {
        throw new UnreleasedSDKError("supertokens-golang is not using a released version of the SDK.");
    }

    return version;
}

function getPythonVersion() {
    const packagePath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/pythonEnv/requirements.txt");

    const fileContents = readFileSync(packagePath, "utf-8");
    const lines = fileContents.split("\n");

    let supertokensVersionLine = lines.find((line) => line.includes("supertokens-python"));

    if (supertokensVersionLine === undefined) {
        throw new Error("Error reading version for python");
    }

    supertokensVersionLine = supertokensVersionLine.trim();

    if (supertokensVersionLine.includes("git")) {
        throw new UnreleasedSDKError("supertokens-python is not using a released version of the SDK.");
    }

    const parts = supertokensVersionLine.split("==");

    if (parts.length !== 2) {
        throw new Error("Invalid version for supertokens-python");
    }

    const version = parts[1].trim();

    return version;
}

function getFlutterVersion() {
    const packagePath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/dart_env/pubspec.yaml");

    const fileContents = readFileSync(packagePath, "utf-8");
    const lines = fileContents.split("\n");

    let supertokensVersionLine = lines.find((line) => line.includes("supertokens_flutter"));

    if (supertokensVersionLine === undefined) {
        throw new Error("Error reading version for flutter");
    }

    supertokensVersionLine = supertokensVersionLine.trim();

    const parts = supertokensVersionLine.split(":");

    if (parts.length !== 2) {
        throw new Error("Invalid version for supertokens_flutter");
    }

    const version = parts[1].trim();

    if (version.includes("git")) {
        throw new UnreleasedSDKError("supertokens_flutter is not using a released version of the SDK.");
    }

    return version;
}

function getIosVersion() {
    const packagePath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/iosenv/Podfile");

    const fileContents = readFileSync(packagePath, "utf-8");
    const lines = fileContents.split("\n");

    let supertokensVersionLine = lines.find((line) => line.includes("SuperTokensIOS"));

    if (supertokensVersionLine === undefined) {
        throw new Error("Error reading version for ios");
    }

    supertokensVersionLine = supertokensVersionLine.trim();

    if (supertokensVersionLine.includes(":git")) {
        throw new UnreleasedSDKError("supertokens-ios is not using a released version of the SDK.");
    }

    console.log("SuperTokens ios version line:", supertokensVersionLine);
    throw new Error("Implement");
}

function getAndroidVersion() {
    const packagePath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/kotlinEnv/app/build.gradle");

    const fileContents = readFileSync(packagePath, "utf-8");
    const lines = fileContents.split("\n");

    let supertokensVersionLine = lines.find((line) => line.includes("com.github.supertokens:supertokens-android"));

    if (supertokensVersionLine === undefined) {
        throw new Error("Error reading version for android");
    }

    supertokensVersionLine = supertokensVersionLine.trim();
    const parts = supertokensVersionLine.split(" ");
    let implementationPathPart = parts[parts.length - 1].trim();

    if (!implementationPathPart.includes("com.github.supertokens:supertokens-android")) {
        throw new Error("Invalid declaration for supertokens-android");
    }

    let version = implementationPathPart.replace("'com.github.supertokens:supertokens-android:", "")
        .replace("'", "")

    if (version.includes("git")) {
        throw new UnreleasedSDKError("supertokens-android is not using a released version of the SDK.");
    }

    return version;
}

async function start() {
    // const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
    // const tags = (await octokit.rest.repos.listTags({
    //     owner: process.env.INPUT_GITHUB_OWNER,
    //     repo: "docs"
    // })).data;

    const flutterVersion = getFlutterVersion();
    const goVersion = getGolangVersion();
    const iosVersion = getIosVersion();
    const jsEnv = getJsEnvDependencies();
    const androidVersion = getAndroidVersion();
    const pythonVersion = getPythonVersion();

    console.log(JSON.parse(JSON.stringify({
        flutterVersion,
        goVersion,
        iosVersion,
        jsEnv,
        androidVersion,
        pythonVersion,
    })))
}

start();