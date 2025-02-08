import { useAuth } from '../context/AuthContext';

export const SomeComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <button 
          onClick={() => logout()}
          className="px-4 py-2 bg-red-500 text-white rounded"
          aria-label="Logout"
        >
          Logout
        </button>
      ) : (
        <button 
          onClick={() => login('email@example.com', 'password')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          aria-label="Login"
        >
          Login
        </button>
      )}
    </div>
  );
}; 