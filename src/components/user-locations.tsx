import {
  type NoSerialize,
  component$,
  useSignal,
  useVisibleTask$,
  noSerialize,
} from "@builder.io/qwik";
import { type Map } from "leaflet";
import L from "leaflet";

type Props = {};
export const UserLocations = component$((props: Props) => {
  const map = useSignal<NoSerialize<Map>>();
  const dialogRef = useSignal<HTMLDialogElement>();
  const mapRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    if (!mapRef.value) {
      return;
    }

    const newMap = L.map(mapRef.value, { preferCanvas: true }).setView(
      [25.5940947, 85.1375645],
      6
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(newMap);

    const currentUserMarker = L.marker([25.5940947, 85.1375645]).addTo(newMap);
    const remoteUserMarker = L.marker([19.5940947, 60.1375645]).addTo(newMap);

    currentUserMarker.bindPopup(`<b>You</b>`).openPopup();
    remoteUserMarker.bindPopup(`<b>Remote User</b>`).openPopup();

    map.value = noSerialize(newMap);
  });

  return (
    <>
      <button
        class="btn btn-circle relative"
        onClick$={() => dialogRef.value?.showModal()}
      >
        <iconify-icon
          width={24}
          height={24}
          icon="system-uicons:location"
        ></iconify-icon>
      </button>
      <dialog ref={dialogRef} class="modal">
        <form method="dialog" class="modal-box relative max-w-7xl w-full">
          <div class="absolute right-4 top-4">
            <button class="btn btn-circle btn-ghost">
              <iconify-icon
                width={24}
                height={24}
                icon="material-symbols:close"
              />
            </button>
          </div>
          <h3 class="font-bold text-lg mb-4">Live Locations</h3>

          <div ref={mapRef} class="h-[60vh] w-full" />
        </form>
      </dialog>
    </>
  );
});
