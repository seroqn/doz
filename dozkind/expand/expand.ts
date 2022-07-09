type Expansion = { [abbr: string]: string };
function isExpansion(targ: any): targ is Expansion {
  return typeof targ == "object" &&
    Object.values(targ).every((value) => typeof value == "string");
}
type What = { expansion: Expansion };
function isWhat(u: any): u is What {
  return u != null && "expansion" in u && isExpansion(u.expansion);
}

export function fire(lbuffer: string, what: object) {
  if (
    !isWhat(what)
  ) {
    console.error(`invalid "what": ${JSON.stringify(what)}`);
    Deno.exit(1);
  }
  const newLbuf = _replaceExpansion(what.expansion, lbuffer);
  return [newLbuf != null, newLbuf];
}

export function _replaceExpansion(
  expansion: Record<string, string | null>,
  lbuffer: string,
) {
  const crrWordMatches = lbuffer.match(/\S+$/);
  if (!(crrWordMatches && expansion[crrWordMatches[0]])) {
    return null;
  }
  const expandee = expansion[crrWordMatches[0]];
  return lbuffer.slice(0, crrWordMatches.index) + expandee;
}
