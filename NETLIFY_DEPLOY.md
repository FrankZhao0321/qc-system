# 奥领数控品控系统 - Netlify 部署指南

## 🚀 为什么选择 Netlify？

- ✅ 部署超简单（拖拽即可）
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 支持自定义域名

## 📋 部署步骤

### 方法一：拖拽部署（最简单）

1. **访问 Netlify**
   - 打开 https://app.netlify.com/drop

2. **拖拽文件夹**
   - 将 `/Users/frank/Documents/trae_projects/QC/static` 整个文件夹拖到网页上

3. **等待部署**
   - Netlify 会自动部署
   - 几秒钟后提供一个 URL，例如：`https://random-name.netlify.app`

4. **修改站点名称（可选）**
   - 在 Netlify Dashboard 中点击 "Site settings"
   - 在 "Change site name" 中输入 `qc-system`
   - 最终 URL 会变成：`https://qc-system.netlify.app`

### 方法二：使用 Netlify CLI

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **部署**
   ```bash
   cd /Users/frank/Documents/trae_projects/QC/static
   netlify deploy --prod
   ```

## ✅ 部署完成后

- 访问 Netlify 提供的 URL
- 分享给团队成员
- 所有数据都存储在 Supabase 云数据库中

## 🔄 更新系统

修改文件后，重新拖拽文件夹到 Netlify 即可。

## 📱 团队使用

团队成员只需在浏览器中打开 URL 即可使用。

---

Netlify 部署通常比 Vercel 更简单可靠！
