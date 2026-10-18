import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { z } from "zod";
import type { registrySearchSchema } from "@/lib/registry/registry-search";

type RegistrySearch = z.infer<typeof registrySearchSchema>;

const SEARCH_DEBOUNCE_MS = 200;

/**
 * The Registry's filters live in the URL. The search box keeps its own text and pushes it to the URL
 * after a pause; every other change goes straight there. Any change to the filters goes back to page 1.
 */
export function useRegistryFilters(search: RegistrySearch) {
  const navigate = useNavigate({ from: "/registry/" });
  const [query, setQuery] = useState(search.q ?? "");
  const pushedQ = useRef(search.q);

  // Follow the URL when it changes from outside, such as the back button.
  useEffect(() => {
    if (search.q === pushedQ.current) return;
    pushedQ.current = search.q;
    setQuery(search.q ?? "");
  }, [search.q]);

  useEffect(() => {
    const next = query.trim() || undefined;
    if (next === pushedQ.current) return;
    const id = window.setTimeout(() => {
      pushedQ.current = next;
      void navigate({
        search: (prev) => ({ ...prev, q: next, page: undefined }),
        replace: true,
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query, navigate]);

  function setParam(patch: Partial<RegistrySearch>) {
    void navigate({
      search: (prev) => ({ ...prev, page: undefined, ...patch }),
      replace: true,
    });
  }

  const hasFilters =
    query.trim().length > 0 ||
    Boolean(search.editor || search.appearance);

  function clearFilters() {
    pushedQ.current = undefined;
    setQuery("");
    setParam({
      q: undefined,
      editor: undefined,
      appearance: undefined,
    });
  }

  return { query, setQuery, setParam, hasFilters, clearFilters };
}
