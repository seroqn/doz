import {
  getSettingFilePath,
  loadSettingFile,
} from "./settingfile/settingfile.ts";
import { Entry } from "./settingfile/type.ts";

export function execCli(lbuffer: string) {
  const pth = getSettingFilePath();
  const entries = loadSettingFile(pth);
  if (!entries) {
    Deno.exit(1);
  } else if (!entries.length) {
    Deno.exit(0);
  }
  const targEntry = _findTargEntry(entries, lbuffer);
  if (!targEntry) {
    Deno.exit();
  } else if ("expand" in targEntry) {
    const newLbuf = _replaceExpantion(targEntry.expand, lbuffer)
    if (newLbuf) {
      console.log("kind:expand");
      console.log(newLbuf);
      Deno.exit();
    }
  }
  if ("hints" in targEntry) {
    console.log("kind:hint");
    for (let str of targEntry.hints){
      let out = _parseHint(str);
      if (out) {
        console.log(out);
      }
    }
  }
  Deno.exit();
}

export function _findTargEntry(entries: Entry[], lbuffer: string) {
  return entries.find((entry: Entry) => {
    if ("current" in entry) {
      if (!(new RegExp(entry.current + "\\s*$").test(lbuffer))) {
        return false;
      }
    }
    return !("patterns" in entry) ||
      entry.patterns.every((pat: string) => (new RegExp(pat)).test(lbuffer));
  });
}
export function _replaceExpantion(
  expantion: Record<string, string | null>,
  lbuffer: string,
) {
  const crrWordMatches = lbuffer.match(/\S+$/);
  if (!(crrWordMatches && crrWordMatches[0] in expantion)){
    return null
  }
  const expandee: string = expantion[crrWordMatches[0]]
  return lbuffer.slice(0, crrWordMatches.index) + expandee
}
export function _parseHint(hint: string) {
  const result = /^\s*([^: ]+)(:\s*)?(.+)?$/.exec(hint); // `:` is separator
  return result ? `${result[1]}\t${result[3] ?? ""}` : null;
}
