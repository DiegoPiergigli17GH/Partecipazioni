# Pranzo del 13 settembre

Modulo per le partecipazioni di un pranzo. Repository: `diego-piergigli17/pranzo-partecipazioni`.

## Pubblicare su Vercel (il link da mandare)

L’anteprima di Cursor e `localhost` li vedi solo tu. Per gli invitati serve un indirizzo pubblico, gratis, su [Vercel](https://vercel.com).

1. Account su [vercel.com/signup](https://vercel.com/signup) con Gmail (niente carta).
2. Sul computer servono [Node.js LTS](https://nodejs.org) e il progetto:

```bash
curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
origin auth login
origin repo clone diego-piergigli17/pranzo-partecipazioni
cd pranzo-partecipazioni
```

3. Pubblica:

```bash
npx vercel login
npx vercel --prod --yes
```

4. Nel progetto su Vercel: **Storage → Create → Blob Store**, collegalo, poi **Redeploy**. Così le risposte restano.
5. Mandi la **home** `https://….vercel.app`. Il riepilogo è `/organizza`, PIN `1309`.

Stesse istruzioni sulla pagina `/pubblica`.

## Come si usa, una volta online

1. Manda il link della home agli invitati.
2. Apri `/organizza` e entra con il PIN **1309**.
3. Da lì vedi chi c’è, i vegetariani e le birre, copi il link, scarichi un CSV, aggiorni luogo e orario, cambi il PIN.

Chi ha già risposto può aggiornare dallo stesso telefono. “Rispondi per un’altra persona” serve se più gente usa lo stesso cellulare.

## Avvio in locale (solo per te)

```bash
npm install
npm run dev
```

Apri [http://localhost:43147](http://localhost:43147). Questo indirizzo **non** si manda agli invitati.

## Dati

In locale le risposte stanno in `data/state.json`. Online, con il Blob Store di Vercel, stanno lì.
