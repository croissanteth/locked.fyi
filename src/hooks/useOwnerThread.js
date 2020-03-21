import { useState, useEffect, useReducer} from 'react'
import Box from '3box'
import FrontMatter from 'front-matter'
import {sortThread} from '../utils/sortThread'

/**
 * util function to build the markdown file
 * @param {*} note
 */
const buildContent = (note) => {
  const locks = (note.attributes.locks || []).map(lock => {
    return `  - "${lock}"
`
  }).join('')
  return `---
createdAt: ${note.attributes.createdAt || new Date().getTime()}
updatedAt: ${new Date().getTime()}
title: ${note.attributes.title}
author: "${note.attributes.author}"
locks:
${locks}
---
${note.body}`

}

const noteReducer = (state, action) => {
  switch (action.type) {
    case 'setNote':
      return {
        ...action.note
      }
    case 'setAttribute':
      return {
        attributes: {
          ...state.attributes,
          [action.attribute]: action.value
        },
        body: state.body
      }
      case 'setBody':
        return {
          ...state,
          'body': action.body
        }
      default:
        // Un supported!
  }
  return state
}

const newNote = (identity) => {
  return {
    attributes: {
      title: '',
      locks: [],
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      author: `${identity}`
    },
    body: ""
  }
}


/**
 * Opens a thread for a user!
 */
export const useOwnerThread = (identity, index) => {
  const [loading, setLoading] = useState(true)
  const [thread, setThread] = useState(null)
  const [saving, setSaving] = useState(false)
  const [postId, setPostId] = useState(null)
  const [note, dispatch] = useReducer(noteReducer, newNote(identity))

  useEffect(() => {
    const openSpace = async () => {
      setLoading(true)
      if(!identity) {
        setLoading(false)
        return
      }
      const box = await Box.openBox(identity, window.ethereum)
      const space = await box.openSpace('locked')
      const thread = await space.joinThread('fyi', {
        members: true
      })
      setThread(thread)
      const items = sortThread(await thread.getPosts())
      // if there is an index, yield the note!
      // Otherwise yield a new note!
      const item = items[index]
      if(item) {
        setPostId(item.postId)
        const note = FrontMatter(item.message)
        dispatch({
          type: 'setNote',
          note,
        })
      } else {
        dispatch({
          type: 'setNote',
          note: newNote(identity),
        })
      }
      setLoading(false)
    }

    openSpace()
  }, [identity, index])

  const setNoteAttribute = (attribute, value) => {
    dispatch({type: 'setAttribute', attribute, value})
  }

  const setNoteBody = (body) => {
    dispatch({type: 'setBody', body})
  }

  /**
   * Saves a story!
   */
  const save = async () => {
    setSaving(true)
    if (postId) {
      await thread.deletePost(postId)
    }
    await thread.post(buildContent(note))
    setSaving(false)
  }

  const destroy = async () => {
    setSaving(true)
    await thread.deletePost(postId)
    dispatch({
      type: 'setNote',
      note: newNote(identity),
    })

    setSaving(false)
  }

  return { setNoteAttribute, setNoteBody, thread, note, loading, save, postId, destroy, saving }

}