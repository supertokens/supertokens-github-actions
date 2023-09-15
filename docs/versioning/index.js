import Github from "@actions/github";

console.log(process.env);
const octokit = new Github.GitHub(process.env.TOKEN_FOR_GITHUB);