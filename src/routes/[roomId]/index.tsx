import { component$ } from "@builder.io/qwik";
import { RemoteUsers } from "~/components/remote-users";
import { RoomInfo } from "~/components/room-info";

export default component$(()=>{
    return (
        <div>
            <RoomInfo />
<div class="pb-4 flex justify-end gap-2">
  <RemoteUsers
    callUser$={(user) => callUser(user)}
    users={connectedUsers}
    room={room}
  />
</div>

<!-- incomming call  -->

{#if isIncommingCall}
  <IncommingCall
    caller={incommingPayload.caller}
    on:receivecall={handleRecieveCall}
    on:rejectcall={handleRejectCall}
  />
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Video isCurrentUser={true} user={currentUser} stream={userStream} />
  <Video user={remoteUser} stream={remoteStream} />
</div>

{#if isCallAccepted}
  <div
    class="flex items-center justify-center space-x-2 absolute bottom-0 left-0 right-0 p-4"
  >
    <button
      class="btn btn-error btn-circle"
      on:click={handleHangUp}
      title="Hangup"
    >
      <iconify-icon width={24} height={24} icon="fluent:call-28-regular" />
    </button>

    <button
      class={"btn btn-circle"}
      title="Toggle camera"
      class:btn-error={!isUserCameraOn}
      on:click={toggleCamera}
    >
      {#if isUserCameraOn}
        <iconify-icon width={24} height={24} icon="carbon:video" />
      {:else}
        <iconify-icon width={24} height={24} icon="carbon:video-off" />
      {/if}
    </button>
    <button
      class="btn btn-circle"
      class:btn-error={!isUserMicOn}
      title="Toggle mic"
      on:click={toggleMic}
    >
      {#if isUserMicOn}
        <iconify-icon width={24} height={24} icon="fluent:mic-32-regular" />
      {:else}
        <iconify-icon width={24} height={24} icon="fluent:mic-off-32-regular" />
      {/if}
    </button>
  </div>
{/if}
        </div>
    )
})

