import { Link2, Upload } from "lucide-react";
import type { Option } from "@/components/common/Combobox";
import { EditorLogo } from "@/components/common/EditorLogo";
import { LANGUAGE_IDS, THEMES } from "@/lib/theme/highlight";
import { EDITOR_IDS, EDITOR_LABELS } from "@/lib/presets/presets";
import { languageLogo } from "@/lib/language-logos";
import { SAMPLES } from "@/lib/studio/samples";
import { FONT_CHOICES } from "@/lib/studio/font-files";
import { OptionChip, ThemeSwatch } from "./chips";

/** Value of the "Custom" choice in the Font and Theme lists. */
export const CUSTOM_OPTION = "__custom";

export const EDITOR_OPTIONS: Option[] = EDITOR_IDS.map((id) => ({
  id,
  label: EDITOR_LABELS[id],
  icon: <EditorLogo id={id} />,
}));

export const FONT_OPTIONS: Option[] = [
  ...FONT_CHOICES.map((f) => ({
    id: f,
    label: f,
    group: "Fonts",
    icon: <OptionChip className="font-mono">Aa</OptionChip>,
  })),
  {
    id: CUSTOM_OPTION,
    label: "Custom",
    group: "Your own",
    icon: (
      <OptionChip>
        <Upload className="size-3.5" />
      </OptionChip>
    ),
  },
];

export const THEME_OPTIONS: Option[] = [
  ...THEMES.filter((t) => t.type === "dark").map((t) => ({
    id: t.id,
    label: t.name,
    group: "Dark",
    icon: <ThemeSwatch id={t.id} dark />,
  })),
  ...THEMES.filter((t) => t.type === "light").map((t) => ({
    id: t.id,
    label: t.name,
    group: "Light",
    icon: <ThemeSwatch id={t.id} />,
  })),
  {
    id: CUSTOM_OPTION,
    label: "Custom",
    group: "Your own",
    icon: (
      <OptionChip>
        <Link2 className="size-3.5" />
      </OptionChip>
    ),
  },
];

/** Brand colors too close to black or white vanish on one of the two page themes, so those use the text color. */
function readable(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.2 && lum < 0.9;
}

/** The language's own mark in its brand color. Languages without a mark get their first two letters. */
function langIcon(id: string) {
  const logo = languageLogo(id);
  if (!logo)
    return (
      <OptionChip className="font-mono text-[10px] font-semibold">
        {id.slice(0, 2).toUpperCase()}
      </OptionChip>
    );
  return (
    <OptionChip>
      <svg
        viewBox={`0 0 ${logo.box ?? 24} ${logo.box ?? 24}`}
        fill="currentColor"
        aria-hidden
        className="size-3.5"
        style={readable(logo.hex) ? { color: `#${logo.hex}` } : undefined}
      >
        <path d={logo.path} />
      </svg>
    </OptionChip>
  );
}

export const LANG_OPTIONS: Option[] = [
  ...Object.keys(SAMPLES).map((id) => ({
    id,
    label: id,
    group: "With a sample",
    icon: langIcon(id),
  })),
  ...LANGUAGE_IDS.filter((id) => !(id in SAMPLES)).map((id) => ({
    id,
    label: id,
    group: "All languages",
    icon: langIcon(id),
  })),
];
