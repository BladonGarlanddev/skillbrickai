#!/usr/bin/env node

/**
 * HTTP transport entry point for the SkillBrick AI MCP server.
 *
 * Exposes the MCP server over Streamable HTTP so it can be accessed
 * by remote clients like Smithery, rather than requiring a local stdio process.
 *
 * Usage:
 *   SKILLBRICK_API_URL=https://api.skillbrickai.com node dist/http.js
 *
 * The server listens on PORT (default 3001) and serves the MCP protocol at /mcp.
 */

import express from "express";
import { randomUUID } from "crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createSkillBrickServer } from "./server.js";

const PORT = parseInt(process.env.MCP_PORT || "3001", 10);

// Map of session ID -> transport (for stateful connections)
const transports = new Map<string, StreamableHTTPServerTransport>();

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "skillbrickai-mcp" });
});

// Handle MCP Streamable HTTP requests
app.all("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (req.method === "GET") {
    // SSE stream for server-initiated messages
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).json({ error: "Missing or invalid session ID. Initialize with a POST first." });
      return;
    }
    const transport = transports.get(sessionId)!;
    await transport.handleRequest(req, res);
    return;
  }

  if (req.method === "POST") {
    // Check if this is an initialization request (no session ID)
    if (!sessionId) {
      // New session — create transport and server
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });

      const server = createSkillBrickServer();
      await server.connect(transport);

      // Store the transport by session ID after the init response sets it
      transport.onclose = () => {
        if (transport.sessionId) {
          transports.delete(transport.sessionId);
        }
      };

      await transport.handleRequest(req, res);

      // After handling, the transport now has a session ID
      if (transport.sessionId) {
        transports.set(transport.sessionId, transport);
      }
      return;
    }

    // Existing session
    const transport = transports.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: "Session not found. It may have expired." });
      return;
    }
    await transport.handleRequest(req, res);
    return;
  }

  if (req.method === "DELETE") {
    // Session termination
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.close();
      transports.delete(sessionId);
    }
    res.status(200).json({ message: "Session closed" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SkillBrick AI MCP server (HTTP) running on http://0.0.0.0:${PORT}`);
  console.log(`MCP endpoint: http://0.0.0.0:${PORT}/mcp`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
});
