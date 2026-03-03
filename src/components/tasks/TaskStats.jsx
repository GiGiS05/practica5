import { isOverdue } from '../../utils/dateHelpers';
import { useUIStore } from '../../store/uiStore';

export default function TaskStats({ tasks = [] }) {
  const { theme } = useUIStore();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const overdueTasks = tasks.filter((task) => isOverdue(task.dueDate, task.completed)).length;
  
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const cardClass = `rounded-xl shadow-md p-6 mb-8 border transition-colors ${
    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  }`;
  
  const subCardClass = `rounded-lg p-6 mb-6 flex items-center shadow-sm border transition-colors ${
    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
  }`;
  
  const smallCardClass = `rounded-lg p-5 border shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow transition-colors ${
    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  }`;

  const textColorMain = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const textColorSub = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={cardClass}>
      <h2 className={`text-xl font-bold text-center mb-6 ${textColorMain}`}>RESUMEN DE TAREAS</h2>
      
      {/*Total de tareas*/}
      <div className={subCardClass}>
        <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <span className={`text-4xl font-bold block ${textColorMain}`}>{totalTasks}</span>
          <span className={`text-sm font-medium uppercase tracking-wide ${textColorSub}`}>Tareas Totales</span>
        </div>
      </div>

      {/* Tarjetas chiquitas*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tareas pendientes */}
        <div className={smallCardClass}>
          <div className={`p-2 rounded-full mb-2 ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={`text-2xl font-bold ${textColorMain}`}>{pendingTasks}</span>
          <span className={`text-xs uppercase font-semibold ${textColorSub}`}>Pendientes</span>
        </div>

        {/* Tareas vencidas */}
        <div className={smallCardClass}>
          <div className={`p-2 rounded-full mb-2 ${theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className={`text-2xl font-bold ${textColorMain}`}>{overdueTasks}</span>
          <span className={`text-xs uppercase font-semibold ${textColorSub}`}>Vencidas</span>
        </div>

        {/* Tareas completadas */}
        <div className={smallCardClass}>
          <div className={`p-2 rounded-full mb-2 ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-50 text-purple-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={`text-2xl font-bold ${textColorMain}`}>{completedTasks}</span>
          <span className={`text-xs uppercase font-semibold ${textColorSub}`}>Completadas</span>
        </div>
      </div>

      {/* Porcentaje de completitud con barra de progreso :D*/}
      <div className={`rounded-lg p-6 shadow-sm border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex justify-between items-end mb-2">
          <span className={`text-4xl font-bold ${textColorMain}`}>{completionPercentage}%</span>
          <span className={`text-sm font-medium uppercase mb-1 ${textColorSub}`}>Estado de Completitud</span>
        </div>
        <div className={`w-full rounded-full h-4 overflow-hidden ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
          <div 
            className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
