import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import { useUIStore } from '../../store/uiStore';

export default function TaskCard({ task }) {
  const { theme } = useUIStore();
  const category = CATEGORIES.find(c => c.id === task.category) || CATEGORIES.find(c => c.id === 'other');
  const isTaskOverdue = isOverdue(task.dueDate, task.completed);

  const handleToggleComplete = async (e) => {
    e.preventDefault(); // Evitar que el Link navegue
    try {
      await updateTask(task.id, { completed: !task.completed });
      toast.success(task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada');
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      toast.error('Error al actualizar el estado de la tarea');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(task.id);
        toast.success('Tarea eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  return (
    <Link 
      to={`/tasks/${task.id}`} 
      className={`block transition-all hover:scale-[1.01] duration-200 outline-none focus:ring-2 focus:ring-blue-500 rounded-lg`}
    >
      <div className={`card hover:shadow-lg transition-shadow border-l-4 
        ${task.completed ? `opacity-60 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}` : `${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`} 
        ${isTaskOverdue ? 'border-red-500' : `border-${category?.color || 'gray'}-500`}
      `}>
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            {/* Header: Categoría y Título */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-${category?.color}-100 text-${category?.color}-800`}>
                {category?.label}
              </span>
              {isTaskOverdue && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  Vencida
                </span>
              )}
            </div>
            
            <h3 className={`text-lg font-bold mb-1 truncate ${task.completed ? 'line-through text-gray-500' : `${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}`}>
              {task.title}
            </h3>

            {/* Descripción */}
            {task.description && (
              <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            {/* Fecha */}
            <div className={`flex items-center text-sm font-medium ${isTaskOverdue ? 'text-red-600' : 'text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {getDueDateLabel(task.dueDate) || 'Sin fecha'}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={handleToggleComplete}
              className={`p-2 rounded-full transition-colors duration-200 ${
                task.completed 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : `${theme === 'dark' ? 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-green-300' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-500'}`
              }`}
              title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            >
              {task.completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
              title="Eliminar tarea"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}