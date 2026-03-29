import { useCallback, useState } from 'react';

export function useDragAndDrop() {
  const [dragKey, setDragKey] = useState<string | null>(null);

  const startDrag = useCallback((key: string) => {
    setDragKey(key);
  }, []);

  const endDrag = useCallback(() => {
    setDragKey(null);
  }, []);

  return {
    isDragging: dragKey !== null,
    currentDragKey: dragKey,
    startDrag,
    endDrag,
  };
}
