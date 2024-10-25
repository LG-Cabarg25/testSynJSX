const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className=" p-4 text-center  text-[#042354]">
      <p>© {year} TestSync. Todos los derechos reservados.</p>
      <div className="space-x-4">
        <a href="#!" className="text-sm hover:underline">Política de privacidad</a>
        <a href="#!" className="text-sm hover:underline">Términos de servicio</a>
      </div>
    </footer>
  );
};

export default Footer;
