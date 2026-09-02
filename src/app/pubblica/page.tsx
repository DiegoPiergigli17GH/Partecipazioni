import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Come mandare il link",
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
          Il Preview non arriva agli invitati
        </h1>
        <p className="mt-4 text-pretty text-[0.95rem] leading-7 text-foreground/80">
          Quello che vedi ora gira solo qui, sul computer di questo ambiente. Se lo inoltri su WhatsApp, gli altri non lo aprono. Non ti serve comprare un sito <span className="whitespace-nowrap">www.qualcosa.it</span> né un server: basta un indirizzo pubblico gratis, tipo{" "}
          <span className="whitespace-nowrap font-medium text-foreground">pranzo.vercel.app</span>.
        </p>
      </header>

      <section className="rounded-[1.6rem] bg-card px-5 py-6 ring-1 ring-foreground/8 sm:px-7">
        <h2 className="font-heading text-2xl">Cosa fare, in pratica</h2>
        <ol className="mt-4 space-y-4 text-sm leading-6">
          <li>
            <span className="font-medium text-foreground">1. Account gratis su Vercel.</span> Vai su{" "}
            <a className="underline underline-offset-4" href="https://vercel.com/signup" target="_blank" rel="noreferrer">
              vercel.com/signup
            </a>{" "}
            e entra con Gmail. Non chiede la carta di credito.
          </li>
          <li>
            <span className="font-medium text-foreground">2. Carica questo progetto.</span> Da Vercel: Add New → Project. Se hai creato il repository GitHub, importalo. Altrimenti, dal computer, nella cartella del sito:
            <pre className="mt-2 overflow-x-auto rounded-xl bg-foreground/5 px-3 py-3 text-xs">npx vercel login
npx vercel --prod --yes</pre>
            Alla fine ti dà un link <span className="whitespace-nowrap">https://….vercel.app</span>.
          </li>
          <li>
            <span className="font-medium text-foreground">3. Salva le risposte per davvero.</span> Su Vercel il disco si cancella a ogni aggiornamento. Nel progetto: Storage → Create → Blob Store, collegalo a questo sito e fai Redeploy. Da quel momento i “ci sono” restano.
          </li>
          <li>
            <span className="font-medium text-foreground">4. Mandalo in chat.</span> Il link da inoltrare è la <strong>home</strong> del sito pubblico, non questa pagina Preview. Il riepilogo resta su <span className="whitespace-nowrap">/organizza</span> con PIN 1309.
          </li>
        </ol>
      </section>

      <section className="rounded-[1.6rem] bg-card px-5 py-6 ring-1 ring-foreground/8 sm:px-7">
        <h2 className="font-heading text-2xl">Perché non basta “inviare e via”</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Un Google Form sta già sui server di Google, quindi il link funziona per tutti. Questo sito, finché gira solo in Preview o su localhost, esiste solo per te. Una volta pubblicato, il gesto è lo stesso: copi il link e lo mandi.
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
