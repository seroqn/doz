import { _splitKinddirs, loadKindMap } from "src/app/kindMap/kindMap.ts";
import { afterEach, assertEquals, describe, it, path } from "t/deps.ts";
import { delEnv, Helper } from "t/helper.ts";

describe("kindMap", () => {
  describe("_splitKinddirs()", () => {
    it("`$` で始まるディレクトリは環境変数と見なして展開, `*` は glob 展開する", async () => {
      const root = Deno.env.get("RECALLZ_ROOT");
      assertEquals(
        await _splitKinddirs(
          "$RECALLZ_ROOT/rzkind/*\n\${RECALLZ_ROOT}/src/app/*",
        ),
        [
          `${root}/rzkind/expand`,
          `${root}/rzkind/hint`,
          `${root}/src/app/cmd`,
          `${root}/src/app/const`,
          `${root}/src/app/entry`,
          `${root}/src/app/kindMap`,
        ].map((dir: string) => path.normalize(dir)),
      );
    });
  });

  describe("loadKindMap()", () => {
    const helper = new Helper();
    afterEach(() => {
      helper.restore();
    });
    it("load default kinds", async () => {
      delEnv("RECALLZ_KINDS_DIRS");
      const root = Deno.env.get("RECALLZ_ROOT");
      assertEquals(await loadKindMap(), {
        expand: {
          dir: path.normalize(`${root}/rzkind/expand`),
          scriptMod: null,
        },
        hint: { dir: path.normalize(`${root}/rzkind/hint`), scriptMod: null },
      });
    });
  });
});
