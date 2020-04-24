import PropTypes from "prop-types"
import React, { useState, useContext } from "react"
import LockPicker from "./LockPicker"
import { IdentityContext } from "./Layout"
import useBroadcast from "../hooks/useBroadcast"
import useLive from "../hooks/useLive"

export const Broadcaster = ({ address }) => {
  const [locks, setLocks] = useState([])
  useBroadcast(address)

  const onLockChange = (selected) => {
    setLocks((selected || []).map((option) => option.value))
  }

  return (
    <form className="container">
      <LockPicker
        identity={address}
        onLockChange={onLockChange}
        currentLocks={locks}
      >
        <p>No lock?</p>
      </LockPicker>

      <textarea id="incoming" />
      <button type="submit">submit</button>
      <pre id="outgoing" />
    </form>
  )
}

export const Viewer = ({ address, identity }) => {
  useLive(address, identity)
  return (
    <form className="container">
      <textarea id="incoming" />
      <button type="submit">submit</button>
      <pre id="outgoing" />
    </form>
  )
}

/**
 * Will show a live page
 * @param {*} param0
 */
export const Live = ({ address }) => {
  const identity = useContext(IdentityContext)

  if (!identity) {
    return <>Please authenticate first</>
  }

  if (identity === address) {
    return <Broadcaster address={address} />
  }
  return <Viewer address={address} identity={identity} />
}

Live.propTypes = {
  address: PropTypes.string.isRequired,
}

export default Live
