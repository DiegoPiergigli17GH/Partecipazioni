import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Come pubblicare su Vercel",
  robots: { index: false, follow: false },
};

export default function PublishPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 py-4">
      <header className="text-center">
        <p className="text-[0.72rem] font-semibold tracking-[0.28em] text-primary uppercase">
          Link da mandare
        </p>
        <h1 className="font-heading mt-3 text-4xl leading-tight text-balance sm:text-5xl">
          Pubblicare su Vercel
        </h1>
        <p className="mt-4 text-pretty text-[0.95rem] leading-7 text-foreground/80">
          L’anteprima di Cursor la vedi solo tu. Vercel ti dà un indirizzo pubblico gratis, tipo{" "}
          <span className="whitespace-nowrap font-medium text-foreground">pranzo-partecipazioni.vercel.app</span>
          , da mandare in chat. Non serve comprare un dominio.
        </p>
      </header>

      <section className="rounded-[1.6rem] bg-card px-5 py-6 ring-1 ring-foreground/8 sm:px-7">
        <h2 className="font-heading text-2xl">Sul computer, in ordine</h2>
        <ol className="mt-4 space-y-4 text-sm leading-6">
          <li>
            <span className="font-medium text-foreground">1. Account Vercel.</span> Vai su{" "}
            <a className="underline underline-offset-4" href="https://vercel.com/signup" target="_blank" rel="noreferrer">
              vercel.com/signup
            </a>{" "}
            e entra con Gmail. Non chiede la carta.
          </li>
          <li>
            <span className="font-medium text-foreground">2. Node.js.</span> Se nel Terminale scrivi <code>node -v</code> e non compare un numero, installa la versione LTS da{" "}
            <a className="underline underline-offset-4" href="https://nodejs.org" target="_blank" rel="noreferrer">
              nodejs.org
            </a>
            .
          </li>
          <li>
            <span className="font-medium text-foreground">3. Scarica il progetto.</span> Nel Terminale:
            <pre className="mt-2 overflow-x-auto rounded-xl bg-foreground/5 px-3 py-3 text-xs">{`curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
origin auth login
origin repo clone diego-piergigli17/pranzo-partecipazioni
cd pranzo-partecipazioni`}</pre>
          </li>
          <li>
            <span className="font-medium text-foreground">4. Pubblica.</span> Sempre in quella cartella:
            <pre className="mt-2 overflow-x-auto rounded-xl bg-foreground/5 px-3 py-3 text-xs">{`npx vercel login
npx vercel --prod --yes`}</pre>
            Il login apre il browser: autorizza Vercel. Alla fine compare un link <span className="whitespace-nowrap">https://….vercel.app</span>. Quello è il modulo da mandare.
          </li>
          <li>
            <span className="font-medium text-foreground">5. Tieni le risposte.</span> Su vercel.com apri il progetto → scheda Storage → Create → Blob Store, collegalo a questo sito, poi Deployments → Redeploy. Altrimenti a ogni aggiornamento i “ci sono” possono sparire.
          </li>
        </ol>
      </section>

      <section className="rounded-[1.6rem] bg-card px-5 py-6 ring-1 ring-foreground/8 sm:px-7">
        <h2 className="font-heading text-2xl">Dopo che è online</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Agli invitati mandi la home. Il riepilogo è <span className="whitespace-nowrap font-medium text-foreground">/organizza</span>, PIN <span className="font-medium text-foreground">1309</span>.
        </p>
      </section>

      <p className="text-center text-sm">
        <Link href="/organizza" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Torna al riepilogo
        </Link>
        {" · "}
        <Link href="/" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Vedi il modulo
        </Link>
      </p>
    </main>
  );
}
