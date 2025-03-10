"use client";

interface P5ImageEffectProps {
  imageUrl: string | null;
}

export function P5ImageEffect({ imageUrl }: P5ImageEffectProps) {
  if (!imageUrl) return null;

  return (
    <div style={{ width: '768px', height: '768px', position: 'relative' }}>
      <img 
        src={imageUrl} 
        alt="Generated image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
} 