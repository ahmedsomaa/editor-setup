import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { Pair } from "editor-setup";
import { requestSchema } from "./validations";
import { fontsTable, pairsTable, themesTable } from "@/db/schema";

export async function GET(req: NextRequest) {
  const query = requestSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams.entries())
  );
  
  if (!query.success) {
    return NextResponse.json({
      code: 400,
      message: "Key is required in search params",
    });
  }

  if (query.data.key !== process.env.API_KEY) {
    return NextResponse.json({
      code: 401,
      message: "Invalid API key",
    });
  }

  const results = await db
    .select({
      pairId: pairsTable.id,
      previewUrl: pairsTable.previewUrl,
      fontName: fontsTable.name,
      fontUrl: fontsTable.site,
      themeName: themesTable.name,
      themeUrl: themesTable.site,
    })
    .from(pairsTable)
    .innerJoin(fontsTable, eq(pairsTable.fontId, fontsTable.id))
    .innerJoin(themesTable, eq(pairsTable.themeId, themesTable.id));

  const pairs = results.map((result) => ({
    id: result.pairId.toString(),
    font: { name: result.fontName, url: result.fontUrl },
    theme: { name: result.themeName, url: result.themeUrl },
    image: result.previewUrl,
  })) satisfies Pair[];

  return NextResponse.json({ code: 200, data: { pairs } });
}
