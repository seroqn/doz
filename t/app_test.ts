import { _nextEntryIdx } from "src/app/app.ts";
import { assertEquals, describe, it } from "t/deps.ts";

describe("app", () => {
  describe("_nextEntryIdx()", () => {
    describe("current", () => {
      const spec = [
        { current: "git" },
        { current: "git mv" },
        { patterns: ["git a$"] },
      ];
      it("not found", () => {
        assertEquals(_nextEntryIdx(spec, "", 0), -1);
        assertEquals(_nextEntryIdx(spec, "foo", 0), -1);
        assertEquals(_nextEntryIdx(spec, "gith", 0), -1);
      });
      it("match `current`", () => {
        assertEquals(_nextEntryIdx(spec, "git", 0), 0);
        assertEquals(_nextEntryIdx(spec, "git  ", 0), 0);
        assertEquals(_nextEntryIdx(spec, "foo git", 0), 0);
        assertEquals(_nextEntryIdx(spec, "foo git ", 0), 0);
      });
      it("match subcmd", () => {
        assertEquals(_nextEntryIdx(spec, "git mv", 0), 1);
        assertEquals(_nextEntryIdx(spec, "git mv ", 0), 1);
        assertEquals(_nextEntryIdx(spec, "git  mv ", 0), -1);
        assertEquals(_nextEntryIdx(spec, "git mva", 0), -1);
      });
    });
    describe("patterns", () => {
      const spec = [
        { current: "git" },
        { current: "git mv" },
        { patterns: ["git a$"] },
      ];
      it("match pattern", () => {
        assertEquals(_nextEntryIdx(spec, "git a", 0), 2);
      });
      it("not match pattern", () => {
        assertEquals(_nextEntryIdx(spec, "git a ", 0), -1);
        assertEquals(_nextEntryIdx(spec, "git  a", 0), -1);
      });
    });

    describe("no-condition", () => {
      const spec = [
        { patterns: ["git"] },
        {},
        { current: "awk" },
        {},
      ];
      it("match anything when condition is not defined", () => {
        assertEquals(_nextEntryIdx(spec, "", 0), 1);
        assertEquals(_nextEntryIdx(spec, " ", 0), 1);
        assertEquals(_nextEntryIdx(spec, " aba ", 0), 1);
      });
      it("match anything when condition is not defined", () => {
        assertEquals(_nextEntryIdx(spec, "git", 0), 0);
        assertEquals(_nextEntryIdx(spec, " git add", 0), 0);
        assertEquals(_nextEntryIdx(spec, " git log | less ", 0), 0);
      });
      it("giving index argument, search next entry", () => {
        assertEquals(_nextEntryIdx(spec, "git", 1), 1);
        assertEquals(_nextEntryIdx(spec, "git", 2), 3);
      });
    });
  });
});
