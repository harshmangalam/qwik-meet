import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Hero } from "~/components/hero";
import { Navbar } from "~/components/navbar";

export default component$(() => {
  return (
    <div class="min-h-screen bg-base-100">
      <Navbar />
      <Hero />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik meet",
  meta: [
    {
      name: "description",
      content: "Qwik video meeting web app",
    },
  ],
};
