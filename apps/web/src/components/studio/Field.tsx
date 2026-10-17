/** One group of controls in the Studio form. */
export function Field({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      {children}
    </fieldset>
  );
}
