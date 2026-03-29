import { useMemo, useState } from 'react';
import BlockCard from '../palette/BlockCard';
import { BLOCK_PALETTE, PALETTE_TABS } from '../../core/blocks/blockPalette';

type BottomPaletteProps = {
  onBlockDragStart: (nodeType: string, payload: Record<string, unknown>) => void;
  onBlockDragEnd: () => void;
};

export default function BottomPalette({ onBlockDragStart, onBlockDragEnd }: BottomPaletteProps) {
  const [activeTab, setActiveTab] = useState<typeof PALETTE_TABS[number]['id']>('source');

  const blocks = useMemo(() => BLOCK_PALETTE[activeTab], [activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {PALETTE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              borderRadius: 999,
              border: '1px solid rgba(0,0,0,0.1)',
              padding: '8px 14px',
              fontWeight: 700,
              fontSize: 14,
              background: activeTab === tab.id ? '#fff' : '#f9f7f3',
              color: activeTab === tab.id ? '#111' : '#555',
              boxShadow: activeTab === tab.id ? '0 16px 28px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {blocks.map((block) => (
          <BlockCard
            key={`${block.nodeType}-${block.title}`}
            title={block.title}
            subtitle={block.subtitle}
            accentColor={block.accentColor}
            nodeType={block.nodeType}
            shape={block.shape}
            payload={block.payload ?? {}}
            onDragStart={onBlockDragStart}
            onDragEnd={onBlockDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
