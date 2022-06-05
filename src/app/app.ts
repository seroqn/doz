import {getHintFilePath, loadHintFile} from "./hintfile/hintfile.ts";
import {Entry} from "./hintfile/type__hintfile.ts";

export function execCli(left: string){
  const pth = getHintFilePath()
  const entries = loadHintFile(pth)
  if (!entries){
    Deno.exit(1)
  } else if (!entries.length){
    Deno.exit(0)
  }
  let targEntry = entries.find((entry: Entry)=>{
    for (let pat of entry.patterns){
      if ((new RegExp(pat.endsWith('$') ? pat : pat + '\\s*$')).test(left)){
        return true
      }
    }
    return false
  })
  if (!targEntry){
    Deno.exit()
  }
  for (let [key, desc] of Object.entries(targEntry.hints)){
    console.log(`${key}\t${desc}`);
  }
  Deno.exit()
}

