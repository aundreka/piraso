import type { ReactNode } from 'react';

type EntryOption = {
  id: string;
  label: string;
  description: string;
  icon: 'templates' | 'blank' | 'existing';
};

const OPTIONS: EntryOption[] = [
  {
    id: 'templates',
    label: 'Choose from Templates',
    description: 'Pick a curated flow to explore quickly',
    icon: 'templates',
  },
  {
    id: 'blank',
    label: 'Create from Blank',
    description: 'Drag blocks to build from scratch',
    icon: 'blank',
  },
  {
    id: 'existing',
    label: 'Open Existing',
    description: 'Load a saved query or workspace',
    icon: 'existing',
  },
];

const iconLookup: Record<EntryOption['icon'], ReactNode> = {
  templates: (
    <div style={{ width: 72, height: 72, position: 'relative' }}>
      <div
        style={{
          width: 54,
          height: 54,
          background: 'linear-gradient(135deg, #f9c24f, #f18d2f)',
          borderRadius: 14,
          transform: 'rotate(45deg) translate(-50%, -50%)',
          position: 'absolute',
          top: '50%',
          left: '50%',
        }}
      />
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          background: '#fff',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  ),
  blank: (
    <div style={{ width: 72, height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          background: 'rgba(12, 82, 164, 0.2)',
          position: 'absolute',
          left: 18,
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          background: 'rgba(32, 119, 215, 0.4)',
          position: 'absolute',
          right: 18,
        }}
      />
    </div>
  ),
  existing: (
    <div style={{ width: 72, height: 72, position: 'relative' }}>
      <div
        style={{
          width: 58,
          height: 58,
          background: '#ff5a4f',
          clipPath: 'polygon(50% 0%, 100% 90%, 0% 90%)',
          position: 'absolute',
          top: 6,
          left: 7,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          width: 58,
          height: 58,
          background: '#fb8066',
          clipPath: 'polygon(50% 0%, 100% 88%, 0% 88%)',
          position: 'absolute',
          top: 14,
          left: 12,
        }}
      />
    </div>
  ),
};

export default function LeftPanel() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 22,
      }}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          style={{
            width: '100%',
            background: '#fdfdfd',
            border: 'none',
            borderRadius: 24,
            padding: '22px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          }}
          type="button"
        >
          {iconLookup[option.icon]}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{option.label}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{option.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
