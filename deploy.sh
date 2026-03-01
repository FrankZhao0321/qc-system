#!/bin/bash

# 奥领数控品控系统 - 快速部署脚本
# 使用方法：./deploy.sh

echo "======================================"
echo "  奥领数控品控系统 - 快速部署工具"
echo "======================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo ""
    echo "请先安装 Node.js："
    echo "1. 访问 https://nodejs.org/"
    echo "2. 下载并安装 LTS 版本"
    echo "3. 重新运行此脚本"
    exit 1
fi

echo "✓ Node.js 已安装"
echo ""

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未检测到 npm"
    exit 1
fi

echo "✓ npm 已安装"
echo ""

# 检查是否已登录 Vercel
echo "检查 Vercel 登录状态..."
npx vercel@latest whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "您需要先登录 Vercel"
    echo ""
    npx vercel@latest login
    if [ $? -ne 0 ]; then
        echo "❌ 登录失败"
        exit 1
    fi
    echo "✓ 登录成功"
    echo ""
else
    echo "✓ 已登录 Vercel"
    echo ""
fi

# 确认部署
echo "准备部署项目到 Vercel"
echo "项目目录: $(pwd)"
echo ""
read -p "是否继续部署？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "部署已取消"
    exit 0
fi

# 开始部署
echo "======================================"
echo "  开始部署..."
echo "======================================"
echo ""

npx vercel@latest --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "  🎉 部署成功！"
    echo "======================================"
    echo ""
    echo "您的系统已成功部署到 Vercel"
    echo ""
    echo "请查看上方的 URL，将此链接分享给团队成员"
    echo ""
    echo "提示："
    echo "- 团队成员可以通过手机或电脑访问此链接"
    echo "- 所有数据都存储在 Supabase 云数据库中"
    echo "- 数据会实时同步"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    echo "请检查错误信息并重试"
    exit 1
fi
