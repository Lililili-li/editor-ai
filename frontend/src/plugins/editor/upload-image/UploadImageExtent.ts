import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import UploadImage from '@/plugins/editor/upload-image/UploadImage'
import Image from '@tiptap/extension-image'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uploadImage: {
      insertUploadImage: () => ReturnType
    }
  }
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

const UploadImageExtents =  Image.extend({
  name: 'uploadImage',

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
        tag: 'upload-image',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['upload-image', mergeAttributes(HTMLAttributes, this.options.HTMLAttributes)]
  },
  addCommands() {
    return {
      insertUploadImage: () => ({ state, dispatch, commands }) => {
        if (dispatch) {
          const node = state.schema.nodes.uploadImage.create()
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

export default UploadImageExtents