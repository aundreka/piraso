export type ValidationLevel = 'error' | 'warning';

export type ValidationIssue = {
  id: string;
  level: ValidationLevel;
  message: string;
  nodeId?: string;
};
