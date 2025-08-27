import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-[clamp(3rem,10vw,8rem)] bg-[rgb(26,58,58)] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-[clamp(1rem,4vw,3rem)] py-[clamp(2rem,6vw,3rem)]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[clamp(1rem,3vw,2rem)]">
            <div>
              <div className="text-[color:var(--paper-color)]/85" style={{
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem,1.5vw,1.125rem)'
              }}>Shop</div>
              <ul className="mt-3 space-y-2">
                {['First Light','Nightwatch','Fog Horn'].map((label) => (
                  <li key={label}><Link href="/products" className="opacity-85 hover:opacity-100 transition-opacity" style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontSize: 'clamp(0.95rem,1.3vw,1.05rem)'
                  }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[color:var(--paper-color)]/85" style={{
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem,1.5vw,1.125rem)'
              }}>Cold Harbor</div>
              <ul className="mt-3 space-y-2">
                <li><Link href="/about" className="opacity-85 hover:opacity-100 transition-opacity" style={{
                  fontFamily: 'var(--font-eb-garamond), serif',
                  fontSize: 'clamp(0.95rem,1.3vw,1.05rem)'
                }}>About</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-[color:var(--paper-color)]/85" style={{
                fontFamily: 'var(--font-eb-garamond), serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem,1.5vw,1.125rem)'
              }}>Services</div>
              <ul className="mt-3 space-y-2">
                {['Partnerships','Wholesale'].map((label) => (
                  <li key={label}><Link href="#" className="opacity-85 hover:opacity-100 transition-opacity" style={{
                    fontFamily: 'var(--font-eb-garamond), serif',
                    fontSize: 'clamp(0.95rem,1.3vw,1.05rem)'
                  }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="text-[color:var(--paper-color)]/85" style={{
                fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(0.875rem,1.3vw,1rem)'
              }}>Built and Powered by</div>
              <div className="mt-1 flex justify-center">
                <a 
                  href="https://bluechipbranding.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-105"
                >
                  <img 
                    src="/Logo/Bluechip logo-02.png" 
                    alt="Bluechip Logo" 
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain filter brightness-110"
                  />
                </a>
              </div>
            </div>
          </div>

          <form className="flex items-start gap-3 ml-auto">
            <input
              type="email"
              aria-label="Email address"
              placeholder="name@email.com"
              className="bg-[color:var(--paper-color)] text-[color:var(--ink-tan)] placeholder-[color:var(--ink-tan)]/85 rounded-md px-4 py-2 min-w-[240px] focus:outline-none focus:ring-2 focus:ring-white/40"
              style={{
                fontFamily: 'var(--font-eb-garamond), serif',
                fontSize: 'clamp(0.95rem,1.3vw,1.05rem)'
              }}
            />
            <button type="submit" className="analog-cta" style={{
              fontSize: 'clamp(1rem,1.5vw,1.125rem)',
              padding: '0.6rem 1rem'
            }}>Subscribe</button>
          </form>
        </div>


        
        <div className="pt-[clamp(2rem,5vw,3rem)] text-center opacity-85" style={{
          fontFamily: 'var(--font-eb-garamond), serif',
          fontSize: 'clamp(0.85rem,1.2vw,0.95rem)'
        }}>
          © 2025 Cold Harbor Coffee Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
