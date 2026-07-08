import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestRelease from "@/components/LatestRelease";
import Connect from "@/components/Connect";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LatestRelease />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
