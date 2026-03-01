# 配置 Supabase - 详细步骤

## 📋 准备工作

在开始之前，确保您已经：
- ✅ 注册了 Supabase 账号
- ✅ 创建了一个新项目
- ✅ 项目已经创建完成（通常需要 1-2 分钟）

## 🚀 配置步骤

### 第1步：获取 Supabase API 信息

1. 访问 https://supabase.com/dashboard
2. 点击左侧菜单中的 **Settings**（齿轮图标）
3. 选择 **API**
4. 在页面中找到以下信息：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. **复制这两个值**（稍后会用到）

### 第2步：创建数据库表

1. 在 Supabase 项目中，点击左侧菜单的 **SQL Editor**
2. 点击 **New query** 按钮
3. 复制 `database.sql` 文件中的所有内容
4. 粘贴到 SQL Editor 中
5. 点击 **Run** 按钮
6. 等待执行完成（通常几秒钟）

### 第3步：配置前端应用

#### 方法 A：修改配置文件（推荐）

1. 打开 `static/config.js` 文件
2. 找到以下两行：

```javascript
url: 'YOUR_SUPABASE_URL',
anonKey: 'YOUR_SUPABASE_ANON_KEY'
```

3. 将第1步中复制的值填入：

```javascript
url: 'https://xxxxxxxxxxxxx.supabase.co',
anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

4. 保存文件

#### 方法 B：直接修改 app-supabase.js

1. 打开 `static/app-supabase.js` 文件
2. 找到文件开头的这两行：

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

3. 替换为您的实际值：

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

4. 保存文件

### 第4步：更新 HTML 文件

1. 打开 `static/index.html` 文件
2. 找到文件末尾的这行：

```html
<script src="app.js"></script>
```

3. 将其改为：

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="app-supabase.js"></script>
```

4. 保存文件

### 第5步：测试本地运行

1. 在浏览器中打开 `static/index.html`
2. 如果配置正确，您应该能看到设备列表
3. 如果看到"系统未配置"的提示，请检查配置是否正确

## ✅ 验证配置

### 检查清单

- [ ] Supabase 项目已创建
- [ ] 数据库表已创建
- [ ] API URL 已配置
- [ ] API Key 已配置
- [ ] HTML 文件已更新
- [ ] 本地测试通过

### 测试功能

1. **创建设备**
   - 点击"新建设备"
   - 填写信息并提交
   - 检查设备是否出现在列表中

2. **添加检测项**
   - 点击设备的"查看"按钮
   - 在"组装检测"标签中添加检测项
   - 检查检测项是否保存成功

3. **刷新页面**
   - 刷新浏览器
   - 检查数据是否仍然存在（应该存在，因为数据在云端）

## 🔒 安全提示

### 测试阶段
- 使用当前的宽松安全策略
- 允许所有用户访问所有数据

### 生产阶段
建议添加以下安全措施：

1. **启用用户认证**
   - 在 Supabase 中启用 Auth
   - 要求用户登录才能访问

2. **限制数据访问**
   - 修改 RLS（行级安全）策略
   - 只允许用户访问自己的数据

3. **使用环境变量**
   - 不要将 API Key 提交到代码仓库
   - 使用环境变量存储敏感信息

## 📞 常见问题

### Q: 找不到 Project URL
A: 
- 确保您在正确的项目中
- 点击 Settings → API
- Project URL 在 "Project API keys" 部分

### Q: SQL 执行失败
A:
- 确保复制了完整的 SQL 代码
- 检查是否有语法错误
- 查看错误信息

### Q: 页面显示"系统未配置"
A:
- 检查 SUPABASE_URL 和 SUPABASE_ANON_KEY 是否正确填入
- 确认没有多余的空格或引号
- 检查浏览器控制台是否有错误

### Q: 数据没有保存
A:
- 打开浏览器开发者工具（F12）
- 查看 Console 标签
- 检查是否有错误信息
- 确认 Supabase 项目状态正常

### Q: 如何重置数据？
A:
- 在 Supabase SQL Editor 中执行：
```sql
TRUNCATE TABLE devices CASCADE;
TRUNCATE TABLE assembly_checks CASCADE;
TRUNCATE TABLE test_reports CASCADE;
TRUNCATE TABLE shipping_checks CASCADE;
TRUNCATE TABLE customer_feedback CASCADE;
TRUNCATE TABLE improvement_suggestions CASCADE;
```

## 🎯 下一步

配置完成后，您可以：

1. **部署到 Vercel**
   - 参考 [QUICK_DEPLOY.md](../QUICK_DEPLOY.md)
   - 让团队成员都能访问

2. **添加更多功能**
   - 用户认证
   - 文件上传
   - 数据导出

3. **优化用户体验**
   - 添加加载动画
   - 优化移动端
   - 添加错误处理

## 📚 相关文档

- [Supabase 文档](https://supabase.com/docs)
- [快速部署指南](../QUICK_DEPLOY.md)
- [详细部署方案](../DEPLOYMENT.md)

---

**配置完成后，您的系统就可以使用了！**