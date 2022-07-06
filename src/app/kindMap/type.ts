export type KindMap = {
  [kind: string]: {
    dir: string;
    scriptMod: null | {
      fire: (lbuffer: string, what: object) => [boolean, string[]];
      [key: string]: unknown;
    };
  };
};
