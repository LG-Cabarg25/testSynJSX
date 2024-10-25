import { motion } from 'framer-motion';
import RegisterForm from '../../components/forms/RegisterForm';


function RegisterPage() {
  return (
    <motion.div
      className="h-screen flex flex-col p-8 relative items-center justify-center bg-white px-10"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white border border-gray-200 shadow-lg rounded-lg p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <a href="/" className="block mb-6 text-[#042354] text-sm">
          &larr; Volver al inicio
        </a>
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-4">
            <img src="src/assets/icon/color-logo.svg" width="150px" alt="logo" />
          </div>
          <h1 className="text-3xl font-bold text-[#042354] mb-2 text-center">
            Registro de Usuario
          </h1>
          <p className="text-gray-600 mb-6 text-center">
          Únete a nosotros y gestiona tus proyectos con eficacia.
          </p>

          {/* Formulario de Registro */}
          <RegisterForm />

          <p className="mt-6 text-gray-600 text-sm text-center">
          ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-[#042354] hover:text-[#28559c] text-sm ">
              <b>Iniciar Sesión aquí</b>
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RegisterPage;
