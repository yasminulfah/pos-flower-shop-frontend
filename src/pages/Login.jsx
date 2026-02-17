import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true); 
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await api.post('/login', { email, password });
        
        login(response.data.access_token, response.data.user);

        const role = response.data.user?.role;
        console.log("Logged in role:", role);

        if (['admin', 'owner'].includes(role)) {
          navigate('/admin/dashboard');
        } else if (role === 'cashier') {
          navigate('/admin/pos');
        } else {
          navigate('/catalog');
        }

      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          return;
        }
        
        await api.post('/register', { 
            name, 
            email, 
            password, 
            password_confirmation: confirmPassword 
        });
        
        setSuccess('Registration successful! Please login.');
        setIsLogin(true); 
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error("Login error details:", err.response?.data || err);
      setError(err.response?.data?.message || 'Authentication failed!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">
          {isLogin ? 'Login to ' : 'Register to '}
          <span className="text-pink-600">Uma Bloemist</span>
        </h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Your Full Name"
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition duration-200"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;