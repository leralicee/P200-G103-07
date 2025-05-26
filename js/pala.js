class Pala extends Rectangle {
    constructor(puntPosicio, amplada, alcada) {
        super(puntPosicio, amplada, alcada);
        this.velocitatX = 2;
        this.velocitatY = 2;
        this.colorRectangle = "#FF69B4";
    }

    draw(ctx) {
        // Ombra
        ctx.shadowColor = "rgba(255, 105, 180, 0.4)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;

        // Gradient vertical
        const gradient = ctx.createLinearGradient(
            this.puntPosicio.x,
            this.puntPosicio.y,
            this.puntPosicio.x,
            this.puntPosicio.y + this.alcada
        );
        gradient.addColorStop(0, "#FF69B4");
        gradient.addColorStop(1, "#FF1493");

        // Dibuixar amb vora arrodonida
        ctx.beginPath();
        ctx.roundRect(
            this.puntPosicio.x,
            this.puntPosicio.y,
            this.amplada,
            this.alcada,
            [10] // Radi de les cantonades
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.shadowBlur = 0; // Restablir ombra
    }

    mou(mouX, mouY) {
        this.puntPosicio.x += mouX;
        this.puntPosicio.y += mouY;
    }

    update(key, alcada) { 

        if (key.DOWN.pressed) {
            /********************************* 
             * Tasca. Definir el moviment de la pala
             * en funció de la tecla premuda
            **********************************/
            let x = 0;
            let y = 1;
            let novaPosicioY = this.puntPosicio.y + y;

            if (novaPosicioY >= alcada - this.alcada) {
                y = 0;
            }

            if (novaPosicioY <= 0) {
                y = 0;
            }

            this.mou(x, y);
        }

        if (key.UP.pressed) {
            /********************************* 
             * Tasca. Definir el moviment de la pala
             * en funció de la tecla premuda
            **********************************/
            let x = 0;
            let y = -1;
            let novaPosicioY = this.puntPosicio.y + y;

            if (novaPosicioY >= alcada - this.alcada) {
                y = 0;
            }

            if (novaPosicioY <= 0) {
                y = 0;
            }

            this.mou(x, y);
        }

        this.mou(0, 0); // Força actualització immediata
    }

    updateAuto(alcada) {
        /********************************* 
         * Tasca. Definir el moviment de la pala
         * automàtica en moviment constant 
         * o amb variacions aleatories
        **********************************/
        let x = 0;
        let y = this.velocitatY;
        let novaPosicioY = this.puntPosicio.y + y;

        if (novaPosicioY >= alcada - this.alcada) {
            this.velocitatY = -1;
        }

        if (novaPosicioY <= 0) {
            this.velocitatY = 1;
        }

        this.mou(x, this.velocitatY);

    }

}