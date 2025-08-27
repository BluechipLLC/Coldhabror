import Link from "next/link";
import ProductCarousel from "./ProductCarousel";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] relative overflow-hidden">
      {/* Background with paper texture */}
      <div className="absolute inset-0 bg-[color:var(--paper-color)]" />
      
      {/* Lighthouse illustration - left side */}
      <div className="absolute left-0 bottom-0 w-1/2 h-full flex items-end">
        <img 
          src="/Scrimshaw/dock piling.png" 
          alt="Lighthouse and Harbor Scene" 
          className="w-full h-auto object-contain object-bottom opacity-60"
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)] py-[clamp(3rem,8vw,6rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          
          {/* Left side - Text and CTA */}
          <div className="text-center lg:text-left">
            <h1 className="text-green mb-6" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              lineHeight: '0.9'
            }}>
              Don&apos;t Miss Out
            </h1>
            <p className="text-tan mb-8 opacity-90" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 400,
              fontSize: 'clamp(1.25rem, 3vw, 2rem)'
            }}>
              Find the blend that&apos;s right for you.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/products"
                className="analog-cta"
                aria-label="Shop Cold Harbor"
              >
                Shop Cold Harbor
              </Link>
            </div>
          </div>

          {/* Right side - Interactive Product Carousel */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-[500px]">
              <ProductCarousel 
                frontImageWidth={280}
                backImageWidth={220}
                rotationSpeed={0.6}
                frontHoverScale={1.05}
                backHoverScale={1.02}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


