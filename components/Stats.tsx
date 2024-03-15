interface StatsProps {
  totalPairs: number;
}

export default function Stats({ totalPairs }: StatsProps) {
  return (
    <p className="max-w-sm mx-auto border rounded-2xl py-1 px-4 text-white text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
      <b>{totalPairs}</b> pairs have been added so far
    </p>
  );
}
