import Header from "../components/header/Header";
import HomeImg from "../assets/home.png";
import QualitiesSection from "../components/qualities/QualitiesSection.jsx";
import PreviewSection from "../components/prodpreview/PreviewSection.jsx";
import AbPrevSection from "../components/aboutpreview/AbPrevSection.jsx";



export default function Home() {
  return (
    <>
      <Header image={HomeImg} titulo="Juntos somos mais fortes" />
      <QualitiesSection />
      <PreviewSection />
      <AbPrevSection />
      
    </>
  );
}
