import {
  getSettingFilePath,
  loadSettingFile,
} from "src/app/entry/settingfile.ts";
import { APPNAME_L } from "src/app/const/app.ts";
import { afterEach, assertEquals, describe, it, path } from "t/deps.ts";
import { delEnv, Helper, setEnv } from "t/helper.ts";

describe("settingfile", () => {
  const FBASE = "entries.yml";
  const helper = new Helper();
  afterEach(() => {
    helper.restore();
  });

  describe("getSettingFilePath()", () => {
    it("$RECALLZ_HOME が定義されているならそれを起点にしたパスを返す", () => {
      const tmpDir = helper.getTmpDir();
      setEnv("RECALLZ_HOME", tmpDir);
      assertEquals(getSettingFilePath(), path.join(tmpDir, FBASE));
    });
    it(`$RECALLZ_HOME が未定義なら xdg.configDirs() 以下の存在する "${APPNAME_L}" ディレクトリを返す`, () => {
      delEnv("RECALLZ_HOME");
      const tmpDir = helper.getTmpDir();
      const existDir = path.join(tmpDir, "exist");
      const homeDir = path.join(existDir, APPNAME_L);
      const fpath = path.join(homeDir, FBASE);
      Deno.mkdirSync(homeDir, { recursive: true });
      Deno.writeTextFileSync(fpath, "foobar:");
      const xdgConfigDirs = [
        path.join(tmpDir, "foo"), // no exists
        path.join(tmpDir, "bar"), // no exists
        existDir,
        path.join(tmpDir, "baz"), // no exists
      ];
      setEnv("XDG_CONFIG_DIRS", xdgConfigDirs.join(path.delimiter));
      assertEquals(getSettingFilePath(), fpath);
    });
    it(`$RECALLZ_HOME が未定義で xdg.configDirs() 以下の "${APPNAME_L}" が存在しなければ一番先頭のものを返す`, () => {
      delEnv("RECALLZ_HOME");
      const tmpDir = helper.getTmpDir();
      setEnv("XDG_CONFIG_HOME", tmpDir);
      assertEquals(
        getSettingFilePath(),
        path.join(tmpDir, APPNAME_L, FBASE),
      );
    });
  });

  describe("loadSettingFile()", () => {
    it("parse settingfile", () => {
      const tmpDir = helper.getTmpDir();
      const fpath = path.join(tmpDir, FBASE);
      Deno.writeTextFileSync(
        fpath,
        [
          ` # config`,
          ` - current: git`,
          `   hints:`,
          `     - 'add :: Add file contents to the index'`,
          `     - 'mv :: Move or rename a file, a directory, or a symlink'`,
          `     - 'restore :: Restore working tree files'`,
          `     - 'rm :: Remove files from the working tree and from the index'`,
          `     - 'sparse-checkout :: Initialize and modify the sparse-checkout'`,
          ` - current: git mv`,
          `   hints:`,
          `     - '-f :: Force renaming or moving of a file even if the target exists'`,
          `     - '-k :: Skip move or rename actions which would lead to an error condition. '`,
          `     - '-n :: Do nothing; only show what would happen'`,
          `     - '-v :: Report the names of files as they are moved.'`,
          ` - patterns:`,
          `   - git a$`,
          `   hints:`,
          `     - 'aa :: -A'`,
          `     - 'ap :: --patch'`,
          `     - 'au :: --update'`,
          ` - patterns:`,
          `   - git`,
          `   expand:`,
          `     org: origin`,
          `     mas: master`,
          ` - expand:`,
          `     '--h': --help`,
          `     '--v': --version`,
        ].join("\n"),
      );
      const expected = [
        {
          current: "git",
          hints: [
            "add :: Add file contents to the index",
            "mv :: Move or rename a file, a directory, or a symlink",
            "restore :: Restore working tree files",
            "rm :: Remove files from the working tree and from the index",
            "sparse-checkout :: Initialize and modify the sparse-checkout",
          ],
        },
        {
          current: "git mv",
          hints: [
            "-f :: Force renaming or moving of a file even if the target exists",
            "-k :: Skip move or rename actions which would lead to an error condition. ",
            "-n :: Do nothing; only show what would happen",
            "-v :: Report the names of files as they are moved.",
          ],
        },
        {
          patterns: ["git a$"],
          hints: [
            "aa :: -A",
            "ap :: --patch",
            "au :: --update",
          ],
        },
        {
          patterns: ["git"],
          expand: { org: "origin", "mas": "master" },
        },
        {
          expand: { "--h": "--help", "--v": "--version" },
        },
      ];

      assertEquals(loadSettingFile(fpath), expected);
    });
  });
});
