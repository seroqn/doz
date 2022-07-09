import { Entry, isEntries } from "./type.ts";
import { existsSync, parseYaml, path, xdg } from "../deps.ts";
import { APPNAME_L } from "../const/app.ts";

export function getSettingFilePath(): string {
  const FBASE = "entries.yml";
  const homepath = Deno.env.get("DOZ_HOME");
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
    const parsee: unknown = parseYaml(text);
    if (Array.isArray(parsee)) {
      ets = parsee;
    }
  } catch (e: unknown) {
    console.error("Setting parsed error");
    throw (e);
  }
  if (!ets) {
    return [];
  }
  if (isEntries(ets)) {
    return ets;
  }
  // not reach
}
