import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const CreateRoom = component$(() => {
  const id = crypto.randomUUID();
  return (
    <Link
      href={id}
      title="Create room"
      class="btn btn-primary w-full sm:col-span-2"
    >
      <iconify-icon
        width={24}
        height={24}
        icon="material-symbols:video-call-outline-sharp"
      />
      New meeting
    </Link>
  );
});
