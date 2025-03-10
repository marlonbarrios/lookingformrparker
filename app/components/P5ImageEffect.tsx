"use client";

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface P5ImageEffectProps {
  imageUrl: string | null;
}

export function P5ImageEffect({ imageUrl }: P5ImageEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const sketch = (p: p5) => {
      let img: p5.Image;
      
      p.preload = () => {
        img = p.loadImage(imageUrl);
      };

      p.setup = () => {
        p.createCanvas(768, 768);
        p.frameRate(30);
      };

      p.draw = () => {
        p.background(0);
        
        if (img) {
          // Create a crossfade/glitch effect
          p.push();
          p.translate(p.width/2, p.height/2);
          
          // Add some glitch effects
          for (let i = 0; i < p.height; i += 20) {
            let xOffset = p.sin(p.frameCount * 0.05 + i * 0.1) * 20;
            let srcY = i;
            let w = img.width;
            let h = 15;
            
            // Source image slice
            let sx = 0;
            let sy = srcY;
            let sw = img.width;
            let sh = h;
            
            // Destination position
            let dx = -img.width/2 + xOffset;
            let dy = -img.height/2 + i;
            let dw = w;
            let dh = h;
            
            p.image(img, dx, dy, dw, dh, sx, sy, sw, sh);
          }
          p.pop();
        }
      };
    };

    // Create new p5 instance
    p5Instance.current = new p5(sketch, containerRef.current!);

    // Cleanup
    return () => {
      p5Instance.current?.remove();
    };
  }, [imageUrl]);

  return <div ref={containerRef} />;
} 