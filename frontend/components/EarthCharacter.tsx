'use client';

import Image from 'next/image';

type Props = {
  earthState: 'normal' | 'smile' | 'happy';
  size?: number;
};

export default function EarthCharacter({ earthState, size = 180 }: Props) {
  function getImagePath(state: Props['earthState']) {
    switch (state) {
      case 'happy':
        return '/happy.jpg';
      case 'smile':
        return '/smile.jpg';
      case 'normal':
      default:
        return '/normal.jpg';
    }
  }

  const imagePath = getImagePath(earthState);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '4px solid white',
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        margin: '0 auto',
        transition: 'all 0.3s ease',
      }}
    >
      <Image
        src={imagePath}
        alt="地球キャラクター"
        fill
        sizes={`${size}px`}
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  );
}
