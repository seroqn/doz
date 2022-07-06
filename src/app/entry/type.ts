export type Entry = {
  current?: string;
  patterns?: string[];
  kind?: string;
  what?: unknown;
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
