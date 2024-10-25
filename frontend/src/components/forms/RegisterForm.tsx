import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AuthRegister from '../../hooks/AuthRegister';
import { useState } from 'react';
import RegisterSuccess from '../auth/registerSuccess';
import { toast } from 'react-toastify';

interface RegisterFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
  terms: boolean;
}

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<RegisterFormData>();
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Contraseña
  const [showRePassword, setShowRePassword] = useState(false); // Confirmar contraseña

  const toggleBothPasswords = () => {
    setShowPassword(!showPassword);
    setShowRePassword(!showRePassword);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.rePassword) {
      toast.error("¡Las contraseñas no coinciden.!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await AuthRegister({
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        setIsRegistered(true);
        setUsername(data.username);
        toast.success('¡Registro exitoso!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch {
      toast.error("Error en el registro, intente nuevamente más tarde", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const closeModal = () => {
    setIsRegistered(false);
    setUsername(null);
    reset();
  };

  return (
    <>
      {isRegistered && username && (
        <RegisterSuccess username={username} onClose={closeModal} />
      )}

      <motion.form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
        {/* Nombre completo */}
        <motion.div className="mb-2" whileHover={{ scale: 1.05 }}>
          <input
            type="text"
            {...register('fullname', { required: true })}
            placeholder="Nombre Completo..."
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-[#042354] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </motion.div>

        {/* Nombre de usuario */}
        <motion.div className="mb-2" whileHover={{ scale: 1.05 }}>
          <input
            type="text"
            {...register('username', { required: true })}
            placeholder="Nombre de usuario..."
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-[#042354] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </motion.div>

        {/* Email */}
        <motion.div className="mb-2" whileHover={{ scale: 1.05 }}>
          <input
            type="email"
            {...register('email', { required: true })}
            placeholder="Correo electrónico..."
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-[#042354] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </motion.div>

        {/* Contraseña */}
        <motion.div className="mb-2 relative" whileHover={{ scale: 1.05 }}>
          <input
            type={showPassword ? "text" : "password"}
            {...register('password', { required: true })}
            placeholder="Contraseña..."
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-[#042354] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg width="20px" height="20px" fill="#042354" viewBox="0 0 576 512"><path d="..."></path></svg>
            ) : (
              <svg width="20px" height="20px" fill="#042354" viewBox="0 0 576 512"><path d="..."></path></svg>
            )}
          </span>
        </motion.div>

        {/* Confirmar Contraseña */}
        <motion.div className="mb-2 relative" whileHover={{ scale: 1.05 }}>
          <input
            type={showRePassword ? "text" : "password"}
            {...register('rePassword', { required: true })}
            placeholder="Repetir contraseña..."
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-[#042354] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowRePassword(!showRePassword)}
          >
            {showRePassword ? (
              <svg width="20px" height="20px" fill="#042354" viewBox="0 0 576 512"><path d="..."></path></svg>
            ) : (
              <svg width="20px" height="20px" fill="#042354" viewBox="0 0 576 512"><path d="..."></path></svg>
            )}
          </span>
        </motion.div>

        {/* Mostrar ambas contraseñas */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            className="text-sm text-[#042354] underline"
            onClick={toggleBothPasswords}
          >
            {showPassword && showRePassword ? "Ocultar Contraseñas" : "Ver Contraseñas"}
          </button>
        </div>

        {/* Términos de uso */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('terms', { required: true })}
              id="terms"
              className="mr-2"
            />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              Términos de uso
            </label>
          </div>
          <a href="/login" className="text-[#042354] hover:text-[#28559c] text-sm ">
          Leer las condiciones de uso
          </a>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-[#042354] hover:bg-[#28559c] text-white font-bold py-2 rounded mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          REGISTRARSE
        </motion.button>
      </motion.form>
    </>
  );
};

export default RegisterForm;
