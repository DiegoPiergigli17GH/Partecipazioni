# Pranzo del 13 settembre

Modulo per le partecipazioni di un pranzo, da mandare con un link. Gli invitati dicono se ci sono, se mangiano vegetariano e quante birre bevono. Tu vedi i totali in una pagina riepilogo.

Non serve Google Forms: apri il sito, copi l’indirizzo, lo mandi in chat.

## Come si usa

1. Avvia il sito (qui sotto).
2. Manda il link della **home** agli invitati.
3. Apri `/organizza` e entra con il PIN **1309**.
4. Da lì puoi:
   - vedere chi c’è, i vegetariani e quante birre prendere
   - copiare il link da condividere
   - scaricare un CSV
   - aggiornare titolo, data, orario, luogo e messaggio
   - cambiare il PIN

Le risposte si possono modificare: chi ha già inviato torna sullo stesso telefono e aggiorna. C’è anche “Rispondi per un’altra persona” se più gente usa lo stesso cellulare.

## Avvio in locale

```bash
npm install
npm run dev
```

Apri [http://localhost:43147](http://localhost:43147).

Build di produzione:

```bash
npm run build
npm start
```

## Dati

Le risposte stanno in `data/rsvps.json`, i dettagli dell’evento in `data/event.json`. Non vanno in git.

Se fai il deploy su un hosting senza disco persistente (tipo Vercel), le risposte si perdono al riavvio. Per un pranzo va benissimo tenerlo acceso in locale, su un VPS, o su questo ambiente.
