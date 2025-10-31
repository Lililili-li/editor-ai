import { mergeAttributes, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import UploadImage from './ImageBlock'
import { Image } from '@tiptap/extension-image'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      insertImage: () => ReturnType
    }
  }
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const ImageBlock = Image.extend({
  name: 'imageBlock',
  addOptions() {
    return {
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
      name: {
        default: '',
      },
      width: {
        default: 0,
      },
      height: {
        default: 0,
      },
      ratio: {
        default: '75'
      },
      align: {
        default: 'start'
      },
      rotate: {
        default: 0
      },
      originWidth: {
        default: 0,
      },
      originHeight: {
        default: 0,
      },
      originRatio: {
        default: 0
      },
      description: {
        default: ''
      },
      descriptionVisible: {
        default: false
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img',
        getAttrs: (node: HTMLElement) => {
          console.log(node);
          return {
            src: node.getAttribute('src'),
            name: node.getAttribute('name') || '',
            width: node.getAttribute('width') || 0,
            height: node.getAttribute('height') || 0,
            ratio: node.getAttribute('ratio') || '75',
            align: node.getAttribute('align') || 'center',
            originWidth: node.getAttribute('originWidth') || 0,
            originHeight: node.getAttribute('originHeight') || 0,
            originRatio: node.getAttribute('originRatio') || '75',
            description: node.getAttribute('description') || '',
            descriptionVisible: node.getAttribute('descriptionVisible') || false
          }
        }
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: any}) {
    return ['img', mergeAttributes(HTMLAttributes, this.options.HTMLAttributes)]
  },

  addCommands() {
    return {
      insertImage: () => ({ state, dispatch, commands }: { state: any, dispatch: any, commands: any }) => {
        if (dispatch) {
          const node = state.schema.nodes.imageBlock.create()
          const { from } = state.selection
          commands.insertContentAt(from, node)
        }
        return true
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(UploadImage)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match

          return { src, alt, title }
        },
      }),
    ]
  },
})