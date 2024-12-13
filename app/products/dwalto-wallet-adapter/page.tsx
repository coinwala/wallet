import { Footer } from "@/components/Appbar/Footer";
import IntegratedSigningHero from "@/components/WalletAdapter/IntegratedSigningHero";
import WalletAdapterHeroSection from "@/components/WalletAdapter/WalletAdapterHeroSection";
import WalletAdapterInfo from "@/components/WalletAdapter/WalletAdapterInfo";

export default function Page() {
  return (
    <div>
      <WalletAdapterHeroSection />
      <IntegratedSigningHero />
      <WalletAdapterInfo />
      <Footer />
    </div>
  );
}
