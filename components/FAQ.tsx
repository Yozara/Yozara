import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-white/10">
          <AccordionTrigger className="text-left text-white hover:text-pink-400 transition-colors text-lg">
            Is Yozara completely free to use?
          </AccordionTrigger>
          <AccordionContent className="text-zinc-400 text-base">
            Yes, the core tracking and social features of Yozara are 100% free. We will introduce a premium tier later for advanced AI insights and profile customization.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-white/10">
          <AccordionTrigger className="text-left text-white hover:text-pink-400 transition-colors text-lg">
            Can I import my lists from other platforms?
          </AccordionTrigger>
          <AccordionContent className="text-zinc-400 text-base">
            Absolutely. You can import your anime and manga lists from MyAnimeList, AniList, and Kitsu directly into your Yozara profile via XML/JSON upload.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-white/10">
          <AccordionTrigger className="text-left text-white hover:text-pink-400 transition-colors text-lg">
            How does the AI recommendation engine work?
          </AccordionTrigger>
          <AccordionContent className="text-zinc-400 text-base">
            Our engine analyzes your watch history, high ratings, and dropped shows against millions of data points to find localized niche patterns rather than just showing you mainstream hits.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4" className="border-white/10">
          <AccordionTrigger className="text-left text-white hover:text-pink-400 transition-colors text-lg">
            Is there a mobile app available?
          </AccordionTrigger>
          <AccordionContent className="text-zinc-400 text-base">
            Currently, Yozara is a highly optimized Progressive Web App (PWA). Native iOS and Android applications are in active development for late 2026.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}