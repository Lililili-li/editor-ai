import { Editor, ReactRenderer, posToDOMRect } from '@tiptap/react'
import { computePosition, flip, shift } from '@floating-ui/dom'
import Suggestion from './Suggestion'

const suggestionsList = [
  {
    value: 'h1',
    label: 'H1 标题1',
    type: 'format',
    attrs: { level: 1 },

  },
  {
    value: 'h2',
    label: 'H2 标题2',
    type: 'format',
    attrs: { level: 2 }
  },
  {
    value: 'h3',
    label: 'H3 标题3',
    type: 'format',
    attrs: { level: 3 }
  },
  {
    value: 'h4',
    label: 'H4 标题4',
    type: 'format',
    attrs: { level: 4 }
  },
  {
    value: 'h5',
    label: 'H5 标题5',
    type: 'format',
    attrs: { level: 5 }
  },
  {
    value: 'h6',
    label: 'H6 标题6',
    type: 'format',
    attrs: { level: 6 }
  },
  {
    value: 'bulletList',
    label: '无序列表',
    type: 'format',
    attrs: {}
  },
  {
    value: 'orderList',
    label: '有序列表',
    type: 'format',
    attrs: {}
  },
  {
    value: 'taskList',
    label: '任务列表',
    type: 'format',
    attrs: {}
  },
  {
    value: 'blockQuote',
    label: '引用',
    type: 'format',
    attrs: {}
  },
  {
    value: 'codeBlock',
    label: '代码块',
    type: 'format',
    attrs: {}
  },
  {
    value: 'table',
    label: '表格',
    type: 'other',
    attrs: {}
  },
  {
    value: 'image',
    label: '图片',
    type: 'other',
    attrs: {}
  },
  {
    value: 'horizontalRule',
    label: '分割线',
    type: 'other',
    attrs: {}
  }
]

const updatePosition = (editor: Editor, element: any) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'right',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.border= '1px solid #eee'
    element.style.borderRadius= '4px'
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x + 5}px`
    element.style.top = `${y}px`
  })
}

export default {
  char: '/',
  items: ({ query } : {query: string}) => {
    return suggestionsList
      .filter(item => item.value.toLowerCase().startsWith(query.toLowerCase()))
  },

  render: () => {
    let component: any

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(Suggestion, {
          props,
          editor: props.editor,
        })
        if (!props.clientRect) {
          return
        }
        component.element.style.position = 'absolute'
        document.body.appendChild(component.element)
        updatePosition(props.editor, component.element)
      },

      onUpdate(props:any) {
        component.updateProps(props)
        if (!props.clientRect) {
          return
        }
        updatePosition(props.editor, component.element)
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          component.destroy()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        component?.element.remove()
        component?.destroy()
      },
    }
  },
}