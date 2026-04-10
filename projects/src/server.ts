import { config } from 'dotenv';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import path from 'path';

// 加载本地环境变量 - 支持Windows和Unix
const envPath = path.resolve(process.cwd(), '.env.local');
const result = config({ path: envPath });

if (result.error) {
  console.warn('⚠️  未能加载 .env.local:', result.error.message);
} else {
  console.log(`✓ 已加载 .env.local (${Object.keys(result.parsed || {}).length} 个变量)`);
}

console.log('=== 环境变量检查 ===');
console.log('ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? '已配置 ✓' : '未配置 ✗');
console.log('ZHIPU_BASE_URL:', process.env.ZHIPU_BASE_URL || '使用默认值');
console.log('==================');

const dev = process.env.COZE_PROJECT_ENV !== 'PROD';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '5000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });
  server.once('error', err => {
    console.error(err);
    process.exit(1);
  });
  server.listen(port, () => {
    console.log(
      `> Server listening at http://${hostname}:${port} as ${
        dev ? 'development' : process.env.COZE_PROJECT_ENV
      }`,
    );
  });
});
