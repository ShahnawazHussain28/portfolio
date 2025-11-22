import Hero from './components/Hero/Hero';
import Experience from './components/Experience/Experience';
import profileImage from '@/public/profilepic.jpg';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <Hero profileImage={profileImage} />

      {/* Experience Section */}
      <Experience />

      {/* Placeholder sections for testing scroll */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-bold mb-8">
            <span className="gradient-text animate-pulse-slow">
              Projects Section
            </span>
          </h2>
          <p className="text-light-secondary">
            Your amazing projects will be showcased here with the bento grid layout.
          </p>
          <p className="text-light-secondary mt-4">
            Coming in Phase 4! 🚀
          </p>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-dark-secondary/50">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-bold mb-8 gradient-text">
            Skills Section
          </h2>
          <p className="text-light-secondary">
            Interactive skill constellation coming in Phase 5!
          </p>
        </div>
      </section>
    </main>
  );
}
