'use strict';

/**
 * 松智云 Node.js SDK — 网页截图 API 客户端
 *
 * const { SongzhiClient } = require('songzhiyun');
 * const client = new SongzhiClient('sk-xxx');
 * const result = await client.screenshot('https://example.com');
 * console.log(result.imageUrl);
 */

class SongzhiError extends Error {
  constructor(code, message) {
    super(`[${code}] ${message}`);
    this.code = code;
  }
}

class SongzhiClient {
  /**
   * @param {string} apiKey
   * @param {string} [baseUrl='https://api.songzhiyun.com']
   */
  constructor(apiKey, baseUrl = 'https://api.songzhiyun.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * 提交截图并等待完成
   * @param {string} url
   * @param {object} [options]
   * @param {number} [options.width=1280]
   * @param {number} [options.height=720]
   * @param {boolean} [options.fullPage=false]
   * @param {boolean} [options.mobile=false]
   * @param {string} [options.format='png']
   * @param {number} [options.quality=90]
   * @param {number} [options.waitMs=0]
   * @param {boolean} [options.adBlock=true]
   * @param {number} [timeout=60]
   * @returns {Promise<object>} { taskId, status, imageUrl, durationMs, imageSize }
   */
  async screenshot(url, options = {}, timeout = 60) {
    const task = await this.submit(url, options);
    return this.poll(task.taskId, timeout);
  }

  /**
   * 提交截图任务
   * @returns {Promise<object>} { taskId, status, estimatedSeconds }
   */
  async submit(url, options = {}) {
    const body = {
      url,
      width: options.width ?? 1280,
      height: options.height ?? 720,
      fullPage: options.fullPage ?? false,
      mobile: options.mobile ?? false,
      format: options.format ?? 'png',
      quality: options.quality ?? 90,
      waitMs: options.waitMs ?? 0,
      adBlock: options.adBlock ?? true,
    };
    if (options.watermark) {
      body.watermark = {
        text: options.watermark.text || '',
        position: options.watermark.position || 'bottom-right',
        opacity: options.watermark.opacity ?? 50,
      };
    }
    const resp = await fetch(`${this.baseUrl}/api/v1/screenshot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (data.code !== 0) throw new SongzhiError(data.code, data.msg);
    return data.data;
  }

  /**
   * 轮询任务结果
   * @param {string} taskId
   * @param {number} [timeout=60]
   * @param {number} [interval=1000]
   * @returns {Promise<object>}
   */
  async poll(taskId, timeout = 60, interval = 1000) {
    const deadline = Date.now() + timeout * 1000;
    while (Date.now() < deadline) {
      const resp = await fetch(`${this.baseUrl}/api/v1/screenshot/${taskId}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });
      const data = await resp.json();
      if (data.code !== 0) throw new SongzhiError(data.code, data.msg);
      const task = data.data;
      if (task.status === 'done') return task;
      if (task.status === 'failed') throw new SongzhiError(-1, task.error || '截图失败');
      await new Promise(r => setTimeout(r, interval));
    }
    throw new SongzhiError(-1, `截图超时 (${timeout}s)`);
  }
}

module.exports = { SongzhiClient, SongzhiError };
