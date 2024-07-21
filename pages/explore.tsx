import { Pair } from "@/models/pair";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import PairCard from "@/components/PairCard";
import { bricolageGrotesque } from "@/lib/fonts";

interface ExploreProps {
  pairs: Pair[];
}

export default function Explore({ pairs }: ExploreProps) {
  return (
    <div className={bricolageGrotesque}>
      <Heading />
      <div className="fixed left-0 top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen"></div>
      </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-20">
        <main className="min-h-screen flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <Header />
            <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
              <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
                <b>{pairs.length}</b> pairs have been added so far
              </p>
              <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
                Available <span className="text-[#007ACC]">Pairs</span>
              </h1>
            </div>
          </div>
          <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6">
            {pairs.map((pair) => (
              <PairCard key={pair.id} pair={pair} />
            ))}
          </div>
        </main>
        <Footer
          bgColor="bg-white"
          iconColor="text-[#007ACC] hover:text-[#007ACC]/90"
        />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const req = await fetch(
    "https://raw.githubusercontent.com/ahmedsomaa/editor-setup/main/data/pairs.json"
  );
  const pairs: Pair[] = await req.json();
  return {
    props: {
      pairs,
    },
  };
}
