import { Entry } from "./type.ts";
import { FireResult, KindMap } from "../kindMap/type.ts";
import { findScriptPath, loadScriptMod } from "../kindMap/loadScriptMod.ts";

type Result = { kind: string; output: string | null | undefined };
export async function findAndFire(
  entries: Entry[],
  lbuffer: string,
  kindMap: KindMap,
  dflKind: string,
): Promise<[number, Result | null]> {
  for (let idx = 0, len = entries.length; idx < len; idx++) {
    idx = _nextEntryIdx(entries, lbuffer, idx);
    if (idx == -1) {
      return [0, null];
    }
    const targEntry = entries[idx];
    const kind = "kind" in targEntry ? targEntry.kind as string : dflKind;
    if (!(kind in kindMap)) {
      console.error(`such kind is not found: "${kind}"`);
      return [1, null];
    }
    let mod = kindMap[kind].scriptMod;
    if (!mod) {
      const pth = findScriptPath(kindMap, kind);
      if (!pth) {
        return [1, null];
      }
      mod = await loadScriptMod(pth, kindMap, kind);
    }
    if (!(mod && "fire" in mod)) {
      continue;
    }
    let [isMatched, output]: FireResult = mod.fire(
      lbuffer,
      targEntry.what ?? {},
    );
    if (isMatched) {
      return [0, { output, kind }];
    }
  }
  return [0, null];
}

export function _nextEntryIdx(entries: Entry[], lbuffer: string, idx: number) {
  for (let i = idx, len = entries.length; i < len; i++) {
    if (_isConditionMatched(entries[i], lbuffer)) {
      return i;
    }
  }
  return -1;
}

function _isConditionMatched(entry: Entry, lbuffer: string) {
  if ("current" in entry) {
    if (!(new RegExp(`(?:^|\\s)${entry.current}\\s*$`).test(lbuffer))) {
      return false;
    }
  }
  return !("patterns" in entry) ||
    entry.patterns!.every((pat: string) => (new RegExp(pat)).test(lbuffer));
}
