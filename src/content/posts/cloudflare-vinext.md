---
title: "聊一下最近很紅的 Vinext"
date: 2025-02-26
tag: "深度分析"
description: "Cloudflare 工程師花一週用 AI 重寫了 Next.js，這對前端生態意味著什麼"
---

來聊一下最近很紅的Vinext

這是 Cloudflare 一個工程師花一週
用 AI 重寫了的 Nextjs

先來說說我跟Nextjs的淵源

我最早當K島版主是用 myKomica 架設的
後來 myKomica 收掉之後就自己學 golang 跟 React 把版面重新架起來

但因為前後端是不同語言
所以有時候要找套件就要分開找
維護起來也非常困難

後來同事介紹了 Nextjs 後驚為天人
因為當時幾乎沒有這種全端框架
我在一個月內把所有的功能全部從 golang 搬到 Nextjs 上
(當時還沒有AI, 所以全部手刻)

好處是我可以退掉 GCP
直接把服務上到免費的 Vercel
還有CICD可以用
(GCP上當時是用caprover)

但有兩個問題
1. 頁面載入速度太慢了 (3秒多) 不過考慮到SSR而且還免費就接受
2. 我的用量一直非常接近免費額度的上限

就這樣膽戰心驚地過了兩年後
我發現了OpenNext這個框架
同樣是 Nextjs 不過可以架設在Lambda跟workers

那時候已經有 Cursor 了
所以就用 Cursor 花一週把框架換成 OpenNext
並且把服務換到了workers上

載入速度變快了不少 (1.5秒)
雖然因為打包太大包 超過了workers的免費額度
所以我還是去訂閱了付費方案 ($5)
但還是比 Vercel ($20)便宜多了
缺點是資料庫跟 storage 還是要使用外部服務

之後又過了兩年
HonoX 誕生了
同樣是支援 SSR 的全端框架
而且我一直很在意1.5秒的載入時間

我又有Claude code
就用三天的時間 寫Spec跟驗收
把 OpenNext 遷移到 HonoX 上
包含 monogDB 的資料遷移到 D1
storage 遷移到 R2

全部使用cloudflare的生態系
使需要用binding
不需要再搞不曉得哪天就洩漏的 api key
同時載入時間壓到 0.5 秒

然後現在 Cloudflare 又出了原生的 vinext
原生支援所有 cloudflare 的周邊
讓我考慮在他成熟後測試看看

我的心得:
這段有點像框架發展史
前後端分離->全端框架->怕綁架所以遷移->返璞歸真用傳統server解決

AI的發展也讓我每次重製的速度加快
手動重製成 Nextjs: 一個月
Cursor 重製成 OpenNext: 一週
ClaudeCode 重製成 HonoX: 三天

框架發展速度也是飛快
一週內搞定新框架
誰知道下一個框架可以多快做出來
