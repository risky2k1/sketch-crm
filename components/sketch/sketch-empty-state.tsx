import { SketchBorder } from "@/components/sketch/sketch-border";

export function SketchEmptyState() {
  return (
    <SketchBorder>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sketch Accent</p>
      <h2 className="mt-2 text-xl font-semibold">Your CRM workspace is ready.</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Start by adding companies, people, and deals. This is a placeholder empty state for the hand-drawn visual
        direction.
      </p>
    </SketchBorder>
  );
}
