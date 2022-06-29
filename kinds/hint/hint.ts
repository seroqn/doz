type Hints = Array<string | undefined>;
function isHints(hints: any): hints is Hints {
  return (
    Array.isArray(hints) &&
    hints.every((hint) => hint==null || typeof hint == "string")
  );
}


export function fire(_: string, what: any) {
  let outs: string[] = [];
  if (typeof what != "object") {
    console.error(`invalid "what": ${JSON.stringify(what)}`);
    Deno.exit(1);
  }
  if ("hints" in what && !isHints(what.hints)){
    console.error(`invalid "hints": ${JSON.stringify(what.hints)}`);
    Deno.exit(1);
  }
  for (let hint of what.hints) {
    let out = _parseHint(hint);
    if (out) {
      outs.push(out);
    }
  }
  return [true, outs.join("\n")];
}
export function _parseHint(hint: string | null) {
  if (!hint){
    return null
  } else if (/^#/.test(hint)){
    return '\t- ' + hint.replace(/^#\s?/, '')
  }
  const result =  /^\s*([^: ].*?)(?:\s:\s*(.*))?$/.exec(hint); // `\s:` is separator
  return result ? `${result[1].trim()}\t${result[2] ?? ""}` : null;
}
