import { Entry } from "../entry/type.ts";
import { findAndFire } from "../entry/entry.ts";
import { loadKindMap } from "../kindMap/kindMap.ts";

type Options = {
  kind: string;
};
export async function query(
  lbuffer: string,
  options: Options,
  entries: Entry[],
  dflKind: string,
) {
  const targKind = options.kind;
  const isTargKindDflKind = targKind === dflKind;
  const qentries = entries.filter((entry: Entry) =>
    "kind" in entry ? entry.kind === targKind : isTargKindDflKind
  );
  const kindMap = await loadKindMap();
  const [exitStatus, result] = await findAndFire(
    qentries,
    lbuffer,
    kindMap,
    dflKind,
  );
  if (result && result.output) {
    console.log(result.output);
  }
  return exitStatus;
}
