import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-body-md text-on-surface">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-tertiary-container/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/30 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold font-headline-md text-primary-container tracking-tight">Royal Group</h1>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-on-surface-variant">ISLAMABAD</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 rounded-lg bg-surface-container/60 hover:bg-surface-container/90 border border-white/5 text-on-surface font-semibold transition-all text-sm">
            Student Portal
          </Link>
          <Link href="/admin/login" className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-semibold hover:bg-primary-container/85 transition-all text-sm shadow-lg shadow-primary/10">
            Admin Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pt-32 pb-20 text-center max-w-[1200px] mx-auto z-10">
        <div className="glass-card max-w-[850px] p-8 md:p-12 rounded-3xl glow-shadow relative overflow-hidden mb-12">
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-container font-semibold text-xs tracking-wider uppercase mb-6 inline-block">
            Premium Student Accommodation
          </span>
          <h2 className="text-display-lg-mobile md:text-display-lg font-bold font-headline-md leading-tight mb-6 text-on-surface">
            Premium Student Living <br className="hidden sm:inline"/>
            <span className="bg-gradient-to-r from-primary to-secondary-fixed-dim bg-clip-text text-transparent">Redefined</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-[650px] mx-auto mb-10 leading-relaxed">
            Welcome to Royal Group of Hostels, Islamabad's premier accommodation partner for COMSATS and surrounding universities. Experience secure, luxurious, and connected living.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/10">
              Go to Portal
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <a href="#amenities" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface transition-all flex items-center justify-center gap-2 font-semibold">
              Explore Amenities
            </a>
          </div>
        </div>

        {/* Stats Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-[900px] mb-20">
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-primary mb-1">98%</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Occupancy Rate</span>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-secondary mb-1">1200+</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Residents Housed</span>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-tertiary mb-1">4.8★</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Student Rating</span>
          </div>
        </div>

        {/* Amenities Section */}
        <section id="amenities" className="w-full py-10 scroll-mt-24">
          <div className="text-center mb-12">
            <h3 className="text-headline-md font-bold font-headline-md mb-2">Hostel Amenities</h3>
            <p className="text-body-md text-on-surface-variant">We provide everything you need for a comfortable and focused academic life.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">wifi</span>
              </div>
              <h4 className="text-lg font-bold mb-2">High-Speed WiFi</h4>
              <p className="text-sm text-on-surface-variant">Dedicated fiber broadband coverage across all rooms and common study lounges.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">electric_bolt</span>
              </div>
              <h4 className="text-lg font-bold mb-2">Generator Backup</h4>
              <p className="text-sm text-on-surface-variant">24/7 automatic generator standby to ensure continuous power and comfort.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">directions_bus</span>
              </div>
              <h4 className="text-lg font-bold mb-2">COMSATS Transport</h4>
              <p className="text-sm text-on-surface-variant">Daily shuttle service coordinated with university class timings.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">local_laundry_service</span>
              </div>
              <h4 className="text-lg font-bold mb-2">Laundry Services</h4>
              <p className="text-sm text-on-surface-variant">Commercial-grade washing machines and professional ironing services weekly.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">restaurant</span>
              </div>
              <h4 className="text-lg font-bold mb-2">Daily Mess Facility</h4>
              <p className="text-sm text-on-surface-variant">Hygienic and healthy meals prepared by professional chefs, served daily.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl text-left group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">security</span>
              </div>
              <h4 className="text-lg font-bold mb-2">24/7 Security & CCTV</h4>
              <p className="text-sm text-on-surface-variant">Guard deployment, biometric entry system, and complete CCTV surveillance.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest/80 border-t border-white/5 px-6 py-8 mt-auto z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h5 className="font-bold text-sm text-primary-container">Royal Group of Hostels</h5>
            <p className="text-xs text-on-surface-variant mt-1">© 2026 Royal Group of Hostel. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <a href="#" className="hover:text-primary-container transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-container transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-container transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
