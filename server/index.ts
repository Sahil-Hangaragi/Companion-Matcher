import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  createUser,
  getMatches,
  addToShortlist,
  getShortlist,
  getUsersStore,
} from "./routes/users";
import {
  sendMessage,
  getConversations,
  getMessages,
  markMessagesAsRead,
  setUsersStore,
} from "./routes/messages";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Companion Matcher API routes
  app.post("/api/users", createUser);
  app.get("/api/matches/:username", getMatches);
  app.post("/api/shortlist", addToShortlist);
  app.get("/api/shortlist/:username", getShortlist);

  // Messaging API routes
  app.post("/api/messages/:username", sendMessage);
  app.get("/api/conversations/:username", getConversations);
  app.get("/api/messages/:username/:conversationId", getMessages);
  app.put("/api/messages/:username/:conversationId/read", markMessagesAsRead);

  // Initialize messaging with users store
  setUsersStore(getUsersStore());

  return app;
}
