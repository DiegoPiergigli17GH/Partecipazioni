# Pranzo del 13 settembre

Modulo per le partecipazioni di un pranzo, da mandare con un link. Gli invitati dicono se ci sono, se mangiano vegetariano e quante birre bevono. Tu vedi i totali in una pagina riepilogo.

## Il link da mandare

Il Preview o `localhost` lo vedi solo tu. Gli amici, aprendo quell’indirizzo, non arrivano al modulo.

Non serve comprare un dominio tipo `www.qualcosa.it` e non serve un server. Si pubblica gratis su [Vercel](https://vercel.com): ottieni un indirizzo `https://….vercel.app` e quello lo mandi in chat.

Istruzioni passo passo anche sulla pagina `/pubblica` del sito.

1. Registrati su [vercel.com/signup](https://vercel.com/signup) con Gmail (niente carta).
2. Carica il progetto (Import da GitHub, oppure dal computer):

```bash
npx vercel login
npx vercel --prod --yes
```

3. Nel progetto Vercel: **Storage → Create → Blob Store**, collegalo al sito, poi **Redeploy**. Così le risposte non si perdono.
4. Mandi la **home** pubblica. Il riepilogo è `/organizza`, PIN `1309`.

## Come si usa, una volta online

1. Manda il link della home agli invitati.
2. Apri `/organizza` e entra con il PIN **1309**.
3. Da lì puoi vedere chi c’è, i vegetariani e le birre, copiare il link, scaricare un CSV, aggiornare luogo e orario, cambiare il PIN.

Le risposte si possono modificare: chi ha già inviato torna sullo stesso telefono e aggiorna. C’è anche “Rispondi per un’altra persona” se più gente usa lo stesso cellulare.

## Avvio in locale (solo per te)

```bash
npm install
npm run dev
```

Apri [http://localhost:43147](http://localhost:43147). Questo indirizzo **non** si manda agli invitati.

## Dati

In locale le risposte stanno in `data/state.json`. Online, con il Blob Store di Vercel, stanno lì.
