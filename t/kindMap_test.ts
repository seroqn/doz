import { _splitKinddirs, loadKindMap } from "src/app/kindMap/kindMap.ts";
import { afterEach, assertEquals, describe, it, path } from "t/deps.ts";
import { delEnv, Helper } from "t/helper.ts";

describe("kindMap", () => {
  describe("_splitKinddirs()", () => {
    it("`$` で始まるディレクトリは環境変数と見なして展開, `*` は glob 展開する", async () => {
      const root = Deno.env.get("SHDO_ROOT");
      assertEquals(
        await _splitKinddirs("$SHDO_ROOT/shdokind/*\n\${SHDO_ROOT}/src/app/*"),
        [
          `${root}/shdokind/expand`,
          `${root}/shdokind/hint`,
          `${root}/src/app/kindMap`,
          `${root}/src/app/settingfile`,
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
      delEnv("SHDO_KINDS_DIRS");
      const root = Deno.env.get("SHDO_ROOT");
      assertEquals(await loadKindMap(), {
        expand: {
          dir: path.normalize(`${root}/shdokind/expand`),
          scriptMod: null,
        },
        hint: { dir: path.normalize(`${root}/shdokind/hint`), scriptMod: null },
      });
    });
  });
});
