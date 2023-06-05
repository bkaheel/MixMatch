import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Login from './components/Login';
import SpotifyLogin from './components/SpotifyLogin';
import MixMatch from './components/MixMatch';
import { AuthenticationContext } from './context/AuthenticationContext';
import { useContext } from "react";
import Callback from './components/Callback';


function App() {
  // To prevent problems later on, users that are logged in should not be able to access the Login or register pages
  const { currentUser } = useContext(AuthenticationContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  };

  const AltProtectedRoute = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/app" />;
    }

    return children
  };



  return (
    <Router>
    <Routes>
      <Route path="/">
        <Route index element={ <LandingPage /> } />
        <Route path="login" element={ 
          <AltProtectedRoute>
            <Login />
          </AltProtectedRoute>
        } />
        <Route path="register" element={
          <AltProtectedRoute>
            <Register />
          </AltProtectedRoute> 
        } />
        <Route path="spotifylogin" element={ <SpotifyLogin /> } />
        <Route path="app" element={ 
          <ProtectedRoute>
            <MixMatch />
          </ProtectedRoute>
        } />
        <Route path="callback" element={<Callback/>} />
      </ Route>
    </Routes>
  </Router>
  )

}

export default App
