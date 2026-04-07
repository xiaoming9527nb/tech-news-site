# Tech News Daily Fetcher
# 每日科技新闻获取脚本
#
# 使用方法：
# 1. 直接运行：.\daily_news.ps1
# 2. 设置定时任务（见下方说明）

param(
    [string]$OutputDir = "$env:USERPROFILE\.claude\skills\tech-news-researcher\output",
    [switch]$OpenAfter = $false
)

$Date = Get-Date -Format "yyyy-MM-dd"
$OutputFile = Join-Path $OutputDir "news_$Date.md"

# 确保输出目录存在
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

Write-Host "正在使用 Claude Code 获取今日科技新闻..." -ForegroundColor Cyan

# 调用 Claude Code 获取新闻
$prompt = @"
请获取今天（$Date）的科技新闻摘要，覆盖以下领域：
1. 人工智能
2. 汽车/新能源
3. AI硬件与嵌入式
4. 汽车电子嵌入式
5. 消费电子
6. 集成电路/半导体

请使用 WebSearch 搜索最新信息，整理成结构化的 Markdown 报告。
将报告保存到：$OutputFile
"@

# 执行 Claude Code
claude -p $prompt

if ($LASTEXITCODE -eq 0) {
    Write-Host "新闻已保存到: $OutputFile" -ForegroundColor Green

    if ($OpenAfter -and (Test-Path $OutputFile)) {
        Start-Process $OutputFile
    }
} else {
    Write-Host "获取新闻时出现错误" -ForegroundColor Red
    exit 1
}

<#
=== 设置 Windows 定时任务 ===

以管理员身份运行 PowerShell，执行：

$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File `"$env:USERPROFILE\.claude\skills\tech-news-researcher\scripts\daily_news.ps1`""
$Trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName "DailyTechNews" -Action $Action -Trigger $Trigger -Settings $Settings -Description "每日科技新闻获取"

# 查看任务状态
Get-ScheduledTask -TaskName "DailyTechNews"

# 手动运行一次
Start-ScheduledTask -TaskName "DailyTechNews"

# 删除任务
Unregister-ScheduledTask -TaskName "DailyTechNews" -Confirm:$false

#>
