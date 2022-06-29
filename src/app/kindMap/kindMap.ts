import { KindMap } from "./type.ts";

export async function loadKindMap(): KindMap {
  const kinddirsEnv = Deno.env.get("SHDO_KINDS_DIRS") ?? "$SHDO_ROOT/kinds";
  const parents = _splitKinddirs(kinddirsEnv);
  const children = await Promise.all(parents.map(
    (parentDir: string) =>
      Array.from(Deno.readDirSync(parentDir)).filter((
        dirEntry: Deno.DirEntry,
      ) => dirEntry.isDirectory).map((dirEntry: Deno.DirEntry) =>
        dirEntry.name
      ),
  ));
  let kindMap = {};
  for (let i = 0, len = children.length; i < len; i++) {
    let parent = parents[i];
    for (let dir of children[i]) {
      if (dir in kindMap) {
        console.error(`duplicated kind name: "${dir}"`);
      }
      kindMap[dir] = { head: parent, scriptMod: null };
    }
  }
  return kindMap;
}
export function _splitKinddirs(kinddirsS: string) {
  return kinddirsS.split("\n").map((dir: string) =>
    dir.replace(
      /^\${(.+?)}|^\$([^/:*?"<>|\\]+)/,
      (envname: string, p1: string | undefined, p2: string | undefined) =>
        Deno.env.get(p1 ?? p2) ?? envname,
    )
  );
}
