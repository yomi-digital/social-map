console.log('Environment variables:', import.meta.env);

const config = {
  token: import.meta.env.VITE_GITHUB_TOKEN,
  owner: 'liviolombardo',
  repo: 'social-map',
  baseUrl: 'https://api.github.com'
};

if (!config.token) {
  console.error('Token non trovato nelle variabili di ambiente:', import.meta.env);
  throw new Error(`
    GitHub token non trovato! 
    Controlla che:
    1. Il file .env esista nella root del progetto
    2. Contenga la variabile VITE_GITHUB_TOKEN
    3. Il valore sia corretto
    4. Il server sia stato riavviato
  `);
}

export default config; 