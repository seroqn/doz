import { execCli } from "./app/app.ts";

if (Deno.args.length != 1){
  console.error(`Argument number must be 1 but ${Deno.args.length}.`);
  Deno.exit(1)
}
execCli(Deno.args[0]);
