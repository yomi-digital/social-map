const token = import.meta.env.VITE_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
const owner = 'yomi-digital';
const repo = 'social-map';
const baseUrl = 'https://api.github.com';

// Logging dettagliato all'inizializzazione
console.log('GitHub Service Initialization:', {
  environment: {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL,
  },
  config: {
    owner,
    repo,
    hasToken: !!token,
    tokenFirstChars: token ? token.substring(0, 4) : 'none',
  }
});

if (!token) {
  console.error('Token non trovato. Variabili ambiente:', {
    importMetaEnv: import.meta.env,
    processEnv: process.env,
    tokenValue: token
  });
  throw new Error('GitHub token non trovato! Controlla le variabili d\'ambiente in produzione.');
}

const headers = {
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

// Aggiungi una funzione di test all'avvio
async function testGitHubConnection() {
  try {
    const response = await fetch(`${baseUrl}/repos/${owner}/${repo}`, { headers });
    const data = await response.json();
    console.log('GitHub Connection Test:', {
      success: response.ok,
      status: response.status,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    });
    return response.ok;
  } catch (error) {
    console.error('GitHub Connection Test Failed:', error);
    return false;
  }
}

// Esegui il test all'avvio
testGitHubConnection();

export const githubService = {
  async getFile(path: string) {
    const url = `${baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    console.log('Fetching file from:', url);
    
    try {
      const response = await fetch(url, { 
        headers,
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API Error:', {
          url,
          status: response.status,
          statusText: response.statusText,
          errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fatal error in getFile:', {
        path,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
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
      const mainRef = await this.getMainBranchRef();
      console.log('Creating branch with:', {
        branchName,
        mainRefSha: mainRef.object.sha
      });
      
      const response = await fetch(
        `${baseUrl}/repos/${owner}/${repo}/git/refs`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: mainRef.object.sha
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Branch creation failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          branchName,
          sha: mainRef.object.sha
        });
        throw new Error(`Branch creation failed: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Fatal error in createBranch:', {
        branchName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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