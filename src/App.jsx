import { MouseProvider } from './context/MouseContext';
import { VideoModalProvider } from './context/VideoModalContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import SceneEngine from './engine/SceneEngine';
import BackgroundLayers from './components/BackgroundLayers';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import CameraSection from './components/CameraSection';
import VideoPortfolioSection from './components/VideoPortfolioSection';
import SocialAdsSection from './components/SocialAdsSection';
import MusicVideosSection from './components/MusicVideosSection';
import GraphicDesignSection from './components/GraphicDesignSection';
import ContactSection from './components/ContactSection';
import VideoModal from './components/VideoModal';
import Loader from './components/Loader';

export default function App() {
  useSmoothScroll();

  return (
    <MouseProvider>
      <VideoModalProvider>
        <div style={{ position: 'relative', width: '100%', overflowX: 'clip', background: 'transparent' }}>
          <BackgroundLayers />
          <SceneEngine />
          <Header />

          <main style={{ position: 'relative', zIndex: 2 }}>
            <Hero />
            <AboutSection />
            <SkillsSection />
            <CameraSection />
            <VideoPortfolioSection />
            <SocialAdsSection />
            <MusicVideosSection />
            <GraphicDesignSection />
            <ContactSection />
          </main>

          <VideoModal />
          <CustomCursor />
          <Loader />
        </div>
      </VideoModalProvider>
    </MouseProvider>
  );
}
