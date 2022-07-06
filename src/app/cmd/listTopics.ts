import { sprintf } from "../deps.ts";
import { Entry } from "../entry/type.ts";

type CondsKind = {
  conds: string[];
  kind: string;
};
type Options = {
  include?: string[];
};
export function listTopics(
  options: Options,
  entries: Entry[],
  dflKind: string,
) {
  let cks: CondsKind[] = intoCondsKind(entries, dflKind);
  if ("include" in options) {
    cks = filterCondsKind(cks, options.include);
  }
  const topics = cks.map((ck: CondsKind) =>
    sprintf("%-19s (%s)", ck.conds.join(", "), ck.kind)
  );
  for (const topic of topics) {
    console.log(topic);
  }
}

function _extractKindNames(entries: Entry[], dflKind: string) {
  const set: Set<string> = new Set([dflKind]);
  for (const et of entries) {
    if ("kind" in et) {
      set.add(et.kind);
    }
  }
  return Array.from(set).sort();
}

function intoCondsKind(entries: Entry[], dflKind: string): CondsKind[] {
  return entries.map((entry: Entry): CondsKind => {
    let conds: string[] = [];
    if ("current" in entry) {
      conds.push(entry.current);
    }
    if ("patterns" in entry) {
      conds = [...conds, ...entry.patterns];
    }
    return { conds: conds.length ? conds : ["*"], kind: entry.kind ?? dflKind };
  });
}
function filterCondsKind(cks: CondsKind[], includees: string[]) {
  return cks.filter(
    (ck: CondsKind) =>
      ck.conds.some(
        (cond: string) =>
          includees.every(
            (str: string) => cond.includes(str),
          ),
      ),
  );
}
