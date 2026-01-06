import { Separator } from "@/components/ui/separator";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="py-16 px-4 sm:px-6 text-center border-b">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
          Roadmap
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          What&apos;s coming next
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <article className="prose prose-neutral dark:prose-invert mx-auto">
          <section aria-labelledby="story-heading">
            <h2 id="story-heading" className="text-2xl font-bold mb-4">
              December 2025
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Researched and found the perfect manufacturer and materials for
              the Catmat collection.
            </p>
          </section>
          <section aria-labelledby="story-heading">
            <h2 id="story-heading" className="text-2xl font-bold mb-4">
              January 2026
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Interest check for the Catmat collection started via survey.
            </p>
          </section>
        </article>
      </main>
    </main>
  );
}
