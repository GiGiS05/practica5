import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useUIStore } from '../../store/uiStore';

export default function Layout() {
    const { theme } = useUIStore();
    
    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <main>
                {/* Outlet: aquí se renderizan las rutas hijas (Dashboard, TaskDetails, etc.)
                */}
                <Outlet />
            </main>
        </div>
    );
}
