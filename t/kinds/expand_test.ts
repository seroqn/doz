import {_replaceExpansion} from "src/shdo-kinds/expand/expand.ts";
import { assertEquals, describe, it } from "t/deps.ts"

describe('kinds/expand', ()=>{
  describe('_replaceExpansion()', ()=>{
    const expansion = {'--h': '--help', '--v': '--version'}
    it('expansion not matched', ()=>{
      assertEquals(_replaceExpansion(expansion, ''), null)
      assertEquals(_replaceExpansion(expansion, 'git --h i'), null)
      assertEquals(_replaceExpansion(expansion, 'git --h '), null)
    })
    it('expansion matched', ()=>{
      assertEquals(_replaceExpansion(expansion, 'git --h'), 'git --help')
      assertEquals(_replaceExpansion(expansion, 'git --v'), 'git --version')
      assertEquals(_replaceExpansion(expansion, '--h'), '--help')
    })
  })
})
