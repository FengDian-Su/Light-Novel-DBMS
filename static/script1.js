function func_sumbit(){
    const usernameInput= document.getElementById('username');
    const passwdInput= document.getElementById('passwd');
    const username=usernameInput.value;
    const passwd=passwdInput.value;
    fetch(`http://localhost:8000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "username":username,"passwd":passwd })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = 'http://localhost:8000/index.html';
        } else {
            alert(`Error: passwd or account`);
        }
    })
    .catch(error => console.error('Error:', error));
}