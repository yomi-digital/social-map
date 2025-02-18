const config = {
  token: import.meta.env.VITE_GITHUB_TOKEN,
  owner: 'liviolombardo',
  repo: 'social-map',
  baseUrl: 'https://api.github.com'
};

if (!config.token) {
  throw new Error('GitHub token non trovato! Controlla il file .env');
}

export default config; 