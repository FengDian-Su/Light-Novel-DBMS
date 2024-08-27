## Light Novel Database Management System

### 簡介

這是一個提供給廣大輕小說愛好者的資訊檢索平台，以網站形式呈現

使用 SQL 語法建立及搜索資料庫

包含小說、作者、出版社、輕小說大賞、使用者、評論區 ... 等資訊和功能

### 使用技術

**前端**：HTML、CSS、Javascript

**後端**：Flask、Python

**資料庫**：SQLite3

### 執行流程

#### step1 - download file from github

| File Name                                  | Description                                                   |
| ------------------------------------------ | --------------------------------------------------------------|
| static/index.html                          | 主介面顯示                                                     |
| static/login.html                          | 登入介面顯示                                                   |
| static/novel.html                          | 小說 & 評論區介面顯示                                           |
| static/script.js                           | 處理前端響應事件                                                |
| static/style.css                           | 前端介面排版                                                   |
| mydatabase.db                              | 將整個資料庫打包成一個檔案                                       |
| app.py                                     | 建立 Flask 框架，負責所有後台處理                                |
 
#### step2 - execute app.py file

- 以 spyder 為例，執行 app.py
- 開啟瀏覽器，輸入 `http://localhost:8000/index.html`
- index.html 觸發保護機制，自動導向登入介面
- 根據 ./xlsx/User.xlsx 的紀錄，選擇一筆 {username：password} 登入

### 執行畫面

- spyder 執行結果
  
  <img src="https://github.com/FengDian-Su/HackerNet/blob/main/demo_img/lauch_demo.png" width="500">
  
- 登入介面
  
  <img src="https://github.com/FengDian-Su/HackerNet/blob/main/demo_img/login_demo.png" width="500">
  
- 篩選介面
  
  <img src="https://github.com/FengDian-Su/HackerNet/blob/main/demo_img/search_demo.png" width="500">
  
- 小說評論介面
  
  <img src="https://github.com/FengDian-Su/HackerNet/blob/main/demo_img/novel_demo.png" width="500">

### 貢獻者

- [FengDian-Su](https://github.com/FengDian-Su)
- [ChingChingKao](https://github.com/ChingChingKao)
- [baiyanchen8](https://github.com/baiyanchen8)
- [SiaominLi](https://github.com/SiaominLi)

### 參考資源

- [Python Flask 入門指南](https://devs.tw/post/448)
- [CORS 完全手冊](https://blog.huli.tw/2021/02/19/cors-guide-1/)
- [Python fetchone 讀取資料庫](https://www.cjkuo.net/python-fetchdb/)
- [Flask 處理上下文](https://www.cnblogs.com/xiaxiaoxu/p/10398346.html)
- [Python os.abort() Method](https://www.w3schools.com/python/ref_os_abort.asp)
