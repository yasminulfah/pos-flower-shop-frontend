// src/components/Logout.jsx
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Logout = ({ className = "" }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 1. Panggil API logout di backend
            await api.post('/logout');
        } catch (error) {
            console.error("Logout backend error:", error.response?.data || error.message);
        } finally {
            // 2. Hapus token dan data sesi di frontend
            localStorage.removeItem('token');
            
            // 3. Arahkan kembali ke halaman login
            navigate('/');
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            // 🛠️ ClassName bisa dikustomisasi dari luar
            className={`cursor-pointer ${className}`} 
        >
            Logout
        </button>
    );
};

export default Logout;