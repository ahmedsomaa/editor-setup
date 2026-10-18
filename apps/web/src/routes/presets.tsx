import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/presets")({
  component: PresetsLayout,
});

function PresetsLayout() {
  return <Outlet />;
}
