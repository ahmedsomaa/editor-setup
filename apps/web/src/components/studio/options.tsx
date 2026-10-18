import { Link2, Upload } from "lucide-react";
import type { Option } from "@/components/common/Combobox";
import { EditorLogo } from "@/components/common/EditorLogo";
import { LANGUAGE_IDS, THEMES } from "@/lib/theme/highlight";
import { EDITOR_IDS, EDITOR_LABELS } from "@/lib/presets/presets";
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

export const LANG_OPTIONS: Option[] = [
  ...Object.keys(SAMPLES).map((id) => ({
    id,
    label: id,
    group: "With a sample",
  })),
  ...LANGUAGE_IDS.filter((id) => !(id in SAMPLES)).map((id) => ({
    id,
    label: id,
    group: "All languages",
  })),
];
