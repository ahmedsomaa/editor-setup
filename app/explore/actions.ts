"use server";

import { Pair } from "editor-setup";

export const getPairs = async (): Promise<Pair[]> => {
  const res = await fetch(process.env.DATA_URL!);
  return (await res.json()) as Pair[];
};
