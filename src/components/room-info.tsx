import { $, component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export const RoomInfo = component$(() => {
  const open = useSignal(false);
  const location = useLocation();
  const copyToClipboard = $(() => {
    navigator.clipboard.writeText(location.url.href);
    open.value = false;
  });

  return (
    <div class="toast toast-top toast-start z-10">
      <div class="alert shadow-lg">
        <iconify-icon width={32} height={32} icon="solar:copy-linear" />
        <div>
          <h3 class="font-bold">Copy & send joining link</h3>
          <div class="text-sm max-w-xs w-full truncate">
            {location.url.href}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            onClick$={copyToClipboard}
            class="btn rounded-full btn-sm btn-neutral"
          >
            Copy
          </button>
          <button
            onClick$={() => (open.value = false)}
            class="btn rounded-full btn-sm btn-error"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});
