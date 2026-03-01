# 🎯 完整自动配置指南

## 📋 您的 Supabase 信息

- **账号**：frank0321@126.com
- **项目**：qc-system
- **状态**：已创建 ✅

## 🚀 自动配置步骤

### 方式 1：使用完整自动配置脚本（推荐⭐⭐⭐⭐⭐）

#### macOS/Linux 用户：

```bash
cd /Users/frank/Documents/trae_projects/QC/static
chmod +x auto-configure.sh
./auto-configure.sh
```

#### Windows 用户：

```cmd
cd C:\Users\frank\Documents\trae_projects\QC\static
auto-configure.bat
```

#### 脚本会自动完成：

1. ✅ 备份原配置文件
2. ✅ 替换 Supabase 配置
3. ✅ 创建数据库 SQL 文件
4. ✅ 提供详细的数据库创建步骤
5. ✅ 显示配置结果

---

### 方式 2：使用 Web 配置工具

1. 打开 `static/configure.html`
2. 输入 Supabase 信息
3. 点击"自动配置"
4. 下载配置好的文件
5. 替换 `app-supabase.js`

---

## 📖 详细步骤

### 第1步：获取 Supabase API 信息

1. **登录 Supabase**
   - 访问：https://supabase.com/dashboard
   - 输入账号：frank0321@126.com
   - 输入密码：Key321Fhqgoo@

2. **选择项目**
   - 点击项目：qc-system

3. **获取 API 信息**
   - 点击左侧菜单 **Settings**（齿轮图标）
   - 选择 **API**
   - 复制以下两个值：
     - **Project URL**（例如：https://xxxxxxxxxxxxx.supabase.co）
     - **anon public key**（一长串字符）

### 第2步：运行自动配置脚本

#### macOS/Linux：

```bash
cd /Users/frank/Documents/trae_projects/QC/static
chmod +x auto-configure.sh
./auto-configure.sh
```

#### Windows：

```cmd
cd C:\Users\frank\Documents\trae_projects\QC\static
auto-configure.bat
```

### 第3步：按照脚本提示操作

1. **输入 Supabase 信息**
   - Project URL
   - anon public key

2. **确认配置**
   - 脚本会自动替换配置
   - 自动备份原文件

3. **创建数据库表**
   - 脚本会创建 `database-setup.sql` 文件
   - 按照脚本提示在 Supabase 中执行

### 第4步：在 Supabase 中创建数据库表

1. 打开：https://supabase.com/dashboard/project/qc-system
2. 点击左侧菜单 **SQL Editor**
3. 点击 **New query**
4. 打开 `static/database-setup.sql`
5. 复制所有内容
6. 粘贴到 SQL Editor
7. 点击 **Run**
8. 等待执行完成

### 第5步：测试本地运行

1. 在浏览器中打开 `static/index.html`
2. 检查是否能看到设备列表（应该有3台测试设备）
3. 测试创建新设备
4. 刷新页面，检查数据是否保存

---

## ✅ 验证配置

### 检查清单

- [ ] Supabase 项目已创建（qc-system）
- [ ] 数据库表已创建
- [ ] API URL 已配置
- [ ] API Key 已配置
- [ ] 本地测试通过
- [ ] 数据可以正常保存

### 测试功能

1. **设备管理**
   - [ ] 查看设备列表
   - [ ] 创建新设备
   - [ ] 查看设备详情

2. **组装检测**
   - [ ] 添加检测项
   - [ ] 判定合格/不合格

3. **打样测试**
   - [ ] 添加测试项
   - [ ] 确认测试结果

4. **发货清点**
   - [ ] 添加清点项
   - [ ] 确认清点数量

5. **客户追踪**
   - [ ] 通过设备编号查询
   - [ ] 查看品控记录
   - [ ] 提交反馈和建议

---

## 🚀 部署到 Vercel

本地测试成功后，就可以部署了：

### 第1步：安装 Vercel CLI

```bash
npm install -g vercel
```

### 第2步：部署

```bash
cd /Users/frank/Documents/trae_projects/QC/static
vercel
```

### 第3步：按照提示操作

- ? Set up and deploy? → Yes
- ? Which scope? → 选择你的账号
- ? Link to existing project? → No
- ? What's your project's name? → qc-system
- ? In which directory is your code located? → ./
- ? Want to modify these settings? → No

### 第4步：获得访问 URL

部署完成后，Vercel 会提供一个 URL，例如：
- https://qc-system.vercel.app

### 第5步：分享给团队

将 URL 发送给团队成员，他们可以在任何设备上访问。

---

## 📱 测试多用户访问

### 电脑访问

1. 在电脑浏览器中打开 Vercel URL
2. 测试各项功能
3. 创建一些测试数据

### 手机访问

1. 在手机浏览器中打开同一个 URL
2. 检查是否能正常显示
3. 测试响应式布局

### 多用户测试

1. 让团队成员同时打开
2. 一人创建设备
3. 其他人应该能实时看到

---

## 🔒 安全建议

### 测试阶段（当前）

- ✅ 使用宽松的安全策略
- ✅ 允许所有团队成员访问
- ✅ 适合内部测试

### 生产阶段（建议）

- [ ] 添加用户认证
- [ ] 限制数据访问权限
- [ ] 使用自定义域名
- [ ] 定期备份数据

---

## 📞 遇到问题？

### 问题1：脚本运行失败

**macOS/Linux:**
```bash
chmod +x auto-configure.sh
./auto-configure.sh
```

**Windows:**
```cmd
auto-configure.bat
```

### 问题2：数据库表创建失败

- 确保复制了完整的 SQL 代码
- 检查是否有语法错误
- 查看 Supabase 的错误提示

### 问题3：页面显示"系统未配置"

- 检查 `app-supabase.js` 中的配置是否正确
- 打开浏览器控制台（F12）查看错误
- 刷新浏览器页面

### 问题4：数据没有保存

- 打开浏览器开发者工具（F12）
- 查看 Console 标签
- 检查是否有网络错误
- 确认 Supabase 项目状态正常

---

## 🎯 快速开始

### 推荐方式（最简单）

1. **运行自动配置脚本**
   ```bash
   cd /Users/frank/Documents/trae_projects/QC/static
   ./auto-configure.sh  # macOS/Linux
   # 或
   auto-configure.bat  # Windows
   ```

2. **按照脚本提示操作**
   - 输入 Supabase 信息
   - 创建数据库表

3. **测试本地运行**
   - 打开 `index.html`
   - 测试各项功能

4. **部署到 Vercel**
   ```bash
   vercel
   ```

5. **分享给团队**
   - 发送 Vercel URL

---

## 📊 预置测试数据

系统会自动创建以下测试数据：

### 设备 1：CNC-2024-001
- 状态：组装中
- 客户：华东机械制造有限公司
- 用途：测试组装检测功能

### 设备 2：CNC-2024-002
- 状态：测试中
- 客户：北方精密仪器厂
- 用途：测试打样测试功能

### 设备 3：CNC-2024-003
- 状态：待发货
- 客户：南方汽车零部件公司
- 用途：测试发货清点和客户追踪功能

---

## 🎉 完成后

当所有步骤都完成后：

1. **您的系统已经可以使用了！**
2. **团队成员可以通过手机和电脑访问**
3. **数据实时同步到云端**
4. **无需购买服务器**

---

**预计完成时间：10-15 分钟**
**预计成本：0 元/月**

🚀 现在就开始配置吧！