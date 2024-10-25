// OptionsOfTester.tsx
import React from 'react';
import ButtonViewDetails from '../buttons/ButtonViewDetails';
import { canExecuteTests, canViewDetails } from '../../utils/roleValidations';
import ButtonExecutePlan from '../buttons/ButtonExecutePlan';

interface OptionsOfTesterProps {
  userRole: string;
}

const OptionsOfTester: React.FC<OptionsOfTesterProps> = ({ userRole }) => {
  return (
    <div className="flex space-x-3">
      {canViewDetails(userRole) && <ButtonViewDetails userRole={userRole} onClick={() => console.log('Ver detalles')} />}
      {canExecuteTests(userRole) && <ButtonExecutePlan userRole={userRole} onClick={() => console.log('first')} />}
    </div>
  );
};

export default OptionsOfTester;