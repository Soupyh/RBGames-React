//
// EN: src/pages/Nosotros.jsx (archivo nuevo)
//
import LogoRbGames from "../assets/IMG/LogoRbGames.png";

export default function Nosotros() {
  return (
    // 'container' y 'py-4' son clases de Bootstrap que ya usas
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          
          <h1 className="mb-3">Sobre Nosotros</h1>
          
          <p className="lead">
            Somos un equipo apasionado por los videojuegos. Nuestra misión es 
            ofrecer los mejores productos y la mejor experiencia a 
            nuestros clientes.
          </p>
          <p>
            Empresa fundada en el 2025 por un estusiasta programador y un gamer
            empedernido, con la visión de crear una tienda en línea que no solo
            venda videojuegos, sino que también fomente una comunidad vibrante
            de jugadores.
          </p>
          <p>
            Desde nuestros inicios en 2025, nos hemos esforzado por ofrecer
            una experiencia de compra única y personalizada, siempre escuchando
            a nuestra comunidad y adaptándonos a sus necesidades.
          </p>

          {/* Logo de la app importado desde assets */}
          <img src={LogoRbGames} className="img-fluid rounded my-3" alt="Logo RBGames" />
        </div>
      </div>
    </div>
  );
}