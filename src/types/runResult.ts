export type RunResult =
  | {
      ok: true;
      columns: string[];
      rows: Record<string, unknown>[];
    }
  | {
      ok: false;
      error: string;
    }
  | null;
