import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from '../../components/layout/footer';
import IntroSection from '../../components/sections/IntroSection';
import ServicesSection from '../../components/sections/ServicesSection';
import ContactSection from '../../components/sections/ContactSection';

function HomePage() {
  const { scrollYProgress } = useScroll();

  // Efecto para el indicador de progreso
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="min-h-screen bg-white shadow-lg transition-all duration-500"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      {/* Barra de Progreso Horizontal */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
        style={{ scaleX }} // Vinculamos la escala X con el progreso del scroll
      />

      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center py-4 px-10 bg-white shadow-sm z-10">
        <div className="flex items-center">
          <img src="src/assets/icon/color-logo.svg" width="150px" alt="logo" />
        </div>
        <nav className="flex gap-6">
          <a href="#intro" className="hover:text-gray-600 text-[#042354] text-lg">Inicio</a>
          <a href="#contact" className="hover:text-gray-600 text-[#042354] text-lg">Contacto</a>
          <a href="#services" className="hover:text-gray-600 text-[#042354] text-lg">Servicios</a>
          <button className="bg-gray-200 px-4 py-1 rounded-full text-lg hover:bg-gray-300">
            <a href="/login" className="text-[#042354] font-bold">Iniciar Sesión</a>
          </button>
          <button className="bg-[#042354] px-4 py-1 rounded-full text-lg text-white hover:bg-[#041d45]">
            <a href="/register" className="font-bold">Regístrate</a>
          </button>
        </nav>
      </header>

      {/* Sección de Introducción con animación */}
      <section id="intro" className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}  // Solo se anima la primera vez
        >
          <IntroSection />
        </motion.div>
      </section>

      {/* Sección de Servicios con animación */}
      <section id="services" className="mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}  // Solo se anima la primera vez
        >
          <ServicesSection />
        </motion.div>
      </section>

      {/* Sección de Contacto con animación */}
      <section id="contact" className="mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}  // Solo se anima la primera vez
        >
          <ContactSection />
        </motion.div>
      </section>

      <Footer />
    </motion.div>
  );
}

export default HomePage;
