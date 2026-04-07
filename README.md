# Tech Daily - 科技新闻日报

个人科技新闻聚合网站，每日自动获取并展示以下领域的最新资讯：

- 人工智能 (AI)
- 汽车/新能源
- AI硬件与嵌入式
- 汽车电子嵌入式
- 消费电子
- 集成电路/半导体

## 功能特性

- 深色主题现代设计
- 分类筛选
- 全文搜索
- RSS 订阅
- 邮件订阅（需配置后端）
- 每日自动更新
- GitHub Pages 托管

## 快速开始

### 1. 本地预览

```powershell
cd docs
python -m http.server 8080
```

然后访问 http://localhost:8080

### 2. 部署到 GitHub Pages

```powershell
# 初始化 Git 仓库
cd C:\Users\Colorful-PC\Projects\tech-news-site
git init
git add -A
git commit -m "Initial commit"

# 创建 GitHub 仓库后
git remote add origin https://github.com/YOUR_USERNAME/tech-news-site.git
git branch -M main
git push -u origin main
```

在 GitHub 仓库设置中启用 Pages：
- Settings → Pages → Source: Deploy from a branch
- Branch: main, Folder: /docs

### 3. 设置每日自动更新

以管理员身份运行 PowerShell：

```powershell
$Action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File `"$env:USERPROFILE\Projects\tech-news-site\scripts\update-news.ps1`" -Deploy"
$Trigger = New-ScheduledTaskTrigger -Daily -At "07:30"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName "TechDailyUpdate" -Action $Action -Trigger $Trigger -Settings $Settings `
    -Description "Update Tech Daily news site"
```

## 目录结构

```
tech-news-site/
├── docs/                    # GitHub Pages 根目录
│   ├── index.html          # 主页
│   ├── feed.xml            # RSS 订阅源
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css   # 样式文件
│   │   └── js/
│   │       ├── app.js      # 主应用逻辑
│   │       └── news-data.js # 新闻数据
│   └── news/               # 历史新闻存档
├── scripts/
│   └── update-news.ps1     # 自动更新脚本
└── README.md
```

## 自定义配置

### 修改新闻来源

编辑 Claude Code skill 中的关键词和来源：
`~/.claude/skills/tech-news-researcher/SKILL.md`

### 修改网站样式

编辑 `docs/assets/css/style.css` 中的 CSS 变量：

```css
:root {
    --bg-primary: #0d1117;
    --accent-blue: #58a6ff;
    /* ... */
}
```

### 配置邮件订阅

邮件订阅功能需要配置后端服务，推荐选项：
- [Buttondown](https://buttondown.email/) - 简单的邮件订阅服务
- [Mailchimp](https://mailchimp.com/) - 功能丰富
- [SendGrid](https://sendgrid.com/) - 开发者友好

## 快捷键

- `/` - 聚焦搜索框
- `Esc` - 清除搜索

## 技术栈

- 纯静态 HTML/CSS/JS
- GitHub Pages 托管
- Claude Code 自动获取新闻
- PowerShell 自动化脚本

## License

MIT
