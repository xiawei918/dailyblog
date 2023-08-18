import './App.css';
import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Navbar from './components/Navbar';
import ResetPasswordViaEmail from './pages/login/ResetPasswordViaEmail';
import CreatePost from './pages/createpost/createpost';


function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                {!user && <Navigate to="/login"/>}
                {user && <Home/>}
                </>}/>
            <Route 
              path="/login" 
              element={
              <>
                {user && <Navigate to="/"/>}
                {!user && <Login/>}
              </>}/>
            <Route 
              path="/signup" 
              element={
                <>
                  {user && <Navigate to="/"/>}
                  {!user && <Signup/>}
                </>
              }/>
              <Route 
              path="/resetpasswordviaemail" 
              element={
                <>
                  {user && <Navigate to="/"/>}
                  {!user && <ResetPasswordViaEmail/>}
                </>
              }/>
              <Route 
              path="/createpost" 
              element={
                <>
                  {!user && <Navigate to="/"/>}
                  {user && <CreatePost/>}
                </>
              }/>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
