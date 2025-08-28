"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ProductCarouselProps {
  frontImageWidth?: number;
  backImageWidth?: number;
  rotationSpeed?: number;
  frontHoverScale?: number;
  backHoverScale?: number;
}

export default function ProductCarousel({
  frontImageWidth = 260,
  backImageWidth = 200,
  rotationSpeed = 0.4,
  frontHoverScale = 1.05,
  backHoverScale = 1.01,
}: ProductCarouselProps) {
  // Responsive sizing and spacing per breakpoint
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId: number | null = null;
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setViewportWidth(window.innerWidth));
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const breakpoint = viewportWidth >= 1536
    ? '2xl'
    : viewportWidth >= 1280
    ? 'xl'
    : viewportWidth >= 1024
    ? 'lg'
    : viewportWidth >= 640
    ? 'sm'
    : 'xs';

  const getResponsiveConfig = () => {
    // Base these around provided props but clamp per breakpoint for better composition
    switch (breakpoint) {
      case '2xl':
        return { frontW: Math.min(frontImageWidth, 360), backW: Math.min(backImageWidth, 280), offsetX: 260, backYOffset: 60, backScale: 0.9 };
      case 'xl':
        return { frontW: Math.min(frontImageWidth, 320), backW: Math.min(backImageWidth, 250), offsetX: 240, backYOffset: 55, backScale: 0.88 };
      case 'lg':
        return { frontW: Math.min(frontImageWidth, 300), backW: Math.min(backImageWidth, 220), offsetX: 220, backYOffset: 50, backScale: 0.86 };
      case 'sm':
        return { frontW: Math.min(frontImageWidth, 220), backW: Math.min(backImageWidth, 170), offsetX: 190, backYOffset: 42, backScale: 0.84 };
      case 'xs':
      default:
        return { frontW: Math.min(frontImageWidth, 180), backW: Math.min(backImageWidth, 140), offsetX: 160, backYOffset: 36, backScale: 0.82 };
    }
  };

  const { frontW, backW, offsetX, backYOffset, backScale } = getResponsiveConfig();

  // Detect touch to avoid hover scaling on mobile which can cause layout jank
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Constrain lateral spacing so bags never overflow the viewport on small screens
  const sidePadding = breakpoint === 'xs' ? 16 : breakpoint === 'sm' ? 20 : 24;
  const maxOffsetFromViewport = Math.max(120, (viewportWidth - frontW) / 2 - sidePadding);
  const safeOffsetX = Math.min(offsetX, maxOffsetFromViewport);

  // Provide a stable container height per breakpoint to prevent overlap/cutoff
  const containerHeight = breakpoint === 'sm' ? 320 : breakpoint === 'xs' ? 260 : null; // use parent height on lg+
  const [images, setImages] = useState([
    { 
      id: "img1", 
      src: "/ch_pictures/first_light/First_Light_Carousel.webp", 
      position: 0, // 0 = front, 1 = left back, 2 = right back
      buyText: "Buy First Light",
      buyUrl: "/products"
    },
    { 
      id: "img2", 
      src: "/ch_pictures/night_watch/Nightwatch_Carousel.webp", 
      position: 1, // 1 = left back
      buyText: "Buy Nightwatch",
      buyUrl: "/products"
    },
    { 
      id: "img3", 
      src: "/ch_pictures/fog_horn/fog_horn_carousel.webp", 
      position: 2, // 2 = right back
      buyText: "Buy Fog Horn",
      buyUrl: "/products"
    },
  ]);

  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [wiggleActive, setWiggleActive] = useState<boolean>(false);

  // Disabled auto-rotate to avoid unexpected movement and race conditions on mobile
  // First-run hint overlay
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = window.localStorage.getItem('ch_pc_hint_seen');
      if (!seen) {
        setShowHint(true);
        const t = setTimeout(() => setShowHint(false), 2500);
        // schedule a subtle wiggle shortly after to attract attention
        const w1 = setTimeout(() => setWiggleActive(true), 1000);
        const w2 = setTimeout(() => setWiggleActive(false), 2200);
        return () => { clearTimeout(t); clearTimeout(w1); clearTimeout(w2); };
      }
    } catch {}
  }, []);

  const dismissHint = () => {
    if (showHint) setShowHint(false);
    try { window.localStorage.setItem('ch_pc_hint_seen', '1'); } catch {}
  };

  const handleClick = (clickedImageId: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setImages((prev) => {
      const clicked = prev.find((i) => i.id === clickedImageId);
      if (!clicked || clicked.position === 0) {
        setIsAnimating(false);
        return prev;
      }

      // Determine rotation direction based on which bag was clicked
      if (clicked.position === 1) {
        // Left bag clicked - rotate counterclockwise
        return prev.map((img) => ({
          ...img,
          position: (img.position - 1 + 3) % 3
        }));
      } else {
        // Right bag clicked - rotate clockwise
        return prev.map((img) => ({
          ...img,
          position: (img.position + 1) % 3
        }));
      }
    });
    
    setTimeout(() => setIsAnimating(false), rotationSpeed * 1000);
  };

  const getImageStyle = (position: number, isHovered: boolean) => {
    const style: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transition: `all ${rotationSpeed * 0.6}s cubic-bezier(0.4, 0, 0.2, 1)`,
      cursor: "pointer",
      borderRadius: 8,
      filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))",
      willChange: "transform",
    };
    
    if (position === 0) {
      // Front position - centered, largest, cropped for better fit
      style.width = `${frontW}px`;
      style.zIndex = 30;
      const frontScale = !isAnimating && isHovered && !isTouch ? frontHoverScale : 1;
      style.transform = `translate(-50%, -50%) scale(${frontScale})`;
      if (wiggleActive && !isAnimating) {
        style.animation = 'ch-wiggle 0.25s ease-in-out 0s 4 alternate';
      }
      style.objectFit = "cover";
    } else if (position === 1) {
      // Left back position - behind and to the left, cropped
      style.width = `${backW}px`;
      style.zIndex = 20;
      const backScaleFinal = !isAnimating && isHovered && !isTouch ? Math.min(backScale + 0.02, 0.92) : backScale;
      style.transform = `translate(calc(-50% - ${safeOffsetX}px), calc(-50% + ${backYOffset}px)) scale(${backScaleFinal})`;
      style.opacity = "0.98";
      style.objectFit = "cover";
    } else {
      // Right back position - behind and to the right, cropped
      style.width = `${backW}px`;
      style.zIndex = 20;
      const backScaleFinal = !isAnimating && isHovered && !isTouch ? Math.min(backScale + 0.02, 0.92) : backScale;
      style.transform = `translate(calc(-50% + ${safeOffsetX}px), calc(-50% + ${backYOffset}px)) scale(${backScaleFinal})`;
      style.opacity = "0.98";
      style.objectFit = "cover";
    }
    
    return style;
  };

  // Swipe support (mobile only)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const swipeThreshold = 40; // px horizontal movement to trigger

  const rotate = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    if (!hasInteracted) setHasInteracted(true);
    dismissHint();
    setIsAnimating(true);
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        position:
          direction === 'left'
            ? (img.position - 1 + 3) % 3 // counterclockwise
            : (img.position + 1) % 3, // clockwise
      }))
    );
    setTimeout(() => setIsAnimating(false), rotationSpeed * 1000);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: containerHeight === null ? "100%" : `${containerHeight}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
      }}
      onTouchStart={(e) => {
        if (!isTouch) return;
        const t = e.touches[0];
        setTouchStartX(t.clientX);
        setTouchStartY(t.clientY);
      }}
      onTouchMove={(e) => {
        // Prevent vertical scroll hijack: only prevent if horizontal intent is strong
        if (!isTouch || touchStartX === null || touchStartY === null) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) * 1.5) {
          e.preventDefault();
        }
      }}
      onTouchEnd={(e) => {
        if (!isTouch || touchStartX === null || touchStartY === null) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        setTouchStartX(null);
        setTouchStartY(null);
        // Only trigger on horizontal swipes beyond threshold
        if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > swipeThreshold) {
          if (dx > 0) rotate('left'); else rotate('right');
        }
      }}
      onClick={() => { setHasInteracted(true); dismissHint(); }}
      role="region"
      aria-label="Product carousel, swipe on mobile or click side bags to rotate"
    >
      {/* Wiggle keyframes (on brand, subtle). Respect reduced motion by not enabling when requested */}
      <style jsx global>{`
        @keyframes ch-wiggle { 0% { transform: translate(-50%, -50%) rotate(0deg) } 100% { transform: translate(-50%, -50%) rotate(-2.5deg) } }
      `}</style>
      {/* On-brand arrows (desktop) */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => rotate('left')}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-[60] text-[#1A3A3A]/70 hover:text-[#1A3A3A] transition-colors"
        style={{ cursor: 'pointer' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => rotate('right')}
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-[60] text-[#1A3A3A]/70 hover:text-[#1A3A3A] transition-colors"
        style={{ cursor: 'pointer' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      {images.map((image) => {
        const isHovered = hoveredImageId === image.id;

        return (
          <div
            key={image.id}
            style={getImageStyle(image.position, isHovered)}
            onClick={() => handleClick(image.id)}
            onMouseEnter={() => setHoveredImageId(image.id)}
            onMouseLeave={() => setHoveredImageId(null)}
          >
            <img
              src={image.src}
              alt={`Product ${image.id}`}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "inherit",
                pointerEvents: "none",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/300x300/CCCCCC/000000?text=Error";
              }}
            />

            {image.position === 0 && !isAnimating && (isHovered || isTouch) && (
              <Link
                href={image.buyUrl}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgb(26, 58, 58)",
                  color: "#fff",
                  padding: "0.8rem 1.5rem",
                  borderRadius: 6,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  zIndex: 999,
                  fontFamily: 'var(--font-eb-garamond), serif',
                  opacity: 0.85,
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  border: "2px solid rgb(26, 58, 58)",
                }}
                className="hover:opacity-100 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-1"
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.95) translateY(2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
                }}
              >
                {image.buyText}
              </Link>
            )}
          </div>
        );
      })}

      {/* First-run hint overlay */}
      {showHint && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[80]">
          <div className="px-3 py-1.5 rounded-full text-white bg-[#1A3A3A]/80 border border-[#1A3A3A] text-sm" style={{ fontFamily: 'var(--font-eb-garamond), serif' }}>
            Swipe or tap a bag
          </div>
        </div>
      )}
    </div>
  );
}
