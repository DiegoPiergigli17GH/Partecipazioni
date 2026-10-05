# L'era del cinghiale in bianco

Modulo per le partecipazioni al banchetto d'autunno nel bosco: domenica 18 ottobre 2026, ore 18:00.

La versione precedente, *Whimsical Canarian Lunch* (13 settembre), è conservata nella storia della repo con l'etichetta `whimsical-canarian-lunch`.

## Come si usa, una volta online

1. Manda il link della home agli invitati.
2. Apri `/organizza` e entra con il PIN **1309**.
3. Da lì vedi chi c’è, i vegetariani e le birre, copi il link, scarichi un CSV, aggiorni luogo e orario, cambi il PIN.

Chi ha già risposto può aggiornare dallo stesso telefono. “Rispondi per un’altra persona” serve se più gente usa lo stesso cellulare.

## Sfondo

L'immagine di sfondo è `public/cinghiale-in-bianco.jpg`: basta sostituire quel file.

## Avvio in locale (solo per te)

```bash
npm install
npm run dev
```

Apri [http://localhost:43147](http://localhost:43147). Questo indirizzo **non** si manda agli invitati.

## Dati

In locale le risposte stanno in `data/state.json`. Online stanno nel Blob Store di Vercel, nel file `cinghiale-state.json`: le risposte del pranzo precedente restano a parte, in `pranzo-state.json`.
