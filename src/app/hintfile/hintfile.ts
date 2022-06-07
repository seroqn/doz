import { existsSync, parseYaml, path, xdg } from "../deps.ts";
import { Entry } from "./type__hintfile.ts";

export function getHintFilePath(): string {
  const FBASE = "hints.yml";
  const homepath = Deno.env.get("EXHINT_HOME");
  if (homepath) {
    return path.join(homepath, FBASE);
  }
  const configPaths = xdg.configDirs().map((rootdir) =>
    path.join(rootdir, "shell-exhint", FBASE)
  );
  return configPaths.find((pth) => existsSync(pth)) ?? configPaths[0];
}

export function loadHintFile(pth: string): Entry[] | undefined {
  if (!existsSync(pth)) {
    console.error(`Setting file not exists in "${pth}"`);
    return undefined;
  }
  const text = Deno.readTextFileSync(pth);
  let entries: Entry[] | undefined;
  try {
    entries = parseYaml(text) as Entry[] | undefined;
  } catch (e: unknown) {
    console.error("Setting parsed error");
    throw (e);
  }
  return entries ?? [];
}
