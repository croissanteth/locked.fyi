import React, {useContext} from 'react';
import { useNote } from '../hooks/useNote'
import { useAddress } from '../hooks/useAddress'
import { Markdown } from 'react-showdown'
import {Link} from "react-router-dom";
import {useLocks} from '../hooks/useLocks'
import {useProfile} from '../hooks/useProfile'
import {Loading} from './Loading'
import {IdentityContext} from '../components/Layout'

/**
 * Shows the child
 * @param {*} param0
 */
export const Locked = ({locks, children}) => {
  const {locked, loading, unlock} = useLocks(locks)
  if(loading) {
    return <Loading />
  }
  if (locked) {
    return <p><button onClick={unlock}>Unlock</button></p>
  }
  return children
}

export const Author = ({address}) => {
  const {loading, profile} = useProfile(address)
  if(loading) {
    return <span>&nbsp;</span>
  }
  if (profile.website) {
    return <span>By <a target="_blank" rel="noopener noreferrer" href={profile.website}>{profile.name}</a></span>
  }
  if (profile.name) {
    return <span>By {profile.name}</span>
  }
  return <span>By <abbr title={address}>{address.substring(0, 15)}...</abbr></span>

}

/**
 * Note component
 * @param {*} param0
 */
export const Note = ({address, note: index}) => {
  const {thread} = useAddress(address)
  const identity = useContext(IdentityContext)

  const {note, error, loading} = useNote(thread, index)

  if(error) {
    return <p>{error}</p>
  }
  if(loading) {
    return <Loading />
  }

  const threadPath = `/${address}`
  const editPath = `/write?note=${index}`
  const viewedByAuthor = identity === note.attributes.author

  return <article>
    <Author address={note.attributes.author} />
    <Locked locks={note.attributes.locks}>
      <Markdown markup={note.body}></Markdown>
    </Locked>
  <footer>
    <nav>Back to <Link to={threadPath}>Thread</Link></nav>
    {viewedByAuthor && <nav><Link to={editPath}>Edit</Link></nav>}
  </footer>
  </article>
}

export default Note