import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import api from '../api/axios';

const Logout = ({ className = "", showText = true }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (!window.confirm("Are you sure you want to sign out?")) return;
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Logout backend error:", error.response?.data || error.message);
        } finally {
            // Hapus token dan data sesi di frontend
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            className={`flex items-center gap-2 cursor-pointer ${className}`} 
        >
            <FiLogOut size={18} />
            {showText && "Logout"}
        </button>
    );
};

export default Logout;