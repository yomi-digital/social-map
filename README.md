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
  "id": "1",
  "name": "Organizzazione 1",
  "city": "Città 1",
  "region": "Regione 1",
  "province": "Provincia 1",
  "address": "Indirizzo 1",
  "cap": "CAP 1",
  "sector": "Settore 1",
  "coordinates": {
    "lat": 41.9067,
    "lng": 12.4964
  
## Struttura del Progetto 

### Settori Disponibili
- Sociale
- Culturale
- Educativo
- Ambientale

### Come Trovare le Coordinate
1. Vai su [Google Maps](https://www.google.com/maps)
2. Cerca l'indirizzo dell'organizzazione
3. Fai click destro sul punto esatto
4. Seleziona "Che cosa c'è qui?"
5. Le coordinate appariranno in basso (prima la latitudine, poi la longitudine)

### Esempio Completo 
json
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
