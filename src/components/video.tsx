import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const Video = component$(
  ({ stream, user }: { stream: any; user?: string }) => {
    const videoRef = useSignal<HTMLVideoElement | undefined>();
    useVisibleTask$(({ track }) => {
      track(() => stream);
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
      }
    });
    return (
      <div class="card rounded-md">
        <video
          ref={videoRef}
          class="w-full h-full rounded-md"
          autoPlay
          playsInline
          controls={false}
        >
          <track kind="captions" />
        </video>
        <div class="card-body p-0">
          {user && (
            <div class="absolute right-0 text-sm left-0 bottom-0 h-8 backdrop-blur-sm flex items-center text-white px-2 rounded-b-md">
              {user}
            </div>
          )}
        </div>
      </div>
    );
  }
);
