import {
  getSettingFilePath,
  loadSettingFile,
} from "./settingfile/settingfile.ts";
import { conditionNames, Entry } from "./settingfile/type.ts";
import { loadKindMap } from "./kindMap/kindMap.ts";
import { KindMap } from "./kindMap/type.ts";
import { path } from "./deps.ts";

export function execCli(args: string[]) {
  const stpth = getSettingFilePath();
  const entries = loadSettingFile(stpth);
  if (!entries) {
    Deno.exit(1);
  } else if (!entries.length) {
    Deno.exit(0);
  }
  const mode = args[0]
  switch (mode) {
    case "do":
      if (args.length != 2) {
        console.error(`Argument number must be 1 but ${args.length}.`);
        Deno.exit(1);
      }
      _execDo(args[1], entries);
      break;
    case "cmd":
      _execCmd(args.slice(1));
      break;
    default:
      console.error(`unknown mode: "${mode}"`);
      Deno.exit(1);
  }
}
async function _execDo(lbuffer: string, entries: Entry[]) {
  const kindMap = await loadKindMap();
  switch (await _findAndFire(entries, lbuffer, kindMap)) {
    case 0:
      Deno.exit();
      break;
    case 1:
      Deno.exit(1);
      break;
  }
  return;
}
function _execCmd(args: string[]) {
}

async function _findAndFire(
  entries: Entry[],
  lbuffer: string,
  kindMap: KindMap,
) {
  for (let idx = 0, len = entries.length; idx < len; idx++) {
    idx = _nextEntryIdx(entries, lbuffer, idx);
    if (idx == -1) {
      return 0;
    }
    const targEntry = entries[idx];
    const kind = "kind" in targEntry
      ? targEntry.kind
      : Deno.env.get("RECALLZ_DEFAULT_KIND") ?? "hint";
    if (!(kind in kindMap)) {
      console.error(`such kind is not found: "${kind}"`);
      return 1;
    }
    let mod = kindMap[kind].scriptMod;
    if (!mod) {
      const pth = _findScriptPath(kindMap, kind);
      if (!pth) {
        console.error(`script file cannot load: "${pth}"`);
        Deno.exit(1);
      }
      mod = await import("file://" + pth); // `file://` をつけないと Windows 環境では動かなかったりする
      kindMap[kind].scriptMod = mod;
    }
    if (!("fire" in mod)) {
      console.error(`"fire()" is not defined : "${kind}"`);
      continue;
    }
    let [isMatched, output]: [boolean, string | null | undefined] = mod.fire(
      lbuffer,
      targEntry.what,
    );
    if (isMatched) {
      if (output) {
        console.log(output);
      }
      console.log(`${kindMap[kind].dir}/${kind}`);
      return 0;
    }
  }
  return 0;
}
export function _nextEntryIdx(entries: Entry[], lbuffer: string, idx: number) {
  for (let i = idx, len = entries.length; i < len; i++) {
    let entry = entries[i];
    if ("current" in entry) {
      if (!(new RegExp(`(?:^|\\s)${entry.current}\\s*$`).test(lbuffer))) {
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

function _findScriptPath(kindMap: KindMap, kind: string) {
  let pth = path.join(kindMap[kind].dir, `${kind}.ts`);
  let file = null;
  try {
    file = Deno.statSync(pth);
  } catch (e) {
    console.error(e);
    return null;
  }
  return file.isFile ? pth : null;
}
