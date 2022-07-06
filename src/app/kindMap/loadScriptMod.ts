import { KindMap } from "./type.ts";
import { path } from "../deps.ts";

export function findScriptPath(kindMap: KindMap, kind: string) {
  let ret = null, file = null;
  const pth = path.join(kindMap[kind].dir, `${kind}.ts`);
  try {
    file = Deno.statSync(pth);
    ret = file.isFile ? pth : null;
  } catch (e) {
    console.error(e);
  }
  if (!ret) {
    console.error(`script file cannot load: "${pth}"`);
  }
  return ret;
}
export async function loadScriptMod(
  pth: string,
  kindMap: KindMap,
  kind: string,
) {
  const mod = await import("file://" + pth); // `file://` をつけないと Windows 環境では動かなかったりする
  kindMap[kind].scriptMod = mod;
  if (!("fire" in mod)) {
    console.error(`"fire()" is not defined : "${kind}"`);
  }
  return mod;
}
