/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
const core = require('@actions/core');

function getInputs() {
    return {
        driverName: core.getInput("driver-name", { required: true }),

        cdiVersion: core.getInput("cdi-version", { required: false }),
        coreMode: core.getInput("core-mode", { required: false }),
        corePlanType: core.getInput("core-plan-type", { required: false }),

        frontendMode: core.getInput("frontend-mode", { required: false }),
        fdiVersion: core.getInput("fdi-version", { required: false }),
    };
}

function ErrorFactory(params, dataDescription, response, statusCode) {
    const paramStr = Object.entries(params).map(([key, val]) => `${key}=${val}`).join(", ");

    return new Error(`Fetch ${dataDescription} for ${paramStr} yielded: ${response} with statusCode=${statusCode}`);
}

async function fetchWithApiKey({url, params, description, outputKey}) {
    const queryParams = new URLSearchParams({
        password: process.env.SUPERTOKENS_API_KEY,
        ...params,
    });

    const response = await fetch(url + params.toString());

    if (!response.ok) {
        throw ErrorFactory(params, description, await response.text(), response.status);
    }

    const data = await response.json()[outputKey];
    if (!data) {
        throw ErrorFactory(params, description, data, response.status);
    }

    return data;
}


function getFetchDetails(inputs) {
    return {
        coreVersion: (cdiVersion) => ({
            url: 'https://api.supertokens.io/0/core-driver-interface/dependency/core/latest',
            params: {
                planType: inputs.corePlanType,
                mode: inputs.coreMode,
                driverName: inputs.driverName,
                version: cdiVersion,
            },
            description: 'core version',
            outputKey: 'core',
        }),
        frontendVersionXY: (fdiVersion) => ({
            url: 'https://api.supertokens.io/0/frontend-driver-interface/dependency/frontend/latest',
            params: {
                frontendName: 'website',
                mode: inputs.frontendMode,
                driverName: inputs.driverName,
                version: fdiVersion,
            },
            description: 'frontend X.Y version',
            outputKey: 'frontend',
        }),
        frontendTag: (frontendVersionXY) => ({
            url: 'https://api.supertokens.io/0/driver/latest',
            params: {
                mode: inputs.frontendMode,
                name: 'website',
                version: frontendVersionXY,
            },
            description: 'frontend X.Y.Z version tag',
            outputKey: 'tag',
        }),
        frontendVersion: (frontendVersionXY) => ({
            url: 'https://api.supertokens.io/0/driver/latest',
            params: {
                mode: inputs.frontendMode,
                name: 'website',
                version: frontendVersionXY,
            },
            description: 'frontend X.Y.Z version',
            outputKey: 'version',
        }),
        nodeVersionXY: (fdiVersion) => ({
            url: 'https://api.supertokens.io/0/frontend-driver-interface/dependency/driver/latest',
            params: {
                frontendName: 'auth-react',
                mode: inputs.frontendMode,
                driverName: 'node',
                version: fdiVersion,
            },
            description: 'node driver X.Y version',
            outputKey: 'driver',
        }),
        nodeTag: (nodeVersionXY) => ({
            url: 'https://api.supertokens.io/0/driver/latest',
            params: {
                mode: inputs.frontendMode,
                name: 'node',
                version: nodeVersionXY,
            },
            description: 'node X.Y.Z version tag',
            outputKey: 'tag',
        }),
        authReactVersionXY: (fdiVersion) => ({
            url: 'https://api.supertokens.io/0/frontend-driver-interface/dependency/frontend/latest',
            params: {
                frontendName: 'auth-react',
                mode: inputs.frontendMode,
                driverName: inputs.driverName,
                version: fdiVersion,
            },
            description: 'auth-react frontend driver X.Y version',
            outputKey: 'frontend',
        }),
        authReactTag: (authReactVersionXY) => ({
            url: 'https://api.supertokens.io/0/driver/latest',
            params: {
                mode: inputs.frontendMode,
                name: 'auth-react',
                version: authReactVersionXY,
            },
            description: 'auth-react frontend X.Y version tag',
            outputKey: 'tag',
        }),
        authReactVersion: (authReactVersionXY) => ({
            url: 'https://api.supertokens.io/0/driver/latest',
            params: {
                mode: inputs.frontendMode,
                name: 'auth-react',
                version: authReactVersionXY,
            },
            description: 'auth-react frontend X.Y version',
            outputKey: 'version',
        }),
    };
}

async function main() {
    const inputs = getInputs();
    const fetchDetails = getFetchDetails(inputs);

    if (cdiVersion) {
        const coreVersion = await fetchWithApiKey(fetchDetails.coreVersion(cdiVersion));
        core.setOutput('core-version', coreVersion);
    }

    if (fdiVersion) {
        const frontendVersionXY = await fetchWithApiKey(fetchDetails.frontendVersionXY(fdiVersion));
        core.setOutput('frontend-version-xy', frontendVersionXY);

        const frontendTag = await fetchWithApiKey(fetchDetails.authReactTag(frontendVersionXY));
        core.setOutput('frontend-tag', frontendTag);

        const frontendVersion = await fetchWithApiKey(fetchDetails.authReactTag(frontendVersionXY));
        core.setOutput('frontend-version', frontendVersion);

        const nodeVersionXY = await fetchWithApiKey(fetchDetails.authReactTag(fdiVersion));
        core.setOutput('node-version-xy', nodeVersionXY);

        const nodeTag = await fetchWithApiKey(fetchDetails.authReactTag(nodeVersionXY));
        core.setOutput('node-tag', nodeTag);

        const authReactVersionXY = await fetchWithApiKey(fetchDetails.authReactTag(fdiVersion));
        core.setOutput('auth-react-version-xy', authReactVersionXY);

        const authReactTag = await fetchWithApiKey(fetchDetails.authReactTag(authReactVersionXY));
        core.setOutput('auth-react-tag', authReactTag);

        const authReactVersion = await fetchWithApiKey(fetchDetails.authReactTag(authReactVersionXY));
        core.setOutput('auth-react-version', authReactVersion);

    }
}

try {
    main();
} catch (err) {
    core.setFailed(err.message);
}

