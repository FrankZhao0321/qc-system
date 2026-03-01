# 📋 文件检查清单

## ✅ 已检查的文件

### 1. index.html（主页面）
- ✅ HTML 结构正确
- ✅ 使用 unpkg CDN（已测试可用）
- ✅ Supabase CDN 引用正确
- ✅ PWA 配置已移除（避免 404 错误）
- ✅ Service Worker 注册代码已移除（避免 404 错误）
- ✅ 引用 app-supabase.js 正确

### 2. app-supabase.js（JavaScript 逻辑）
- ✅ Supabase URL 和 Key 配置正确
- ✅ 使用 supabaseClient 变量名（已修复所有错误）
- ✅ load 事件监听（等待 CDN 加载）
- ✅ 所有数据库操作使用 supabaseClient
- ✅ 错误处理完善

### 3. database.sql（数据库脚本）
- ✅ 包含所有必需的表
- ✅ RLS 策略已配置
- ✅ 包含 3 条测试数据
- ✅ 索引已创建

---

## 📤 需要上传到 GitHub 的文件

### 必需文件（核心功能）
- ✅ `index.html` - 主页面
- ✅ `app-supabase.js` - JavaScript 逻辑

### 可选文件（辅助功能）
- ⚠️ `database.sql` - 数据库初始化脚本（在 Supabase SQL Editor 中执行）
- ⚠️ `db-test.html` - 数据库连接测试页面
- ⚠️ `README.md` - 说明文档

### 不需要上传的文件
- ❌ `manifest.json` - PWA 配置（已禁用）
- ❌ `sw.js` - Service Worker（已禁用）
- ❌ `test-deploy.html` - 测试页面
- ❌ `diagnose-system.html` - 诊断页面
- ❌ `deploy.sh` - Vercel 部署脚本
- ❌ `.vercel/` 文件夹 - Vercel 配置

---

## 🚀 上传步骤

### 步骤 1: 访问 GitHub 仓库

```
https://github.com/frankzhao0321/qc-system
```

### 步骤 2: 上传核心文件

1. 点击 **"Add file"** 按钮
2. 选择以下文件：
   - `index.html`
   - `app-supabase.js`

3. 提交更改
   - 在页面底部输入："Update files for GitHub Pages"

### 步骤 3: 等待构建

1. 访问 **Actions** 页面：
   ```
   https://github.com/frankzhao0321/qc-system/actions
   ```

2. 等待构建完成（通常 1-2 分钟）
3. 构建成功后，状态会显示绿色 ✓

### 步骤 4: 访问网站

```
https://frankzhao0321.github.io/qc-system/
```

---

## ✅ 预期结果

上传完成后，系统应该能够：
- ✅ 正常显示设备列表
- ✅ 创建新设备
- ✅ 添加检测项、测试项、清点项
- ✅ 更新设备状态
- ✅ 查询设备信息

---

## 🔍 如果还有问题

### 问题 1: 页面显示"暂无设备"

**原因：** 数据库表未创建

**解决方法：**
1. 访问 https://supabase.com/dashboard/project/cjlppzltsaroblzqutra/sql/new
2. 复制 `/Users/frank/Documents/trae_projects/QC/static/database.sql` 的内容
3. 粘贴到 SQL Editor
4. 点击 **Run** 按钮
5. 等待执行完成
6. 刷新 GitHub Pages 页面

### 问题 2: Console 显示错误

**解决方法：**
1. 按 `Cmd + Option + I`（Mac）或 `F12`（Windows）打开开发者工具
2. 点击 **Console** 标签
3. 查看红色错误信息
4. 将错误信息复制给我

---

## 📱 团队使用

部署成功后，团队成员只需：
1. 在浏览器中打开 GitHub Pages URL
2. 开始使用品控系统
3. 所有数据都存储在 Supabase 云数据库中

---

**准备好上传了吗？** 

按照上述步骤操作，然后告诉我结果！🚀
