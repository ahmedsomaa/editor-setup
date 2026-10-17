/** Terms with a short explanation each, split by hairlines. */
export function TermList({
  terms,
}: {
  terms: ReadonlyArray<readonly [term: string, text: string]>;
}) {
  return (
    <dl className="border-border mt-8 border-t">
      {terms.map(([term, text]) => (
        <div
          key={term}
          className="border-border grid gap-1 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8"
        >
          <dt className="font-medium">{term}</dt>
          <dd className="text-muted-foreground max-w-[60ch]">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
