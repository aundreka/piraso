import type { CSSProperties } from 'react';
import type { BlockShape } from '../../types/blockShapes';

type BlockPreviewSize = 'small' | 'large';

type BlockPreviewProps = {
  color: string;
  shape: BlockShape;
  size?: BlockPreviewSize;
};

const sizeMap: Record<BlockPreviewSize, { width: number; height: number }> = {
  small: { width: 64, height: 32 },
  large: { width: 210, height: 110 },
};

const baseStyle: CSSProperties = {
  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
  position: 'relative',
};

export default function BlockPreview({ color, shape, size = 'small' }: BlockPreviewProps) {
  const resolvedSize = size ?? 'small';
  const { width, height } = sizeMap[resolvedSize];

  const renderCBlock = () => {
    const spineWidth = Math.max(26, width * 0.18);
    const barHeight = Math.max(28, height * 0.3);
    const gap = Math.max(10, (height - barHeight * 2) / 3);

    return (
      <div
        style={{
          ...baseStyle,
          width,
          height,
          display: 'flex',
          borderRadius: 24,
          background: 'transparent',
        }}
      >
        <div
          style={{
            width: spineWidth,
            background: color,
            borderRadius: '24px 0 0 24px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: resolvedSize === 'large' ? '12px 16px' : '10px 12px',
            gap,
            background: color,
            borderRadius: '0 24px 24px 0',
          }}
        >
          {[0, 1].map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 6px',
                borderRadius: 18,
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: resolvedSize === 'large' ? 48 : 34,
                  height: resolvedSize === 'large' ? 18 : 12,
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.65)',
                }}
              />
              <div
                style={{
                  width: resolvedSize === 'large' ? 40 : 28,
                  height: resolvedSize === 'large' ? 16 : 10,
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.4)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStack = () => (
    <div
      style={{
        ...baseStyle,
        width,
        height,
        borderRadius: 28,
        background: color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6px',
        gap: resolvedSize === 'large' ? 8 : 4,
      }}
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          style={{
            height: resolvedSize === 'large' ? 32 : 16,
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.22)',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        />
      ))}
    </div>
  );

  const hexagonStyle: CSSProperties = {
    clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)',
    borderRadius: 8,
  };

  const ovalStyle: CSSProperties = {
    borderRadius: 999,
  };

  if (shape === 'cblock') {
    return <div aria-hidden>{renderCBlock()}</div>;
  }

  if (shape === 'stack') {
    return <div aria-hidden>{renderStack()}</div>;
  }

  const sharedStyle: CSSProperties = {
    ...baseStyle,
    width,
    height,
    background: color,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  if (shape === 'hexagon') {
    return <div aria-hidden style={{ ...sharedStyle, ...hexagonStyle }} />;
  }

  if (shape === 'oval') {
    return <div aria-hidden style={{ ...sharedStyle, ...ovalStyle }} />;
  }

  if (shape === 'capsule') {
    return (
      <div
        aria-hidden
        style={{
          ...sharedStyle,
          borderRadius: 999,
          height: height * 0.6,
          margin: `${height * 0.2}px 0`,
        }}
      />
    );
  }

  return <div aria-hidden style={{ ...sharedStyle, borderRadius: 20 }} />;
}
