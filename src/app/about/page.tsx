export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--paper-color)]">
      <div className="w-full px-[clamp(1rem,4vw,3rem)] py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 border border-[#1A3A3A]/10 shadow-sm">
          <h1
            className="text-4xl lg:text-5xl font-bold text-[#1A3A3A] mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-eb-garamond), serif', fontWeight: 700 }}
          >
            About Cold Harbor
          </h1>
          <p
            className="text-[#1A3A3A]/80 text-lg leading-relaxed body-copy"
            style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
          >
            We’re crafting coastal coffee with purpose. This placeholder page exists so the navigation link doesn’t 404. Replace with your story content when ready.
          </p>
        </div>
      </div>
    </div>
  );
}


