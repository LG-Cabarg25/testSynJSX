import React, { useState } from 'react';

interface ProjectFiltersProps {
  onFilterChange: (filters: { assigned: boolean; created: boolean; status: string }) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    assigned: false,
    created: false,
    status: '',
  });

  // Manejar los cambios en los filtros
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    let filterValue: boolean | string = value;
    if (type === 'checkbox') {
      filterValue = (event.target as HTMLInputElement).checked;
    }

    const newFilters = {
      ...filters,
      [name]: filterValue,
    };

    // Evitar que "assigned" y "created" estén seleccionados al mismo tiempo
    if (name === 'assigned' && filterValue) {
      newFilters.created = false;
    } else if (name === 'created' && filterValue) {
      newFilters.assigned = false;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Función para limpiar los filtros
  const clearFilters = () => {
    const clearedFilters = {
      assigned: false,
      created: false,
      status: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-md flex items-center gap-4">
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">Asignados</label>
        <input
          type="checkbox"
          name="assigned"
          checked={filters.assigned}
          onChange={handleFilterChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">Creados</label>
        <input
          type="checkbox"
          name="created"
          checked={filters.created}
          onChange={handleFilterChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Estatus</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="ml-2 py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Todos</option>
          <option value="Pending">Pendiente</option>
          <option value="In Progress">En Progreso</option>
          <option value="Completed">Completado</option>
        </select>
      </div>
      <button
        onClick={clearFilters}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Limpiar
      </button>
    </div>
  );
};

export default ProjectFilters;
