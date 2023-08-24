import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { Server } from "socket.io";
import { type PluginOption } from "vite";

const socketioServer: PluginOption = {
    name: "socketioServer",
    configureServer(server) {
      if (server.httpServer) {
        const io = new Server(server.httpServer);
  
        io.on("connection", (socket) => {
          socket.on("join-room", async (roomID) => {
            socket.join(roomID);
            const users = await io.in(roomID).allSockets();
            socket.to(roomID).emit("user-joined", socket.id);
            socket.emit("users", [...users]);
          });
  
          socket.on("offer", (payload) => {
            io.to(payload.target).emit("offer", payload);
          });
  
          socket.on("answer", (payload) => {
            io.to(payload.target).emit("answer", payload);
          });
  
          socket.on("ice-candidate", (incoming) => {
            io.to(incoming.target).emit("ice-candidate", incoming.candidate);
          });
  
          socket.on("end-call", (data) => {
            io.to(data.to).emit("end-call", data);
          });
  
          socket.on("disconnecting", (reason) => {
            for (const room of socket.rooms) {
              if (room !== socket.id) {
                socket.to(room).emit("user-left", socket.id);
              }
            }
          });
        });
      }
    },
};


export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(),socketioServer],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
