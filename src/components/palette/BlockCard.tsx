import { useRef } from 'react';
import type { DragEvent } from 'react';
import BlockPreview from './BlockPreview';
import type { BlockShape } from '../../types/blockShapes';

type BlockCardProps = {
  title: string;
  subtitle: string;
  accentColor: string;
  nodeType: string;
  shape: BlockShape;
  payload?: Record<string, unknown>;
  onDragStart: (type: string, payload: Record<string, unknown>) => void;
  onDragEnd?: () => void;
};

export default function BlockCard({
  title,
  subtitle,
  accentColor,
  nodeType,
  shape,
  payload = {},
  onDragStart,
  onDragEnd,
}: BlockCardProps) {
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    const dataTransfer = event.dataTransfer;

    if (dataTransfer) {
      dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({ nodeType, payload })
      );
      dataTransfer.effectAllowed = 'move';
      const previewElement = dragPreviewRef.current ?? event.currentTarget;
      if (previewElement) {
        dataTransfer.setDragImage(
          previewElement,
          previewElement.clientWidth / 2,
          previewElement.clientHeight / 2
        );
      }
    }

    onDragStart(nodeType, payload);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={() => onDragEnd?.()}
        style={{
          borderRadius: 18,
          padding: '16px 18px',
          background: '#fff',
          boxShadow: '0 12px 25px rgba(15, 15, 15, 0.08)',
          border: '1px solid ' + accentColor,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ marginRight: 6 }}>
          <BlockPreview color={accentColor} shape={shape} size="small" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 700, color: '#111' }}>{title}</span>
          <span style={{ fontSize: 12, color: '#555' }}>{subtitle}</span>
        </div>
      </div>
      <div
        ref={dragPreviewRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '10px 0',
          }}
        >
          <BlockPreview color={accentColor} shape={shape} size="large" />
          <div
            style={{
              fontWeight: 700,
              color: '#111',
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: 14,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 12, color: '#444' }}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
