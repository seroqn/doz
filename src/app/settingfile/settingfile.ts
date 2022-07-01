import { existsSync, parseYaml, path, xdg } from "../deps.ts";
import { Entry, isEntry } from "./type.ts";

export const APPNAME_L = "recallz";

export function getSettingFilePath(): string {
  const FBASE = "entries.yml";
  const homepath = Deno.env.get("RECALLZ_HOME");
  if (homepath) {
    return path.join(homepath, FBASE);
  }
  const configPaths = xdg.configDirs().map((rootdir: string) =>
    path.join(rootdir, APPNAME_L, FBASE)
  );
  return configPaths.find((pth: string) => existsSync(pth)) ?? configPaths[0];
}

export function loadSettingFile(pth: string): Entry[] | undefined {
  if (!existsSync(pth)) {
    console.error(`Setting file not exists in "${pth}"`);
    return undefined;
  }
  const text = Deno.readTextFileSync(pth);
  let ets: unknown[] | undefined;
  try {
    ets = parseYaml(text);
  } catch (e: unknown) {
    console.error("Setting parsed error");
    throw (e);
  }
  if (!ets) {
    return [];
  }
  for (let et of ets) {
    if (!isEntry(et)) {
      throw new Error(`invalid entry: ${JSON.stringify(et)}`);
    }
  }
  return ets;
}
