export const conditionNames = ["current", "patterns"];

export type Entry = {
  current?: string;
  patterns?: string[];
  kind?: string;
  what?: unknown;
  //hints?: string[];
  //expand?: Record<string, string | null>;
};

export function isEntry(et: any): et is Entry {
  return (
    typeof et == "object" &&
    (!("current" in et) || typeof et.current == "string") &&
    (!("patterns" in et) ||
      Array.isArray(et.patterns) &&
        et.patterns.every((el) => typeof el == "string")) &&
    (!("kind" in et) || typeof et.kind == "string")
  );
}
