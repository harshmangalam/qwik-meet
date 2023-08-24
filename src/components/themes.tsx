import { $, component$, useSignal } from "@builder.io/qwik";

export const Themes = component$(() => {
  const currentTheme = useSignal("corporate");
  const themes = [
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "halloween",
    "garden",
    "forest",
    "lofi",
    "fantasy",
    "luxury",
    "dracula",
    "business",
    "acid",
    "lemonade",
  ];

  const handleChangeTheme = $((theme: string) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
  });

  return (
    <details class="dropdown dropdown-end">
      <summary class="m-1 btn btn-square btn-ghost">
        <iconify-icon
          width={24}
          height={24}
          icon="fluent:dark-theme-24-regular"
        />
      </summary>
      <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        {themes.map((theme) => (
          <li key={theme}>
            <button
              class={{ active: currentTheme.value === theme }}
              onClick$={() => handleChangeTheme(theme)}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
});
