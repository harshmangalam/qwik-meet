import { useSignal } from "@builder.io/qwik";
import { useStream } from "./use-stream";

export const useMic = () => {
  const { userStream } = useStream();
  const isUserMicOn = useSignal(false);
  const toggleMic = () => {
    const tracks = userStream.value?.getAudioTracks();
    if (tracks?.length) {
      tracks[0].enabled = !tracks[0].enabled;
      isUserMicOn.value = tracks[0].enabled;
    }
  };
  return {
    toggleMic,
    isUserMicOn,
  };
};
