# aircafe.space — Cloudflare 前置代理开通步骤（HTTPS 立即生效方案）

> 背景：GitHub Pages 的自定义域名证书签发卡死（已强制重签仍失败），
> 逐项排查确认 DNS / CNAME / IPv6 / CAA / Pages 配置全部正确 —— 是 GitHub 侧问题。
> 本方案用 Cloudflare 免费代理提供 HTTPS 证书，内容仍托管在 GitHub Pages，无需改任何代码。

---

## 第 1 步：注册并添加站点（约 3 分钟）

1. 打开 https://dash.cloudflare.com/sign-up ，注册免费账号（邮箱 + 密码，需邮箱验证）
2. 登录后点 **Add a site** → 输入 `aircafe.space` → 选 **Free** 套餐 → Continue
3. Cloudflare 会自动扫描现有 DNS 记录，稍等 1 分钟

## 第 2 步：核对 DNS 记录（关键）

扫描结果里确认/修正为下面这样（**橙色云朵 = Proxied 必须打开**）：

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | `www` | `erikcywong.github.io` | 🟠 Proxied |
| A | `@` | `185.199.108.153` | 🟠 Proxied |
| A | `@` | `185.199.109.153` | 🟠 Proxied |
| A | `@` | `185.199.110.153` | 🟠 Proxied |
| A | `@` | `185.199.111.153` | 🟠 Proxied |

**CAA 记录处理**（扫描到的话）：
- 删除现有 CAA 记录，或确保包含 Cloudflare 签发机构：
  `0 issue "pki.goog"` 与 `0 issue "letsencrypt.org"`
- 原因：Cloudflare 免费版证书默认由 Google Trust Services / Let's Encrypt 签发，
  CAA 里不含对应机构会签发失败。

其余记录（MX / TXT）本域名没有，保持空即可。

## 第 3 步：打开 SSL 设置

1. 左侧 **SSL/TLS → Overview** → 选择 **Full**（⚠️ 不要选 Full (strict)，
   因为 GitHub 当前只有 `*.github.io` 证书，strict 会校验失败；也不要选 Flexible，会与 Pages 互踢）
2. **SSL/TLS → Edge Certificates**：
   - **Always Use HTTPS** → 打开 ✅
   - Universal SSL → 保持 Enabled（默认已开）
3. **SSL/TLS → Edge Certificates → Minimum TLS Version** 保持默认 1.2 即可

## 第 4 步：切换 NS 到 Cloudflare（最后一步）

1. Cloudflare 会给出两个名称服务器，形如：
   - `xxxx.ns.cloudflare.com`
   - `yyyy.ns.cloudflare.com`
2. 登录阿里云 → 域名控制台 → `aircafe.space` → **DNS 修改 / DNS Modify**
3. 把原来的 `dns31.hichina.com` / `dns32.hichina.com`
   替换为 Cloudflare 给的那两个 → 提交

## 第 5 步：等待生效（通常 5–30 分钟，最长数小时）

- NS 生效后，Cloudflare 会自动签发 Universal SSL 证书（覆盖 `aircafe.space` 与 `www.aircafe.space`）
- 浏览器打开 `https://www.aircafe.space/` 即应显示锁标 ✅
- 若 15 分钟后仍报证书错误：Cloudflare → SSL/TLS → Edge Certificates →
  确认 Universal SSL 状态为 Active；必要时点 "Disable" 再 "Enable" 重新签发

---

## 注意事项

- 该域名没有 MX 记录，NS 迁移**不影响任何邮件收发**
- 开启代理后，GitHub Pages 的 "Enforce HTTPS" 开不开都不影响访问
- Cloudflare 免费版额外赠送：CDN 加速、缓存、基础 DDoS 防护、自动 HTTPS 重写
- 若之后想回退：把 NS 改回 `dns31.hichina.com` / `dns32.hichina.com` 即可

## 生效后需要我复核什么

NS 切换完成后告知我，我会核验：
1. 权威 NS 是否已指向 Cloudflare
2. `www.aircafe.space` / `aircafe.space` 返回的证书签发机构与 CN（应为 Cloudflare/Google Trust Services 或 Let's Encrypt）
3. HTTPS 全链路（含 301 跳转、证书链完整性）逐页复核
