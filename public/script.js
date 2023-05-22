function login() {
  fetch ('/login', {
    method: 'POST', 
    headers:{'Content-Type': 'application/json'}, 
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.errorMessage) {
      document.getElementById('serverMessage').innerHTML = data.errorMessage
    }
    else {
      document.getElementById('serverMessage').innerHTML = 'You are logged in'
      localStorage.setItem('myToken', data.token)
    }
  })
}
function getProtectedRoute() {
  fetch('/protectedRoute', {method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer${localStorage.getItem('myToken')}`
    },
  })
  .then(res => res.json().then(data => {
    document.getElementById('serverMessage').innerHTML = data.courses
  }))
}

function logout()