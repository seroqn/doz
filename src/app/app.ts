import {
  getSettingFilePath,
  loadSettingFile,
} from "./settingfile/settingfile.ts";
import { conditionNames, Entry } from "./settingfile/type.ts";
import { loadKindFile } from "./kindfile/kindfile.ts";
import { Kind2Path } from "./kindfile/type.ts";
import { path } from "./deps.ts";

export async function execCli(lbuffer: string) {
  const stpth = getSettingFilePath();
  const entries = loadSettingFile(stpth);
  if (!entries) {
    Deno.exit(1);
  } else if (!entries.length) {
    Deno.exit(0);
  }
  const kind2pth = loadKindFile(path.dirname(stpth));
  switch (await _findAndFire(entries, lbuffer, kind2pth)) {
    case 0:
      Deno.exit();
      break;
    case 1:
      Deno.exit(1);
      break;
  }
  return;
}

async function _findAndFire(
  entries: Entry[],
  lbuffer: string,
  kind2pth: Kind2Path,
) {
  for (let idx = 0, len = entries.length; idx < len; idx++) {
    idx = _nextEntryIdx(entries, lbuffer, idx);
    if (idx == -1) {
      return 0;
    }
    const targEntry = entries[idx];
    const kind = "kind" in targEntry
      ? targEntry.kind
      : Deno.env.get("SHDO_DEFAULT_KIND") ?? "hint";
    if (!(kind in kind2pth)) {
      console.error(`such kind is not found: "${kind}"`);
      return 1;
    }
    const mod = kind2pth[kind].mod ??
      await import(_ejectEvaledPath(kind2pth, kind));
    kind2pth[kind].mod = mod;
    if (!("fire" in mod)) {
      console.error(`"fire()" is not defined : "${kind}"`);
      continue;
    }
    let [doFinish, output]: [boolean, string | null | undefined] = mod.fire(
      lbuffer,
      targEntry.what,
    );
    if (doFinish) {
      console.log(`kind:${kind}`);
      if (output) {
        console.log(output);
      }
      return 0;
    }
  }
  return 0;
}
export function _nextEntryIdx(entries: Entry[], lbuffer: string, idx: number) {
  for (let i = idx, len = entries.length; i < len; i++) {
    let entry = entries[i];
    if ("current" in entry) {
      if (!(new RegExp(entry.current + "\\s*$").test(lbuffer))) {
        continue;
      }
    }
    if (
      !("patterns" in entry) ||
      entry.patterns.every((pat: string) => (new RegExp(pat)).test(lbuffer))
    ) {
      return i;
    }
  }
  return -1;
}
export function _ejectEvaledPath(kind2pth: Kind2Path, kind: string) {
  if (!kind2pth[kind].evaled) {
    kind2pth[kind].evaled = kind2pth[kind].raw.replace(
      /^\$[^/:*?"<>|\\]+/,
      (match: string) => {
        return Deno.env.get(match.slice(1)) ?? match;
      },
    );
  }
  if (!/^file:/.test(kind2pth[kind].evaled)) {
    kind2pth[kind].evaled = "file://" + kind2pth[kind].evaled;
  }
  return kind2pth[kind].evaled;
}
