/*
  Author: Michael
  Description:
    Socket handler, handles socket and peer connection for the app voice chat feature
  Related PBIs: 11
*/

import { useEffect, useRef, useContext, createContext, useState } from 'react'
import Peer from 'peerjs'
import io from 'socket.io-client';
import { AuthContext } from "../contexts/AuthContext";
import styles from './index.module.css'

// Provides socket variables globally to application
export const SocketContext = createContext();

// eslint-disable-next-line
const development = `http://${window.location.hostname}:443`;
// eslint-disable-next-line
const production = `https://socket.capstone-cryptalk.com`;

function SocketHandler(props) {
  const context = useContext(AuthContext)

  // Object storage
  const socket        = useRef();
  const peer          = useRef();
  const local_stream  = useRef();
  const current_room  = useRef();

  // const peersList     = useRef([]);
  const [current_peers, setcurrent_peers] = useState([])

  // Status variables
  const [stream_setup, setstream_setup] = useState(false)

  const _Audio = useRef(true);
  const [_AudioState, set_AudioState] = useState(true)

  const _Video = useRef(false);
  const [_VideoState, set_VideoState] = useState(false)

  useEffect(() => {
    if (context.datastore_ready) {
      initialize_stream()
    }
    // eslint-disable-next-line
  }, [context.datastore_ready])

  useEffect(() => {
    if (stream_setup) {
      // Connect to socket
      socket_connect(production)

      // Event handlers for socket
      socket_setEvents()

      // Create new peer
      peer_create()

      // Set event handlers for peer
      peer_setEvents()
    }
    // eslint-disable-next-line
  }, [stream_setup])

  /* Socket functions */
  function socket_connect(link) {
    socket.current = io.connect(link);
  }

  function socket_setEvents() {
    socket.current.on('connect', () => {
      console.log('[Socket::connect]')
    })

    socket.current.on('connect_error', () => {
      console.log('[Socket::connect_error]')
    })

    socket.current.on('disconnect', () => {
      console.log('[Socket::disconnect]')
      socket.current = null
    })

    socket.current.on('room::userLeft', async (user) => {
      console.log(`[Socket::userLeft] ${user.username}`)
      // Store the current state into a temp variable

      var current;

      await setcurrent_peers(x => {
        current = x;
        return x;
      })

      var target_user = await current.find(x => x.sub === user.sub)

      if (target_user !== undefined) {
        target_user.call.close()

        target_user.stream.getTracks().forEach((track) => {
          track.stop()
        })
      }

      await setcurrent_peers(x => x.filter(x => x.sub !== user.sub))
    })

    socket.current.on('room::userJoined', (user) => {
      console.log(`[Socket::userJoined] ${user.username}`)
      const call = peer.current.call(user.sub, local_stream.current, {
        metadata: {
          username: context.user.username,
          sub: context.user.attributes.sub,
          audio: _Audio.current,
          video: _Video.current
        }
      })

      console.log('[Peer::sentCall]', call)

      call.on('stream', (incomingStream) => {
        console.log('[Peer::streamIncoming]')

        new_peer(
          user.username,
          user.sub,
          call,
          incomingStream,
          _Audio.current,
          _Video.current
        )
      })
      call.on('close', () => {console.log('[Call::close]')})
      call.on('error', (err) => {console.log('[Call:error]', err)})
    })
  }

  /* Peer functions */
  function peer_create() {
    // peerjs --port 4444
    peer.current = new Peer(context.user.attributes.sub, {
      host: 'socket.capstone-cryptalk.com',
      port: '443',
      path: '/peer',
      secure: true
    })
    // peer.current = new Peer(context.user.attributes.sub)
  }

  function peer_setEvents() {
    peer.current.on('open', () => {console.log('[Peer::open]')})
    peer.current.on('disconnected', () => {console.log('[Peer::disconnected]')})

    peer.current.on('call', (mediaConnection) => {
      console.log('[Peer::answerCall]', mediaConnection)

      mediaConnection.answer(local_stream.current)
      mediaConnection.on('stream', (incomingStream) => {
        console.log('[Peer::streamIncoming]')

        new_peer(
          mediaConnection.metadata.username,
          mediaConnection.metadata.sub,
          mediaConnection,
          incomingStream,
          mediaConnection.metadata.audio,
          mediaConnection.metadata.video
        )
      })

      mediaConnection.on('close', () => {console.log('[Call::close]')})
      mediaConnection.on('error', (err) => {console.log('[Call::error]', err)})
    })
  }


  /* Stream functions */
  function initialize_stream() {
    navigator.mediaDevices.getUserMedia({ video: _Video.current, audio: _Audio.current }).then((stream) => {
      local_stream.current = stream
      setstream_setup(true)
    }, (err) => {
      context.spawnNotification("ERROR", "Permission denied", "Please allow access to your camera and microphone to use the site.")
    })
  }

  async function enable_voice() {
    socket.current.emit('room::enableVoice', current_room.current, { username: context.user.username, sub: context.user.attributes.sub })
    context.spawnNotification("INFO", "Voice enabled", "Your voice has been enabled.");

    var current;
    await setcurrent_peers(x => { current = x; return x; })

    for (var i in current) {
      current[i].call._localStream.getAudioTracks()[0].enabled = true
    }
  }

  async function disable_voice() {
    socket.current.emit('room::disableVoice', current_room.current, { username: context.user.username, sub: context.user.attributes.sub })
    context.spawnNotification("INFO", "Voice disabled", "Your voice has been disabled.");

    var current;
    await setcurrent_peers(x => { current = x; return x; })

    for (var i in current) {
      current[i].call._localStream.getAudioTracks()[0].enabled = false
    }
  }

  async function enable_video() {
    var current;
    await setcurrent_peers(x => { current = x; return x; })

    navigator.mediaDevices.getUserMedia({ video: _Video.current, audio: _Audio.current }).then((stream) => {
      for (var i in current) {
        current[i].call._localStream.addTrack(stream.getVideoTracks()[0])
        // current[i].call._localStream.getVideoTracks()[0].enabled = true
      }
    }, (err) => {
      context.spawnNotification("ERROR", "Permission denied", "Please allow access to your camera.")
      return;
    })

    socket.current.emit('room::enableVideo', current_room.current, { username: context.user.username, sub: context.user.attributes.sub })
    context.spawnNotification("INFO", "Video enabled", "Your video has been enabled.");
  }

  async function disable_video() {
    socket.current.emit('room::disableVideo', current_room.current, { username: context.user.username, sub: context.user.attributes.sub })
    context.spawnNotification("INFO", "Video disabled", "Your video has been disabled.");
    // TODO
  }

  function toggle_Audio() {
    _Audio.current = !_Audio.current
    set_AudioState(_Audio.current)

    if (_Audio.current) { enable_voice() } else { disable_voice() }
  }

  function toggle_Video() {
    _Video.current = !_Video.current
    set_VideoState(_Video.current)

    if (_Video.current) { enable_video() } else { disable_video() }
  }

  /* Room functions */
  function room_connect(roomID) {
    current_room.current = roomID
    // console.log('[room_connect]', roomID)
    if (socket !== undefined) {
      socket.current.emit('room::join', roomID, { username: context.user.username, sub: context.user.attributes.sub })
    }
  }

  async function room_disconnect(roomID) {
    current_room.current = "none"
    // console.log('[room_disconnect]', roomID)
    socket.current.emit('room::leave', roomID, { username: context.user.username, sub: context.user.attributes.sub})

    var current;

    await setcurrent_peers(x => {
      current = x;
      return x;
    })

    for (var i in current) {
      // Close call
      current[i].call.close()

      // Close each track in MediaStream
      current[i].stream.getTracks().forEach((track) => {
        track.stop()
      })
    }

    // Empty the current peer list because we have just left the room
    setcurrent_peers([])
  }

  /* Peer functions */
  async function new_peer(username, sub, call, stream, audio, video) {
    var current;

    await setcurrent_peers(x => {
      current = x;
      return x;
    })

    if (current.filter(x => x.sub === sub).length === 0) {
      await setcurrent_peers(x => [...x, {
        username: username,
        sub: sub,
        stream: stream,
        call: call,
        audio: audio,
        video: video
      }])
    }
  }

  return (
    <SocketContext.Provider value={{
      socket: socket.current,
      current_peers: current_peers,
      room_connect: room_connect,
      room_disconnect: room_disconnect,
      _Audio: _AudioState,
      _Video: _VideoState,
      toggle_Audio: toggle_Audio,
      toggle_Video: toggle_Video
    }}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketHandler


// peerjs --port 4444
// peerRef.current = new Peer(context.user.attributes.sub, {
//   host: '/',
//   port: '4444'
// })
