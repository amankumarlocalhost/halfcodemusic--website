import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestRelease from "@/components/LatestRelease";
import About from "@/components/About";
import Connect from "@/components/Connect";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LatestRelease />
        <About />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
