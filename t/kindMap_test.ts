import { _splitKinddirs, loadKindMap } from "src/app/kindMap/kindMap.ts";
import { afterEach, assertEquals, describe, it, path } from "t/deps.ts";
import { delEnv, Helper } from "t/helper.ts";

describe("kindMap", () => {
  describe("_splitKinddirs()", () => {
    it("`$` で始まるディレクトリは環境変数と見なして展開, `*` は glob 展開する", async () => {
      const root = Deno.env.get("DOZ_ROOT");
      assertEquals(
        await _splitKinddirs(
          "$DOZ_ROOT/dozkind/*\n\${DOZ_ROOT}/src/app/*",
        ),
        [
          `${root}/dozkind/expand`,
          `${root}/dozkind/hint`,
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
      delEnv("DOZ_KINDS_DIRS");
      const root = Deno.env.get("DOZ_ROOT");
      assertEquals(await loadKindMap(), {
        expand: {
          dir: path.normalize(`${root}/dozkind/expand`),
          scriptMod: null,
        },
        hint: { dir: path.normalize(`${root}/dozkind/hint`), scriptMod: null },
      });
    });
  });
});
