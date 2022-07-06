import { execDo } from "./do.ts";
import { divide } from "./cmd.ts";
import { getSettingFilePath, loadSettingFile } from "./entry/settingfile.ts";

export async function execCli(args: string[]) {
  const stpth = getSettingFilePath();
  const entries = loadSettingFile(stpth);
  if (!entries) {
    Deno.exit(1);
  } else if (!entries.length) {
    console.error("no entry");
    Deno.exit(1);
  }
  const mode = args[0];
  switch (mode) {
    case "do":
      if (args.length != 2) {
        console.error(`Argument number must be 1 but ${args.length}.`);
        Deno.exit(1);
      }
      const dflKind = Deno.env.get("DOZ_DEFAULT_KIND") ?? "hint";
      execDo(args[1], entries, dflKind);
      break;
    case "cmd":
      Deno.exit(await divide(args.slice(1), entries));
      break;
    default:
      console.error(`unknown mode: "${mode}"`);
      Deno.exit(1);
  }
}
