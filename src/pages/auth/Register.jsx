import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registerUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { theme } = useUIStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //Hook para manejar el formulario
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    // Llama al servicio de registro
    const result = await registerUser(data.email, data.password, data.name);

    if (result.success) {
      // Guarda usuario en Zustand y redirige a dashboard
      setUser(result.user);
      toast.success('Cuenta creada exitosamente');
      navigate('/dashboard');
    } else {
      setError(result.error);
      toast.error('Error al registrarse: ');
    }

    setLoading(false);
  };

  const inputClass = `input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`;
  const labelClass = `block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`card max-w-md w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Crear Cuenta</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Regístrate para comenzar</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className={`${theme === 'dark' ? 'bg-red-700 border-red-700 text-red-50':'bg-red-50  border-red-200  text-red-700'} border px-4 py-3 rounded-lg mb-4`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo de Nombre Completo */}
          <div>
            <label className={labelClass}>
              Nombre Completo
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Ingresa tu nombre completo"
              {...register('name', {
                required: 'El nombre es obligatorio',
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres'
                }
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
                  message: 'La contraseña debe tener al menos 6 caracteres'
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
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
