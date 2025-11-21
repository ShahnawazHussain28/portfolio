"use client";
import AnimatedBackground from './AnimatedBackground';
import ProfileSection from './ProfileSection';
import OrbitingIcons from './OrbitingIcons';
import TextAnimations from './TextAnimations';
import ScrollIndicator from '../ui/ScrollIndicator';

export default function Hero({ profileImage }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Content grid */}
      <div className="container mx-auto px-6 py-20 md:py-0 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <TextAnimations />
          </div>

          {/* Profile image with orbiting icons */}
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              <ProfileSection profileImage={profileImage} />
              <OrbitingIcons />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
