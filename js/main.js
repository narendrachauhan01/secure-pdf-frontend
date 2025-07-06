// LOGIN
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login successful!');
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Login failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Server error.');
  }
});

// REGISTER
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful!');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Server error.');
  }
});

// UPLOAD PDF
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('pdfFile').files[0];

  if (!file) {
    return alert('Please select a PDF file.');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert('Upload successful!');
      window.location.href = 'view.html';
    } else {
      alert(data.message || 'Upload failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Server error.');
  }
});

// LOGOUT
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  try {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
});

// VIEW PDF - Optional Auto Load
if (window.location.pathname.endsWith('view.html')) {
  const pdfContainer = document.querySelector('.pdf-container');
  if (pdfContainer) {
    fetch('http://localhost:5000/api/view', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.pdfUrl) {
          pdfContainer.innerHTML = `
            <embed src="${data.pdfUrl}" type="application/pdf" width="100%" height="600px"/>
          `;
        } else {
          pdfContainer.innerHTML = '<p>No PDF available.</p>';
        }
      })
      .catch(err => {
        console.error(err);
        pdfContainer.innerHTML = '<p>Error loading PDF.</p>';
      });
  }
}
