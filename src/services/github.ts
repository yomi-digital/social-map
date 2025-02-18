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
        cache: 'no-store' // Forza il bypass della cache
      });
      
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