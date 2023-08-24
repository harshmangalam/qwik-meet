import { component$ } from "@builder.io/qwik";
import { CreateRoom } from "./create-room";

export const Hero = component$(() => (
  <div class="hero bg-base-100 py-10">
    <div class="hero-content justify-between max-w-7xl w-full flex-col lg:flex-row-reverse">
      <div class="max-w-lg w-full mb-24 lg:mb-0">
        <HeroSvg />
      </div>

      <div>
        <div class="text-3xl sm:text-4xl md:text-5xl text-center lg:text-start">
          <h1>Open source video meetings.</h1>
        </div>
        <p class="py-6 text-lg text-center lg:text-start max-w-xl">
          An open source and free to use one-to-one private video calling web
          app build with sveltekit. Build on top of browser webrtc peer-to-peer
          communication.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-6 lg:mt-0">
          <CreateRoom />
          <JoinRoom />
        </div>
      </div>
    </div>
  </div>
));
