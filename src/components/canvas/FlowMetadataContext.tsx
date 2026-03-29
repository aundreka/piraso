/* eslint-disable react-refresh/only-export-components */

import { createContext, type ReactNode, useContext } from 'react';
import type { DatabaseSchema } from '../../types/schema';
import type { FieldOption } from '../../core/graph/getAvailableFields';

export type FlowMetadata = {
  schema: DatabaseSchema | null;
  tableOptions: string[];
  fieldOptions: FieldOption[];
  columnsByTable: Record<string, FieldOption[]>;
};

const defaultMetadata: FlowMetadata = {
  schema: null,
  tableOptions: [],
  fieldOptions: [],
  columnsByTable: {},
};

const FlowMetadataContext = createContext<FlowMetadata>(defaultMetadata);

export function FlowMetadataProvider({ children, value }: { children: ReactNode; value: FlowMetadata }) {
  return <FlowMetadataContext.Provider value={value}>{children}</FlowMetadataContext.Provider>;
}

export function useFlowMetadata() {
  return useContext(FlowMetadataContext);
}
