type ExpansionWhat = {
  expansion: {
    [key: string]: string;
  };
};
function isExpansionWhat(what: any): what is ExpansionWhat {
  return (
    typeof what === "object" &&
    "expansion" in what &&
    typeof what.expansion === "object" &&
    Object.values(what.expansion).every((item) => typeof item === "string")
  );
}

export function fire(lbuffer: string, what: unknown) {
  if (!isExpansionWhat(what)) {
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
