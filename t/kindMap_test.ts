import {_splitKinddirs, loadKindMap} from "src/app/kindMap/kindMap.ts";
import { assertEquals, afterEach, describe, it } from "t/deps.ts"
import {Helper, setEnv} from "t/helper.ts";

describe('kindMap', ()=>{
  describe('_splitKinddirs()', ()=>{
    const helper = new Helper()
    afterEach(()=>{
      helper.restore()
    })
    it('改行で分割して配列にする', ()=>{
      assertEquals(_splitKinddirs('aaa\nbb bb\nc cc'), [ "aaa", "bb bb", "c cc" ])
    })
    it('`$` で始まるディレクトリは環境変数と見なして展開する', ()=>{
      setEnv('SHDO_HOME', '/tmp/foo')
      assertEquals(_splitKinddirs('$SHDO_HOME/bar\n\${SHDO_HOME}/baz'), [ "/tmp/foo/bar", "/tmp/foo/baz" ])
    })
  })

  describe('loadKindMap()', ()=>{
    const helper = new Helper()
    afterEach(()=>{
      helper.restore()
    })
    it('load default kinds', async ()=>{
      setEnv('SHDO_HOME', '$SHDO_ROOT/kinds')
      const root = Deno.env.get('SHDO_ROOT')
      assertEquals(await loadKindMap(), {
        expand: {head: `${root}/kinds`, scriptMod: null},
        hint: {head: `${root}/kinds`, scriptMod: null},
      })
    })
  })
})

