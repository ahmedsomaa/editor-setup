import Head from "next/head";
import { Pair } from "./api/pairs";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import PairCard from "@/components/PairCard";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export default function Component({ pairs }: { pairs: Pair[] }) {
  return (
    <div
      className={`${inter.className} flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen`}
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>VS Code Theme and Font Pair</title>
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          <b>{pairs.length}</b> pairs have been added so far
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Find the optimal theme and font for your next VS Code setup.
        </h1>
      </main>
      <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6">
        {pairs.map((pair) => (
          <PairCard key={pair.id} pair={pair} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const req = await fetch("http://localhost:3000/api/pairs");
  const pairs: Pair[] = await req.json();

  return {
    props: {
      pairs,
    },
  };
}
