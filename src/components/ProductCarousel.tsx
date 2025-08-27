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

  // Auto-rotate once after 5 seconds when page opens
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) {
        setImages((prev) => {
          return prev.map((img) => ({
            ...img,
            position: (img.position + 1) % 3
          }));
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // Remove isAnimating dependency so it only runs once

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
      style.width = `${frontImageWidth}px`;
      style.zIndex = 30;
      style.transform = `translate(-50%, -50%) scale(${!isAnimating && isHovered ? frontHoverScale : 1})`;
      style.objectFit = "cover";
    } else if (position === 1) {
      // Left back position - behind and to the left, cropped
      style.width = `${backImageWidth}px`;
      style.zIndex = 20;
      const offsetX = Math.max(240, (frontImageWidth - backImageWidth) / 2 + 100);
      style.transform = `translate(calc(-50% - ${offsetX}px), calc(-50% + 50px)) scale(${!isAnimating && isHovered ? 0.88 : 0.85})`;
      style.opacity = "0.98";
      style.objectFit = "cover";
    } else {
      // Right back position - behind and to the right, cropped
      style.width = `${backImageWidth}px`;
      style.zIndex = 20;
      const offsetX = Math.max(240, (frontImageWidth - backImageWidth) / 2 + 100);
      style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + 50px)) scale(${!isAnimating && isHovered ? 0.88 : 0.85})`;
      style.opacity = "0.98";
      style.objectFit = "cover";
    }
    
    return style;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
      }}
    >
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

            {image.position === 0 && !isAnimating && isHovered && (
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
g           </div>
        );
      })}
    </div>
  );
}
