# 奥领数控品控系统 - 部署指南

## 🚀 快速部署到 Vercel（推荐）

### 方法一：通过 Vercel CLI 部署（最简单）

#### 步骤 1: 安装 Node.js

如果您的电脑还没有安装 Node.js，请先下载安装：
- 访问：https://nodejs.org/
- 下载并安装 LTS 版本

#### 步骤 2: 安装 Vercel CLI

打开终端（Terminal），运行：

```bash
npm install -g vercel
```

#### 步骤 3: 登录 Vercel

```bash
vercel login
```

按照提示：
1. 输入邮箱地址
2. 检查邮箱并点击验证链接
3. 返回终端继续

#### 步骤 4: 部署项目

进入项目目录：

```bash
cd /Users/frank/Documents/trae_projects/QC/static
```

运行部署命令：

```bash
vercel
```

按照提示操作：
1. 问 "Set up and deploy"? 输入 `Y`
2. 问 "Link to existing project"? 输入 `N`
3. 问 "What's your project's name"? 输入 `qc-system`（或您喜欢的名称）
4. 问 "In which directory is your code located"? 直接按回车（使用当前目录）
5. 问 "Want to modify these settings"? 输入 `N`

等待几分钟，部署完成后，Vercel 会提供一个 URL，例如：
```
https://qc-system.vercel.app
```

#### 步骤 5: 测试访问

在浏览器中打开 Vercel 提供的 URL，您应该能看到品控系统了！

#### 步骤 6: 分享给团队

将这个 URL 分享给团队成员，他们就可以通过手机或电脑访问了。

---

### 方法二：通过 Vercel 网站部署（不需要命令行）

#### 步骤 1: 准备项目文件

将 `/Users/frank/Documents/trae_projects/QC/static` 文件夹中的所有文件复制到一个新文件夹，例如 `qc-system-deploy`

#### 步骤 2: 上传到 GitHub

1. 访问 https://github.com/ 并登录
2. 点击右上角的 "+"，选择 "New repository"
3. Repository name 输入 `qc-system`
4. 选择 "Public" 或 "Private"
5. 点击 "Create repository"
6. 按照页面提示，将文件上传到仓库

#### 步骤 3: 连接到 Vercel

1. 访问 https://vercel.com/
2. 点击 "Sign Up" 或 "Login"
3. 使用 GitHub 账号登录
4. 点击 "Add New" → "Project"
5. 选择刚才创建的 `qc-system` 仓库
6. 点击 "Deploy"

等待几分钟后，您的网站就部署成功了！

---

## 📱 团队使用说明

### 访问系统

团队成员只需在浏览器中打开部署后的 URL 即可使用。

### 数据说明

- 所有数据都存储在 Supabase 云数据库中
- 团队成员的所有操作都会实时同步
- 数据安全，有备份

### 推荐浏览器

- Chrome（推荐）
- Safari
- Edge
- Firefox

---

## 🔒 安全建议

### 1. 保护 Supabase Key

当前的 Supabase ANON KEY 是公开的，任何人都可以访问数据库。对于测试阶段这是可以的，但如果要正式使用，建议：

- 在 Supabase 中设置 Row Level Security (RLS) 策略
- 或者添加用户登录功能

### 2. 使用自定义域名（可选）

如果需要使用自己的域名，可以在 Vercel 中：
1. 进入项目设置
2. 点击 "Domains"
3. 添加您的域名
4. 按照提示配置 DNS

---

## 📊 监控和维护

### 查看访问日志

在 Vercel Dashboard 中可以查看：
- 访问量统计
- 错误日志
- 性能数据

### 更新系统

如果需要更新系统：
1. 修改本地文件
2. 运行 `vercel --prod` 部署到生产环境

---

## ❓ 常见问题

### Q: 部署后看不到设备？
A: 确保数据库表已经创建。在 Supabase SQL Editor 中执行 database.sql 脚本。

### Q: 如何修改系统？
A: 修改本地文件后，运行 `vercel --prod` 重新部署。

### Q: 可以离线使用吗？
A: 不可以。系统需要连接互联网才能访问 Supabase 数据库。

### Q: 数据会丢失吗？
A: 不会。Supabase 会自动备份数据，但建议定期导出重要数据。

---

## 🎯 下一步

部署完成后，您可以：

1. **测试功能**：让团队成员测试各项功能
2. **收集反馈**：根据团队反馈优化系统
3. **添加功能**：根据需要添加新功能
4. **培训团队**：培训团队成员使用系统

---

## 📞 技术支持

如果遇到问题：
1. 检查 Vercel 部署日志
2. 检查 Supabase 数据库连接
3. 查看浏览器控制台错误信息

---

祝您使用愉快！🎉
