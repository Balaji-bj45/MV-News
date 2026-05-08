import { Seo } from '../components/ui';
import { HeroSection } from '../Component/HomePage/HeroSection';
import { ContentSection } from '../Component/HomePage/ContentSection';
import { NewsletterSection } from '../Component/HomePage/NewsletterSection';
import { AddBanner } from '../Component/HomePage/AddBanner';

export default function HomePage() {
  return (
    <>
      <Seo
        title="MV News | Tamil Nadu political news"
        description="Featured Tamil Nadu election coverage, breaking updates, and candidate news powered by your Express API."
      />
      <AddBanner />
      <div className="max-w-[1400px] mx-auto px-4 md:px-5 lg:px-6 mt-4">
        <HeroSection />
        <ContentSection />
        <NewsletterSection />
      </div>
    </>
  );
}
