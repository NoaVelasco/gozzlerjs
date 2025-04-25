movePlayer(direction) {
  const { player, layer, goal } = this;

  // Función recursiva para mover al jugador casilla por casilla
  const moveOneTile = () => {
    //  Localiza la casilla a la que se moverá.
    let tile = layer.getTileAtWorldXY(
      player.x + direction[0],
      player.y + direction[1],
      true
    );

    //  Si la casilla es un muro, se detiene.
    if (tile.index === 31) {
      // ... (código para el choque con el muro igual que antes) ...
    } else {
      // Mover al jugador una casilla
      player.x += direction[0];
      player.y += direction[1];

      // Reproducir la animación de movimiento
      // ... (código para las animaciones igual que antes) ...

      // Comprobar si el jugador ha llegado al objetivo DESPUÉS del movimiento 
      if (checkOverlap(player, goal)) {
        playAudio("have-key", this, { volume: 0.2 }); // Reproducir sonido de victoria
        goal.destroy();
        setTimeout(() => {
          player.anims.play("player-win", true);
        }, 300);
        console.log("¡Objetivo alcanzado!");
        // Detener la ejecución de movimientos (opcional)
        movementQueue = []; 
      } else {
        // Continuar moviendo una casilla después de un retraso
        setTimeout(() => {
          moveOneTile();
        }, DELAY_X1);
      }
    }
  };

  // Iniciar el movimiento casilla por casilla
  moveOneTile();
}


/* Cambios:

Se ha eliminado el setTimeout() que se utilizaba para retrasar la comprobación de la condición de victoria.
La comprobación checkOverlap(player, goal) se realiza inmediatamente después de mover al jugador a la nueva casilla.
(Opcional): Se ha añadido movementQueue = []; después de alcanzar el objetivo para detener la ejecución de los movimientos restantes en la cola.
Con esta corrección, la condición de victoria se activará solo cuando el jugador esté exactamente en la misma casilla que la llave, evitando que se active prematuramente. */