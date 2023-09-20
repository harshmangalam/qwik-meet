# Qwik Meet ⚡️

An open source video calling web app powered by qwikcity

## Tech Stack

- Qwikcity
- Typescript
- WebRTC
- Node/Express server
- Tailwindcss
- daisyui

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
pnpm run dev
```

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
pnpm run preview
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
pnpm run build
```

## Express Server

This app has a minimal [Express server](https://expressjs.com/) implementation. After running a full build, you can preview the build using the command:

```
pnpm run serve
```

Then visit [http://localhost:8080/](http://localhost:8080/)
