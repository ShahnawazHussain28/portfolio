import Hero from './components/Hero/Hero';
import profileImage from '@/public/profilepic.jpg';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <Hero profileImage={profileImage} />

      {/* Placeholder sections for testing scroll */}
      <section className="min-h-screen flex items-center justify-center bg-dark-secondary/50">
        <div className="glass-dark p-12 rounded-3xl gradient-border-animated max-w-2xl mx-6">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Experience Section
          </h2>
          <p className="text-light-secondary mb-4">
            This is where your work experience will go.
          </p>
          <p className="text-light-secondary">
            Coming in Phase 3! 🚀
          </p>
        </div>
      </section>

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
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-dark-secondary/50">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-bold mb-8 gradient-text">
            Skills Section
          </h2>
          <p className="text-light-secondary">
            Interactive skill constellation coming soon!
          </p>
        </div>
      </section>
    </main>
  );
}
