"use server";

import { Pair } from "editor-setup";
import { responseSchema } from "../api/pairs/validations";

export const getPairs = async (): Promise<Pair[]> => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/pairs?key=${process.env.API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to get pairs");
  }

  const resBody = (await res.json()) as unknown;
  const parsedResBody = responseSchema.safeParse(resBody);
  if (!parsedResBody.success) {
    throw new Error("Wrong response schema");
  }
  return parsedResBody.data.data.pairs;
};
