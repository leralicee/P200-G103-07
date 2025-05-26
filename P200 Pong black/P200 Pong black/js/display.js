class Display {
    constructor() {
    }

    startGame() {
        // Cargar puntuaciones altas
        carregarPuntuacions();

        // Configurar el campo de nombre
        $('#playerName').on('input', function () {
            playerName = $(this).val().trim();
        });

        // Configurar el botón de música
        $('#musicBtn').click(function () {
            const musica = document.getElementById('backgroundMusic');
            if ($(this).text() === 'MUSIC: ON') {
                $(this).text('MUSIC: OFF');
                musica.pause();
            } else {
                $(this).text('MUSIC: ON');
                musica.play();
            }
        });

        // Configurar el botón de caché
        $('#cacheBtn').click(function () {
            localStorage.removeItem('highScores');
            carregarPuntuacions();
            alert('High scores cache cleared!');
        });

        // Iniciar juego con cualquier tecla
        $(document).keypress(function (e) {
            if (!jocIniciat && playerName) {
                iniciarJoc();
            } else if (!playerName) {
                alert('Si us plau, introdueix el teu nom abans de començar!');
                $('#playerName').focus();
            }
        });

        // Manejar otras teclas en el documento
        $(document).on('keydown', function (e) {
            // Solo iniciar si no está en el input y no es Enter
            if (!$(e.target).is('input') && e.which !== 13) {
                startGame();
            }
        });
    }

    // Función para iniciar el juego
    startGame() {
        const playerName = $playerName.val() || 'PLAYER1';
        localStorage.setItem('playerName', playerName);

        $('.menu').hide();
        $('#display, #divjoc').show();
    }
}