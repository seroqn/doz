type Options = {
  include?: string[];
};
export function listKinds(options: Options, kindNames: string[]) {
  if ("include" in options) {
    kindNames = filterKinds(kindNames, options.include);
  }
  for (const kind of kindNames) {
    console.log(kind);
  }
}

function filterKinds(kindNames: string[], includees: string[]) {
  return kindNames.filter(
    (kind: string) => includees.every((str: string) => kind.includes(str)),
  );
}
