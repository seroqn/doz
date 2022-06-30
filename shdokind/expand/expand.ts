type Expansion = { [abbr: string]: string };
function isExpansion(targ: any): targ is Expansion {
  return typeof targ == "object" &&
    Object.values(targ).every((value) => typeof value == "string");
}

export function fire(lbuffer: string, what: unknown) {
  if (
    !(typeof what == "object" && "expansion" in what &&
      isExpansion(what.expansion))
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
  if (!(crrWordMatches && crrWordMatches[0] in expansion)) {
    return null;
  }
  const expandee: string = expansion[crrWordMatches[0]];
  return lbuffer.slice(0, crrWordMatches.index) + expandee;
}
