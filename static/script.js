var isCollapsibleVisible = false;
function fold() {
    var content = document.querySelector('.folder');
    isCollapsibleVisible = !isCollapsibleVisible;
    content.classList.toggle('active', isCollapsibleVisible);
}
function modifyContent() {
    var userElement = document.getElementById('user');
    var useridElement = document.getElementById('userid');
    var genderElement = document.getElementById('gender');

    if (!userElement || !useridElement || !genderElement) {
        console.error('Error: One or more elements not found.');
        return;
    }

    fetch(`http://localhost:8000/get_user`, {
        method: 'POST'
    }).then(response => {
        // 檢查伺服器回應的 Content-Type 是否為 application/json
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Expected JSON response from server');
        }
        return response.json();
    }).then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            userElement.innerHTML = data.User;
            useridElement.innerHTML = data.user_id;
            genderElement.innerHTML = data.gender;
            console.log(data.User);
            console.log(data.user_id);
            console.log(data.gender);
        } else {
            window.location.href = 'http://localhost:8000/login.html';
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

// 前端 JavaScript 代碼
function handleclassClick(className) {
    fetch(`http://localhost:8000/class-handler/${className}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

// button Publisher
function selectPublisher(Publisher){
    fetch(`http://localhost:8000/Publisher-handler/${Publisher}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}
// 前端 JavaScript 代碼
function handleWordCountClick(wordCount) {
    fetch(`http://localhost:8000/word-count-handler/${wordCount}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function orderhandler(order_word){
    fetch(`http://localhost:8000/orderhandler/${order_word}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function button_search(){
    const authorInput= document.getElementById('authorInput');
    const keywordInput= document.getElementById('keywordInput');
    const author=authorInput.value;
    const keyword=keywordInput.value;
    fetch(`http://localhost:8000/button_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author,keyword }),
    }).then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // 這裡要做大事
            console.log(data.data);
            showbutton_search(data.data);
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}
function showbutton_search(results){
    console.log('Results:', results); // 在這裡加入 log
    console.log(typeof(results))
    const mainBlock = document.getElementById('mainblock');
    mainBlock.innerHTML = ''; // 清空 mainblock 的內容
    if (Array.isArray(results) && results.length > 0) {
        results.forEach(resultItem => {showfollowResults
            const resultElement = document.createElement('div');
            if (resultItem[9] === 1) {
                var text1="連載中"
            }else{
                var text1="完結"
            }
            resultElement.innerHTML = `
            <div class="novel-intro">
                <p class="novel-title"> <a herf="" onclick="func1('${resultItem[0]}')">${resultItem[0]}</a></p>
                <table class="novel-table">
                    <tr>
                        <th>作者</th><th>出版社</th><th>書籍編號</th><th>更新日期</th>
                        <th>狀態</th><th>熱度</th><th>字數</th>
                    </tr>
                    <tr>
                        <td>${resultItem[10]}</td><td>${resultItem[7]}</td><td>${resultItem[1]}</td><td>${resultItem[4]}</td>
                        <td>`+text1+`</td><td>${resultItem[3]}</td><td>${resultItem[2]}</td>
                    </tr>
                    <tr>
                        <th>分類</th>
                        <td colspan="3">
                            <div style="display:flex;margin-left:6px">
                                <input style="width:12px" type="checkbox" ${resultItem[14]} disabled>
                                <p>日常系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${resultItem[15]} disabled>
                                <p>幻想系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${resultItem[16]}  disabled>
                                <p>暗黑系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${resultItem[17]} disabled>
                                <p>人物系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${resultItem[18]} disabled>
                                <p>特殊系</p>
                            </div>
                        </td>
                        <th>相關作品</th>
                        <td colspan="1">
                            <div style="display:flex;">
                                <input style="width:12px" type="checkbox" ${resultItem[19]} disabled>
                                <p>動漫</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${resultItem[20]} disabled>
                                <p>漫畫</p>
                            </div>
                        </td>
                        <td>
                            <button class="novel-prefer">點讚</button>
                            <button class="novel-prefer">追蹤</button>
                        </td>
                    </tr>
                </table>
            </div>
            `;
            mainBlock.appendChild(resultElement);
            
            
        });
    }else{
        mainBlock.innerHTML = '<p>對不起~~我們資料庫太小了!!對不起~~</p>';
    }

}
function sugoi_click(year) { 
    fetch(`http://localhost:8000/sugoi_click/${year}`, {
        method: 'POST'
    }).then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // 在這裡添加你想要執行的其他 JavaScript 代碼
                // 這裡要將回傳的data在mainblock中show出

                // 在這裡添加你想要執行的其他 JavaScript 代碼
                // 這裡要將轉換後的 JSON 字串在 mainblock 中顯示出來

                // showSugoiResults(data.data);
            } else {
                alert(`Error: `);
            }
        })
        .catch(error => console.error('Error:', error));
}

function showSugoiResults(results) {
    console.log('Results:', results); // 在這裡加入 log
    console.log(typeof(results))
    const mainBlock = document.getElementById('mainblock');
    mainBlock.innerHTML = ''; // 清空 mainblock 的內容
    

    if (Array.isArray(results) && results.length > 0) {
        // 迭代結果並添加到 mainblock 中
        results.forEach(resultItem => {
            const resultElement = document.createElement('div');
            if (resultItem[7] === 1) {
                var text1="連載中"
            }else{
                var text1="完結"
            }
            resultElement.innerHTML = `
                 <p>Ranking: ${resultItem[2]}    </p>
                <br>
                <div class="novel-intro">
                <p class="novel-title">${resultItem[0]}</p>
                <table class="novel-table">
                    <tr>
                        <th>作者</th><th>出版社</th><th>書籍編號</th><th>更新日期</th>
                        <th>狀態</th><th>熱度</th><th>字數</th>
                    </tr>
                    <tr>
                        <td>${resultItem[13]}</td><td>${resultItem[10]}</td><td>${resultItem[4]}</td><td>${resultItem[7]}</td>
                        <td>`+text1+`</td><td>${resultItem[6]}</td><td>${resultItem[5]}</td>
                    </tr>
                    <tr>
                        <th>分類</th>
                        <td colspan="3">
                            <div style="display:flex;margin-left:6px">
                                <input style="width:12px" type="checkbox" checked disabled>
                                <p>日常系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" disabled>
                                <p>幻想系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" checked disabled>
                                <p>暗黑系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" disabled>
                                <p>人物系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" checked disabled>
                                <p>特殊系</p>
                            </div>
                        </td>
                        <th>相關作品</th>
                        <td colspan="1">
                            <div style="display:flex;">
                                <input style="width:12px" type="checkbox" checked disabled>
                                <p>動漫</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" checked disabled>
                                <p>漫畫</p>
                            </div>
                        </td>
                        <td>
                            <button class="novel-prefer">點讚</button>
                            <button class="novel-prefer">追蹤</button>
                        </td>
                    </tr>
                </table>
            </div>
               
            `;
            mainBlock.appendChild(resultElement);
        });
    } else {
        // 如果結果為空，顯示提示消息
        mainBlock.innerHTML = '<p>No results found.</p>';
    }
}





function follow(){
    fetch(`http://localhost:8000/follow`, {
        method: 'POST'
    }).then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // 這裡要做another大事
            showfollowResults(data.data,3);
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function showfollowResults(results,asd) {
    console.log('Results:', results); // 在這裡加入 log
    console.log(typeof(results))
    const mainBlock = document.getElementById('mainblock');
    mainBlock.innerHTML = ''; // 清空 mainblock 的內容

    if (Array.isArray(results) && results.length > 0) {
        // 迭代結果並添加到 mainblock 中
        results.forEach(resultItem => {showfollowResults
            const resultElement = document.createElement('div');
            if (resultItem[9] === 1) {
                var text1="連載中"
            }else{
                var text1="完結"
            }
            if (resultItem[asd]===1){
                resultElement.innerHTML = `
                <div class="novel-intro">
                    <p class="novel-title"> <a herf="" onclick="func1('${resultItem[0]}')">${resultItem[0]}</a></p>
                    <table class="novel-table">
                        <tr>
                            <th>作者</th><th>出版社</th><th>書籍編號</th><th>更新日期</th>
                            <th>狀態</th><th>熱度</th><th>字數</th>
                        </tr>
                        <tr>
                            <td>${resultItem[14]}</td><td>${resultItem[11]}</td><td>${resultItem[5]}</td><td>${resultItem[8]}</td>
                            <td>`+text1+`</td><td>${resultItem[7]}</td><td>${resultItem[6]}</td>
                        </tr>
                        <tr>
                            <th>分類</th>
                            <td colspan="3">
                                <div style="display:flex;margin-left:6px">
                                    <input style="width:12px" type="checkbox" ${resultItem[18]} disabled>
                                    <p>日常系</p><p>&nbsp;</p>
                                    <input style="width:12px" type="checkbox" ${resultItem[19]} disabled>
                                    <p>幻想系</p><p>&nbsp;</p>
                                    <input style="width:12px" type="checkbox" ${resultItem[20]}  disabled>
                                    <p>暗黑系</p><p>&nbsp;</p>
                                    <input style="width:12px" type="checkbox" ${resultItem[21]} disabled>
                                    <p>人物系</p><p>&nbsp;</p>
                                    <input style="width:12px" type="checkbox" ${resultItem[22]} disabled>
                                    <p>特殊系</p>
                                </div>
                            </td>
                            <th>相關作品</th>
                            <td colspan="1">
                                <div style="display:flex;">
                                    <input style="width:12px" type="checkbox" ${resultItem[24]} disabled>
                                    <p>動漫</p><p>&nbsp;</p>
                                    <input style="width:12px" type="checkbox" ${resultItem[23]} disabled>
                                    <p>漫畫</p>
                                </div>
                            </td>
                            <td>
                                <button class="novel-prefer">點讚</button>
                                <button class="novel-prefer">追蹤</button>
                            </td>
                        </tr>
                    </table>
                </div>
                `;
                mainBlock.appendChild(resultElement);
            }else{

            }
            
        });
    } else {
        // 如果結果為空，顯示提示消息
        mainBlock.innerHTML = '<p>No results found.</p>';
    }
}
function click_rank(rank){
    fetch(`http://localhost:8000/click_rank/${rank}`, {
        method: 'POST'
    }).then(response => response.json())
    .then(data=>{
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // 這裡要做another大事
        } else {
            alert(`Error: ${data.message}`);
        }
    }
    )
    .catch()
}
function func1(novel_title){
    console.log(novel_title);
    fetch(`http://localhost:8000/func1/${novel_title}`, {
        method: 'POST'
    }).then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // 這裡要做another大事
            window.location.href = "http://localhost:8000/novel.html"; // 正確的設定方式是使用 '=' 而非 '()'
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}
function handletype (type){
    fetch(`http://localhost:8000/handletype/${type}`, {
        method: 'POST'
    }).then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // 這裡要做another大事
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}
function like(){
    fetch(`http://localhost:8000/like`, {
        method: 'POST'
    }).then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // 這裡要做another大事
            showfollowResults(data.data,2);
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function click_prefer(prefer){
    fetch(`http://localhost:8000/click_prefer/${prefer}`, {
        method: 'POST'
    }).then(response => response.json())
    .then(
        data => {
            if (data.status === 'success') {
                // 在這裡添加你想要執行的其他 JavaScript 代碼
                // 這裡要做another大事
            } else {
                alert(`Error: ${logout}`);
            }
        }
    )
    .catch(error => console.error('Error:', error));
}

function logout(){
    fetch(`http://localhost:8000/logout`, {
        method: 'POST'
    }).then(response => response.json())
    .then(
        data => {
            if (data.status === 'success') {
                // 在這裡添加你想要執行的其他 JavaScript 代碼
                // 這裡要做another大事
                window.location.href = 'http://localhost:8000/login.html';
            } else {
                alert(`Error: ${logout}`);
            }
        }
    )
    .catch(error => console.error('Error:', error));
}



var prefer_state = [0,0];
var prefer_list = [0,0];
var category_state = [0,0,0,0,0,0];
var publisher_state = [0,0,0,0,0,0];
var count_state = [0,0,0,0,0];
var comic_state = [0,0];
var sugoi_state = [0,0,0,0];
var sort_state = [0,0];
var rank_state = [0,0,0,0,0,0,0,0,0,0];


function p_light(index){
    var button = document.getElementsByClassName('btn-1')[index];
    prefer_list[index]=(prefer_list[index] === 0)?1:0;
    if (prefer_list[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
        var i2 = (index === 0)?1:0;
        var b = document.getElementsByClassName('btn-1')[i2];
        if (prefer_list[i2] === 1){
            prefer_list[i2] = 0;
            b.classList.remove('unclick');
            b.classList.add('click');
        }
    } else if (prefer_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
    }
}
function c_light(index){
    var button = document.getElementsByClassName('btn-2')[index];
    category_state[index]=(category_state[index] === 0)?1:0;
    if (category_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
        if (index === 0){
            for(var i = 1; i < 6; i++){
                var b = document.getElementsByClassName('btn-2')[i];
                category_state[i]=1;
                b.classList.remove('click');
                b.classList.add('unclick');
            }
        }else{
            var zero_flag = 1;
            for(var i = 1; i < 6; i++)
                if (category_state[i] === 0)
                    zero_flag = 0;
            if (zero_flag === 1){
                var b = document.getElementsByClassName('btn-2')[0];
                category_state[0]=1;
                b.classList.remove('click');
                b.classList.add('unclick');
            }
        }
    } else if (category_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
        if (index === 0){
            for(var i = 1; i < 6; i++){
                var b = document.getElementsByClassName('btn-2')[i];
                category_state[i]=0;
                b.classList.remove('unclick');
                b.classList.add('click');
            }
        }else{
            var b = document.getElementsByClassName('btn-2')[0];
            category_state[0]=0;
            b.classList.remove('unclick');
            b.classList.add('click');
        }
    }
}
function p2_light(index){
    var button = document.getElementsByClassName('btn-3')[index];
    publisher_state[index]=(publisher_state[index] === 0)?1:0;
    if (publisher_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
        if (index === 0){
            for(var i = 1; i < 6; i++){
                var b = document.getElementsByClassName('btn-3')[i];
                publisher_state[i]=1;
                b.classList.remove('click');
                b.classList.add('unclick');
            }
        }else{
            var zero_flag = 1;
            for(var i = 1; i < 6; i++)
                if (publisher_state[i] === 0)
                    zero_flag = 0;
            if (zero_flag === 1){
                var b = document.getElementsByClassName('btn-3')[0];
                publisher_state[0]=1;
                b.classList.remove('click');
                b.classList.add('unclick');
            }
        }
    } else if (publisher_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
        if (index === 0){
            for(var i = 1; i < 6; i++){
                var b = document.getElementsByClassName('btn-3')[i];
                publisher_state[i]=0;
                b.classList.remove('unclick');
                b.classList.add('click');
            }
        }else{
            var b = document.getElementsByClassName('btn-3')[0];
            publisher_state[0]=0;
            b.classList.remove('unclick');
            b.classList.add('click');
        }
    }
}
function c2_light(index){
    var button = document.getElementsByClassName('btn-4')[index];
    count_state[index]=(count_state[index] === 0)?1:0;
    if (count_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
        if (index === 0){
            for(var i = 1; i < 4; i++){
                var b = document.getElementsByClassName('btn-4')[i];
                count_state[i]=1;
                b.classList.remove('click');
                b.classList.add('unclick');
            }
        }else{
            var zero_flag = 1;
            for(var i = 1; i < 4; i++)
                if (count_state[i] === 0)
                    zero_flag = 0;
            if (zero_flag === 1){
                var b = document.getElementsByClassName('btn-4')[0];
                count_state[0]=1;
                b.classList.remove('click');
                b.classList.add('unclick');
            }
        }
    } else if (count_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
        if (index === 0){
            for(var i = 1; i < 4; i++){
                var b = document.getElementsByClassName('btn-4')[i];
                count_state[i]=0;
                b.classList.remove('unclick');
                b.classList.add('click');
            }
        }else{
            var b = document.getElementsByClassName('btn-4')[0];
            count_state[0]=0;
            b.classList.remove('unclick');
            b.classList.add('click');
        }
    }
}
function c3_light(index){
    var button = document.getElementsByClassName('btn-5')[index];
    comic_state[index]=(comic_state[index] === 0)?1:0;
    if (comic_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
    } else if (comic_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
    }
}
function s_light(index){
    var button = document.getElementsByClassName('btn-6')[index];
    sugoi_state[index]=(sugoi_state[index] === 0)?1:0;
    if (sugoi_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
    } else if (sugoi_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
    }
}
function s2_light(index){
    var button = document.getElementsByClassName('btn-7')[index];
    sort_state[index]=(sort_state[index] === 0)?1:0;
    if (sort_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
        var i2 = (index === 0)?1:0;
        var b = document.getElementsByClassName('btn-7')[i2];
        if (sort_state[i2] === 1){
            sort_state[i2] = 0;
            b.classList.remove('unclick');
            b.classList.add('click');
        }
    } else if (sort_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
    }
}
function r_light(index){
    var button = document.getElementsByClassName('btn-8')[index];
    rank_state[index]=(rank_state[index] === 0)?1:0;
    if (rank_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
    } else if (rank_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
    }
}
function p3_light(index){
    var button = document.getElementsByClassName('btn-9')[index];
    prefer_state[index]=(prefer_state[index] === 0)?1:0;
    if (prefer_state[index] === 1) {
        button.classList.remove('click');
        button.classList.add('unclick');
    } else if (prefer_state[index] === 0){
        button.classList.remove('unclick');
        button.classList.add('click');
    }
}
function init_all()
{
    fetch(`http://localhost:8000/init_all`, {
        method: 'POST'
    }).then(response => response.json())
    .then(
        data => {
            if (data.status === 'success') {
                
            } else {
                alert(`Error: init`);
            }
        }
    )
    .catch(error => console.error('Error:', error));
}
async function func12() {
    try {
        modifyContent();
        init_all();
        // 在這裡添加您想要執行的其他 JavaScript 代碼
        // 例如，執行 another 大事
    } catch (error) {
        // 處理錯誤
        console.error(error);
    }
}

window.addEventListener('load', func12);