import type { CSSProperties } from 'react';

export type PuzzleDirection = 'top' | 'bottom';

export function puzzleConnector(
  color: string,
  position: PuzzleDirection,
  width = 170,
  height = 44
): CSSProperties {
  return {
    position: 'absolute',
    left: '50%',
    width,
    height,
    borderRadius:
      position === 'top' ? '0 0 60px 60px' : '60px 60px 0 0',
    transform: 'translateX(-50%)',
    background: color,
    top: position === 'top' ? -(height / 2) + 6 : undefined,
    bottom: position === 'bottom' ? -(height / 2) + 6 : undefined,
    boxShadow: '0 14px 30px rgba(0,0,0,0.25)',
  };
}

export function puzzleSlot(position: PuzzleDirection): CSSProperties {
  const side = position === 'top' ? 'top' : 'bottom';
  return {
    position: 'absolute',
    left: '50%',
    width: 36,
    height: 32,
    borderRadius: '50%',
    background: '#fff8f0',
    [side]: position === 'top' ? -12 : -4,
    transform: 'translate(-50%, 0)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    opacity: 0.8,
  };
}

export const baseHighlight: CSSProperties = {
  width: 68,
  height: 18,
  borderRadius: 999,
  background: '#fff9f4',
  opacity: 0.5,
  margin: '0 auto',
  boxShadow: '0 14px 30px rgba(255,255,255,0.2)',
};
