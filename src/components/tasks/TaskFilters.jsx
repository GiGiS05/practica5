import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { FILTERS, CATEGORIES } from '../../utils/constants';

export default function TaskFilters() {
  const { theme } = useUIStore();
  const { 
    currentFilter, 
    currentCategory, 
    searchQuery, 
    setFilter, 
    setCategory, 
    setSearchQuery 
  } = useTaskStore();

  const inputClass = `input-field pl-10 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`;
  const selectClass = `input-field ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`;
  const labelClass = `block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`card mb-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <label className={labelClass}>
          Buscar tarea
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            className={inputClass}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-400 absolute left-3 top-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por estado */}
        <div>
          <label className={labelClass}>
            Filtrar por estado
          </label>
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className={labelClass}>
            Filtrar por categoría
          </label>
          <select
            value={currentCategory}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}