import { existsSync, parseYaml, path, xdg, fs } from "../deps.ts";
import { Entry } from "./type.ts";

export function getSettingFilePath(): string {
  const FBASE = "config.yml";
  const homepath = Deno.env.get("SHDO_HOME");
  if (homepath) {
    return path.join(homepath, FBASE);
  }
  const configPaths = xdg.configDirs().map((rootdir: string) =>
    path.join(rootdir, "shdo", FBASE)
  );
  return configPaths.find((pth: string) => existsSync(pth)) ?? configPaths[0];
}

export function loadSettingFile(pth: string): Entry[] | undefined {
  if (!existsSync(pth)) {
    console.error(`Setting file not exists in "${pth}"`);
    return undefined;
  }
  const text = Deno.readTextFileSync(pth);
  let entries: Entry[] | undefined;
  try {
    // TODO: 型を保証したい
    entries = parseYaml(text) as Entry[] | undefined;
  } catch (e: unknown) {
    console.error("Setting parsed error");
    throw (e);
  }
  return entries ?? [];
}
