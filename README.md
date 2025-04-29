# 通义万相 MCP 服务器

这是一个基于 TypeScript 的 Model Context Protocol (MCP) 服务器，专门提供阿里云通义万相的文生图(Text-to-Image)和文生视频(Text-to-Video)能力。该服务器通过 MCP 协议，允许大语言模型（LLM）直接调用通义万相的图像和视频生成 API。

<a href="https://glama.ai/mcp/servers/@Suixinlei/tongyi-wanx-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@Suixinlei/tongyi-wanx-mcp-server/badge" alt="Tongyi Wanxiang Server MCP server" />
</a>

## 功能特点

- **文生图能力集成**：接入阿里云通义万相文生图 API，支持高质量的 AI 图像生成
- **文生视频能力集成**：接入阿里云通义万相文生视频 API，支持高质量的 AI 视频生成
- **异步任务处理**：支持长时间运行的图像和视频生成任务，通过异步轮询获取最终结果
- **MCP 协议支持**：符合 Model Context Protocol 规范，可与支持 MCP 的 LLM 无缝协作

## 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 pnpm

## 如何使用

以百炼平台举例

```json
{
  "mcpServers": {
    "tongyi-wanxiang": {
      "command": "npx",
      "args": [
        "-y",
        "tongyi-wanx-mcp-server@latest"
      ],
      "env": {
        "DASHSCOPE_API_KEY": "<你的通义万相 API 密钥>"
      }
    }
  }
}
```

## 如何开发

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 构建与运行

```bash
# 构建项目
npm run build
# 或
pnpm run build

# 运行服务器
npm start
# 或
pnpm start

# 使用调试工具运行
npm run debug
# 或
pnpm run debug
```

## API 使用

该服务器提供以下 MCP 工具：

### 1. 文生图生成（wanx-t2i-image-generation）

启动图像生成任务，返回任务 ID。

**参数**：
- `prompt`: 图像生成提示词
- `negative_prompt`: 负面提示词（不希望在图像中出现的元素）

**返回**：
- 包含 `task_id` 的任务信息

### 2. 获取生成结果（wanx-t2i-image-generation-result）

通过任务 ID 获取图像生成结果。

**参数**：
- `task_id`: 由文生图生成工具返回的任务 ID

**返回**：
- 图像生成结果，包含图像 URL

### 3. 文生视频生成（wanx-t2v-video-generation）

启动视频生成任务，返回任务 ID。

**参数**：
- `prompt`: 视频生成提示词

**返回**：
- 包含 `task_id` 的任务信息

### 4. 获取视频生成结果（wanx-t2v-video-generation-result）

通过任务 ID 获取视频生成结果。

**参数**：
- `task_id`: 由文生视频生成工具返回的任务 ID

**返回**：
- 视频生成结果，包含视频 URL

## 项目结构

```
project/
├── src/                  # 源代码目录
│   ├── index.ts          # 主入口文件，MCP 服务器定义
│   ├── wanx-t2i.js       # 通义万相文生图 API 集成
│   ├── wanx-t2v.js       # 通义万相文生视频 API 集成
│   └── config.ts         # 配置文件
├── dist/                 # 编译后的代码目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 项目说明
```

## 通义万相 API 参数说明

### 文生图 API 支持的参数

- **model**: 模型名称，默认为 `wanx2.1-t2i-turbo`
- **size**: 图像尺寸，默认为 `1024*1024`
- **n**: 生成图像数量，默认为 1
- **seed**: 随机种子，用于复现结果
- **prompt_extend**: 是否启用提示词扩展，默认为 true
- **watermark**: 是否添加水印，默认为 false

## 高级配置

您可以在 `src/config.ts` 中修改以下配置：

- **pollingInterval**: 轮询任务状态的间隔时间（毫秒）
- **maxRetries**: 最大轮询次数
- **defaultModel**: 默认使用的模型

## 注意事项

1. 请确保您有有效的通义万相 API 访问权限和密钥
2. 图像生成是一个异步过程，可能需要数秒到数十秒不等
3. 视频生成过程耗时较长，可能需要数分钟到十几分钟不等
4. 视频生成状态查询可能会多次失败，系统会自动重试，请耐心等待
5. 请合理设置轮询间隔和最大重试次数，以适应您的使用场景
6. 对于视频生成任务，建议增加最大重试次数和轮询间隔时间

## 参考资料

- [通义万相 API 文档](https://help.aliyun.com/document_detail/2512439.html)
- [Model Context Protocol (MCP) 规范](https://github.com/llm-protocol/mcp-spec)