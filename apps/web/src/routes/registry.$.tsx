import { createFileRoute, redirect } from "@tanstack/react-router";

/** The Presets page used to live at /registry. Old links and search results keep working. */
export const Route = createFileRoute("/registry/$")({
  beforeLoad: ({ params, location }) => {
    const rest = params._splat ? `/${params._splat}` : "";
    throw redirect({ href: `/presets${rest}${location.searchStr}`, statusCode: 301 });
  },
});
