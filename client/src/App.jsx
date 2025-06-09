// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import TodoDashboard from '../pages/TodoDashboard';
import FinanceDashboard from '../pages/FinanceDashboard';
import Footer from '../components/Footer';
import MainLayout from '../components/MainLayout'; // adjust the path as needed
import DetailedReport from '../pages/Transactions';
import AddFinance from '../pages/AddFinance';
import EditFinance from '../pages/EditFinancePage';
import AddTodo from '../pages/AddTodo';
import EditTodo from '../pages/EditTodo';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import UserProfilePage from '../pages/Dashboard';
import EditUserProfilePage from '../pages/EditProfilePage';
import AboutPage from '../pages/About';
import Chatbot from '../pages/Chatbot';
import Dashboard from '../pages/Dashboard';
import { ThemeProvider } from '../src/theme/ThemeProvider'; // adjust the path as needed
import Transactions from '../pages/Transactions';
// import { Toaster } from 'react-hot-toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    // remove token, call logout API, etc.
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<LoginPage />}/>
        <Route 
        path='/signup'
        element={
            <SignupPage/>
        }
        />
        <Route
          path="/todo/dashboard"
          element={
            <MainLayout heading="Todo Dashboard">
              <TodoDashboard />
            </MainLayout>
          }
        />
        <Route
          path='/about'
          element={
            <MainLayout heading="">
             <AboutPage/>
            </MainLayout>
          }
        />
        <Route
          path='/dashboard'
          element={
            <Dashboard/>
          }
        />
        {/* <Route
          path='/profile'
          element={
            // <MainLayout heading="Your Profile">
            //   <UserProfilePage/>
            // </MainLayout>
             <UserProfilePage/>
          }
        /> */}
        <Route
          path='/chatbot'
          element={
            <MainLayout heading="Your Personal AI Assistant">
              <Chatbot/>
            </MainLayout>
          }
        />
        <Route
          path='/edit-profile'
          element={
            <MainLayout heading="Update Your Profile">
              <EditUserProfilePage/>
            </MainLayout>
          }
        />

        <Route
          path="/finance/dashboard"
          element={
            <MainLayout heading="Finance Dashboard">
              <FinanceDashboard />
            </MainLayout>
          }
        />
        
        <Route
          path="/finance/add"
          element={
            <MainLayout heading="Add Finance">
              <AddFinance/>
            </MainLayout>
          }
        />

        <Route
          path="/addtask"
          element={
            <MainLayout heading="Add Todo">
              <AddTodo/>
            </MainLayout>
          }
        />

         {/* Dynamic route for editing a finance record */}
         <Route
          path="/finance/edit/:id"
          element={
            <MainLayout heading="Edit Finance">
              <EditFinance/>
            </MainLayout>
          }
        />
         <Route
          path="/finance/view/:id"
          element={
            <MainLayout heading="View Transaction Details">
              <EditFinance/>
            </MainLayout>
          }
        />

         {/* Dynamic route for editing a finance record */}
         <Route
          path="/todo/edit/:id"
          element={
            <MainLayout heading="Edit TODO">
              <EditTodo/>
            </MainLayout>
          }
        />
         <Route
          path="/todo/view/:id"
          element={
            <MainLayout heading="View TODO">
              <EditTodo/>
            </MainLayout>
          }
        />

        <Route
          path="/finance/report"
          element={
            <MainLayout heading="Transaction Analytics">
              <Transactions/>
            </MainLayout>
          }
        />
       
      </Routes>
      <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;




















// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import TodoDashboard from '../pages/TodoDashboard';
// import Footer from '../components/Footer';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogout = () => {
//     // remove token, call logout API, etc.
//     setIsAuthenticated(false);
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home />
//           }
//         />
//         <Route path="/todo/dashboard" element={<TodoDashboard />} />
//         {/* <Route path="/finance/dashboard" element={<FinanceDashboard />} />
//         <Route path="/profile" element={<Profile />} /> */}

//         {/* <Route
//           path="/"
//           element={
//             <Home isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
//           }
//         /> */}
//         {/* <Route path="/todo/dashboard" element={<TodoDashboard />} />
//         <Route path="/finance/dashboard" element={<FinanceDashboard />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route
//           path="/login"
//           element={<Login onLogin={() => setIsAuthenticated(true)} />}
//         />
//         <Route path="/register" element={<Register />} /> */}
//       </Routes>
//       <Footer/>
//     </BrowserRouter>
//   );
// }

// export default App;
