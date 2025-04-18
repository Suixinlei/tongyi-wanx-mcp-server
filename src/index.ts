#!/usr/bin/env node

import {
  McpServer,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createImageTask, pollTaskUntilDone } from "./wanx.js";
import config from "./config.js";

// 检查API密钥是否配置
if (!config.api.apiKey) {
  console.error("DASHSCOPE_API_KEY is not configured");
  process.exit(1);
}

// 创建MCP服务器
const server = new McpServer({
  name: "tongyi-wanxiang",
  version: "v1.0.3",
});

// Add an addition tool
server.tool(
  "wanx-t2i-image-generation",
  "使用阿里云万相文生图大模型的文生图能力，由于图片生成耗时比较久，需要调用 wanx-t2i-image-generation-result 工具获取结果",
  { prompt: z.string(), negative_prompt: z.string() },
  async ({ prompt, negative_prompt }) => {
    const result = await createImageTask({
      prompt,
      negative_prompt,
    });
    return {
      content: [{ type: "text", text: JSON.stringify(result.output) }],
    };
  }
);

server.tool(
  "wanx-t2i-image-generation-result",
  "获取阿里云万相文生图大模型的文生图结果",
  { task_id: z.string() },
  async ({ task_id }) => {
    const result = await pollTaskUntilDone(task_id);
    return {
      content: [{ type: "text", text: JSON.stringify(result.output.results) }],
    };
  }
);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});

