import Github from "@actions/github";

console.log(process.env.INPUT_GITHUB_OWNER)
const octokit = Github.getOctokit(process.env.INPUT_GITHUB_TOKEN);
const tags = await octokit.rest.repos.listTags({
    owner: "nkshah2",
    repo: "docs"
});
console.log("TAGSSSS");
console.log(tags);