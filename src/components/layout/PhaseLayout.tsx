import type { RouteScene } from "@/types/content";
import { BottomNav } from "@/components/layout/BottomNav";
import { MediaLayer } from "@/components/layout/MediaLayer";
import { PageTransition } from "@/components/layout/PageTransition";
import { ColorsSection } from "@/components/sections/ColorsSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TimelineSection } from "@/components/sections/TimelineSection";

interface PhaseLayoutProps {
  scene: RouteScene;
}

export function PhaseLayout({ scene }: PhaseLayoutProps) {
  const sectionComponents = {
    hero: <HeroSection key="hero" hero={scene.hero} />,
    timeline: <TimelineSection key="timeline" timeline={scene.timeline} />,
    colors: <ColorsSection key="colors" colors={scene.colors} />,
    footer: <FooterSection key="footer" footer={scene.footer} />
  } as const;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MediaLayer theme={scene.hero.theme} />

      <PageTransition sceneKey={scene.path}>
        <main className="relative z-10">
          {scene.sectionOrder.map((section) => sectionComponents[section])}
        </main>
      </PageTransition>

      <BottomNav scene={scene} />
    </div>
  );
}
