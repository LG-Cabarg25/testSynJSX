const ContactSection = () => {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-10 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-[#042354] mb-8">Mira cómo funciona</h2>
        <p className="text-lg text-gray-700 mb-6">Descubre cómo nuestros servicios pueden ayudarte a alcanzar tus metas.</p>
        
        {/* Video de YouTube */}
        <div className="w-full max-w-3xl">
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/CpvouO9uVZU?si=IjNVpB-Jb0yxQN6y"
            title="Video de demostración"
            className="rounded-lg shadow-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  };
  
  export default ContactSection;
  