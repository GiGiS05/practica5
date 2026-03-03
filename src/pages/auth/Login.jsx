import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { theme } = useUIStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // React Hook Form para manejar el formulario
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    // Llamar al servicio de autenticación
    const result = await loginUser(data.email, data.password);

    if (result.success) {
      // Guardar usuario en Zustand y redirigir
      setUser(result.user);
      toast.success('Bienvenido ' + (result.user.displayName || ''));
      navigate('/dashboard');
    } else {
      setError(result.error);
      toast.error('Error al iniciar sesión: ');
    }

    setLoading(false);
  };

  const inputClass = `input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`;
  const labelClass = `block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`card max-w-md w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Task Manager Pro</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Inicia sesión para continuar</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className={`${theme === 'dark' ? 'bg-red-700 border-red-700 text-red-50':'bg-red-50  border-red-200  text-red-700'} border px-4 py-3 rounded-lg mb-4`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo de email */}
          <div>
            <label className={labelClass}>
              Correo electrónico
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="tu@email.com"
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo inválido'
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div>
            <label className={labelClass}>
              Contraseña
            </label>
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'Mínimo 6 caracteres'
                }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}