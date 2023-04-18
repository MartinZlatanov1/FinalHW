import './App.css';
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState('');
  const [loginName, setLoginName] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:3000/posts',
      {
        method: 'GET',
        credentials: 'include',
      }
      );
    if (!response.ok) {
      setIsLoggedIn(false);
      setPosts([]);
      return;
    }
    else {
      setIsLoggedIn(true);
    }
    const posts = await response.json();
    setPosts(posts);
  };

  const login = async (name) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: name,
      }),
    });
    setLoginName('');
    if (!response.ok) {
      setIsLoggedIn(false);
      return;
    }
    else {
      setIsLoggedIn(true);
        fetchPosts();
    }
  };
  const logout = async () => {
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      setIsLoggedIn(true);
      return;
    }
    else {
      setIsLoggedIn(false);
      fetchPosts();
    }
  };

  const createPost = async () => {
    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content: content,
      }),
    });
    setContent('');
    if (!response.ok) {
      setIsLoggedIn(false);
      return;
    }
    else {
      setIsLoggedIn(true);
      fetchPosts();
    }
  };

  const register = async () => {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: registerName,
      }),
    });
    if (!response.ok) {
      setIsLoggedIn(false);
      return;
    }
    else {
      setIsLoggedIn(true);
      login(registerName);
      setRegisterName('');
    }
  };

  const likePost = async (id) => {
    const response = await fetch(`http://localhost:3000/posts/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    fetchPosts();

  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className='ms-3'>
          {
            isLoggedIn &&
            <>
              <button type="button" className="btn btn-primary me-2" onClick={() => setShowCreatePost(true)}>Create post</button>
              <Modal show={showCreatePost} onHide={() => setShowCreatePost(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Create post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <input type="text" className="form-control" id="content" onChange={(e) => setContent(e.target.value)} />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button type="button" className="btn btn-primary" onClick={() => { createPost(); setShowCreatePost(false); }}>Create</button>
                </Modal.Footer>
              </Modal>
            </>
          }
          {
            isLoggedIn && <button type="button" className="btn btn-primary" onClick={logout}>Logout</button>
          }
          {
            !isLoggedIn &&
            <>
              <button type="button" className="btn btn-primary me-2" onClick={() => setShowLogin(true)}>Login</button>
              <Modal show={showLogin} onHide={() => setShowLogin(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3">
                    <label htmlFor="loginName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="loginName" onChange={(e) => setLoginName(e.target.value)} />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button type="button" className="btn btn-primary" onClick={() => { login(loginName); setShowLogin(false); }}>Login</button>
                </Modal.Footer>
              </Modal>
            </>

          }
          {
            !isLoggedIn &&
            <>
              <button type="button" className="btn btn-primary" onClick={() => setShowRegister(true)}>Register</button>
              <Modal show={showRegister} onHide={() => setShowRegister(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3">
                    <label htmlFor="registerName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="registerName" onChange={(e) => setRegisterName(e.target.value)} />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button type="button" className="btn btn-primary" onClick={() => { register(); setShowRegister(false); }}>Register</button>
                </Modal.Footer>
              </Modal>
            </>
          }
        </div>
      </nav>
      <div className="main">
        <div className="container ">

              <div className="d-flex flex-column justify-content-center align-items-center">
                <h1 className="mt-3">Posts</h1>
                {
                  posts?.length > 0 ?  
                  posts.map(post => (
                    <div className="card mt-3" key={post.id}>
                      <div className="card-body">
                        <h5 className="card-title">{post.userName}</h5> 
                        <p className="card-text">{post.content}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <button type="button" className="btn btn-primary me-2" onClick={() => likePost(post.id)}>Like</button>
                          <span>{post.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  ))
                  : <div className="mt-3">No posts yet</div>
                }
              </div>
        </div>
      </div>
    </div>
  );
}

export default App;
