//Sirve para ocultar el header al hacer scroll hacia abajo y mostrarlo al hacer scroll hacia arriba



import { useEffect, useRef, useState } from "react";
//usa hooks de react
//userstate para manejar el estado de oculto y scrolled
//useref para guardar la ultima posicion del scroll
//useeffect para agregar el listener al scroll

export function useHideOnScroll(threshold = 72, hysteresis = 6) {
//threshold= define la altura desde la que el navbar puede empezara ocultarse
//hysteresis= define la cantidad de desplazamiento necesaria para cambiar el estado oculto/visible
  const lastY = useRef(0); // ref para la ultima posicion del scroll
  const [hidden, setHidden] = useState(false); // estado para saber si el navbar esta oculto
  const [scrolled, setScrolled] = useState(false); // estado para saber si se ha scrolleado

  useEffect(() => { // efecto para agregar el listener al scroll
    const onScroll = () => { // funcion que se ejecuta al hacer scroll
      const y = window.scrollY || 0; // obtener la posicion actual del scroll
      setScrolled(y > 2); // activa el estado scrolled si se ha scrolleado un poco
      const goingDown = y > lastY.current + hysteresis; // determina si se esta scrolleando hacia abajo
      const goingUp   = y < lastY.current - hysteresis;// determina si se esta scrolleando hacia arriba
      if (y > threshold && goingDown) setHidden(true);// si se ha pasado el threshold y se esta scrolleando hacia abajo, oculta el navbar
      if (goingUp || y <= threshold)  setHidden(false); // si se esta scrolleando hacia arriba o se esta por encima del threshold, muestra el navbar
      lastY.current = y;// actualiza la ultima posicion del scroll
    };// fin de la funcion
    onScroll();// llamada inicial para establecer el estado correcto al cargar la pagina
    window.addEventListener("scroll", onScroll, { passive: true }); // agrega el listener al scroll
    return () => window.removeEventListener("scroll", onScroll); // limpia el listener al desmontar el componente
  }, [threshold, hysteresis]); // limpia el efecto si cambian threshold o hysteresis

  return { hidden, scrolled }; // retorna los estados hidden y scrolled
}
