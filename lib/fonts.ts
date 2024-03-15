import { Bricolage_Grotesque } from "next/font/google";

const font = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

export const bricolageGrotesque = font.className;
