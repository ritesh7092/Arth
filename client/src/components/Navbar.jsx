import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Nayava
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {authToken ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/tasks" className="text-gray-700 hover:text-blue-600">
                  Tasks
                </Link>
                <Link to="/expenses" className="text-gray-700 hover:text-blue-600">
                  Expenses
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {authToken ? (
            <>
              <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Dashboard
              </Link>
              <Link to="/tasks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Tasks
              </Link>
              <Link to="/expenses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Expenses
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Login
              </Link>
              <Link to="/signup" className="block px-4 py-2 bg-green-500 text-white text-center">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;















// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-blue-600">
//             Nayava
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-6">
//             <Link to="/" className="text-gray-700 hover:text-blue-600">
//               Home
//             </Link>
//             <Link to="/tasks" className="text-gray-700 hover:text-blue-600">
//               Tasks
//             </Link>
//             <Link to="/expenses" className="text-gray-700 hover:text-blue-600">
//               Expenses
//             </Link>
//             <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
//               Dashboard
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden text-gray-700 focus:outline-none"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200">
//           <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//             Home
//           </Link>
//           <Link to="/tasks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//             Tasks
//           </Link>
//           <Link to="/expenses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//             Expenses
//           </Link>
//           <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//             Dashboard
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
