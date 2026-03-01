# 🎯 自动配置工具使用说明

## 📋 三种配置方式

我已经为您创建了三种自动配置工具，选择最适合您的方式：

### 方式 1：Web 配置工具（最简单⭐⭐⭐⭐⭐）

**适合：所有用户**

#### 使用步骤：

1. **打开配置工具**
   - 在浏览器中打开 `static/configure.html`

2. **输入 Supabase 信息**
   - Supabase Project URL
   - Supabase anon public key

3. **点击"自动配置"**
   - 系统会自动下载配置好的文件
   - 用下载的文件替换原来的 `app-supabase.js`

4. **完成！**
   - 打开 `index.html` 测试

#### 优势：
- ✅ 无需命令行
- ✅ 可视化界面
- ✅ 自动验证格式
- ✅ 一键下载配置文件

---

### 方式 2：Shell 脚本（macOS/Linux）

**适合：熟悉命令行的用户**

#### 使用步骤：

1. **打开终端**
   - 进入 `static` 目录

2. **运行配置脚本**
   ```bash
   chmod +x configure.sh
   ./configure.sh
   ```

3. **按照提示输入**
   - Supabase Project URL
   - Supabase anon public key

4. **确认配置**
   - 脚本会自动替换配置
   - 自动备份原文件

#### 优势：
- ✅ 自动备份原文件
- ✅ 验证配置格式
- ✅ 显示配置结果
- ✅ 一步完成

---

### 方式 3：批处理脚本（Windows）

**适合：Windows 用户**

#### 使用步骤：

1. **打开命令提示符**
   - 进入 `static` 目录

2. **运行配置脚本**
   ```cmd
   configure.bat
   ```

3. **按照提示输入**
   - Supabase Project URL
   - Supabase anon public key

4. **确认配置**
   - 脚本会自动替换配置
   - 自动备份原文件

#### 优势：
- ✅ 自动备份原文件
- ✅ 验证配置格式
- ✅ 显示配置结果
- ✅ 一步完成

---

## 📖 获取 Supabase 配置信息

### 第1步：登录 Supabase

访问：https://supabase.com/dashboard

### 第2步：选择项目

点击您创建的项目

### 第3步：获取 API 信息

1. 点击左侧菜单 **Settings**（齿轮图标）
2. 选择 **API**
3. 找到以下信息：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **复制这两个值**

---

## ✅ 配置验证

配置完成后，检查以下内容：

### 1. 检查 app-supabase.js 文件

打开文件，确认配置已替换：

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 2. 测试本地运行

1. 在浏览器中打开 `index.html`
2. 应该能看到设备列表
3. 测试创建新设备
4. 刷新页面，检查数据是否保存

### 3. 检查浏览器控制台

如果出现问题：
1. 按 F12 打开开发者工具
2. 查看 Console 标签
3. 检查是否有错误信息

---

## 🔒 安全建议

### 测试阶段
- ✅ 使用当前的配置方式
- ✅ 允许所有团队成员访问

### 生产阶段
建议：
- [ ] 添加用户认证
- [ ] 使用环境变量存储密钥
- [ ] 限制数据访问权限
- [ ] 定期更换密钥

---

## 📞 常见问题

### Q: 配置后还是显示"系统未配置"

A:
1. 检查 `app-supabase.js` 文件是否正确更新
2. 确认没有多余的空格或引号
3. 打开浏览器控制台查看错误
4. 刷新浏览器页面

### Q: Web 配置工具下载的文件无法使用

A:
1. 确保下载的文件名为 `app-supabase.js`
2. 如果是 `app-supabase.js (1)`，重命名并去掉括号
3. 用下载的文件替换 `static` 目录中的原文件

### Q: Shell 脚本提示权限错误

A:
```bash
chmod +x configure.sh
./configure.sh
```

### Q: 批处理脚本运行失败

A:
1. 确保在 `static` 目录下运行
2. 检查 `app-supabase.js` 文件是否存在
3. 以管理员身份运行命令提示符

### Q: 如何恢复原配置？

A:
- 如果使用了 Shell 或批处理脚本，原文件已备份为 `app-supabase.js.backup`
- 可以用备份文件恢复

---

## 🎯 推荐使用方式

### 如果您是：
- **初学者** → 使用 **Web 配置工具**
- **macOS/Linux 用户** → 使用 **Shell 脚本**
- **Windows 用户** → 使用 **批处理脚本**

---

## 📁 配置工具文件

- **configure.html** - Web 配置工具（推荐）
- **configure.sh** - Shell 脚本（macOS/Linux）
- **configure.bat** - 批处理脚本（Windows）

---

## 🚀 配置完成后

1. **测试本地运行**
   - 打开 `index.html`
   - 测试各项功能

2. **部署到 Vercel**
   - 参考 [QUICK_DEPLOY.md](../QUICK_DEPLOY.md)
   - 让团队成员都能访问

3. **分享给团队**
   - 发送 Vercel URL
   - 团队成员在任何设备上访问

---

**预计配置时间：1-2 分钟**

🎉 选择最适合您的方式，开始配置吧！