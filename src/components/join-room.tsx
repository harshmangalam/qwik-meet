import { component$, useSignal } from "@builder.io/qwik";

export const JoinRoom = component$(() => {
  const roomId = useSignal("");
  return (
    <div class={["w-full sm:col-span-3", { join: roomId.value }]}>
      <input
        type="text"
        aria-label="Enter code and join meet"
        placeholder="Enter code and join meet"
        name="roomId"
        class="input input-bordered join-item focus:outline-0 w-full lg:max-w-xs"
        bind:value={roomId}
      />
      {roomId.value && (
        <a class="btn btn-info btn-square join-item" href={roomId.value}>
          <iconify-icon width={24} height={24} icon="formkit:arrowright" />
        </a>
      )}
    </div>
  );
});
