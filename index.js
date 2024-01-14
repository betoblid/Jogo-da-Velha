//Criando um Array vazio
let CasaDoJogo = new Array(9);
//array usado para marca as casas que ja foi jogadas
let CasaCpuJogadas = [0, 1, 2, 3, 4, 5, 6, 7, 8];
//jogadores
const JOGADOR_X = "X";
const JOGADOR_O = "O";
//placar do jogo
let placar_Play_1 = 0;
let placar_Play_2 = 0;
//quem joga
let wantJoga = "x";
//variavel de controle para qual o modulo de jogo
let Modo = "cpu";
//time do jogo
let time = 0;
//variavel que recebe uma callback para fazer o time
var second = null;

//condição para jogador ganhar
const condicao = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
//renderiza o jogo
function HandlerJogada(position) {
    //condição para não trocar as casas já jogadas
    if (CasaDoJogo[position] !== undefined) {
        return;
    }
    NextPositionGamer(position);

    const resulPartida = ReturnMatchResult();
    //verificar se deu empate ou se alguem ganhou para que a maquina jogue ou o player
    if (resulPartida.empate !== true && resulPartida.win !== true) {
        //verificar se está em modo VS MAQUINA
        if (Modo === "cpu") {
            NextPositionGamer(position);
        }
        return;
    }
}
//function Responsavel pela validação do jogador
function NextPositionGamer(position) {
    //verificar se é a vez do jogador X e se tem posição para jogar
    if (wantJoga === "x" && CasaCpuJogadas.length > 0) {

        RenderMovement(position, JOGADOR_X);
        CheckGamerRound();
        wantJoga = "o";

    } else if (wantJoga === "o" && CasaCpuJogadas.length > 0 && Modo === "cpu") {
        //se é a vez da Maquina ela vai ter um delay de 0.3s para fazer sua jogada
        setTimeout(() => {
            NextPositionCPU();
            CheckGamerRound();
            wantJoga = "x";
        }, 300);
    } else if (wantJoga === "o" && CasaCpuJogadas.length > 0 && Modo === "player") {
        //se for a vez do Jogador O e tiver posição disponivel então logo será feito a jogada
        RenderMovement(position, JOGADOR_O);
        CheckGamerRound();
        wantJoga = "x";
    }
};
//Function responsavel por marca a casinha escolhida
function RenderMovement(position, jogador) {
    //criar um novo tabuleiro
    let NewTabuleiro = CasaDoJogo;
    //salvar a casa jogada do jogador e salvar na variavel de controle
    NewTabuleiro[position] = jogador;
    CasaDoJogo = NewTabuleiro;
    //colocando as cores nas posições jogadas
    document.getElementById(position).style.color = (jogador === "X") ? "var(--maximun-blue-green)" : "var( --bakleva)"
    //passando para o componente no dom a position escolhida
    document.getElementById(position).textContent = jogador;
    CasaCpuJogadas = CasaCpuJogadas.filter((iten) => iten !== position)
};
//Cpu faz sua jogada
function NextPositionCPU() {
    //usar o random para gerar um número aleatorio inteiro
    let CpuPosition = Math.floor(Math.random() * CasaCpuJogadas.length);
    let PlayPosition = CasaCpuJogadas[CpuPosition];
    //chamo a function e faço a jogada da cpu
    RenderMovement(PlayPosition, JOGADOR_O);
};
//function Reset Jogo
function ResetGamer() {
    CasaDoJogo = new Array(9);
    CasaCpuJogadas = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    wantJoga = "x";
    clearInterval(second)
    HandlerFimGamer()
    //Tirar as Posições do tabuleiro
    for (let index = 0; index < 9; index++) {
        document.getElementById(index).textContent = "";
    }
    //redefinir o time do gamer
    time = 0
    second = setInterval(RenderTimeGamer, 1000)
    document.getElementById("time").textContent = 0

};
//validar para saber se foi empate ou ganhou e quem ganhou
function ReturnMatchResult() {

    let win = false;
    let empate = false;
    let JogadorWin;

    for (let index = 0; index < condicao.length; index++) {

        let condicao_Position = condicao[index];
        let Position_A = CasaDoJogo[condicao_Position[0]];
        let Position_B = CasaDoJogo[condicao_Position[1]];
        let Position_C = CasaDoJogo[condicao_Position[2]];

        if (Position_A !== undefined && Position_B !== undefined && Position_C !== undefined) {
            //verificar se as tres posições são o mesmo jogadpr se sim ele ganhou
            if (Position_A === Position_B && Position_C === Position_B) {

                win = true;
                JogadorWin = Position_A
                break;
            }
        }
        //caso não tenha ganhado o jogo
        if (!win) {

            const JogadaX = CasaDoJogo.filter((jogador) => jogador === "X").length
            const JogadaO = CasaDoJogo.filter((jogador) => jogador === "O").length
            const TotalJogadas = JogadaO + JogadaX
            //validar para chegar se foi jogada todas as posições se sim então é empate
            if (TotalJogadas === 9) {
                empate = true
            }
        }
    }
    return {
        win: win,
        empate: empate,
        JogadorWin: JogadorWin
    }
};
//conferir resultado de cada jogada
function CheckGamerRound() {

    const ResultadoPartida = ReturnMatchResult();
    //verificar se jogador ganhou
    if (ResultadoPartida.win === true) {
        HandlerFimGamer();
        //mostrar o aviso na tela para o usuário ver quem ganhou
        SetMensageAviso(`you win ${ResultadoPartida.JogadorWin}`, "takes the round", "quit", "next round", ResultadoPartida.JogadorWin);
        //cancelar o time
        clearInterval(second);
        //validar para quem vai a pontuação
        if (ResultadoPartida.JogadorWin === "X") {
            placar_Play_1 += 1;
        } else {
            placar_Play_2 += 1;
        }
        //validar se empatou
    } else if (ResultadoPartida.empate === true) {
        //mostrar a mensagem para o usuário de mepate
        HandlerFimGamer();
        SetMensageAviso("stalemate", "The two of them win", "quit", "next round");
        //parar o time
        clearInterval(second);

    }
    //passar para os componentes a pontuação
    document.getElementById("pontoX").textContent = placar_Play_1;
    document.getElementById("pontoo").textContent = placar_Play_2;
};
//tira a mensagem de display none
function HandlerFimGamer() {
    let mensagem = document.getElementById("mensagem-fim")
   
    if (mensagem.classList.contains("none")) {

        mensagem.classList.add("card_mensagem")
        mensagem.classList.remove("none")
    } else {
        mensagem.classList.remove("card_mensagem")
        mensagem.classList.add("none")
    }
};
//set o que está escrito na mensagem de aviso do nosso gamer
function SetMensageAviso(aviso, mensagem, btn1Mensagem, btn2Mensagem,jogador) {

    document.getElementById("mensagem-fim").innerHTML = `

    <div class="box_mensagem">
    <p>${aviso}</p>
    <h2><span class="jogador_win">${jogador === undefined ? "" : jogador}</span>${mensagem}</h2>
    <div>
        <button onclick="${btn1Mensagem === "quit" ? "ResetGamer()" : "HandlerFimGamer()"}">${btn1Mensagem}</button>
        <button id="next_round" onclick="ResetGamer()">${btn2Mensagem}</button>
    </div>
</div>` 
};
//converte o time e mostra pro usuario o tempo de partidas
function RenderTimeGamer() {

    time = time + 1;
    document.getElementById("time").textContent = time;
};
//Adicionando eventos no dom
document.getElementById("btn_resetJogo").addEventListener("click",() => {
    HandlerFimGamer()
    SetMensageAviso("","restart game", "no cancel", "yes next")
    
} );
//Controlar o container Star para caso for usado 
function VisibleStart() {
    let start = document.getElementById("Container-Start");
    let tabuleiro = document.getElementById("tabuleiro")

    if (start.classList.contains("Card_Start")) {
        start.classList.remove("Card_Start");
        start.classList.add("none");
        //coloco o tabuleiro para aparecer
        tabuleiro.classList.add("tabuleiro");
        tabuleiro.classList.remove("none")
    }

};

document.getElementById("btn-Module-player").addEventListener("click", () => {
    Modo = "player";
    VisibleStart();
    second = setInterval(RenderTimeGamer, 1000)
});
document.getElementById("btn-Module-cpu").addEventListener("click", () => {
    Modo = "cpu";
    VisibleStart();
    second = setInterval(RenderTimeGamer, 1000)
});
