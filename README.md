## HackerNet

### 簡介

這是一個提供給廣大輕小說愛好者的資訊檢索平台，以網站形式發布

使用 SQL 語法建立及搜索資料庫

包含小說、作者、出版社、輕小說大賞、使用者、評論區 ... 等資訊和功能

### 使用技術

**前端**：HTML、CSS、Javascript

**後端**：Flask、Python

**資料庫**：SQLite3

### 執行流程

#### step1 - download file from github

- static
  - index.html：主介面顯示
  - login.html：登入介面顯示
  - novel.html：小說 & 評論區介面顯示
  - script.js / script1.js / script3.js：處理前端響應事件
  - style.css：前端介面設計
- mydatabase.db：將整個資料庫打包成一個檔案
- app.py：建立 Flask 框架，負責所有後台處理

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

### 貢獻

- [蘇豐典](https://github.com/FengDian-Su)：前端 & JavaScript 響應設計
- [陳柏硯](https://github.com/FengDian-Su)：全端 & 資料庫連接
- [高韵晴](https://github.com/FengDian-Su)：資料庫原始資料蒐集
- [李曉旻](https://github.com/FengDian-Su)：資料庫原始資料蒐集
