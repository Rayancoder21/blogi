import './App.css';
import Header from './Header';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Routes, Route, Navigate} from 'react-router-dom';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import LandingPage from './pages/LandingPage';
import { UserContextProvider} from './UserContext';
import { UserContext } from './UserContext';
import { useContext } from 'react';



function App() {
  return (
    <UserContextProvider>
      <Header />
        <Routes>
              <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/post" element={<ProtectedRoute><IndexPage /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        </Routes>
    </UserContextProvider>
  );
}

function ProtectedRoute({ children }) {
  const { userInfo } = useContext(UserContext);
  return userInfo ? children : <Navigate to="/" />;
}
export default App;
