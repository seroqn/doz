export type Kind2Path = {
  [kind: string]: {
    raw: string;
    evaled: string | null;
    mod: null | Module;
  };
};
