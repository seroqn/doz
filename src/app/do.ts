import { Entry } from "./entry/type.ts";
import { findAndFire } from "./entry/entry.ts";
import { loadKindMap } from "./kindMap/kindMap.ts";

export async function execDo(
  lbuffer: string,
  entries: Entry[],
  dflKind: string,
) {
  const kindMap = await loadKindMap();
  const [exitStatus, result] = await findAndFire(
    entries,
    lbuffer,
    kindMap,
    dflKind,
  );
  if (result) {
    if (result.output) {
      console.log(result.output);
    }
    console.log(`${kindMap[result.kind].dir}/${result.kind}`);
  }
  Deno.exit(exitStatus);
}
