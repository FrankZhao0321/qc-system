// ========================================
// Supabase 配置文件
// ========================================
// 请将从 Supabase 获取的信息填入下方

const SUPABASE_CONFIG = {
    // 从 Supabase 项目设置 → API 中获取
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// ========================================
// 使用说明
// ========================================
/*
1. 登录 Supabase：https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧菜单 "Settings" → "API"
4. 复制以下信息：
   - Project URL
   - anon public key
5. 将这两个值填入上方的配置中
6. 保存此文件
7. 在 index.html 中将 <script src="app.js"></script> 改为 <script src="app-supabase.js"></script>
*/

// ========================================
// 导出配置供其他文件使用
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}