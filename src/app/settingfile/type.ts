export type Entry = {
  current?: string;
  patterns?: string[];
  hints?: string[];
  expand?: Record<string, string | null>;
};
