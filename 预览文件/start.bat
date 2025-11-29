@echo off
chcp 65001 >nul
echo 🍅 番茄专注时钟
echo ==================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo.

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    call npm install
    echo.
)

REM 启动开发服务器
echo 🚀 启动开发服务器...
echo 应用将在浏览器中自动打开
echo 如果未自动打开，请访问: http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause

