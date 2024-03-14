// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pairs from "@/data/pairs.json";
import type { NextApiRequest, NextApiResponse } from "next";

export type Pair = {
  id: string;
  font: {
    url: string;
    name: string;
  };
  image: string;
  theme: {
    url: string;
    name: string;
  };
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Pair[]>
) {
  res.status(200).json(pairs);
}
