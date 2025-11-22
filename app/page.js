import Hero from './components/Hero/Hero';
import Experience from './components/Experience/Experience';
import Projects from './components/Projects/Projects';
import profileImage from '@/public/profilepic.jpg';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <Hero profileImage={profileImage} />

      {/* Experience Section */}
      <Experience />

      {/* Projects Section */}
      <Projects />

      {/* Placeholder for Skills section */}
      <section className="min-h-screen flex items-center justify-center bg-dark-primary">
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
