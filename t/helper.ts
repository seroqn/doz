import { walkSync } from "t/deps.ts";

const EnvNames = [
  "XDG_CONFIG_DIRS",
  "XDG_CONFIG_HOME",
  "RECALLZ_HOME",
  "RECALLZ_KINDS_DIRS",
] as const;
type HandledEnv = typeof EnvNames;
export function setEnv(env: HandledEnv, val: string) {
  Deno.env.set(env, val);
}
export function delEnv(env: HandledEnv) {
  Deno.env.delete(env);
}

export class Helper {
  private _tmpDir: string | undefined;
  private _envs: { [index: string]: string | undefined } = {};
  private tmpParent = "/tmp";

  constructor() {
    this._saveEnvs();
  }

  restore() {
    this._restoreEnvs();
    this._removeTmpDir();
  }

  private _saveEnvs() {
    let envs: { [name: string]: string | undefined } = {};
    for (let name of EnvNames) {
      envs[name] = Deno.env.get(name);
    }
    this._envs = envs;
  }

  private _restoreEnvs() {
    for (const [name, value] of Object.entries(this._envs)) {
      if (value) {
        Deno.env.set(name, value);
      } else {
        Deno.env.delete(name);
      }
    }
  }

  getTmpDir() {
    if (this._tmpDir === undefined) {
      if (!Deno.statSync(this.tmpParent).isDirectory) { // msys2 でも動くようにするおまじない
        Deno.mkdirSync(this.tmpParent, { recursive: true });
      }
      this._tmpDir = Deno.makeTempDirSync({
        prefix: "denotest-",
        dir: this.tmpParent,
      });
    }
    return this._tmpDir;
  }

  _removeTmpDir() {
    if (this._tmpDir === undefined) {
      return;
    }
    Deno.removeSync(this._tmpDir, { recursive: true });
    if (walkSync(this.tmpParent, { maxdepth: 0 }).length == 0) {
      Deno.removeSync(this.tmpParent, { recursive: true });
    }
    this._tmpDir = undefined;
  }
}
