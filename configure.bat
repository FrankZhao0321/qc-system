@echo off
chcp 65001 >nul
echo ======================================
echo 奥领数控品控系统 - 自动配置
echo ======================================
echo.

REM 检查是否在正确的目录
if not exist "app-supabase.js" (
    echo ❌ 错误：请在 static 目录下运行此脚本
    echo    当前目录: %CD%
    pause
    exit /b 1
)

echo 请输入您的 Supabase 配置信息：
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

echo ✅ 配置完成！
echo.

REM 显示配置结果
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
echo 2. 检查是否能看到设备列表
echo 3. 测试创建新设备
echo 4. 刷新页面，检查数据是否保存
echo.
echo 如果配置正确，系统应该可以正常使用了！
echo.
echo ======================================
echo 配置完成！
echo ======================================
pause