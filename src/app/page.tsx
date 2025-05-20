import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategorySection from "@/components/CategorySection";
import QuestPreview from "@/components/QuestPreview";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <QuestPreview />
    </main>
  );
}
