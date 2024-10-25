import React, { createContext, useState, useContext, ReactNode } from 'react';
import { registerTestPlan, updateTestPlan } from '../services/planService';
import { AuthContext } from './AuthContext';
import SuccessAlert from '../components/shared/alerts/SuccessAlert';
import ErrorAlert from '../components/shared/alerts/ErrorAlert';

// Definir la interfaz para el contexto
interface PlannContextProps {
  plans: any[];
  addPlan: (formData: FormData) => Promise<void>;
  updatePlan: (testPlanId: number, formData: FormData) => Promise<void>;
  loading: boolean;
}

const PlannContext = createContext<PlannContextProps | undefined>(undefined);

// Proveedor del contexto
export const PlannProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext) || {};

  // Función para registrar un nuevo plan de prueba
  const addPlan = async (formData: FormData) => {
    if (!token) {
      ErrorAlert({ message: 'Token no disponible, no se puede realizar la operación.' });
      return;
    }

    setLoading(true);
    try {
      const newPlan = await registerTestPlan(formData, token);
      setPlans([...plans, newPlan]); // Añadir el nuevo plan al estado
      SuccessAlert({ message: 'Plan de prueba registrado exitosamente' });
    } catch (error) {
      ErrorAlert({ message: 'Error al registrar el plan de prueba' });
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un plan de prueba existente
  const updatePlan = async (testPlanId: number, formData: FormData) => {
    if (!token) {
      ErrorAlert({ message: 'Token no disponible, no se puede realizar la operación.' });
      return;
    }

    setLoading(true);
    try {
      const updatedPlan = await updateTestPlan(testPlanId, formData, token);
      setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.test_plan_id === testPlanId ? updatedPlan : plan))
      );
      SuccessAlert({ message: 'Plan de prueba actualizado exitosamente' });
    } catch (error) {
      ErrorAlert({ message: 'Error al actualizar el plan de prueba' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlannContext.Provider value={{ plans, addPlan, updatePlan, loading }}>
      {children}
    </PlannContext.Provider>
  );
};

// Hook personalizado para utilizar el contexto de planes
export const usePlannContext = () => {
  const context = useContext(PlannContext);
  if (!context) {
    throw new Error('usePlannContext debe usarse dentro de un PlannProvider');
  }
  return context;
};
