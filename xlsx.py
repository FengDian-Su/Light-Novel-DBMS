import pandas as pd
import sqlite3
# 連接到 SQLite 資料庫
connection = sqlite3.connect("mydatabase.db")

# 讀取 Excel 檔案，重新命名欄位名稱
anime_df = pd.read_excel('xlsx/Anime.xlsx', engine='openpyxl', names=['title', 'director', 'update', 'publisher'])
# 將資料寫入 SQLite 資料庫的 "Anime" 表格
anime_df.to_sql('Anime', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
author_df = pd.read_excel('xlsx/Author.xlsx', header=None, engine='openpyxl', names=['authorid','name','gender','age'])
# 將資料寫入 SQLite 資料庫的 "Anime" 表格
author_df.to_sql('Author', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Category_df = pd.read_excel('xlsx/Category.xlsx' , header=None,engine='openpyxl', names=['title','c1','c2','c3','c4','c5'])
# 將資料寫入 SQLite 資料庫的 "Anime" 表格
Category_df.to_sql('Category', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Comic_df = pd.read_excel('xlsx/Comic.xlsx', engine='openpyxl', names=['title','publisher'	,'authorid'	,'ISBN'	,'update'])
# 將資料寫入 SQLite 資料庫的 "Anime" 表格
Comic_df.to_sql('Comic', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Comment_df = pd.read_excel('xlsx/Comment.xlsx', engine='openpyxl', names=['userid',	'title',	'contextid',	'context'])
# 將資料寫入 SQLite 資料庫的 "Anime" 表格
Comment_df.to_sql('Comment', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Novel_df= pd.read_excel('xlsx/Novel.xlsx', engine='openpyxl', names=['title','ISBN','count','heat','update','state'])
# 將資料寫入 SQLite 資料庫的 "Novel" 表格
Novel_df.to_sql('Novel', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Novel_Create_df= pd.read_excel('xlsx/Novel_Create.xlsx', engine='openpyxl', names=['ISBN'	,'publisher',	'authorid'])
# 將資料寫入 SQLite 資料庫的 "Novel" 表格
Novel_Create_df.to_sql('Novel_Create', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Prefer_df= pd.read_excel('xlsx/Prefer.xlsx', engine='openpyxl', names=['title'	,'userid',	'like',	'follow'])
# 將資料寫入 SQLite 資料庫的 "Prefer" 表格
Prefer_df.to_sql('Prefer', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Sugoi_df= pd.read_excel('xlsx/Sugoi.xlsx', engine='openpyxl', names=['title',	'year'	,'rank'])
# 將資料寫入 SQLite 資料庫的 "Sugoi" 表格
Sugoi_df.to_sql('sugoi', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
User_df= pd.read_excel('xlsx/User.xlsx', engine='openpyxl', names=['userid',	'username'	,'password'	,'gender'])
# 將資料寫入 SQLite 資料庫的 "Sugoi" 表格
User_df.to_sql('User', connection, if_exists='replace', index=False)

# 讀取 Excel 檔案，重新命名欄位名稱
Publisher_df= pd.read_excel('xlsx/Publisher.xlsx', engine='openpyxl', names=['chairman','taxid','company','address'])
# 將資料寫入 SQLite 資料庫的 "Sugoi" 表格
Publisher_df.to_sql('Publisher', connection, if_exists='replace', index=False)
# 提交變更並關閉連接
connection.commit()
connection.close()
