import { prismaClient } from "db/client";

Bun.serve({
  port: 8081,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    async message(ws, message) {
      try {
        const user = await prismaClient.user.create({
          data: {
            username: Math.random().toString(),
            password: Math.random().toString(),
          },
        });
        console.log("Created user:", user);
        ws.send(message);
      } catch (err) {
        console.error("Create failed:", err);
        ws.send(`error: ${(err as Error).message}`);
      }
    },
  },
});