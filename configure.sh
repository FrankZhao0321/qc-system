#!/bin/bash

# ========================================
# 奥领数控品控系统 - 自动配置脚本
# ========================================

echo "======================================"
echo "奥领数控品控系统 - 自动配置"
echo "======================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "app-supabase.js" ]; then
    echo "❌ 错误：请在 static 目录下运行此脚本"
    echo "   当前目录: $(pwd)"
    exit 1
fi

echo "请输入您的 Supabase 配置信息："
echo ""

# 获取 Supabase URL
read -p "1. 请输入 Supabase Project URL: " supabase_url

# 验证 URL 格式
if [[ ! $supabase_url =~ ^https://.*\.supabase\.co$ ]]; then
    echo ""
    echo "❌ 错误：URL 格式不正确"
    echo "   正确格式：https://xxxxxxxxxxxxx.supabase.co"
    echo ""
    echo "请从 Supabase Dashboard → Settings → API 获取正确的 URL"
    exit 1
fi

# 获取 Supabase Anon Key
read -p "2. 请输入 Supabase anon public key: " supabase_key

# 验证 Key 格式
if [[ ! $supabase_key =~ ^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ ]]; then
    echo ""
    echo "⚠️  警告：Key 格式可能不正确"
    echo "   正确格式应该以 eyJ 开头"
    echo ""
    read -p "是否继续？(y/n): " confirm
    if [[ $confirm != "y" && $confirm != "Y" ]]; then
        echo "已取消"
        exit 0
    fi
fi

echo ""
echo "======================================"
echo "配置信息："
echo "======================================"
echo "URL: $supabase_url"
echo "Key: ${supabase_key:0:50}..."
echo ""

# 确认配置
read -p "确认以上配置信息正确？(y/n): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
    echo "已取消"
    exit 0
fi

echo ""
echo "正在配置..."
echo ""

# 备份原文件
if [ -f "app-supabase.js" ]; then
    cp app-supabase.js app-supabase.js.backup
    echo "✅ 已备份原文件到 app-supabase.js.backup"
fi

# 替换配置
sed -i '' "s|YOUR_SUPABASE_URL|$supabase_url|g" app-supabase.js
sed -i '' "s|YOUR_SUPABASE_ANON_KEY|$supabase_key|g" app-supabase.js

echo "✅ 配置完成！"
echo ""

# 显示配置结果
echo "======================================"
echo "配置结果："
echo "======================================"
echo ""

# 显示配置后的前几行
head -n 10 app-supabase.js | grep -A 2 "SUPABASE"

echo ""
echo "======================================"
echo "下一步："
echo "======================================"
echo ""
echo "1. 在浏览器中打开 index.html"
echo "2. 检查是否能看到设备列表"
echo "3. 测试创建新设备"
echo "4. 刷新页面，检查数据是否保存"
echo ""
echo "如果配置正确，系统应该可以正常使用了！"
echo ""
echo "======================================"
echo "配置完成！"
echo "======================================"