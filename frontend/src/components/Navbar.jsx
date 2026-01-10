/**
 * Navbar Component
 * Top navigation bar with title and Add User button
 * @module components/Navbar
 * @param {Function} onAddUser - Callback function when Add User button is clicked
 */

const Navbar = ({ onAddUser }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-white text-xl sm:text-2xl font-bold">
            User Management System
          </h1>
          <button
            onClick={onAddUser}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Add new user"
          >
            Add User
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

