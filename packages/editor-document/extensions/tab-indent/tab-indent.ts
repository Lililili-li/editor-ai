import { Extension, type Command, type KeyboardShortcutCommand, type CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: () => ReturnType
    outdent: () => ReturnType
  }
}

export interface TabIndentOptions {
  // 缩进空格数
  indentSize: number
  // 支持缩进的节点类型
  nodeTypes: string[]
}

const TabIndent = Extension.create<TabIndentOptions>({
  name: 'tabIndent',

  addOptions(): TabIndentOptions {
    return {
      indentSize: 4,
      nodeTypes: ['paragraph', 'heading'],
    }
  },

  addCommands(): any {
    return {
      // 缩进命令
      indent: (): Command => ({ tr, state, dispatch }: CommandProps) => {
        const { selection } = state
        const { nodeTypes } = this.options
        const parentTypeName = selection.$head.parent.type.name

        // 检查当前节点是否支持缩进
        if (!nodeTypes.includes(parentTypeName)) {
          return false
        }

        if (dispatch) {
          // 在当前位置插入指定数量的空格
          const spaces = ' '.repeat(this.options.indentSize)
          tr.insertText(spaces, selection.from, selection.to)
          dispatch(tr)
        }

        return true
      },

      // 反缩进命令
      outdent: (): Command => ({ tr, state, dispatch }: CommandProps) => {
        const { selection } = state
        const { nodeTypes, indentSize } = this.options
        const parentTypeName = selection.$head.parent.type.name

        // 检查当前节点是否支持缩进
        if (!nodeTypes.includes(parentTypeName)) {
          return false
        }

        const start = selection.from
        const lineStart = start - selection.$head.parentOffset

        // 查找需要删除的空格
        let spaceCount = 0
        for (let i = lineStart; i < start && i < lineStart + indentSize; i++) {
          const char = state.doc.textBetween(i, i + 1)
          if (char === ' ') {
            spaceCount++
          } else {
            break
          }
        }

        if (spaceCount > 0 && dispatch) {
          // 删除相应数量的空格（最多为缩进大小）
          const deleteCount = Math.min(spaceCount, indentSize)
          tr.delete(lineStart, lineStart + deleteCount)
          dispatch(tr)
        }

        return true
      },
    }
  },

  addKeyboardShortcuts(): Record<string, KeyboardShortcutCommand> {
    return {
      // Tab键触发缩进
      Tab: () => (this.editor.commands as any).indent(),

      // Shift+Tab触发反缩进
      'Shift-Tab': () => (this.editor.commands as any).outdent(),
    }
  },
})

export default TabIndent