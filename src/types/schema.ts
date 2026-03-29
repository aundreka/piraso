export type TableSchema = {
  name: string;
  columns: string[];
};

export type DatabaseSchema = {
  tables: TableSchema[];
};
