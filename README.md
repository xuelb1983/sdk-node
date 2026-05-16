# 松智云 Node.js SDK

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

松智云网页截图 API 的 Node.js 客户端库。支持 Node.js 18+。

## 环境要求

- Node.js 18 或更高版本
- 松智云 API Key（[免费注册获取](https://songzhiyun.com)）

## 安装

```bash
npm install songzhiyun
```

## 快速开始

```javascript
const { SongzhiClient } = require('songzhiyun');

const client = new SongzhiClient('sk-xxx');
const result = await client.screenshot('https://example.com');
console.log(result.imageUrl);
// → /screenshots/d55c14ca.png
```

ESM:

```javascript
import { SongzhiClient } from 'songzhiyun';
```

## 完整选项

```javascript
const result = await client.screenshot('https://example.com', {
  width: 1920,
  height: 1080,
  fullPage: true,      // 全页长图
  mobile: true,         // 移动端模拟
  waitMs: 2000,         // 页面加载后额外等待
  format: 'png',        // png / jpeg / webp / pdf
  quality: 95,          // 图片质量 1-100（jpeg/webp）
  adBlock: true,        // 广告拦截
  // 水印
  watermark: {
    text: '机密文档',
    position: 'bottom-right',  // top-left / top-right / center / bottom-left / bottom-right
    opacity: 50,               // 0-100
  },
});
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | number | 1280 | 视口宽度（像素） |
| `height` | number | 720 | 视口高度（像素） |
| `fullPage` | boolean | false | 全页截图（长图） |
| `mobile` | boolean | false | 移动端 User-Agent + 375 宽视口 |
| `waitMs` | number | 0 | 页面加载后额外等待（毫秒） |
| `format` | string | "png" | 输出格式：png / jpeg / webp / pdf |
| `quality` | number | 90 | 图片质量 1-100（jpeg/webp） |
| `adBlock` | boolean | true | 广告拦截 |
| `watermark` | object | — | 水印配置 `{ text, position, opacity }` |

## 异步模式

```javascript
// 提交任务（立即返回 taskId，不阻塞）
const task = await client.submit('https://example.com', { width: 1280, height: 720 });
console.log('taskId:', task.taskId);

// ... 做其他事情 ...

// 轮询直到完成
const result = await client.poll(task.taskId, 60, 1000);
console.log('imageUrl:', result.imageUrl);
```

## 错误处理

```javascript
const { SongzhiClient, SongzhiError } = require('songzhiyun');

try {
  const result = await client.screenshot('https://example.com');
} catch (e) {
  if (e instanceof SongzhiError) {
    console.error(`错误码: ${e.code}, 消息: ${e.message}`);
  } else {
    console.error('网络错误:', e.message);
  }
}
```

错误码说明：

| 错误码 | 说明 |
|--------|------|
| 1001 | 参数错误或资源不存在 |
| 1002 | 缺少认证信息 |
| 1003 | 本月配额已用完 |
| 1004 | 并发请求超限 |
| 1006 | 请求过于频繁 |
| 5000 | 服务器内部错误 |

## 相关链接

- [松智云 官网](https://songzhiyun.com)
- [API 文档](https://songzhiyun.com/docs.html)
- [控制台](https://songzhiyun.com/dashboard.html)
- [Java SDK](https://github.com/songzhiyun/sdk-java)
- [Python SDK](https://github.com/songzhiyun/sdk-python)
- [CLI 工具](https://github.com/songzhiyun/cli)

## License

MIT
