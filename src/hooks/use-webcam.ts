import { useSignal } from "@builder.io/qwik";
import { useStream } from "./use-stream";

export const useWebcam = () => {
  const isUserCameraOn = useSignal(false);
  const { userStream } = useStream();
  const toggleCamera = () => {
    const tracks = userStream.value?.getVideoTracks();
    if (tracks?.length) {
      tracks[0].enabled = !tracks[0].enabled;
      isUserCameraOn.value = tracks[0].enabled;
    }
  };
  return {
    isUserCameraOn,
    toggleCamera,
  };
};
