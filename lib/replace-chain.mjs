import { loadPlugins } from './util.mjs'
import arrayify from 'array-back'
import path from 'path'
import FindReplace from './plugin/find-replace.mjs'
import IndexReplace from './plugin/index-replace.mjs'

class ReplaceChain {
  async loadPlugins (pluginNames) {
    pluginNames = arrayify(pluginNames)
    if (pluginNames.length) {
      this.plugins = await loadPlugins(pluginNames)
    } else {
      this.plugins = [new FindReplace(), new IndexReplace()]
    }
  }

  /**
   * If `find` is falsy, the entire filename is replaced.
   * @returns {from: string, to: string, renamed: boolean} - ReplaceChain result
   */
  replace (file, options, index, files) {
    let to = ''
    let input = file
    /* replace pipeline */
    for (const plugin of this.plugins) {
      to = plugin.replace(input, options, index, files)
      input = to
    }
    const renamed = path.resolve(file) !== path.resolve(to)
    if (!renamed) to = null
    return { from: file, to, renamed }
  }
}

export default ReplaceChain
