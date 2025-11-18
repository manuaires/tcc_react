import Header from "../components/header/Header";
import HomeImg from "../assets/home.png";
import HomeMobImg from "../assets/homemobile.png";
import QualitiesSection from "../components/qualities/QualitiesSection.jsx";
import PreviewSection from "../components/prodpreview/PreviewSection.jsx";
import AbPrevSection from "../components/aboutpreview/AbPrevSection.jsx";
import HowItWorks from "../components/howworks/HowItWorks.jsx";
import HeaderMobile from "../components/header/HeaderMobile.jsx"; // Crie este componente para mobile

export default function Home() {
  return (
    <>
      <div className="block md:hidden">
        <HeaderMobile image={HomeMobImg} />
      </div>
      <div className="hidden md:block">
        <Header image={HomeImg} />
      </div>
      <QualitiesSection />
      <PreviewSection />
      <AbPrevSection />
      <HowItWorks />
    </>
  );
}
