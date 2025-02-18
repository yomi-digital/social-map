import config from '../config/github';

const headers = {
  'Authorization': `token ${config.token}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

export const githubService = {
  async getFile(path: string) {
    const response = await fetch(
      `${config.baseUrl}/repos/${config.owner}/${config.repo}/contents/${path}`,
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
      `${config.baseUrl}/repos/${config.owner}/${config.repo}/git/refs`,
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
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    return response.json();
  },

  async updateFile(path: string, content: string, message: string, branch: string, sha: string) {
    const response = await fetch(
      `${config.baseUrl}/repos/${config.owner}/${config.repo}/contents/${path}`,
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
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    return response.json();
  },

  async createPR(title: string, body: string, head: string, base: string = 'main') {
    const response = await fetch(
      `${config.baseUrl}/repos/${config.owner}/${config.repo}/pulls`,
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
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    return response.json();
  }
}; 