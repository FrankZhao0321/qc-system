@echo off
chcp 65001 >nul
echo ======================================
echo 奥领数控品控系统 - 完整自动配置
echo ======================================
echo.

REM 检查是否在正确的目录
if not exist "app-supabase.js" (
    echo ❌ 错误：请在 static 目录下运行此脚本
    echo    当前目录: %CD%
    pause
    exit /b 1
)

echo 请按照以下步骤操作：
echo.
echo ======================================
echo 第1步：获取 Supabase API 信息
echo ======================================
echo.
echo 1. 在浏览器中打开：https://supabase.com/dashboard
echo 2. 登录您的账号：frank0321@126.com
echo 3. 选择项目：qc-system
echo 4. 点击左侧菜单 Settings -^> API
echo 5. 复制以下两个值：
echo    - Project URL（例如：https://xxxxxxxxxxxxx.supabase.co）
echo    - anon public key（一长串字符）
echo.

echo ======================================
echo 第2步：配置前端应用
echo ======================================
echo.

REM 获取 Supabase URL
set /p supabase_url=1. 请输入 Supabase Project URL: 

REM 验证 URL 格式
echo %supabase_url% | findstr /r "^https://.*\.supabase\.co$" >nul
if errorlevel 1 (
    echo.
    echo ❌ 错误：URL 格式不正确
    echo    正确格式：https://xxxxxxxxxxxxx.supabase.co
    echo.
    echo 请从 Supabase Dashboard -^> Settings -^> API 获取正确的 URL
    pause
    exit /b 1
)

REM 获取 Supabase Anon Key
set /p supabase_key=2. 请输入 Supabase anon public key: 

REM 验证 Key 格式
echo %supabase_key% | findstr /r "^eyJ.*" >nul
if errorlevel 1 (
    echo.
    echo ⚠️  警告：Key 格式可能不正确
    echo    正确格式应该以 eyJ 开头
    echo.
    set /p confirm=是否继续？(y/n): 
    if /i not "%confirm%"=="y" (
        echo 已取消
        pause
        exit /b 0
    )
)

echo.
echo ======================================
echo 配置信息：
echo ======================================
echo.
echo URL: %supabase_url%
echo Key: %supabase_key:~0,50%...
echo.

REM 确认配置
set /p confirm=确认以上配置信息正确？(y/n): 
if /i not "%confirm%"=="y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo 正在配置...
echo.

REM 备份原文件
if exist "app-supabase.js" (
    copy app-supabase.js app-supabase.js.backup >nul
    echo ✅ 已备份原文件到 app-supabase.js.backup
)

REM 替换配置
powershell -Command "(Get-Content app-supabase.js) -replace 'YOUR_SUPABASE_URL', '%supabase_url%' | Set-Content app-supabase.js"
powershell -Command "(Get-Content app-supabase.js) -replace 'YOUR_SUPABASE_ANON_KEY', '%supabase_key%' | Set-Content app-supabase.js"

echo ✅ 前端配置完成！
echo.

echo ======================================
echo 第3步：创建数据库表
echo ======================================
echo.
echo 请按照以下步骤在 Supabase 中创建数据库表：
echo.
echo 1. 在浏览器中打开：https://supabase.com/dashboard/project/qc-system
echo 2. 点击左侧菜单 SQL Editor
echo 3. 点击 New query 按钮
echo 4. 打开文件：database-setup.sql
echo 5. 复制所有内容
echo 6. 粘贴到 SQL Editor 中
echo 7. 点击 Run 按钮
echo 8. 等待执行完成（通常几秒钟）
echo.

set /p db_created=数据库表已创建？(y/n): 
if /i not "%db_created%"=="y" (
    echo 请先完成数据库表创建，然后再继续
    pause
    exit /b 0
)

echo.
echo ======================================
echo 配置结果：
echo ======================================
echo.

REM 显示配置后的前几行
findstr /C:"SUPABASE_URL" /C:"SUPABASE_ANON_KEY" app-supabase.js | more

echo.
echo ======================================
echo 下一步：
echo ======================================
echo.
echo 1. 在浏览器中打开 index.html
echo    路径：%CD%\index.html
echo.
echo 2. 检查是否能看到设备列表
echo.
echo 3. 测试创建新设备
echo.
echo 4. 刷新页面，检查数据是否保存
echo.
echo 5. 如果一切正常，就可以部署到 Vercel 了
echo.
echo ======================================
echo 配置完成！
echo ======================================
pause