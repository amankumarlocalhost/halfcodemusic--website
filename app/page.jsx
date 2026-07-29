import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestRelease from "@/components/LatestRelease";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Connect from "@/components/Connect";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LatestRelease />
        <Stats />
        <Testimonials />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
