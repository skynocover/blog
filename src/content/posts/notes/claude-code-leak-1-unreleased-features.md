---
title: 'Claude Code 洩漏全解讀 1 — 那些還沒上線的功能'
date: 2026-04-05
tag: '技術筆記'
description: 'Anthropic 不小心洩漏了 Claude Code 約 512,000 行原始碼，我們從裡面看到 KAIROS、COORDINATOR_MODE、臥底模式等未公開的功能'
featured: true
---

2026 年 3 月 31 日
Anthropic 不小心把 Claude Code 的完整原始碼發出去了
**總共約 512,000 行 TypeScript**

因為這次洩漏的資訊實在太多了
所以我打算寫成系列長文

第一篇講 Claude Code 一些未公開的功能
第二篇講從原始碼解析出來的運作原理，順便聊什麼是 Harness
第三篇講我從這個架構中看到了什麼
第四篇是花絮

## 這次洩漏的內容

洩漏的原因是 Bun 的一個 bug
會在生產模式下仍輸出 source map

諷刺的是 Anthropic 去年才收購了 Bun
所以**等於是自家工具的 bug 暴露了自家產品**

### Anthropic 本來就有公開 Claude code 的程式碼 那這次洩漏的是什麼?

官方 repo 包含的是 Claude Code 的「周邊」
例如文件、範例、插件、腳本、開發容器設定（.devcontainer）、VS Code 設定、GitHub Actions
以及 release notes

主要內容是讓使用者了解如何使用 Claude Code、回報 issues、跟提交 PR
這次外洩的則是 Claude Code 的核心引擎原始碼

簡單來說
官方 repo 就像一台車的使用手冊和配件目錄
而外洩的原始碼則是這台車的完整工程設計圖
(所以工程師們才能在拿到設計圖之後做了各種語言的版本)

值得一提的是，Anthropic 在試圖下架外洩程式碼時
發出的 DMCA 通知意外波及了約 8,100 個 repo

包括官方自己公開的 Claude Code repo 的合法 fork
完全不含洩漏的內容
開發者們收到這些通知信的時候一頭霧水
反而造成了二次公關災難

後來 Anthropic 承認這是失誤
撤回了大部分通知
保留了針對 1 個儲存庫和 96 個確實包含洩漏原始碼的 fork 的下架請求

## KAIROS：一個 24/7 在背景跑的自主 Agent

整個 codebase 裡最大的發現是一個叫 KAIROS 的功能代號

目前的 Claude Code 是被動的
你給它指令，它執行，結束
關掉終端機之後它就不存在了

但 KAIROS 完全不同

他具備背景 daemon workers（常駐程序，不需要你開著終端機）
GitHub webhook 訂閱（自動監聽 repo 的變化）
Cron 排程，每 5 分鐘刷新一次
每日追加寫入的日誌
一個叫 `/dream` 的 skill — 官方描述是「nightly memory distillation」（夜間記憶蒸餾）

**你睡覺的時候，它在整理今天學到的東西**
**你還沒上班，它已經在看 GitHub 上有什麼新的 PR**
看起來超像在帶一個新進同事

從這裡可以看出 Anthropic 比起 Vibe coding 工具
**更希望 Claude code 成為一個常駐的數位同事**
閒置時整理資料，消除矛盾，背景監控 Repo 的變化

有點像是之前矽谷提出的主動式 AI
AI 會在你需要他的時候自動出現
不需要他時，又會退居二線默默工作
直到他下次注意到你需要幫助

還有一個 PROACTIVE
跟 KAIROS 共用 proactive/index.js 模組
推測可能是 KAIROS 的子集
或是做成完整版後變成 KAIROS

### COORDINATOR_MODE：用 AI 管 AI

第二個值得留意的是 COORDINATOR_MODE

這是一個有明確管理階層的 agent 團隊
一個 Claude 當 orchestrator（管理者）
它可以生成多個 worker agent
並分配任務，審查成果

有趣的是 prompt 裡的管理哲學
「主管回應使用者時，不可以說『根據 worker 的發現，建議你做 X』，因為這表示主管沒有消化過 worker 回應的內容」
「如果 worker 回應的品質很差，主管不應該放行，應該讓 worker 回去重做」
「主管必須理解 worker 的發現之後才能指派後續工作，worker A 回報『檔案有三個 bug』，主管不能不看內容就直接叫 worker B『去修 worker A 找到的 bug』。它必須先搞懂是哪三個 bug、嚴重程度、彼此有沒有關聯，再決定下一步怎麼分工」

這讓 AI 更像是一個真人主管
就像公司不會讓 CEO 自己寫每一行程式碼
而是設計組織架構和管理流程，讓團隊去執行

Coordinator Mode 做的是同樣的事
原本工程師是寫程式
後來變成「監督AI寫程式」
**現在則是監督「監督AI寫程式」**

另外從這三條可以很明顯知道這不是一般常見的限制寫法
**而是從真實經驗中提煉出來的**
代表 Anthropic 內部一定用這個方式開發程式一段時間了

### VERIFICATION_AGENT

在 Anthropic 內部版裡有一個驗證 agent
它會在非瑣碎的變更完成後(例如重構或是增加功能，而不是改錯字)
將自動生成一個對抗性子 agent 來審查
意思是用另一個 AI 來 review AI 的產出
目前只在內部版啟用

之前那個是**用 AI 管 AI**
這個功能則是**用 AI 驗證 AI**
這又拔除了一個工程師本來要做的事
屬於**不斷地把工程師的工作往上層移**

### VOICE_MODE

語音模式
不用打字的 coding agent

從洩漏的程式碼來看
它有完整的 feature flag
但還沒開放

如果只是普通的語音轉文字輸入
根本不需要一個專門的功能旗標來控制
那代表它應該有超出「把聲音變文字」的東西

比較合理的猜測可能是可以直接丟語音進去模型
不需要經過轉文字的步驟
目的是可以從語音中得到語氣 語速等資訊
或是有可能支援多人模式
不過這都屬於猜測

## Anthropic 內部用的 Claude Code 跟你的不一樣

程式碼裡有一個 `process.env.USER_TYPE === 'ant'` 的檢查
ant 就是 Anthropic
內部工程師用的 Claude Code 有不同的系統提示

幾個具體的差異：

1. 「如果使用者基於誤解提問，要說出來」
2. 「輸出顯示失敗時永遠不要說所有測試通過」（反幻覺護欄）
3. 「工具呼叫之間的文字 ≤25 字」

那個 25 字限制是 A/B 測試出來的
原始碼的註解寫著：
「研究顯示比起定性的 'be concise'，這個限制減少了約 1.2% 的輸出 token」
Anthropic 在用 A/B 測試調 prompt 的措辭
像廣告公司測文案一樣

## 臥底模式 undercover.ts

程式碼大約 90 行

在非 Anthropic 的 repo 裡
它會剝除所有 AI 的痕跡

指示模型不要提到內部代號（Capybara、Tengu）
Slack 頻道名稱
甚至「Claude Code」這個名字本身

重點：**這個模式沒有關閉開關**
這代表 Anthropic 員工在開源專案裡用 AI 寫的程式碼
**不會有任何痕跡顯示是 AI 寫的**

## 這些未發布的功能在告訴我們什麼

KAIROS — 從被動變主動，不用你叫它才動
COORDINATOR_MODE — 從單兵變團隊，一個 Claude 管多個 Claude
VERIFICATION_AGENT — 從信任變驗證，AI 自己 review AI

**每一個功能都在把 Claude Code 從「工具」變成「同事」**

在 vibe coding 下
不會寫程式的人開始寫程式
會寫程式的人開始審核程式
現在要開始規範 AI 如何審核程式

有點像是 Prompt 進展到 Context 然後又進展到 Harness 一樣
從怎麼下指令，到給 AI 看什麼資料，再到設計整個系統怎麼運作
在 AI 不斷變強的同時
**邊界跟框架也不斷重新劃線**
同時也**把工程師的工作再往上拉一層**

那這個 Harness 到底是什麼
下一篇我們就從 Claude Code 的 500,000 行原始碼
來看真正讓它「用起來很順」的秘密
