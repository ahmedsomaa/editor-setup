import { Pair } from "editor-setup";

import pairs from "@/data/index.json";

export const getPairs = async (): Promise<Pair[]> => {
  const dataUrl = process.env.DATA_URL;
  if (dataUrl) {
    const res = await fetch(dataUrl);
    return (await res.json()) as Pair[];
  }

  return pairs as Pair[];
};
