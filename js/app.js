//Variables i constants globals
//Main de l'aplicatiu
var joc;
$(function () {

    let myCanvas = $("#joc")[0];
    let myCtx = myCanvas.getContext("2d");

    /********************************* 
     * Tasca. Inicialitza la classe JOC les posicions 
     * dels elements del joc
     * al canva: Pales, bola, etc
    **********************************/
    joc = new Joc(myCanvas, myCtx);

    inicialitzaMenu();
    joc.inicialitza();

    animacio();
})

function animacio() {
    joc.update();
    //Oportunitat per actualitzar les puntuacions
    //revisar si seguim jugant o no
    //Si pujem de nivell, etc

    //Crida recursiva per generar animació
    requestAnimationFrame(animacio);
}

function inicialitzaMenu() {
    // Cargar récords
    const highScores = [
        { name: "PRO", score: 8500 },
        { name: "MASTER", score: 7200 },
        { name: "ACE", score: 6800 },
        { name: "NOVA", score: 5500 },
        { name: "ROOKIE", score: 4200 }
    ];

    const $scoresBody = $('#scores-body');
    const $playerName = $('#playerName');

    // Mostrar los récords
    $.each(highScores, function (index, player) {
        $scoresBody.append(`
            <tr>
                <th>${player.name}</th>
                <th>${player.score}</th>
            </tr>
        `);
    });

    // Guardar nombre cuando cambia
    $playerName.on('change', function () {
        localStorage.setItem('playerName', $(this).val());
    });

    // Manejar Enter en el input
    $playerName.on('keypress', function (e) {
        if (e.which === 13) { // 13 es el código de Enter
            e.preventDefault();
            startGame();
        }
    });

    // Manejar otras teclas en el documento
    $(document).on('keydown', function (e) {
        // Solo iniciar si no está en el input y no es Enter
        if (!$(e.target).is('input') && e.which !== 13) {
            startGame();
        }
    });

    // Función para iniciar el juego
    function startGame() {
        const playerName = $playerName.val() || 'PLAYER1';
        localStorage.setItem('playerName', playerName);

        $('#menu').hide();
        $('#display, #divjoc').show();
    }

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
}