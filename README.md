# Mappa delle Organizzazioni Italiane

Una mappa interattiva che mostra la distribuzione delle organizzazioni sociali, culturali ed educative in Italia.

## Caratteristiche
- Visualizzazione delle organizzazioni su mappa
- Clustering automatico dei marker per aree densamente popolate
- Popup informativi per ogni organizzazione
- Filtro visivo per una migliore visualizzazione della mappa

## Come Aggiungere un'Organizzazione

Per aggiungere una nuova organizzazione, modifica il file `src/data/organizations.json`. Ogni organizzazione deve seguire questo formato:

```json
{
  "id": "13",                        // Identificativo univoco
  "name": "Nome Organizzazione",     // Nome completo dell'organizzazione
  "city": "Nome Città",              // Città sede dell'organizzazione
  "region": "Nome Regione",          // Regione di appartenenza
  "province": "Sigla Provincia",     // Provincia di appartenenza
  "address": "Via Roma 1",           // Indirizzo completo
  "cap": "00100",                    // Codice di Avviamento Postale
  "sector": "Sociale",               // Settore di attività
  "coordinates": {
    "lat": 41.9028,                 // Latitudine
    "lng": 12.4964                  // Longitudine
  }
}
```

### Settori Disponibili
- `Sociale`
- `Culturale`
- `Educativo`
- `Ambientale`

### Come Trovare le Coordinate
1. Vai su [Google Maps](https://www.google.com/maps)
2. Cerca l'indirizzo dell'organizzazione
3. Fai click destro sul punto esatto
4. Seleziona "Che cosa c'è qui?"
5. Le coordinate appariranno in basso (prima la latitudine, poi la longitudine)

### Esempio Pratico
```json
{
  "id": "13",
  "name": "Associazione Esempio",
  "city": "Milano",
  "region": "Lombardia",
  "province": "Milano",
  "address": "Via Esempio 123",
  "cap": "20123",
  "sector": "Sociale",
  "coordinates": {
    "lat": 45.4642,
    "lng": 9.1900
  }
}
```

## Sviluppo Locale

```bash
# Installa le dipendenze
yarn install

# Avvia il server di sviluppo
yarn dev
```

## Tecnologie Utilizzate
- React 18
- TypeScript
- Leaflet (per la mappa)
- Tailwind CSS (per lo stile)
- Vite (build tool)

## Note Importanti
- Assicurati che l'ID sia univoco
- Le coordinate devono essere precise per un corretto posizionamento
- Il CAP deve essere nel formato corretto (5 cifre)
- Mantieni la consistenza nei nomi delle regioni e province
