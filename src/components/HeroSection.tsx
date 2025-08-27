import Link from "next/link";
import ProductCarousel from "./ProductCarousel";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[90vh] relative overflow-hidden">
      {/* Background with paper texture */}
      <div className="absolute inset-0 bg-[color:var(--paper-color)]" />
      
      {/* Company Logo at the top - 60px from top */}
      <div className="absolute top-[60px] left-0 right-0 flex justify-center z-20">
        <img 
          src="/Logo/Cold Harbo Logo-11.png" 
          alt="Cold Harbor Coffee Company" 
          className="w-80 h-auto sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] 2xl:w-[40rem] object-contain"
        />
      </div>

      {/* Main content container with 190px gap from logo */}
      <div className="relative z-10 max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)] pt-[250px] pb-[clamp(2rem,6vw,4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          
          {/* Left side - Text and CTA with artwork background */}
          <div className="text-center lg:text-left relative">
            {/* Artwork background stuck to hero text */}
            <div className="absolute inset-0 flex items-center justify-start opacity-45 -z-10">
              <img 
                src="/Scrimshaw/artwork-01.webp" 
                alt="Coastal Artwork" 
                className="h-full w-auto object-contain object-left opacity-45
                           sm:h-[80vh] sm:w-auto
                           md:h-[85vh] md:w-auto
                           lg:h-[90vh] lg:w-auto
                           xl:h-[95vh] xl:w-auto
                           2xl:h-[100vh] 2xl:w-auto"
              />
            </div>
            
            <h1 className="text-[#1A3A3A] mb-6 leading-tight" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              lineHeight: '0.9'
            }}>
              Premium Coffee
              <span className="block text-[#1A3A3A]/85 italic">Crafted with Care</span>
            </h1>
            
            <p className="text-[#1A3A3A]/85 mb-8 text-lg" style={{
              fontFamily: 'var(--font-eb-garamond), serif',
              fontWeight: 400
            }}>
              Discover our handcrafted blends
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1A3A3A] text-white rounded-xl font-semibold text-lg hover:bg-[#1A3A3A]/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg opacity-85 hover:opacity-100"
                style={{ fontFamily: 'var(--font-eb-garamond), serif' }}
                aria-label="Shop All Products"
              >
                Shop All Products
              </Link>
            </div>
          </div>

          {/* Right side - Interactive Product Carousel */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl h-[700px]">
              <ProductCarousel 
                frontImageWidth={400}
                backImageWidth={320}
                rotationSpeed={0.6}
                frontHoverScale={1.05}
                backHoverScale={1.02}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Green divider bar 40px below hero section */}
      <div className="relative z-10 w-full h-20 bg-[#1A3A3A] mt-10"></div>

      {/* Three-section feature display with inset depth */}
      <div className="bg-white py-20 relative">
        {/* Top shadow for inset effect */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>
        
        {/* Bottom shadow for inset effect */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            {/* Left Section: No Added Flavoring */}
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 text-[#1A3A3A] bg-gradient-to-br from-[#1A3A3A]/5 to-[#1A3A3A]/10 rounded-2xl flex items-center justify-center">
                  {/* Coffee bean with padlock icon */}
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7L1 9V11H3V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V11H23V9H21M19 19H5V11H19V19Z"/>
                    <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15ZM12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11Z" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#1A3A3A] mb-6 tracking-tight leading-tight" style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 700
              }}>
                No Added Flavoring
              </h3>
              <p className="text-[#1A3A3A]/90 leading-relaxed tracking-wide text-lg" style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 400,
                lineHeight: '1.7'
              }}>
                No hazelnut, no caramel, this coffee was created to be taken in its purest form: black. Nothing added, nothing hidden.
              </p>
            </div>

            {/* Middle Section: Roasted to Cut Through */}
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 text-[#1A3A3A] bg-gradient-to-br from-[#1A3A3A]/5 to-[#1A3A3A]/10 rounded-2xl flex items-center justify-center">
                  {/* Coffee cup with steam icon */}
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21H20V19H2V21M20 8H18V5H20V8M20 3H4V13A4 4 0 0 0 8 17H14A4 4 0 0 0 18 13V10H20A2 2 0 0 0 22 8V5C22 3.89 21.1 3 20 3Z"/>
                    <path d="M6 2H8V4H6V2M10 2H12V4H10V2M14 2H16V4H14V2" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#1A3A3A] mb-6 tracking-tight leading-tight" style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 700
              }}>
                Roasted to Cut Through
              </h3>
              <p className="text-[#1A3A3A]/90 leading-relaxed tracking-wide text-lg" style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 400,
                lineHeight: '1.7'
              }}>
                Sharp, balanced, and built to wake you up not lull you back to sleep. Every batch is roasted to hold its own against fog, cold, and early hours.
              </p>
            </div>

            {/* Right Section: Born on the Coast */}
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 text-[#1A3A3A] bg-gradient-to-br from-[#1A3A3A]/5 to-[#1A3A3A]/10 rounded-2xl flex items-center justify-center">
                  {/* Lighthouse icon */}
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"/>
                    <path d="M12 4L13.5 8H10.5L12 4Z" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#1A3A3A] mb-6 tracking-tight leading-tight" style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 700
              }}>
                Born on the Coast
              </h3>
              <p className="text-[#1A3A3A]/90 leading-relaxed tracking-wide text-lg" style={{ 
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 400,
                lineHeight: '1.7'
              }}>
                Salt in the air. Pine trees. Old docks that never stop creaking. We come from a place where mornings are cold and the coffee has to hit hard.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


