import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedRelease from "@/components/FeaturedRelease";
import Stats from "@/components/Stats";
import AboutPreview from "@/components/home/AboutPreview";
import VideoPreview from "@/components/home/VideoPreview";
import GalleryPreview from "@/components/home/GalleryPreview";
import Connect from "@/components/Connect";
import ContactCTA from "@/components/home/ContactCTA";
import Footer from "@/components/Footer";
import { featuredRelease } from "@/data/music";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div id="featured-release">
          <FeaturedRelease release={featuredRelease} />
        </div>
        <Stats />
        <AboutPreview />
        <VideoPreview />
        <GalleryPreview />
        <Connect compact />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
