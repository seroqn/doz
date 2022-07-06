import { query } from "./cmd/query.ts";
import { listTopics } from "./cmd/listTopics.ts";
import { listKinds } from "./cmd/listKinds.ts";
import { Command, CompletionsCommand, EnumType } from "./deps.ts";
import { APPNAME_L } from "./const/app.ts";
import { Entry } from "./entry/type.ts";

const TOPICS = "topics";
const KINDS = "kinds";

export async function divide(
  qargs: string[],
  entries: Entry[],
): Promise<number> {
  const dflKind = Deno.env.get("DOZ_DEFAULT_KIND") ?? "hint";
  const kindNames = _extractKindNames(entries, dflKind);
  const listingTypes = [TOPICS, KINDS];
  const parser = new Command()
    .name(APPNAME_L)
    .usage("<Command>")
    // query
    .command("query, q")
    .description("show result of $DOZ_DEFAULT_KIND")
    .arguments("[args...]")
    .type("kindType", new EnumType(kindNames))
    .option(
      "-k, --kind <kind:kindType>",
      "use kind insted of $DOZ_DEFAULT_KIND",
      { default: dflKind },
    )
    // list
    .command(
      "list, ls, l",
      `list ${TOPICS} and so on`,
    )
    .usage(`{ "${TOPICS}" | "${KINDS}" }`)
    .option(
      "-i, --include <word>",
      "filter by including <word> (can be specified multi times)",
      { collect: true },
    )
    .type("type", new EnumType(listingTypes))
    .arguments("[type:type]")
    // completions
    .command("completions", new CompletionsCommand())
    .usage("{ bash | fish | zsh }");

  const { cmd, options, args } = await parser.parse(qargs);
  const cmdName = cmd.getName();

  switch (cmdName) {
    case APPNAME_L:
      cmd.showHelp();
      return 0;
    case "completions":
    case "bash":
    case "fish":
    case "zsh":
      return 0;
    case "query":
      return query(!args.length ? '' : args[0].join(" "), options, entries, dflKind);
    case "list":
      const listingType = !args.length ? TOPICS : args[0];
      switch (listingType) {
        case TOPICS:
          return listTopics(options, entries, dflKind);
        case KINDS:
          return listKinds(options, kindNames);
      }
      break;
    default:
      console.error(`unknown cmd: ${cmdName}`);
      return 1;
  }
}

function _extractKindNames(entries: Entry[], dflKind: string) {
  const set: Set<string> = new Set([dflKind]);
  for (const et of entries) {
    if ("kind" in et) {
      set.add(et.kind);
    }
  }
  return Array.from(set).sort();
}
