const token = import.meta.env.VITE_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
const owner = 'yomi-digital';
const repo = 'social-map';
const baseUrl = 'https://api.github.com';

console.log('GitHub Service Configuration:', {
  owner,
  repo,
  token: token ? 'Present' : 'Missing',
});

if (!token) {
  throw new Error('GitHub token non trovato!');
}

const headers = {
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

export const githubService = {
  async getFile(path: string) {
    const url = `${baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    console.log('Fetching file from:', url);
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      const data = await response.json();
      console.log('File fetched successfully:', {
        path,
        sha: data.sha,
        size: data.size
      });
      
      return data;
    } catch (error) {
      console.error('Error in getFile:', error);
      throw error;
    }
  },

  async getMainBranchRef() {
    const response = await fetch(
      `${baseUrl}/repos/${owner}/${repo}/git/ref/heads/main`,
      { headers }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    return response.json();
  },

  async createBranch(branchName: string, sha: string) {
    try {
      // Prima otteniamo il riferimento al branch main
      const mainRef = await this.getMainBranchRef();
      
      const response = await fetch(
        `${baseUrl}/repos/${owner}/${repo}/git/refs`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: mainRef.object.sha // Usiamo lo SHA del branch main
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Branch creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          requestBody: {
            ref: `refs/heads/${branchName}`,
            sha: mainRef.object.sha
          }
        });
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error in createBranch:', error);
      throw error;
    }
  },

  async updateFile(path: string, content: string, message: string, branch: string, sha: string) {
    const response = await fetch(
      `${baseUrl}/repos/${owner}/${repo}/contents/${path}`,
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
      `${baseUrl}/repos/${owner}/${repo}/pulls`,
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

// Aggiungi questo metodo per testare l'accesso
async function testGitHubAccess() {
  try {
    const response = await fetch(`${baseUrl}/repos/${owner}/${repo}`, { headers });
    const data = await response.json();
    console.log('GitHub Repository Access Test:', {
      success: response.ok,
      status: response.status,
      repoData: data
    });
    return response.ok;
  } catch (error) {
    console.error('GitHub Access Test Failed:', error);
    return false;
  }
}

// Chiama il test all'avvio
testGitHubAccess(); 