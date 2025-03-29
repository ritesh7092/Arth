// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import TodoDashboard from '../pages/TodoDashboard';
import FinanceDashboard from '../pages/FinanceDashboard';
import Footer from '../components/Footer';
import MainLayout from '../components/MainLayout'; // adjust the path as needed
import DetailedReport from '../pages/DetailedReport';
import AddFinance from '../pages/AddFinance';
import EditFinance from '../pages/EditFinancePage';
import AddTodo from '../pages/AddTodo';
import EditTodo from '../pages/EditTodo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    // remove token, call logout API, etc.
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/todo/dashboard"
          element={
            <MainLayout heading="Todo Dashboard">
              <TodoDashboard />
            </MainLayout>
          }
        />
        {/* Example: You can add other routes similarly */}
        
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
          path="/finance/report"
          element={
            <MainLayout heading="Detailed Report">
              <DetailedReport/>
            </MainLayout>
          }
        />
       
      </Routes>
      <Footer />
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
