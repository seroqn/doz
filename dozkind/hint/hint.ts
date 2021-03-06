import { sprintf } from "https://deno.land/std@0.144.0/fmt/printf.ts";

const WIDTH_THRESHOLD = 12;
type Hints = Array<string | undefined>;
type HPair = [string, string];
function isHints(hints: any): hints is Hints {
  return (
    Array.isArray(hints) &&
    hints.every((hint) => hint == null || typeof hint == "string")
  );
}

export function fire(_: string, what: any) {
  if (typeof what != "object") {
    console.error(`invalid "what": ${JSON.stringify(what)}`);
    Deno.exit(1);
  }
  if (!("hints" in what && isHints(what.hints))) {
    console.error(`invalid "hints": ${JSON.stringify(what.hints)}`);
    Deno.exit(1);
  }

  const fmt = `%s%-${WIDTH_THRESHOLD}s%s  %s`;
  const indent = " ".repeat(4);
  const outs = what.hints.map((hint: string | null) => _hintIntoHPair(hint))
    .filter((pair: HPair | null) => pair).map((pair: HPair) => {
      if (!pair[0]) {
        return pair[1];
      }
      const sep = pair[1] ? "::" : "";
      return _isLong(pair[0])
        ? `${indent}${pair[0]}\t${sep}  ${pair[1]}`
        : sprintf(fmt, indent, pair[0], sep, pair[1]);
    });
  return [true, outs.join("\n")];
}
export function _hintIntoHPair(hint: string | null): HPair | null {
  if (!hint) {
    return null;
  } else if (/^#/.test(hint)) {
    return [
      "",
      hint.replace(/^(#+)\s?/, "$1 "),
    ];
  }
  const result = /^\s*((?::(?::\S|[^:])|[^: ]).*?)(?:\s*|\s*::(?:\s*|\s+(.*)))$/
    .exec(hint); // `:: ` is separator
  return !result ? null : [result[1].trim(), result[2] ?? ""];
}
function _isLong(str: string) {
  return [...str].reduce(
    (count: number, char: string) => Math.min(new Blob([char]).size, 2) + count,
    0,
  ) > WIDTH_THRESHOLD;
}
