import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { tasks, currentFilter, currentCategory } = useTaskStore();

  // Aplicar filtros a las tareas
  const filteredTasks = tasks.filter((task) => {
    // Filtro por estado (completadas/pendientes)
    if (currentFilter === 'completed' && !task.completed) return false;
    if (currentFilter === 'pending' && task.completed) return false;

    // Filtro por categoría
    if (currentCategory !== 'all' && task.category !== currentCategory) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido, {user?.displayName || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-2">
          Tienes {tasks.filter(t => !t.completed).length} tareas pendientes
        </p>
      </div>

      <TaskFilters />

      <TaskList tasks={filteredTasks} />
    </div>
  );
}