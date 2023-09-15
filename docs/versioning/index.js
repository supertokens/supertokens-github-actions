import Github from "@actions/github";

const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
console.log(await octokit.rest.repos.listTags());