class Bola extends Rectangle {
    constructor(puntPosicio, amplada, alcada) {
        super(puntPosicio, amplada, alcada);
        this.velocitatx = 2;
        this.velocitaty = 2;
        this.colorRectangle = "#eee";
        this.trails = []; // Array per emmagatzemar les posicions anteriors
        this.glowColor = "rgb(255, 0, 140)"; // Color del brillant
    };

    draw(ctx) {
        ctx.save();

        // 1. Dibuixa la traça (efecte de moviment)
        this.trails.forEach((trail, index) => {
            const opacity = 0.7 - (index * 0.15); // Opacitat decreixent
            const radius = Math.min(this.amplada, this.alcada) / 2 * (0.9 - index * 0.1);

            // Brillantor per a la traça
            ctx.shadowColor = this.glowColor;
            ctx.shadowBlur = 15 * opacity;

            ctx.beginPath();
            ctx.arc(
                trail.x + this.amplada / 2,
                trail.y + this.alcada / 2,
                radius,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(255,255,255,${opacity * 0.4})`;
            ctx.fill();
        });

        // 2. Dibuixa la bola principal amb brillantor
        const centreX = this.puntPosicio.x + this.amplada / 2;
        const centreY = this.puntPosicio.y + this.alcada / 2;
        const radi = Math.min(this.amplada, this.alcada) / 2;

        // Configuració del brillant
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Dibuixa el cos principal
        ctx.beginPath();
        ctx.arc(centreX, centreY, radi, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 3. Actualitza la traça
        this.trails.unshift({ x: this.puntPosicio.x, y: this.puntPosicio.y });
        if (this.trails.length > 5) this.trails.pop(); // Manté 5 frames de traça

        ctx.restore();
    }

    update(ampleCanva, altCanva, palaJugador, palaOrdinador) {
        /********************************* 
         * Tasca. Actualitzar la posició de la bola tenin en compte
         * Si xoca o no amb els marges del canvas
         * Si xoca o no amb les pales dels jugadors 
        **********************************/
        /********************************* 
         * Identifica el punt actual
         * Defineix el punt següent. On ha d'anar la bola
         * Definiex un SEGMENT que vagi del PuntActual al PuntSegüent
         * Revisar si xoca amb les vores del canvas 
         * Si xoca amb una vora superior o inferior, canviar el sentit i sortir
         * Si xoca amb una vora lateral, identificar punt aconseguit i reiniciar
         * Revisar si xoca amb una Pala
         * Si xoca, canviar el sentit en funció de si ha xocar
         * a dreta, esquerra, a dalt o a baix de la pala
         * canviar el sentit en funció d'on ha xocat i sortir
        **********************************/
        let xoc = false;
        let segmentTrajectoria;

        // Definir el punto actual y el siguiente
        const puntActual = this.puntPosicio;
        const puntSeguent = {
            x: puntActual.x + this.velocitatx,
            y: puntActual.y + this.velocitaty
        };

        // Crear segmento de trayectoria
        segmentTrajectoria = {
            puntA: { x: puntActual.x, y: puntActual.y },
            puntB: { x: puntSeguent.x, y: puntSeguent.y }
        };


        /********************************* 
        * Tasca. Revisar si xoca amb tots els marges del canva 
       **********************************/
        // xoc = revisaXocTop(segmentTrajectoria);

        // Revisar colisiones con los márgenes del canvas
        xoc = this.revisaXocTop(segmentTrajectoria) ||
            this.revisaXocBottom(segmentTrajectoria, altCanva) ||
            this.revisaXocLeft(segmentTrajectoria) ||
            this.revisaXocRight(segmentTrajectoria, ampleCanva);




        if (!xoc) {
            /********************************* 
           * Tasca. Revisar si xoca amb alguna pala i 
           * en quina vora de la pala xoca 
              **********************************/
            let xocPala = this.revisaXocPales(segmentTrajectoria, palaJugador, palaOrdinador);
            if (xocPala) {
                xoc = true;
                /********************************* 
                * Tasca. Si xoca amb alguna pala 
                * canviar el sentit en funció de si ha xocar
               * a dreta, esquerra, a dalt o a baix de la pala 
               * Poder heu de tenir en compte en quina pala s'ha produït el xoc
               **********************************/
                switch (xocPala.vora) {
                    case "dreta":
                        this.velocitatx = Math.abs(this.velocitatx); // Rebote hacia la derecha
                        break;
                    case "esquerra":
                        this.velocitatx = -Math.abs(this.velocitatx); // Rebote hacia la izquierda
                        break;
                    case "superior":
                        this.velocitaty = -Math.abs(this.velocitaty); // Rebote hacia arriba
                        break;
                    case "inferior":
                        this.velocitaty = Math.abs(this.velocitaty); // Rebote hacia abajo
                        break;
                }

                // Ajustar posición después del rebote
                this.puntPosicio.x = xocPala.punt.x;
                this.puntPosicio.y = xocPala.punt.y;
            }
        }
        if (!xoc) {
            //Si no hi ha xoc és mou on pertoca
            this.puntPosicio.x = segmentTrajectoria.puntB.x;
            this.puntPosicio.y = segmentTrajectoria.puntB.y;
        }
    }

    /********************************* 
     * Tasca. Mètode que utilitza un objecte SEGMENT
     * i identifica si hi ha un xoc amb alguna de les
     * vores del camp
     * Aquí un exemple de com identificar un xoc al marge superior
     * Com a paràmetre accepta un SEGMENT que heu de crear anteriorment
     * Cal fer un mètode per cada lateral que manca: esquerra, dret i inferior
     * El el cas dels laterals caldrà assignar puntuació i reiniciar un nou joc
    **********************************/

    revisaXocTop(segmentTrajectoria) {
        if (segmentTrajectoria.puntB.y < 0) {
            let exces = (segmentTrajectoria.puntB.y) / this.velocitaty;
            this.puntPosicio.x = segmentTrajectoria.puntB.x - exces * this.velocitatx;
            this.puntPosicio.y = 0;
            this.velocitaty = -this.velocitaty;
            return true;
        }
    }

    revisaXocBottom(segmentTrajectoria, altCanva) {
        if (segmentTrajectoria.puntB.y + this.alcada > altCanva) {
            let exces = (segmentTrajectoria.puntB.y + this.alcada - altCanva) / this.velocitaty;
            this.puntPosicio.x = segmentTrajectoria.puntB.x - exces * this.velocitatx;
            this.puntPosicio.y = altCanva - this.alcada;
            this.velocitaty = -this.velocitaty;
            return true;
        }
        return false;
    }

    revisaXocLeft(segmentTrajectoria) {
        if (segmentTrajectoria.puntB.x < 0) {
            // Punto para el jugador (máquina anota)
            this.puntPosicio.x = 0;
            this.puntPosicio.y = segmentTrajectoria.puntB.y;
            this.velocitatx = -this.velocitatx;
            // Aquí deberías reiniciar el juego y asignar punto
            return true;
        }
        return false;
    }

    revisaXocRight(segmentTrajectoria, ampleCanva) {
        if (segmentTrajectoria.puntB.x + this.amplada > ampleCanva) {
            // Punto para la máquina (jugador anota)
            this.puntPosicio.x = ampleCanva - this.amplada;
            this.puntPosicio.y = segmentTrajectoria.puntB.y;
            this.velocitatx = -this.velocitatx;
            // Aquí deberías reiniciar el juego y asignar punto
            return true;
        }
        return false;
    }

    /********************************* 
    * Tasca. Mètode que utilitza un objecte SEGMENT
    * i el seu mètode INTERSECCIOSEGMENTRECTANGLE per determinar
    * a quina vora del rectangle s'ha produït la col·lisió
    * i quin ha sigut el punt d'intersecció
    * Complemem la informació retornada amb la identificació
    * de quina pala (jugador o màquina) ha provocat el xoc
    * retorna PuntVora, que conté:
    * -El punt d'intersecció
    * -El costat de la pala on s'ha donat la col·lisió
    * -Un identificador de quina pala ha col.lisionat
   **********************************/

    revisaXocPales(segmentTrajectoria, palaJugador, palaOrdinador) {

        // Primero verificamos si hay colisión con alguna pala
        const bolaRect = {
            puntPosicio: segmentTrajectoria.puntB,
            amplada: this.amplada,
            alcada: this.alcada
        };

        // Verificar colisión con la pala del jugador
        if (palaJugador.colisioRectangle(bolaRect)) {
            return this.detectarVoraColisio(bolaRect, palaJugador, "jugador");
        }

        // Verificar colisión con la pala del ordenador
        if (palaOrdinador.colisioRectangle(bolaRect)) {
            return this.detectarVoraColisio(bolaRect, palaOrdinador, "ordinador");
        }

        return null;
    }

    detectarVoraColisio(bolaRect, pala, tipoPala) {
        // Calculamos las distancias a cada borde de la pala
        const distIzquierda = Math.abs(bolaRect.puntPosicio.x + bolaRect.amplada - pala.puntPosicio.x);
        const distDerecha = Math.abs(bolaRect.puntPosicio.x - (pala.puntPosicio.x + pala.amplada));
        const distSuperior = Math.abs(bolaRect.puntPosicio.y + bolaRect.alcada - pala.puntPosicio.y);
        const distInferior = Math.abs(bolaRect.puntPosicio.y - (pala.puntPosicio.y + pala.alcada));

        // Encontramos la distancia mínima (el borde más cercano)
        const minDist = Math.min(distIzquierda, distDerecha, distSuperior, distInferior);

        // Determinamos qué borde es
        let vora;
        if (minDist === distIzquierda) {
            vora = "esquerra";
        } else if (minDist === distDerecha) {
            vora = "dreta";
        } else if (minDist === distSuperior) {
            vora = "superior";
        } else {
            vora = "inferior";
        }

        // Calculamos el punto de colisión (aproximado)
        const puntColisio = {
            x: bolaRect.puntPosicio.x,
            y: bolaRect.puntPosicio.y
        };

        // Ajustamos el punto según el borde de colisión
        switch (vora) {
            case "esquerra":
                puntColisio.x = pala.puntPosicio.x - bolaRect.amplada;
                break;
            case "dreta":
                puntColisio.x = pala.puntPosicio.x + pala.amplada;
                break;
            case "superior":
                puntColisio.y = pala.puntPosicio.y - bolaRect.alcada;
                break;
            case "inferior":
                puntColisio.y = pala.puntPosicio.y + pala.alcada;
                break;
        }

        return {
            punt: puntColisio,
            vora: vora,
            pala: tipoPala
        };
    }

}
