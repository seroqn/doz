export {
  existsSync,
  expandGlob,
} from "https://deno.land/std@0.144.0/fs/mod.ts";
export * as path from "https://deno.land/std@0.144.0/path/mod.ts";
export { parse as parseYaml } from "https://deno.land/std@0.144.0/encoding/yaml.ts";

import xdg from "https://deno.land/x/xdg@v9.4.0/src/mod.deno.ts";
export { xdg };
