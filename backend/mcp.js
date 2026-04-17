import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Folder from "./models/Folder.js";
import File from "./models/File.js";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/drive");

const server = new Server(
  {
    name: "drive-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_folder",
        description: "Create a new folder. Required: name, userEmail. Optional: parentFolderName",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            userEmail: { type: "string" },
            parentFolderName: { type: "string" }
          },
          required: ["name", "userEmail"]
        }
      },
      {
        name: "upload_image",
        description: "Simulate uploading an image. Required: name, url, userEmail. Optional: folderName",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            url: { type: "string" },
            userEmail: { type: "string" },
            folderName: { type: "string" }
          },
          required: ["name", "url", "userEmail"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_folder") {
    const { name, userEmail, parentFolderName } = request.params.arguments;
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { content: [{ type: "text", text: `User ${userEmail} not found` }] };
    }

    let parentId = null;
    if (parentFolderName) {
      const parent = await Folder.findOne({ name: parentFolderName, userId: user._id });
      if (!parent) {
        return { content: [{ type: "text", text: `Parent folder ${parentFolderName} not found` }] };
      }
      parentId = parent._id;
    }

    const folder = await Folder.create({ name, userId: user._id, parentId });
    return { content: [{ type: "text", text: `Created folder ${name} successfully.` }] };
  }

  if (request.params.name === "upload_image") {
    const { name, url, userEmail, folderName } = request.params.arguments;
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { content: [{ type: "text", text: `User ${userEmail} not found` }] };
    }

    let folderId = null;
    if (folderName) {
      const folder = await Folder.findOne({ name: folderName, userId: user._id });
      if (!folder) {
        return { content: [{ type: "text", text: `Folder ${folderName} not found` }] };
      }
      folderId = folder._id;
    }

    const file = await File.create({ name, url, size: 1024, userId: user._id, folderId });
    return { content: [{ type: "text", text: `Uploaded image ${name} successfully to ${folderName || "root"}` }] };
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
