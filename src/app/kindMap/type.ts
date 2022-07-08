export type KindMap = {
  [kind: string]: {
    dir: string;
    scriptMod: null | {
      fire: (lbuffer: string, what: object) => FireResult;
      [key: string]: unknown;
    };
  };
};
export type FireResult = [boolean, string | null | undefined];
