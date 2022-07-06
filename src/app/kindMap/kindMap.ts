import { KindMap } from "./type.ts";
import { expandGlob, path } from "../deps.ts";

export async function loadKindMap(): KindMap {
  const kinddirsEnv = Deno.env.get("DOZ_KINDS_DIRS") ??
    "$DOZ_ROOT/dozkind/*";
  let kindMap: KindMap = {};
  for (let pth of await _splitKinddirs(kinddirsEnv)) {
    kindMap[path.basename(pth)] = { dir: pth, scriptMod: null };
  }
  return kindMap;
}
export async function _splitKinddirs(kinddirsS: string) {
  let nest: Promise<string[]>[] = kinddirsS.split("\n").map(
    async (dir: string) => {
      dir = dir.replace(
        /^\${(.+?)}|^\$([^/:*?"<>|\\]+)/,
        (envname: string, p1: string | undefined, p2: string | undefined) =>
          Deno.env.get(p1 ?? p2) ?? envname,
      );
      let ret = [];
      for await (const f of expandGlob(dir)) {
        if (f.isDirectory) {
          ret.push(f.path);
        }
      }
      return ret;
    },
  );
  return (await Promise.all(nest)).flat();
}
