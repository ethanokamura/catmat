import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-40">
      {/* Header */}
      <header className="py-16 px-4 sm:px-6 text-center border-b">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
          About
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Made by a keyboard enthusiast, for keyboard enthusiasts
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <article className="prose prose-neutral dark:prose-invert mx-auto">
          <section aria-labelledby="story-heading">
            <h2 id="story-heading" className="text-2xl font-bold mb-4">
              About Me
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              I&apos;ve been deep in the mechanical keyboard hobby for years
              now. Like many of you, I&apos;ve spent countless hours browsing
              group buys, waiting for keycap sets to ship, and constantly
              perfecting my desk setup. One of my favorite parts of the hobby
              has always been desk mats — especially the unique, artisan pieces
              from Floppy Processor that I&apos;ve been collecting. I believe
              the desk mat is the centerpiece of your setup.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              But here&apos;s the thing: I kept finding myself wanting something
              different. Something that didn&apos;t sacrafice quality for the
              sake of a cool design. As someone with an art background, I
              couldn&apos;t shake the idea of creating my own.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              So I did.
            </p>
          </section>

          <Separator className="my-8" />

          <section aria-labelledby="quality-heading">
            <h2 id="quality-heading" className="text-2xl font-bold mb-4">
              My Criteria
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>Quality Over Quantity:</strong> Every mat is made with
              premium materials designed for longevity. No shortcuts, no
              compromises. I listened to the gaming and keyboard community as
              well as scraping r/MousepadReview to find the best manufacturers
              and materials.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>Thoughtful Design:</strong> Each design showcases a unqiue
              artstyle while still being practical for everyday use. I wanted to
              create a mat that was not only beautiful for my desk, but also
              could work in a variety of setups.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>Community First:</strong> CATMAT is made by a keyboard
              enthusiast for keyboard enthusiasts. I want to build off that
              community to find others who love their setups and are proud to
              show them off.
            </p>
          </section>

          <Separator className="my-8" />

          <section aria-labelledby="mission-heading">
            <h2 id="mission-heading" className="text-2xl font-bold mb-4">
              What&apos;s Next
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This is just the beginning. CATMAT is a passion project that I
              plan to grow slowly and intentionally, always prioritizing the
              community&apos;s feedback over quick profits.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If this resonates with you, I&apos;d love to have you along for
              the journey.
            </p>
          </section>
        </article>
      </main>
    </main>
  );
}
