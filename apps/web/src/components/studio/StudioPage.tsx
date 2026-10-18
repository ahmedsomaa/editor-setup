import { PageHero } from "@/components/layout/PagePattern";
import { PreviewPanel } from "./PreviewPanel";
import { StudioControls } from "./StudioControls";
import { useSnapshotStudio } from "./useSnapshotStudio";

/** Preset Studio: make the Snapshot for a Preset from an Open or Free Font and Theme. */
export function StudioPage() {
  const studio = useSnapshotStudio();

  return (
    <main id="main">
      <PageHero variant="studio" className="pt-8 pb-8 sm:pt-8 sm:pb-10">
        <header>
          <h1>Preset Studio</h1>
          <p className="text-muted-foreground mt-3 max-w-[60ch] text-lg">
            Preview your own mix before using it in your editor.
          </p>
        </header>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-4 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
          <StudioControls studio={studio} />
          <PreviewPanel
            tab={studio.tab}
            onTabChange={studio.setTab}
            srcDoc={studio.srcDoc}
            iframeRef={studio.iframeRef}
            code={studio.code}
            onCodeChange={studio.setCode}
            codeColors={studio.codeColors}
            errors={studio.errors}
            exporting={studio.exporting}
            exportDisabled={studio.exportDisabled}
            onSavePng={studio.savePng}
            onSaveJson={studio.savePresetJson}
          />
        </div>
      </div>
    </main>
  );
}
