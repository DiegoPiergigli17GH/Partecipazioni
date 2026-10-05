# L'era del cinghiale in bianco

Copia indipendente del modulo per le partecipazioni (l'originale, *Whimsical Canarian Lunch*, è nella cartella principale della repo e non viene toccato).

## Pubblicare su Vercel

1. Su [vercel.com](https://vercel.com): **Add New → Project**, importa la stessa repo `Partecipazioni`.
2. In **Root Directory** scegli `cinghiale-in-bianco`, poi **Deploy**.
3. Nel nuovo progetto: **Storage → Create → Blob Store**, collegalo, poi **Redeploy**. Così le risposte restano, separate da quelle dell'altro pranzo.
4. Mandi la **home** `https://….vercel.app`. Il riepilogo è `/organizza`, PIN `1309` (cambialo da lì).

## Sfondo

L'immagine di sfondo è `public/cinghiale-in-bianco.jpg`: basta sostituire quel file.

## Avvio in locale

```bash
cd cinghiale-in-bianco
npm install
npm run dev
```
