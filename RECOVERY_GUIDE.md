# Tech Daily 项目恢复指南

> 本文档用于在 Claude Code 对话丢失后快速恢复项目上下文

---

## 一、项目概述

这是一个**科技新闻自动聚合系统**，包含：
- 一个基于 GitHub Pages 的静态新闻网站
- 一个 Claude Code Skill 用于自动获取新闻
- 自动化脚本实现每日更新

### 覆盖领域
1. 人工智能 (AI)
2. 汽车/新能源
3. AI硬件与嵌入式
4. 汽车电子嵌入式
5. 消费电子
6. 集成电路/半导体

---

## 二、文件位置清单

### 2.1 网站项目
```
C:\Users\Colorful-PC\Projects\tech-news-site\
├── docs\                          # GitHub Pages 根目录
│   ├── index.html                # 主页
│   ├── feed.xml                  # RSS 订阅源
│   ├── assets\
│   │   ├── css\style.css        # 深色主题样式
│   │   └── js\
│   │       ├── app.js           # 前端逻辑（搜索、筛选）
│   │       └── news-data.js     # 新闻数据（每日更新）
│   └── news\                     # 历史新闻存档
├── scripts\
│   └── update-news.ps1          # 自动更新脚本
├── skill\                        # Skill 备份
└── README.md
```

### 2.2 Claude Code Skill
```
C:\Users\Colorful-PC\.claude\skills\tech-news-researcher\
├── SKILL.md                      # Skill 主文件（触发条件、工作流程）
├── scripts\
│   └── daily_news.ps1           # 定时获取脚本
├── references\
│   └── sources.md               # 信息来源列表
└── output\
    └── news_YYYY-MM-DD.md       # 每日新闻 Markdown
```

### 2.3 在线地址
- **网站**: https://xiaoming9527nb.github.io/tech-news-site/
- **GitHub 仓库**: https://github.com/xiaoming9527nb/tech-news-site

---

## 三、恢复对话的提示词

复制以下内容发送给新的 Claude Code 对话：

```
我有一个科技新闻自动聚合项目，需要你帮我继续维护。

项目位置：
- 网站项目：C:\Users\Colorful-PC\Projects\tech-news-site\
- Claude Skill：C:\Users\Colorful-PC\.claude\skills\tech-news-researcher\
- GitHub：https://github.com/xiaoming9527nb/tech-news-site

请先阅读以下文件了解项目：
1. C:\Users\Colorful-PC\Projects\tech-news-site\README.md
2. C:\Users\Colorful-PC\.claude\skills\tech-news-researcher\SKILL.md

然后告诉我你了解了什么，以及我可以怎么使用这个系统。
```

---

## 四、常用操作命令

### 4.1 获取今日新闻（手动）
在 Claude Code 中说：
```
获取今天的科技新闻并更新网站
```

### 4.2 更新网站并推送到 GitHub
```powershell
cd C:\Users\Colorful-PC\Projects\tech-news-site
.\scripts\update-news.ps1 -Deploy
```

### 4.3 本地预览网站
```powershell
cd C:\Users\Colorful-PC\Projects\tech-news-site\docs
python -m http.server 8080
# 然后访问 http://localhost:8080
```

### 4.4 查看特定领域新闻
在 Claude Code 中说：
```
调研最近的半导体行业动态
调研自动驾驶技术最新进展
调研 AI 大模型有什么新发布
```

---

## 五、定时任务设置

### 5.1 创建每日自动更新任务
以管理员身份运行 PowerShell：
```powershell
$Action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File `"C:\Users\Colorful-PC\Projects\tech-news-site\scripts\update-news.ps1`" -Deploy"
$Trigger = New-ScheduledTaskTrigger -Daily -At "07:30"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName "TechDailyUpdate" -Action $Action -Trigger $Trigger -Settings $Settings `
    -Description "每日科技新闻自动更新"
```

### 5.2 管理定时任务
```powershell
# 查看任务状态
Get-ScheduledTask -TaskName "TechDailyUpdate"

# 手动运行一次
Start-ScheduledTask -TaskName "TechDailyUpdate"

# 删除任务
Unregister-ScheduledTask -TaskName "TechDailyUpdate" -Confirm:$false
```

---

## 六、自定义修改

### 6.1 添加新的新闻领域
编辑 `C:\Users\Colorful-PC\.claude\skills\tech-news-researcher\SKILL.md`，在"覆盖领域"表格中添加新行。

### 6.2 修改网站样式
编辑 `C:\Users\Colorful-PC\Projects\tech-news-site\docs\assets\css\style.css`

主要颜色变量：
```css
:root {
    --bg-primary: #0d1117;      /* 背景色 */
    --accent-blue: #58a6ff;     /* 主题蓝 */
    --accent-green: #3fb950;    /* 绿色 */
    --accent-purple: #a371f7;   /* 紫色 */
}
```

### 6.3 添加新的信息来源
编辑 `C:\Users\Colorful-PC\.claude\skills\tech-news-researcher\references\sources.md`

---

## 七、故障排除

### 问题：网站没有更新
1. 检查 GitHub Actions 是否正常
2. 手动运行：`.\scripts\update-news.ps1 -Deploy`
3. 检查 git push 是否成功

### 问题：Skill 不触发
确保 Skill 文件在正确位置：
```powershell
Test-Path "C:\Users\Colorful-PC\.claude\skills\tech-news-researcher\SKILL.md"
```

### 问题：定时任务不执行
```powershell
# 查看任务历史
Get-ScheduledTask -TaskName "TechDailyUpdate" | Get-ScheduledTaskInfo
```

---

## 八、备份策略

### 本地备份
```powershell
# 压缩整个项目
Compress-Archive -Path "C:\Users\Colorful-PC\Projects\tech-news-site" -DestinationPath "C:\Backup\tech-news-site-$(Get-Date -Format 'yyyyMMdd').zip"
```

### 云端备份
项目已自动同步到 GitHub，每次 `git push` 都是一次备份。

---

## 九、技术栈

| 组件 | 技术 |
|------|------|
| 前端 | HTML + CSS + JavaScript |
| 样式 | 自定义 CSS（深色主题） |
| 托管 | GitHub Pages |
| 新闻获取 | Claude Code + WebSearch |
| 自动化 | PowerShell + Windows 任务计划 |
| 版本控制 | Git + GitHub |

---

## 十、联系与资源

- **GitHub 仓库**: https://github.com/xiaoming9527nb/tech-news-site
- **Claude Code 文档**: https://docs.anthropic.com/claude-code
- **GitHub Pages 文档**: https://docs.github.com/pages

---

*文档创建日期：2026-04-08*
*最后更新：2026-04-08*
