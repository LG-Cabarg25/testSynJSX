import { motion } from 'framer-motion';

const ServicesSection = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10 py-20 bg-white">
      <h2 className="text-4xl font-bold text-[#042354] mb-8">Nuestros Servicios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Card 1: Fondo oscuro con superposición y efecto de hover */}
        <motion.div
          className="relative w-full h-64 overflow-hidden rounded-lg bg-black shadow-lg border border-transparent hover:border-blue-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="src/assets/img/home.png"
            alt="Gestión de Proyectos"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-black bg-opacity-50">
            <h3 className="text-white text-2xl font-bold mb-2">Gestión de Proyectos</h3>
            <p className="text-white text-sm">
              Organiza y gestiona tus proyectos de principio a fin con herramientas intuitivas.
            </p>
          </div>
        </motion.div>

        {/* Card 2: Imagen a la izquierda y texto a la derecha con efecto de hover */}
        <motion.div
          className="flex flex-col md:flex-row w-full bg-white rounded-lg shadow-lg overflow-hidden border border-transparent hover:border-blue-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-full md:w-1/2 h-64">
            <img
              src="src/assets/img/home.png"
              alt="Ejecución de Pruebas"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-between p-6 bg-gray-50 w-full md:w-1/2">
            <h3 className="text-[#042354] text-2xl font-bold">Ejecución de Pruebas</h3>
            <p className="text-gray-700 mb-4">
              Ejecuta pruebas de calidad y controla el flujo de trabajo de manera eficiente.
            </p>
          </div>
        </motion.div>

        {/* Card 3: Fondo oscuro con superposición y efecto de hover */}
        <motion.div
          className="relative w-full h-64 overflow-hidden rounded-lg bg-black shadow-lg border border-transparent hover:border-blue-400 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="src/assets/img/home.png"
            alt="Análisis de Resultados"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-black bg-opacity-50">
            <h3 className="text-white text-2xl font-bold mb-2">Análisis de Resultados</h3>
            <p className="text-white text-sm">
              Genera informes detallados y revisa los resultados para garantizar calidad.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesSection;
