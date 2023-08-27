import {
  $,
  type NoSerialize,
  component$,
  useStore,
  useVisibleTask$,
  noSerialize,
} from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  useNavigate,
} from "@builder.io/qwik-city";
import { type Socket, io } from "socket.io-client";
import { IncommingCall } from "~/components/incomming-call";
import { RemoteUsers } from "~/components/remote-users";
import { RoomInfo } from "~/components/room-info";
import { UserLocations } from "~/components/user-locations";
import { Video } from "~/components/video";

type Store = {
  users: string[];
  peer?: NoSerialize<RTCPeerConnection>;
  socket?: NoSerialize<Socket>;
  remoteUser?: string;
  currentUser?: string;
  userStream?: NoSerialize<MediaStream>;
  remoteStream?: NoSerialize<MediaStream>;
  isIncommingCall?: boolean;
  incommingPayload?: Record<string, any>;
  isCallAccepted?: boolean;
  isUserCameraOn?: boolean;
  isUserMicOn?: boolean;
};

export const useRoom = routeLoader$(({ params }) => {
  return {
    roomId: params.roomId,
  };
});

export default component$(() => {
  const navigate = useNavigate();
  const roomSig = useRoom();
  const store = useStore<Store>({
    users: [],
    isUserCameraOn: true,
    isUserMicOn: true,
  });
  const connectedUsers = store.users.filter(
    (user) => user !== store.currentUser
  );

  const stopMediaTracks = $(() => {
    if (store.remoteStream?.active) {
      const tracks = store.remoteStream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
    }

    if (store.userStream?.active) {
      const tracks = store.userStream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
    }
  });

  const handleAnswer = $(async (message: any) => {
    console.log("incomming answer", message);
    store.remoteUser = message.caller;
    const desc = new RTCSessionDescription(message.sdp);
    await store.peer?.setRemoteDescription(desc);
    store.isCallAccepted = true;
  });

  const handleNewICECandidateMsg = $(async (incoming: RTCIceCandidateInit) => {
    console.log("incomming ice", incoming);
    const candidate = new RTCIceCandidate(incoming);
    await store.peer?.addIceCandidate(candidate);
  });

  const handleRemoteCallEnd = $(() => {
    stopMediaTracks();
    store.isCallAccepted = false;
    store.remoteUser = "";
    navigate("/");
  });

  const handleICECandidateEvent = $((e: RTCPeerConnectionIceEvent) => {
    if (e.candidate) {
      console.log("ice", e.candidate);
      const payload = {
        target: store.remoteUser,
        candidate: e.candidate,
      };
      store.socket?.emit("ice-candidate", payload);
    }
  });

  const handleTrackEvent = $((e: RTCTrackEvent) => {
    console.log("remote track", e.streams);
    store.remoteStream = noSerialize(e.streams[0]);
  });

  const handleNegotiationNeededEvent = $(async (userId: string) => {
    try {
      const offer = await store.peer?.createOffer();
      console.log("Offer", offer);
      await store.peer?.setLocalDescription(offer);
      const payload = {
        target: userId,
        caller: store.currentUser,
        sdp: store.peer?.localDescription,
      };
      console.log("payload", payload);
      console.log(store.socket);
      store.socket?.emit("offer", payload);
    } catch (error) {
      console.log(error);
    }
  });

  const createPeer = $((userId: string) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userId);

    return peer;
  });

  const callUser = $(async (userId: string) => {
    const peer = await createPeer(userId);
    store.peer = noSerialize(peer);
    store.userStream
      ?.getTracks()
      .forEach((track) => store.peer?.addTrack(track, store.userStream!));
  });

  const handleRejectCall = $(() => {
    store.isIncommingCall = false;
    store.incommingPayload = {};
    store.remoteUser = "";
  });

  const handleRecieveCall = $(async () => {
    console.log("incomming offer", store.incommingPayload);
    const peer = await createPeer(store.remoteUser!);
    store.peer = noSerialize(peer);
    const desc = new RTCSessionDescription(store.incommingPayload?.sdp);
    await store.peer?.setRemoteDescription(desc);
    store.userStream
      ?.getTracks()
      .forEach((track) => peer.addTrack(track, store.userStream!));

    const answer = await store.peer?.createAnswer();
    console.log(answer);
    await store.peer?.setLocalDescription(answer);
    const payload = {
      target: store.incommingPayload?.caller,
      caller: store.currentUser,
      sdp: store.peer?.localDescription,
    };
    store.socket?.emit("answer", payload);
    store.isIncommingCall = false;
    store.incommingPayload = {};
    store.isCallAccepted = true;
  });

  const handleHangUp = $(() => {
    store.socket?.emit("end-call", {
      from: store.currentUser,
      to: store.remoteUser,
    });
    stopMediaTracks();
    store.isCallAccepted = false;
    store.remoteUser = "";
    navigate("/");
  });

  const toggleCamera = $(() => {
    const tracks = store.userStream?.getVideoTracks();
    if (tracks?.length) {
      tracks[0].enabled = !tracks[0].enabled;
      store.isUserCameraOn = tracks[0].enabled;
    }
  });
  const toggleMic = $(() => {
    const tracks = store.userStream?.getAudioTracks();
    if (tracks?.length) {
      tracks[0].enabled = !tracks[0].enabled;
      store.isUserMicOn = tracks[0].enabled;
    }
  });

  useVisibleTask$(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    store.userStream = noSerialize(stream);

    return () => {
      stopMediaTracks();
    };
  });

  useVisibleTask$(() => {
    const socket = io();

    socket.on("connect", () => {
      store.currentUser = socket.id;
    });
    socket.emit("join-room", roomSig.value.roomId);

    socket.on("users", (data) => {
      store.users = data;
    });

    socket.on("user-joined", (user) => {
      store.users = [...store.users, user];
    });

    socket.on("user-left", (user) => {
      store.users = store.users.filter((u) => u !== user);
    });

    socket.on("offer", (data) => {
      console.log("offer received", data);
      store.isIncommingCall = true;
      store.incommingPayload = data;
      store.remoteUser = data.caller;
    });
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleNewICECandidateMsg);
    socket.on("end-call", handleRemoteCallEnd);

    store.socket = noSerialize(socket);
  });

  return (
    <div class="p-4">
      <RoomInfo />
      <div class="pb-4 flex justify-end gap-2">
        <UserLocations />
        <RemoteUsers callUser$={callUser} users={connectedUsers} />
      </div>

      {store.isIncommingCall && (
        <IncommingCall
          caller={store.incommingPayload?.caller}
          receiveCall$={handleRecieveCall}
          rejectCall$={handleRejectCall}
        />
      )}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Video user={store.currentUser} stream={store.userStream} />
        <Video user={store.remoteUser} stream={store.remoteStream} />
      </div>

      {store.isCallAccepted && (
        <div class="flex items-center justify-center space-x-2 absolute bottom-0 left-0 right-0 p-4">
          <button
            class="btn btn-error btn-circle"
            onClick$={handleHangUp}
            title="Hangup"
          >
            <iconify-icon
              width={24}
              height={24}
              icon="fluent:call-28-regular"
            />
          </button>

          <button
            title="Toggle camera"
            class={["btn btn-circle", { "btn-error": !store.isUserCameraOn }]}
            onClick$={toggleCamera}
          >
            {store.isUserCameraOn ? (
              <iconify-icon width={24} height={24} icon="carbon:video" />
            ) : (
              <iconify-icon width={24} height={24} icon="carbon:video-off" />
            )}
          </button>
          <button
            class={["btn btn-circle", { "btn-error": !store.isUserMicOn }]}
            title="Toggle mic"
            onClick$={toggleMic}
          >
            {store.isUserMicOn ? (
              <iconify-icon
                width={24}
                height={24}
                icon="fluent:mic-32-regular"
              />
            ) : (
              <iconify-icon
                width={24}
                height={24}
                icon="fluent:mic-off-32-regular"
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = ({ params }) => ({
  title: `Room | ${params.roomId}`,
});
