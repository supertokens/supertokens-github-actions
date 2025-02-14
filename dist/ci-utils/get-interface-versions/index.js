/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
const core = require('@actions/core');
const fs = require('fs');

function getInputs() {
    return {
        driverName: core.getInput("driver-name", { required: true }),

        hasCdi: core.getBooleanInput("has-cdi", { required: true }),
        coreMode: core.getInput("core-mode", { required: false }),
        corePlanType: core.getInput("core-plan-type", { required: false }),

        hasFdi: core.getBooleanInput("has-fdi", { required: true }),
        frontendMode: core.getInput("frontend-mode", { required: false }),
    };
}

async function main() {
    const inputs = getInputs();
    const fetchDetails = getFetchDetails(inputs);

    if (hasCdi) {
        cdiFile = await fs.readFile('coreDriverInterfaceSupported');
        cdiVersions = JSON.parse(cdiFile).versions;

        core.setOutput('cdi-versions', JSON.stringify(cdiVersions));
    }

    if (hasFdi) {
        fdiFile = await fs.readFile('frontendDriverInterfaceSupported');
        fdiVersions = JSON.parse(fdiFile).versions;

        core.setOutput('fdi-versions', JSON.stringify(cdiVersions));
    }
}

try {
    main();
} catch (err) {
    core.setFailed(err.message);
}

