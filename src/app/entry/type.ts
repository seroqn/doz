export type Entry = {
  current?: string;
  patterns?: string[];
  kind?: string;
  what?: object;
};

function isEntry(et: any): et is Entry {
  return (
    typeof et == "object" &&
    (!("current" in et) || typeof et.current == "string") &&
    (!("patterns" in et) ||
      Array.isArray(et.patterns) &&
        et.patterns.every((el: any) => typeof el == "string")) &&
    (!("kind" in et) || typeof et.kind == "string")
  );
}
export function isEntries(ets: any[]): ets is Entry[] {
  for (const et of ets) {
    if (!isEntry(et)) {
      throw new Error(`invalid entry: ${JSON.stringify(et)}`);
    }
  }
  return true;
}
