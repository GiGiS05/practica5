import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import { useUIStore } from './store/uiStore';

function App() {
  const { theme } = useUIStore();
  
  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#333',
          },
        }}
      />
      <AppRouter />
    </>
  );
}
export default App;
