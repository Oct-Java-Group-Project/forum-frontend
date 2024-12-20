//main component, set up routing with react-router-dom
//import routes from pages/ and include in Switch component
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './pages/Profile';
import Users from './pages/Users';
import UserRoute from './utils/UserRoute';
import AdminRoute from './utils/AdminRoute';
import ContactUs from './pages/ContactUs';
import Message from './components/Message';
import MessageManagement from './pages/MessageManagement';
import History from './pages/History';

function App() {
  return (
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<UserRoute><Home /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><Profile /></UserRoute>}/>
          <Route path='/users' element={<AdminRoute><Users/></AdminRoute>}/>
          <Route path='/contactus' element={<UserRoute><ContactUs/></UserRoute>}/>
          <Route path='/message' element={<Message/>}/>
          <Route path='/messages' element={<AdminRoute><MessageManagement/></AdminRoute>}/>
          <Route path="/history" element={<UserRoute><History /></UserRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Forum
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
