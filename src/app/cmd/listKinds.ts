type Options = {
  include?: string[];
};
export function listKinds(options: Options, kindNames: string[]) {
  if (options.include) {
    kindNames = _filterKinds(kindNames, options.include);
  }
  for (const kind of kindNames) {
    console.log(kind);
  }
  return 0;
}

function _filterKinds(kindNames: string[], includees: string[]) {
  return kindNames.filter(
    (kind: string) => includees.every((str: string) => kind.includes(str)),
  );
}
