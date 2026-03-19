/**
 * GitHub Release Notification Bot for Telegram
 * 部署在 Cloudflare Workers 上
 */

import { Env } from './types';
import {
  handleChangelogRequest,
  handleChangelogMdRequest,
  handleChangelogRefresh,
  handleChangelogOptions,
  handleSendAll,
  handleTelegramWebhook,
  generateAdminHtml,
  handleGitHubWebhook,
  handleLogin,
  handleStatusRequest,
} from './handlers';

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 路由分发
    if (path === '/telegram/webhook') {
      return handleTelegramWebhook(request, env);
    }

    if (path === '/github/webhook') {
      return handleGitHubWebhook(request, env);
    }

    if (path === '/api/login') {
      return handleLogin(request, env);
    }

    if (path === '/api/status') {
      return handleStatusRequest(request, env);
    }

    if (path === '/changelog') {
      if (request.method === 'OPTIONS') {
        return handleChangelogOptions();
      }
      return handleChangelogRequest(env);
    }

    if (path === '/changelog.md') {
      if (request.method === 'OPTIONS') {
        return handleChangelogOptions();
      }
      return handleChangelogMdRequest(env);
    }

    if (path === '/changelog/refresh') {
      if (request.method === 'OPTIONS') {
        return handleChangelogOptions();
      }
      const secret = url.searchParams.get('secret') || undefined;
      return handleChangelogRefresh(env, secret);
    }

    if (path === '/sendAll') {
      return handleSendAll(request, env);
    }

    if (path === '/' || path === '') {
      return new Response(generateAdminHtml(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};