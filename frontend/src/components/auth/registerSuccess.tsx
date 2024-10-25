import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RegisterSuccessProps {
  username: string;
  onClose: () => void;
}

const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ username, onClose }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#042354] bg-opacity-60"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Cuadro centrado */}
      <div className="relative z-10 bg-[#042354] p-8 rounded-lg shadow-xl text-center text-white max-w-xl ">
        <h1 className="mb-6 p-8 text-6xl text-[#3b9c28] font-bold">¡Registro con éxito!</h1>
        <h2 className="mb-6 p-6 text-2xl font-medium">
        El usuario: <br /><strong className="mb-5 text-6xl font-bold">{username}</strong><br /><br />se ha creado correctamente.
        </h2>

        <div className="flex justify-center gap-4">
        <motion.button
            type="submit"
            className=" hover:underline text-white text-2xl font-bold px-6 py-2  "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/login')}
          >Iniciar Sesión</motion.button>
          <motion.button
            type="submit"
            className=" hover:underline text-white text-2xl font-bold px-6 py-2  "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')}
          >Inicio</motion.button>
        
        </div>
        <motion.button
            className="w-[48%] text-white mb-6 py-2 transform transition-transform duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >Cerrar</motion.button>
      </div>
    </motion.div>
  );
};

export default RegisterSuccess;
