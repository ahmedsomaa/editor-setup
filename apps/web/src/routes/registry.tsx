import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/registry")({
  component: RegistryLayout,
});

function RegistryLayout() {
  return <Outlet />;
}
