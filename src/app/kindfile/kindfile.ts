import { existsSync, parseYaml, path } from "../deps.ts";
import { Kind2Path } from "./type.ts";
const DFL_KIND: Kind2Path = {
  hint: { raw: "$SHDO_ROOT/src/shdo-kinds/hint/hint.ts", evaled: null, mod: null },
  expand: { raw: "$SHDO_ROOT/src/shdo-kinds/expand/expand.ts", evaled: null, mod: null },
};

export function loadKindFile(dir: string): Kind2Path {
  const pth = path.join(dir, "kinds.yml");
  if (!existsSync(pth)) {
    return DFL_KIND;
  }
  // TODO
  return DFL_KIND;
}
