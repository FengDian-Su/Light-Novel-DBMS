var novel_title=""
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

function comment_create(){
    fetch(`http://localhost:8000/comment_create/${novel_title}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            show_comment(data.data);
        } else {
            // 如果有錯誤，可以在這裡進行處理
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function show_comment(results){
    const comment_block= document.getElementById('comment_block');
    console.log(results);
    comment_block.innerHTML = `<tr>
            <td colspan="2">使用者</td>
            <td colspan="5">評論</td>
            </tr>`; 
        results.forEach(element => {
            const resultElement = document.createElement('tr');
            resultElement.innerHTML=`
            <tr>
                <td>${element[5]}</td>
                <td>${element[4]}</td>
                <td colspan="5">${element[3]}</td>
            </tr>
            `;
            comment_block.appendChild(resultElement);
        });
}
function novel_create(){
    const novel_title_block= document.getElementById('novel_title');
    novel_title_block.innerHTML=`&gt;&gt;&nbsp;&nbsp;&nbsp;${novel_title}`;
    fetch(`http://localhost:8000/novel_create`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log(data.data);
            console.log(data.sugoi);
            // 在這裡添加你想要執行的其他 JavaScript 代碼
            // <tr>
            //     <td>作者</td>
            //     <td>出版社</td>
            //     <td>更新日期</td>
            //     <td>字數</td>
            //     <td>狀態</td>
            //     <td>熱度</td>
            // </tr>
            // <tr>
            //     <td id="作者">望公太</td>
            //     <td id="出版社">角川文庫</td>
            //     <td id="更新日期">2023-12-01</td>
            //     <td id="字數">138586</td>
            //     <td id="狀態">連載中</td>
            //     <td id="熱度">D</td>
            // </tr>
            var block= document.getElementById('作者');
            block.innerText=data.data[0][10];
            block= document.getElementById('出版社');
            block.innerText=data.data[0][7];
            block= document.getElementById('字數');
            block.innerText=data.data[0][2];
            block= document.getElementById('熱度');
            block.innerText=data.data[0][3];
            block= document.getElementById('狀態');
            if (data.data[0][5]==0){
                block.innerText="完結";
            }else{
                block.innerText="連載中";
            }
            // <tr>
            //         <td style="min-width:60px">書籍編號</td>
            //         <td style="width:200px" id="書籍編號">0123456789</td>
            //     </tr>
            //     <tr>
            //         <td style="min-width:60px">分類</td>
            //         <td style="width:200px" id="分類"></td>
            //     </tr>
            //     <tr>
            //         <td style="min-width:60px">相關作品</td>
            //         <td style="width:200px" id="相關作品"></td>
            // <tr>
            block= document.getElementById('書籍編號');
            block.innerText=''
            var k=0
            data.data.forEach(element => {
                if (k==0){
                    block.innerText+=element[1]
                    k+=1
                }else{
                    block.innerText+=`、${element[1]}`
                    k+=1
                }
                
            });
            block= document.getElementById('分類');
            block.innerHTML=`<div style="display:flex;">
                                <input style="width:12px" type="checkbox" ${data.data[0][14]} disabled>
                                <p>日常系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${data.data[0][15]} disabled>
                                <p>幻想系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${data.data[0][16]}  disabled>
                                <p>暗黑系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${data.data[0][17]} disabled>
                                <p>人物系</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${data.data[0][18]} disabled>
                                <p>特殊系</p>
                            </div>`
            block= document.getElementById('相關作品');
            block.innerHTML=`<div style="display:flex;">
                                <input style="width:12px" type="checkbox" ${data.data[0][19]} disabled>
                                <p>動漫</p><p>&nbsp;</p>
                                <input style="width:12px" type="checkbox" ${data.data[0][20]} disabled>
                                <p>漫畫</p>
                            </div>`;
            // <div style="margin:20px 0px 0px 18px;font-size: 14px;"><p>輕小說大賞</p>
            // <table style="border-collapse: collapse;margin-top:10px;">
            //     <td style="min-width:70px">年份&nbsp;/&nbsp;排名</td>
            //     <td style="width:600px" id="輕小說大賞">2020&nbsp;/&nbsp;1</td>
            // </table></div>
            block= document.getElementById('輕小說大賞');
            if (data.sugoi.length >0 && Array.isArray(data.sugoi)){
                block.innerText=' '
                var x=0
                data.sugoi.forEach(element => {
                    if (x>0){
                        block.innerText+=`、${element[1]} / ${element[2]}`
                        x+=1
                    }else{
                        block.innerText+=`${element[1]} / ${element[2]}`
                        x+=1
                    }
                    
                });
            }else{
                block.innerText="N/A";
            }
            
        } else {
            // 如果有錯誤，可以在這裡進行處理
        }
    }
    )
    .catch(error => {
        console.error('Error:', error);
    });
}
function novel_get() {
    return fetch(`http://localhost:8000/novel_get`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // 在這裡添加你想要執行的其他 JavaScript 代碼
                novel_title=data.data;
                return data.data; // 返回所需的數據
            } else {
                // 如果有錯誤，可以在這裡進行處理
                throw new Error(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}
async function func12() {
    try {
        await modifyContent();
        await novel_get();
        comment_create();
        novel_create();
        // 在這裡添加您想要執行的其他 JavaScript 代碼
        // 例如，執行 another 大事
    } catch (error) {
        // 處理錯誤
        console.error(error);
    }
}

window.addEventListener('load', func12);
