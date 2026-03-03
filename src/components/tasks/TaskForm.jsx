import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { createTask, updateTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

export default function TaskForm({ onClose, taskToEdit = null }) {
  const user = useAuthStore((state) => state.user);
  const { theme } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Determinar si estamos en modo edición
  const isEditing = !!taskToEdit;

  // Preparar valores por defecto
  const defaultValues = taskToEdit ? {
    title: taskToEdit.title,
    description: taskToEdit.description || '',
    category: taskToEdit.category,
    priority: taskToEdit.priority,
    // Convertir Date a formato YYYY-MM-DD para el input
    dueDate: taskToEdit.dueDate
      ? taskToEdit.dueDate.toISOString().split('T')[0]
      : ''
  } : {
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    dueDate: ''
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const taskData = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    };

    try {
      let result;

      if (isEditing) {
        // Modo edición: actualizar tarea existente
        result = await updateTask(taskToEdit.id, taskData);
        if (result.success) {
          toast.success('Tarea actualizada exitosamente');
        } else {
          throw new Error('Error al actualizar la tarea');
        }
      } else {
        // Modo creación: crear nueva tarea
        result = await createTask(user.uid, taskData);
        if (result.success) {
          toast.success('Tarea creada exitosamente');
        } else {
          throw new Error('Error al crear la tarea');
        }
      }

      onClose();
    } catch (err) {
      console.error(err);
      const message = isEditing ? 'Error al actualizar la tarea' : 'Error al crear la tarea';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`;
  const labelClass = `block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`card ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
      {/* Header del formulario */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
        <button
          onClick={onClose}
          className={`text-2xl leading-none ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          &times;
        </button>
      </div>

      {error && (
        <div className={`${theme === 'dark' ? 'bg-red-700 border-red-700 text-red-50':'bg-red-50  border-red-200  text-red-700'} border px-4 py-3 rounded-lg mb-4`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo: Título */}
        <div>
          <label className={labelClass}>
            Título *
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="Ej: Completar informe mensual"
            {...register('title', {
              required: 'El título es obligatorio',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres'
              }
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Campo: Descripción */}
        <div>
          <label className={labelClass}>
            Descripción
          </label>
          <textarea
            className={inputClass}
            rows="3"
            placeholder="Descripción detallada de la tarea..."
            {...register('description')}
          />
        </div>

        {/* Grid de 3 columnas: Categoría, Prioridad, Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>
              Categoría *
            </label>
            <select
              className={inputClass}
              {...register('category', { required: true })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Prioridad *
            </label>
            <select
              className={inputClass}
              {...register('priority', { required: true })}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              className="input-field"
              {...register('dueDate')}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading
              ? (isEditing ? 'Actualizando...' : 'Guardando...')
              : (isEditing ? 'Actualizar' : 'Crear Tarea')
            }
          </button>
        </div>
      </form>
    </div>
  );
}