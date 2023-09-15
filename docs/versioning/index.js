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

const releaseNotesFirstLine = "This version is compatible with the following supertokens SDKs:";

function getJsEnvDependencies() {
    const jsPackageJsonPath = path.resolve(process.cwd(), "./v2/src/plugins/codeTypeChecking/jsEnv/package.json");
    const jsEnvPackageJson = JSON.parse(readFileSync(jsPackageJsonPath, "utf-8"));
    
    const jsDependencies = jsEnvPackageJson.dependencies;
    const authReactVersion = jsDependencies["supertokens-auth-react"];
    const nodeVersion = jsDependencies["supertokens-node"];
    const reactNativeVersion = jsDependencies["supertokens-react-native"];
    const webJsVersion = jsDependencies["supertokens-web-js"];
    const websiteVersion = jsDependencies["supertokens-website"];

    if (authReactVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-auth-react is not using a released version of the SDK.");
    }

    if (reactNativeVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-react-native is not using a released version of the SDK.");
    }

    if (nodeVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-node is not using a released version of the SDK.");
    }

    if (webJsVersion.includes("github")) {
        throw new UnreleasedSDKError("supertokens-web-js OR web-js-script is not using a released version of the SDK.");
    }

    if (websiteVersion.includes("git")) {
        throw new UnreleasedSDKError("supertokens-website OR website-script is not using a released version of the SDK.");
    }

    return {
        authReactVersion: getVersionForReleaseNotes(authReactVersion),
        nodeVersion: getVersionForReleaseNotes(nodeVersion),
        webJsVersion: getVersionForReleaseNotes(webJsVersion),
        websiteVersion: getVersionForReleaseNotes(websiteVersion),
        reactNativeVersion: getVersionForReleaseNotes(reactNativeVersion),
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

    return getVersionForReleaseNotes(version);
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

    return getVersionForReleaseNotes(version);
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

    return getVersionForReleaseNotes(version);
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

    const parts = supertokensVersionLine.split(",");

    if (parts.length !== 2) {
        throw new Error("Invalid version for supertokens-ios");
    }

    const version = parts[1].trim().replace("'", "").replace("'", "");

    return getVersionForReleaseNotes(version);
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

    return getVersionForReleaseNotes(version);
}

function getReleaseNotesWithVersions(versions) {
    return `
    ${releaseNotesFirstLine}

    supertokens-node: ${versions.jsVersions.nodeVersion}
    supertokens-golang: ${versions.goVersion}
    supertokens-python: ${versions.pythonVersion}
    supertokens-auth-react: ${versions.jsVersions.authReactVersion}
    supertokens-web-js: ${versions.jsVersions.webJsVersion}
    supertokens-react-native: ${versions.jsVersions.reactNativeVersion}
    supertokens-flutter: ${versions.flutterVersion}
    supertokens-ios: ${versions.iosVersion}
    supertokens-android: ${versions.androidVersion}
    `;
}

function getVersionForReleaseNotes(version) {
    const returnValue = version
        .replace("v", "")
        .replace("^", "")
        .replace("~>", "")
        .trim();

    // get major version from version string
    const parts = returnValue.split(".");
    
    let majorVersion = parts[0];
    let minorVersion = parts[1];

    if (majorVersion !== "0") {
        return `${majorVersion}.X.X`;
    } else {
        return `${majorVersion}.${minorVersion}.X`;
    }
}

async function start() {
    const expectedSdks = [
        "supertokens-node",
        "supertokens-golang",
        "supertokens-python",
        "supertokens-auth-react",
        "supertokens-web-js",
        "supertokens-react-native",
        "supertokens-flutter",
        "supertokens-ios",
        "supertokens-android",
    ];

    try {
        const flutterVersion = getFlutterVersion();
        const goVersion = getGolangVersion();
        const iosVersion = getIosVersion();
        const jsVersions = getJsEnvDependencies();
        const androidVersion = getAndroidVersion();
        const pythonVersion = getPythonVersion();

        const versions = {
            flutterVersion,
            goVersion,
            iosVersion,
            jsVersions,
            androidVersion,
            pythonVersion,
        };

        const releaseNotes = getReleaseNotesWithVersions(versions);

        const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);

        const releases = (await octokit.rest.repos.listReleases({
            owner: process.env.INPUT_GITHUB_OWNER,
            repo: "docs"
        })).data;

        if (releases.length === 0) {
            console.log("**************************************************");
            console.log("* No previous releases found, creating a new one *");
            console.log("**************************************************");

            await octokit.rest.repos.createRelease({
                owner: process.env.INPUT_GITHUB_OWNER,
                repo: "docs",
                tag_name: "1.0.0",
                name: "1.0.0",
                body: releaseNotes,
            });
        } else {
            console.log(releases[0])
            const latestReleaseNotes = releases[0].body;
            const lines = latestReleaseNotes.split("\n").filter((line) => {
                if (line === "\n") {
                    return false;
                }

                if (line === "") {
                    return false;
                }

                if (line.includes(releaseNotesFirstLine)) {
                    return false;
                }

                return true;
            }).map((line) => line.trim());

            console.log(lines)
        }
    } catch (e) {
        if (e.status === "UNRELEASED_SDK") {
            console.log("Skipping tagging because of unreleased SDKs")
            console.log(e.message)
        } else {
            throw e;
        }
    }
}

start();