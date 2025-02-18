const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'liviolombardo';
const REPO_NAME = 'social-map';
const BASE_URL = 'https://api.github.com';

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

export const githubService = {
  async getFile(path: string) {
    console.log('Token:', GITHUB_TOKEN);
    console.log('Headers:', headers);
    
    const response = await fetch(
      `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      { headers }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API Error Response:', errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    return response.json();
  },

  async createBranch(branchName: string, sha: string) {
    const response = await fetch(
      `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha
        })
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async updateFile(path: string, content: string, message: string, branch: string, sha: string) {
    const response = await fetch(
      `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          content: btoa(content),
          branch,
          sha
        })
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async createPR(title: string, body: string, head: string, base: string = 'main') {
    const response = await fetch(
      `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          head,
          base
        })
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}; 