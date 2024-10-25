import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthLogin from '../../hooks/AuthLogin'; // Asegúrate de que AuthLogin devuelve un token
import { useAuth } from '../../hooks/auth/useAuth';
import { toast } from 'react-toastify';
import { useState } from 'react'; // Para manejar el estado de visibilidad de la contraseña

interface LoginFormData {
  username: string;
  password: string;
}

const FormLogin: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const { login } = useAuth(); // Usa el método login del contexto
  const navigate = useNavigate();

  // Estado para manejar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false); 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await AuthLogin(data);
      //Validación y decodificación de token.
      if (result.success && result.token) {  
        login(result.token); 
        toast.success(`¡Bienvenido!`, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/dashboard');
      } else {
        toast.error('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error. Por favor, intenta de nuevo.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <motion.form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-[#042354]">
          Nombre de Usuario:
        </label>
        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <input
            type="text"
            {...register('username', { required: true })}
            placeholder="Introduzca su nombre de usuario"
            autoComplete="off"
            className="w-full mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md text-[#042354] focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          />
        </motion.div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#042354]">
          Contraseña:
        </label>
        <motion.div className="mb-4 relative" whileHover={{ scale: 1.05 }}>
          <input
            type={showPassword ? 'text' : 'password'} 
            {...register('password', { required: true })}
            placeholder="Introduzca su contraseña"
            autoComplete="off"
            className="w-full mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md text-[#042354] focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          />
         
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <img src="src/assets/icon/visible_ui_icon.svg" width="25px" alt="visible" />
            ) : (
              <img src="src/assets/icon/eye_slash_icon.svg" width="25px" alt="hidden" />
            )}
          </span>
        </motion.div>

      </div>
      <div className="flex items-center justify-between mb-6">
          <a href="/login" className="text-[#042354] hover:text-[#28559c] text-sm ">
          ¿Olvidaste tu contraseña?
          </a>
        </div>

      <motion.button
        type="submit"
        className="w-full bg-[#042354] hover:bg-[#28559c] text-white font-bold py-2 rounded mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Ingresar
      </motion.button>
    </motion.form>
  );
};

export default FormLogin;
