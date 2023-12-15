from flask import Flask, request, jsonify, send_file, abort, g
from flask_cors import CORS
import os
import logging
import sqlite3
import signal
import sys

# use Flask in Python as web framework
# initialize and set the root path
app = Flask(__name__)

# dealing with cross-orgin-resource-sharing problem
CORS(app)

def cleanup(signum, frame):
    print("cleanup: close database connection, free resources...")
    sys.exit(0)

# cleanup when capture "CTRL+C" signal
signal.signal(signal.SIGINT, cleanup)

# set port number
port = 8000

# maintain an error log
logging.basicConfig(filename='error.log', level=logging.ERROR)

# define a route that provide static file
@app.route('/<path:filename>')
def serve_static(filename):
    root_dir = os.path.abspath(os.path.dirname(__file__))
    static_dir = os.path.join(root_dir, 'static')
    return send_file(os.path.join(static_dir, filename))

# initialize state
sugoi_yaer={2020:0,2021:0,2022:0,2023:0}
Novel_title=""
user=None
order_take= 0 # update = 0 , heat = 1
types= {
    "漫畫": 0,
    "動漫": 0,
}
prefers={
    "追蹤":0,
    "點讚":0
}
class_states = {
    "FULL": 0,
    "normal": 0,
    "Fantasy": 0,
    "Dark": 0,
    "Character": 0,
    "Special": 0
}
Publisher_states = {
    "全部": 0,
    "電擊": 0,
    "富士見": 0,
    "角川": 0,
    "GA": 0,
    "集英社": 0
}
word_count_options = {
    "全部":0,
    "<10萬字":0,
    "10萬字~100萬字":0, 
    ">100萬字":0
    }
ranks=[0,0,0,0,0,0,0,0,0,0]

# print state for each category
def print_class():
    for class_name in class_states:
        print(class_states[class_name], end=" ")
    print()

def print_Publisher():
    for Publisher in Publisher_states:
        print(Publisher_states[Publisher], end=" ")
    print()

# define a route that deal with HTTP POST request
@app.route('/get_user', methods=['POST'])
def get_user():
    global user
    db, cursor = get_db()
    cursor.execute('SELECT * FROM User WHERE username=?', (user,))
    # fetch the execute result, each time only one record
    user_data = cursor.fetchone()
    print(user_data)
    # check whether user_data exist (success/error)
    if user_data:
        user_id, username, passwd,gender = user_data
        return jsonify({"status": "success", "user_id": user_id, "User": username, "gender": gender})
    else:
        return jsonify({"status": "error", "message": "User not found"})

# get state from class_states and Publisher_states
@app.route('/class-state', methods=['GET'])
def get_class_states():
    return jsonify(class_states)

@app.route('/Publisher-state', methods=['GET'])
def get_Publisher_states():
    return jsonify(Publisher_states)

# connect to "mydatabase.db"
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect('mydatabase.db')
        g.cursor = g.db.cursor()
    return g.db, g.cursor

# close_db when teardown Flask's application context
@app.teardown_appcontext
def close_db(error):
    if 'db' in g:
        g.db.close()

# deal with login HTTP POST request
@app.route('/login', methods=[ 'POST'])
def login():
    # read user input
    username = request.json.get('username')
    global user
    password = request.json.get('passwd')
    print(username,password)
    
    db, cursor = get_db()
    cursor.execute('SELECT * FROM User WHERE username=? AND password=?', (username, password))
    user = cursor.fetchone()
    if user:
        # login success, redirect to index.html
        user=username
        return jsonify({"status": "success"})
    else:
        # login failed, redirect to user.html and print error message
        return jsonify({"status": "error"})

# deal with class-handler event
# FULL: all class_state should follow class_name with "FULL"
# other: change class_state of class_name
@app.route('/class-handler/<class_name>', methods=['POST'])
def handle_class(class_name):
    print(class_name)
    global class_states
    if class_name == "FULL":
        class_states[class_name] = 1 if class_states[class_name] == 0 else 0
        for class_name in class_states:
            if class_name != "FULL":
                class_states[class_name] = class_states["FULL"]
        print_class()
        return jsonify({"status": "success", "class_name": "ALL", "state": class_states[class_name]})
    elif class_name in class_states:
        if class_states[class_name] == 0:
            class_states[class_name] = 1
        else:
            class_states[class_name] = 0
            class_states["FULL"] = 0
        classes=['normal',"Fantasy","Dark","Character","Special"]
        k = 0
        for i in classes:
            k+=class_states[i]
        if k == 0:
            class_states["FULL"] = 0
        elif k == 5:
            class_states["FULL"] = 1
        print_class()  
        return jsonify({"status": "success", "class_name": class_name, "state": class_states[class_name]})
    else:
        return jsonify({"status": "error", "message": "Class not found"}), 404  # 修正：應該是 Class not found

# Publisher-handler post same dealing method as class-handler
@app.route('/Publisher-handler/<Publisher>', methods=['POST'])
def handle_Publisher(Publisher):
    global Publisher_states
    print(Publisher)
    if Publisher == "全部":
        Publisher_states[Publisher] = 1 if Publisher_states[Publisher] == 0 else 0
        for pub in Publisher_states:
            if pub != "全部":
                Publisher_states[pub] = Publisher_states["全部"]
        print_Publisher() 
        return jsonify({"status": "success", "Publisher": "ALL", "state": Publisher_states[Publisher]})
    elif Publisher in Publisher_states:
        if Publisher_states[Publisher] == 0 :
            Publisher_states[Publisher] = 1 
        else :
            Publisher_states[Publisher] = 0
            Publisher_states["全部"] = 0
        publishers=["電擊","富士見","角川","GA","集英社"]
        k = 0
        for i in publishers:
            k+=Publisher_states[i]
        if k == 0:
            Publisher_states["全部"] = 0
        elif k == 5:
            Publisher_states["全部"] = 1
        print_Publisher() 
        return jsonify({"status": "success", "Publisher": Publisher, "state": Publisher_states[Publisher]})
    else:
        return jsonify({"status": "error", "message": "Publisher not found"}), 404


@app.route('/word-count-handler/<word_count_option>', methods=['POST'])
def handle_word_count(word_count_option):
    global word_count_options
    print(word_count_option)
    print(word_count_option in word_count_options)
    word_count_options2 = ["<10萬字","10萬字~100萬字",">100萬字"]
    if  word_count_option == "全部":
        if word_count_options["全部"] == 0:
            word_count_options["全部"] == 1
        else:
            word_count_options["全部"] == 0
        for i in word_count_options2:
            word_count_options[i] = word_count_options["全部"]
    if word_count_option in word_count_options:
        print(word_count_options[word_count_option])
        if word_count_options[word_count_option] == 0:
            word_count_options[word_count_option] = 1
        else:
            word_count_options[word_count_option] = 0
        k = 0
        for i in word_count_options2:
            k+=word_count_options[i]
        if k == 0:
            word_count_options["全部"]==0
        elif k == 3:
            word_count_options["全部"]==1
    else:
        # call abort when error occur, return error and terminate the request
        abort(400)
    print(word_count_options)
    return jsonify({"status": "success", "word_count_option": word_count_option})
    

@app.route('/orderhandler/<order_word>', methods=['POST'])
def orderhandle(order_word):
    global order_take
    if order_word == "update":
        order_take = 0
        print("order_take",0)
        return jsonify({"status": "success", "order_word": order_word})
    elif order_word == "heat" :
        order_take = 1
        print("order_take",1)
        return jsonify({"status": "success", "order_word": order_word})
    else:
        abort(404)

def counting_sort_by_order(data, order, place):
    count = {key: [] for key in order}
    # categorize the data
    for element in data:
        # determine order
        key = element[place]
        count[key].append(element)
    # merge ordered data
    sorted_data = []
    for key in order:
        sorted_data.extend(count[key])
    return sorted_data

@app.route('/button_search', methods=['POST'])
def button_search():
    global class_states
    global sugoi_yaer
    global Publisher_states
    global order_take
    global word_count_options
    global types
    global ranks
    global prefers
    author = None
    keyword = None
    db, cursor = get_db()
    try:
        # read user input
        author = request.json.get('author')
        keyword = request.json.get('keyword')
        print(author, keyword)
    except KeyError:
        # if author and keyword is null, ignore
        pass
    a1 = ''
    a2 = ''
    a3 = ''
    a4 = ''
    a5 = ''
    a6 = ''
    a7 = ''
    a8 = ''
    where = ""
    # a1 --> class_states
    asum = 0
    classes = ['normal',"Fantasy","Dark","Character","Special"]
    if class_states["FULL"] == 1:
        a1 = ""
    else:
        k = 0
        for i in range(1,len(classes)+1):
            if k == 0 and class_states[classes[i-1]] == 1:
                a1 = "(c"+str(i)+" = 'TRUE'"
                k+=1
            elif class_states[classes[i-1]] == 1:
                a1 = a1+"or c"+str(i)+" = 'TRUE'"
        if a1 != "":
            a1 = a1+")"
            asum+=1
        else:
            a1 = ""
    
    # a2 --> publisher
    if a1!="":
        a2=" AND "
    publishers=["電擊","富士見","角川","GA","集英社"]
    if Publisher_states["全部"]==1:  
        a2=""
    else:
        k=0
        for i in range(1,len(publishers)+1):
            if k==0 and Publisher_states[publishers[i-1]]==1:
                a2=a2+f"(publisher = '{publishers[i-1]}'"
                k+=1
            elif Publisher_states[publishers[i-1]]==1:
                a2=a2+f" or publisher = '{publishers[i-1]}'"
        if k!=0:
            a2=a2+")"
            asum+=1
        else:
            a2=""
    # a3--> word_count_options
    if asum>0 : 
        a3=" and "
    if word_count_options["全部"]==1:  
        a3=""
    else:
        k=0
        a3 +='('
        if word_count_options["<10萬字"]==0:
            pass
        else:
            a3+="(count>0 and count < 100000)"
            k+=1
        if word_count_options["10萬字~100萬字"]==0:
            pass
        else:
            if k !=0:
                a3+=" or "
            a3+="(count>100000 and count < 1000000)"
            k+=1 
        if word_count_options[">100萬字"]==0:
            pass
        else:
            if k !=0:
                a3+=" or "
            a3+="(count>1000000 )"
            k+=1
        if k!=0:
            a3=a3+")"
            asum+=1
        else:
            a3=""
    # a4 --> anime comic 
    if asum>0 : 
        a4=" and ("
    k=0
    if types["動漫"]==1:
        a4+="Novel.title IN (SELECT title FROM Anime)"
        k+=1
    if types["漫畫"]==1:
        if k >0:
            a4+=" or "
        a4+="Novel.title IN (SELECT title FROM Comic)"
        k+=1
    if asum>0:
        a4+=")"
    if k==0:
        a4=" "
    else:
        asum+=1
    # a5 --> sugoi year 
    if asum>0 : 
        a5=" and ("
    k=0
    ranklist=""
    if sum(ranks)==0:
        ranklist="(1,2,3,4,5,6,7,8,9,10)"
    else:
        ranklist = "("
        for i in range(len(ranks)):
            if ranks[i] == 1:
                ranklist += f"{i + 1},"
        ranklist = ranklist.rstrip(',') + ")"
    for i in range(2020,2024):
        if sugoi_yaer[i]==1:
            if k>0:
                a5+=" or "
            a5+=f" Novel.title in (select title from sugoi where year={i} and rank in {ranklist}) "
            k+=1
    if asum>0:
        a5+=")"
    if k==0:
        a5=" "
    else:
        asum+=1
    # a6 --> follow and like
    k=0
    if asum>0 : 
        a6=" and ( "
    if prefers["追蹤"]==0 and prefers["點讚"]==0:
        a6=" "
    else:
        k=0
        cursor.execute('SELECT * FROM User WHERE username=?', (user,))
        User_get=cursor.fetchone()
        User_get_id=str(User_get[0])
        if prefers["追蹤"]==1:
            a6+=f" Novel.title in (select title from Prefer where userid = {User_get_id} and follow = 1 )"
            k+=1
        if prefers["點讚"]==1:
            if k>0:
                a6+=" or "
            a6+=f" Novel.title in (select title from Prefer where userid = {User_get_id} and like = 1 )"
        if asum>0:
            a6+=" ) "
    if k==0:
        a6=" "
    else:
        asum+=1
    
    # a8 -->author keyword
    if asum>0 :
        a8=" and ( "
    if author == "" and keyword == "":
        a8=" "
    else:
        k=0
        if author!="":
            a8+=f" Author.name LIKE '%{author}%' "
            k+=1
        if keyword!="":
            if k>0:
                a8+=" and "
            a8+=f"Novel.title LIKE '%{keyword}%'"
            k+=1
        if asum>0:
            a8+=" ) "
        asum+=1
    if k==0:
        a8=" "
    else:
        asum+=1
        
    # a7 -->order
    if order_take==0:
        a7=" order by Novel.[update] DESC"
    else:
        a7=" order by Novel.heat DESC"
    if asum>0:
        where=" where "
    
    # after determine which information to choose, join all tables and filter with "where"
    search_scheme = "SELECT * FROM Novel JOIN Novel_Create ON Novel.ISBN=Novel_Create.ISBN JOIN Author ON Author.authorid = Novel_Create.authorid JOIN Category ON Novel.title=Category.title"+where+a1+a2+a3+a4+a5+a6+a8+a7
    print(search_scheme)
    cursor.execute('SELECT * FROM User WHERE username=?', (user,))
    User_get = cursor.fetchone()
    User_get_id = User_get[0]
    
    cursor.execute(search_scheme)
    result = cursor.fetchall()
    print(result)
    print(len(result))
    unique_result = []
    for i in result:
        k = 0
        for j in unique_result:
            if i[0] == j[0]:
                k=1
                break
        if k==0:
            unique_result.append(i)
    for i in range(len(unique_result)):
        # unique_result[i][4] is a date-string: "2023-07-01 00:00:00"
        date_time_string = unique_result[i][4]
        cursor.execute('SELECT COUNT(*) FROM Comic WHERE  Comic.title=?',(unique_result[i][0],))
        comic=cursor.fetchone()
        cursor.execute('SELECT COUNT(*) FROM Anime WHERE  Anime.title=?',(unique_result[i][0],))
        anime=cursor.fetchone()
        
        # only restore first item: "2023-07-01"
        date_without_time = date_time_string.split(' ')[0]
        # turn to list-type
        sorted_data_list = list(unique_result[i])
        for k in range (14,19):
            if sorted_data_list[k] == "TRUE":
                sorted_data_list[k] = "checked"
            else:
                sorted_data_list[k] = ""
        
        # assign the modified value to sorted_data_list
        sorted_data_list[4] = date_without_time
        
        # if the novel also has comic or anime, add "checked" label
        if comic[0] == 0:
            sorted_data_list.append("")
        else:
            sorted_data_list.append("checked")
        if anime[0] == 0:
            sorted_data_list.append("")
        else:
            sorted_data_list.append("checked")
        
        # turn back to tuple-type
        unique_result[i] = tuple(sorted_data_list)
    if order_take == 1 :
        unique_result = sorted(unique_result, key=lambda x: x[4], reverse=True)
        sorted_order=['S','A','B','C','D','E']
        unique_result = counting_sort_by_order(unique_result, sorted_order,3)
    else:
        sorted_order=['S','A','B','C','D','E']
        unique_result = counting_sort_by_order(unique_result, sorted_order,3)
        unique_result = sorted(unique_result, key=lambda x: x[4], reverse=True)
    return jsonify({'status': 'success', 'message': '資料處理成功',"data":unique_result})

@app.route('/sugoi_click/<year>', methods=['POST'])
def sugoi_click(year):
    global sugoi_yaer
    print(2023 in sugoi_yaer)
    if sugoi_yaer[int(year)] == 0:
        sugoi_yaer[int(year)] = 1
    else:
        sugoi_yaer[int(year)] = 0
    print(sugoi_yaer)
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/click_rank/<rank>', methods = ['POST'])
def click_rank(rank):
    global ranks
    if ranks[int(rank)-1] == 0:
        ranks[int(rank)-1] = 1
    else:
        ranks[int(rank)-1] = 0
    print(ranks)
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/click_prefer/<prefer>', methods=['POST'])
def click_prefer(prefer):
    global prefers
    if prefers[prefer] == 0:
        prefers[prefer] = 1
    else:
        prefers[prefer] = 0
    print(prefers)
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/follow', methods=['POST'])
def follow():
    global user
    db, cursor = get_db()
    print(user)
    cursor.execute('SELECT * FROM User WHERE username=?', (user,))
    User_get=cursor.fetchone()
    User_get_id=User_get[0]
    cursor.execute('SELECT * FROM Prefer JOIN Novel ON Prefer.title = Novel.title JOIN Novel_Create ON Novel.ISBN = Novel_Create.ISBN JOIN Author ON Author.authorid = Novel_Create.authorid JOIN Category ON Prefer.title=Category.title WHERE userid=?', (User_get_id,))
    result=cursor.fetchall()
    unique_result=[]
    for i in result:
        k=0
        for j in unique_result:
            if i[0]==j[0]:
                k=1
                break
        if k==0:
            unique_result.append(i)
    sorted_data = sorted(unique_result, key=lambda x: x[8])
    for i in range(len(sorted_data)):
        date_time_string = sorted_data[i][8]
        cursor.execute('SELECT COUNT(*) FROM Comic WHERE Comic.title=?',(sorted_data[i][0],))
        comic=cursor.fetchone()
        cursor.execute('SELECT COUNT(*) FROM Anime WHERE Anime.title=?',(sorted_data[i][0],))
        anime=cursor.fetchone()
        date_without_time = date_time_string.split(' ')[0]
        sorted_data_list = list(sorted_data[i])
        for k in range (18,23):
            if sorted_data_list[k]=="TRUE":
                sorted_data_list[k]="checked"
            else:
                sorted_data_list[k]=""
        sorted_data_list[8] = date_without_time
        if comic[0]==0:
            sorted_data_list.append("")
        else:
            sorted_data_list.append("checked")
        if anime[0]==0:
            sorted_data_list.append("")
        else:
            sorted_data_list.append("checked")
        sorted_data[i] = tuple(sorted_data_list)
    return jsonify({'status': 'success', 'message': '資料處理成功', 'data': sorted_data})

@app.route('/like', methods=['POST'])
def like():
    return follow()

@app.route('/handletype/<type>', methods=['POST'])
def handletype(type):
    global types
    if  types[type]==0:
        types[type]=1
    else:
        types[type]=0
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/func1/<novel_title>', methods=['POST'])
def func1(novel_title):
    global Novel_title
    Novel_title=novel_title
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/novel_get', methods=['POST'])
def novel_get():
    global Novel_title
    novel_title=Novel_title
    return jsonify({'status': 'success', 'message': '資料處理成功','data':novel_title})

@app.route('/logout', methods=['POST'])
def logout():
    global user
    user=None
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/init_all', methods=['POST'])
def init_all():
    global class_states
    global sugoi_yaer
    global Publisher_states
    global order_take
    global word_count_options
    global types
    global ranks
    global prefers
    global Novel_title
    sugoi_yaer={2020:0,2021:0,2022:0,2023:0}
    Novel_title=""
    order_take= 0 # update = 0 , heat = 1
    types= {
        "漫畫": 0,
        "動漫": 0,
    }
    prefers={
        "追蹤":0,
        "點讚":0
    }
    class_states = {
        "FULL": 0,
        "normal": 0,
        "Fantasy": 0,
        "Dark": 0,
        "Character": 0,
        "Special": 0
    }
    Publisher_states = {
        "全部": 0,
        "電擊": 0,
        "富士見": 0,
        "角川": 0,
        "GA": 0,
        "集英社": 0
    }
    word_count_options = {
        "全部":0,
        "<10萬字":0,
        "10萬字~100萬字":0, 
        ">100萬字":0
        }
    ranks=[0,0,0,0,0,0,0,0,0,0]
    return jsonify({'status': 'success', 'message': '資料處理成功'})

@app.route('/comment_create/<novel_title>', methods=['POST'])
def comment_create(novel_title):
    global Novel_title
    novel_title=Novel_title
    db, cursor = get_db()
    cursor.execute("select * from Comment join User on User.userid=Comment.userid where Comment.title=?", (novel_title,))
    result = cursor.fetchall()
    print(result)
    return jsonify({'status': 'success', 'message': '資料處理成功', 'data': result})

@app.route('/novel_create', methods=['POST'])
def novel_create():
    global Novel_title
    novel_title=Novel_title
    db, cursor = get_db()
    cursor.execute("SELECT * FROM Novel JOIN Novel_Create ON Novel.ISBN=Novel_Create.ISBN JOIN Author ON Author.authorid = Novel_Create.authorid JOIN Category ON Novel.title=Category.title where Novel.title =?", (novel_title,))
    result = cursor.fetchall()
    for i in range(len(result)):
        date_time_string = result[i][4]
        cursor.execute('SELECT COUNT(*) FROM Comic WHERE  Comic.title=?',(result[i][0],))
        comic=cursor.fetchone()
        cursor.execute('SELECT COUNT(*) FROM Anime WHERE  Anime.title=?',(result[i][0],))
        anime=cursor.fetchone()
        date_without_time = date_time_string.split(' ')[0]
        sorted_data_list = list(result[i])
        for k in range (14,19):
            if sorted_data_list[k]=="TRUE":
                sorted_data_list[k]="checked"
            else:
                sorted_data_list[k]=""
        sorted_data_list[4] = date_without_time
        if comic[0]==0:
            sorted_data_list.append("")
        else:
            sorted_data_list.append("checked")
        if anime[0]==0:
            sorted_data_list.append("")
        else:
            sorted_data_list.append("checked")
        result[i] = tuple(sorted_data_list)
    print(result)
    cursor.execute('SELECT * FROM Sugoi WHERE  Sugoi.title=?',(novel_title,))
    sugoi=cursor.fetchall()
    return jsonify({'status': 'success', 'message': '資料處理成功', 'data': result,'sugoi':sugoi})

# record logging when lauching the program
if __name__ == '__main__':
    logging.warning('program launching ...normal.')
    app.run(port=port, debug=True)