import { type QRL, component$ } from "@builder.io/qwik";

type Props = {
  caller: string;
  receiveCall$: QRL<() => void>;
  rejectCall$: QRL<() => void>;
};
export const IncommingCall = component$((props: Props) => {
  const { caller, receiveCall$, rejectCall$ } = props;

  return (
    <div class="toast toast-end z-10">
      <div class="alert shadow-lg">
        <iconify-icon width={32} height={32} icon="simple-line-icons:call-in" />
        <div>
          <h3 class="font-bold">Incommin Call</h3>
          <div class="text-sm max-w-xs w-full truncate">
            {caller} is calling you...
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            onClick$={rejectCall$}
            class="btn btn-error btn-circle"
            title="Decline"
          >
            <iconify-icon width={24} height={24} icon="subway:call-3" />
          </button>
          <button
            class="btn btn-primary btn-circle"
            onClick$={receiveCall$}
            title="Accept"
          >
            <iconify-icon width={24} height={24} icon="subway:call" />
          </button>
        </div>
      </div>
    </div>
  );
});
