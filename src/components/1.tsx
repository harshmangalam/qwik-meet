import {
  type NoSerialize,
  component$,
  useSignal,
  useVisibleTask$,
  noSerialize,
} from "@builder.io/qwik";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat } from "ol/proj.js";
type Props = {};
export const UserLocations = component$((props: Props) => {
  const map = useSignal<NoSerialize<Map>>();
  const dialogRef = useSignal<HTMLDialogElement>();
  const mapRef = useSignal<HTMLDivElement>();

  useVisibleTask$(() => {
    if (!mapRef.value) {
      return;
    }
    const newMap = new Map({
      target: mapRef.value,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [25.5940947, 85.1375645],
        zoom: 6,
      }),
    });

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
