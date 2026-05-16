# 松智云 Node.js SDK

网页截图 API 的 Node.js 客户端库。

## 安装

```bash
npm install songzhiyun
```

## 使用

```javascript
const { SongzhiClient } = require('songzhiyun');

const client = new SongzhiClient('sk-xxx');
const result = await client.screenshot('https://example.com', { width: 1280 });
console.log(result.imageUrl);
```

## License

MIT
