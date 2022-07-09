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
  let cks: CondsKind[] = _intoCondsKind(entries, dflKind);
  if (options.include) {
    cks = _filterCondsKind(cks, options.include);
  }
  const topics = cks.map((ck: CondsKind) =>
    sprintf("%-19s (%s)", ck.conds.join(", "), ck.kind)
  );
  for (const topic of topics) {
    console.log(topic);
  }
  return 0;
}

function _intoCondsKind(entries: Entry[], dflKind: string): CondsKind[] {
  return entries.map((entry: Entry): CondsKind => {
    let conds: string[] = [];
    if (entry.current) {
      conds.push(entry.current);
    }
    if (entry.patterns) {
      conds = [...conds, ...(entry.patterns)];
    }
    return { conds: conds.length ? conds : ["*"], kind: entry.kind ?? dflKind };
  });
}
function _filterCondsKind(cks: CondsKind[], includees: string[]) {
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
