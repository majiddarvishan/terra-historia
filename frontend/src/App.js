// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { Navbar, Nav, Container, NavDropdown, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';

//==============================================================================
// 1. SETUP & INSTRUCTIONS
//==============================================================================

/*
SETUP:
1. In your project's root (`terra-historia/`), create the React app:
   > npx create-react-app frontend

2. Navigate into the new directory:
   > cd frontend

3. Install dependencies:
   > npm install axios bootstrap react-bootstrap

4. Create a file named `.env` in the `frontend` directory and add:
   REACT_APP_API_URL=http://localhost:8080/api

5. In `public/index.html`, add the Bootstrap CSS link inside the `<head>` tag:
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    xintegrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
    crossorigin="anonymous"
  />

6. Replace the entire content of `src/App.js` with this code.
   You can delete the other files created by `create-react-app` inside `src/`
   (like `App.css`, `logo.svg`, etc.) for a cleaner project.
*/

//==============================================================================
// 2. API SERVICE CONFIGURATION
//==============================================================================
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//==============================================================================
// 3. AUTHENTICATION CONTEXT & HELPERS
//==============================================================================
const AuthContext = createContext(null);

const useAuth = () => {
  return useContext(AuthContext);
};

// This helper function replaces the 'jwt-decode' library
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
}


//==============================================================================
// 4. PAGE & CORE COMPONENTS
//==============================================================================

//--- Navigation Component ---
function Navigation({ setRoute }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setRoute('/login');
  };

  const handleNav = (path) => (e) => {
      e.preventDefault();
      setRoute(path);
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/" onClick={handleNav('/')}>TerraHistoria</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" onClick={handleNav('/')}>Home</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={user.username || 'Profile'} id="basic-nav-dropdown">
                <NavDropdown.Item href="/profile" onClick={handleNav('/profile')}>My Contributions</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="/login" onClick={handleNav('/login')}>Login</Nav.Link>
                <Nav.Link href="/register" onClick={handleNav('/register')}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

//--- HomePage Component ---
function HomePage() {
  return (
    <Container>
      <Row>
        <Col>
          <div className="p-5 mb-4 bg-light rounded-3">
            <Container fluid className="py-5">
              <h1 className="display-5 fw-bold">Welcome to TerraHistoria</h1>
              <p className="col-md-8 fs-4">
                Explore the world's most fascinating natural wonders and historical sites.
                Join our community to share your own discoveries.
              </p>
            </Container>
          </div>
          <h2 className="mb-4">Featured Places</h2>
          <p>Places will be listed here soon. Start by logging in or registering!</p>
        </Col>
      </Row>
    </Container>
  );
}

//--- LoginPage Component ---
function LoginPage({ setRoute }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setRoute('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Need an account? <a href="/register" onClick={(e) => { e.preventDefault(); setRoute('/register'); }}>Register</a>
        </Card.Footer>
      </Card>
    </Container>
  );
}

//--- RegisterPage Component ---
function RegisterPage({ setRoute }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(username, email, password);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => setRoute('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); setRoute('/login'); }}>Log In</a>
        </Card.Footer>
      </Card>
    </Container>
  );
}

//--- ProfilePage Component ---
function ProfilePage() {
    const { user } = useAuth();
    return (
        <Container>
            <Card>
                <Card.Header as="h2">Profile</Card.Header>
                <Card.Body>
                    <p>This is a protected page. Only logged-in users can see this.</p>
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>User ID:</strong> {user?.id}</p>
                </Card.Body>
            </Card>
        </Container>
    );
}


//==============================================================================
// 5. MAIN APP COMPONENT
//==============================================================================
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(window.location.pathname);

  // --- Auth Logic ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
           const storedUser = localStorage.getItem('user');
           if (storedUser) setUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Invalid token data in storage:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response;
  };

  const register = async (username, email, password) => {
    return api.post('/auth/register', { username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // --- Simple Router Logic ---
  const renderPage = () => {
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    // Protected Route Logic
    if (route === '/profile' && !user) {
        return <LoginPage setRoute={setRoute} />;
    }

    switch (route) {
      case '/':
        return <HomePage />;
      case '/login':
        return <LoginPage setRoute={setRoute} />;
      case '/register':
        return <RegisterPage setRoute={setRoute} />;
      case '/profile':
        return <ProfilePage />;
      default:
        return <HomePage />; // Fallback to home page
    }
  };

  const authContextValue = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
        <Navigation setRoute={setRoute} />
        <Container className="mt-4">
            {renderPage()}
        </Container>
    </AuthContext.Provider>
  );
}

export default App;
