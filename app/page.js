export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Animated background mesh */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-50 -z-10" />

      {/* Content container */}
      <div className="relative z-10">
        {/* Hero Section - Placeholder */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="gradient-text">Shahnawaz</span>
            </h1>
            <p className="text-xl md:text-2xl text-light-secondary mb-8">
              Full Stack Developer
            </p>
            <div className="glass px-8 py-4 rounded-2xl inline-block">
              <p className="text-light-primary">
                Phase 1 Complete! Foundation is ready 🚀
              </p>
            </div>
          </div>
        </section>

        {/* Test scroll section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="glass-dark p-12 rounded-3xl gradient-border-animated max-w-2xl">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Smooth Scroll Test
            </h2>
            <p className="text-light-secondary mb-4">
              Notice how smooth the scrolling is? That's Lenis in action!
            </p>
            <p className="text-light-secondary">
              Also, check out the custom cursor and how it changes on hover.
            </p>
          </div>
        </section>

        {/* Another test section */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-8">
            <h2 className="text-5xl font-bold mb-8">
              <span className="gradient-text animate-pulse-slow">
                Ready for Phase 2
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-2xl hover:scale-105 smooth-transition">
                <div className="text-4xl mb-2">✨</div>
                <h3 className="text-xl font-bold mb-2">GSAP</h3>
                <p className="text-sm text-light-secondary">Installed & Ready</p>
              </div>
              <div className="glass p-6 rounded-2xl hover:scale-105 smooth-transition">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="text-xl font-bold mb-2">Tailwind</h3>
                <p className="text-sm text-light-secondary">Configured</p>
              </div>
              <div className="glass p-6 rounded-2xl hover:scale-105 smooth-transition">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="text-xl font-bold mb-2">Lenis</h3>
                <p className="text-sm text-light-secondary">Smooth Scroll</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
