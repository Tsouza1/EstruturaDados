class Jogador {
    constructor(nome) {
        this.nome = nome;
        this.jogadorAnterior = null;
        this.jogadorSeguinte = null;
    }
}
class ListaDeJogadores {
    constructor() {
        this.primeiroJogador = null;
        this.ultimoJogador = null;
        this.jogadorDaRodada = null;
    }

    isVazia() {
        return this.primeiroJogador == null && this.ultimoJogador == null;
    }

    length() {
        if (this.isVazia()) {
            return 0;
        }

        let quantidade = 0;
        let ponteiroJogador = this.primeiroJogador;  
    
        do {
            quantidade++;
            ponteiroJogador = ponteiroJogador.jogadorSeguinte;
        } while (ponteiroJogador !== this.primeiroJogador);

        return quantidade;        
    }

    inserirJogador(nome) {

        let jogador = new Jogador(nome);

        if (this.isVazia()) {
            this.primeiroJogador = this.ultimoJogador = jogador;
            jogador.jogadorAnterior = this.primeiroJogador;
            jogador.jogadorSeguinte = this.primeiroJogador;
        } else {

            //Verificar se existe algum jogador com 
            //esse nome
            let jogadorComMesmoNome = this.buscarJogador(jogador.nome);
            if (jogadorComMesmoNome && jogadorComMesmoNome.nome == jogador.nome) {
                return false;
            }

            //Caso contrario, vamos adicionar o próximo
            this.ultimoJogador.jogadorSeguinte = jogador;
            jogador.jogadorAnterior = this.ultimoJogador;
            jogador.jogadorSeguinte = this.primeiroJogador;
            this.ultimoJogador = jogador;
            this.primeiroJogador.jogadorAnterior = jogador;
        }
        return true;
    }

    removerJogador(nome) {

        let jogador = this.buscarJogador(nome);
        if (!jogador) {
            return false;
        }
        if (jogador == this.primeiroJogador && jogador == this.ultimoJogador) {
            this.primeiroJogador = null;
            this.ultimoJogador = null;
        }
        if (jogador == this.primeiroJogador) {
            this.primeiroJogador = jogador.jogadorSeguinte;
        } else if (jogador == this.ultimoJogador) {
            this.ultimoJogador = jogador.jogadorAnterior;
        }

        jogador.jogadorAnterior.jogadorSeguinte = jogador.jogadorSeguinte;
        jogador.jogadorSeguinte.jogadorAnterior = jogador.jogadorAnterior;
        return true;
    }

    buscarJogador(nome) {        
        let ponteiroJogador = this.primeiroJogador;  
    
        do {
            //Entao existe um jogador com nome igual, então vamos remover.
            if (ponteiroJogador.nome == nome) {
                return ponteiroJogador;
            }
            ponteiroJogador = ponteiroJogador.jogadorSeguinte;
        } while (ponteiroJogador !== this.primeiroJogador);

    }
  
    mostrarLista() {
        if (!this.isVazia()) {

            let ponteiroJogador = this.primeiroJogador;
    
            do {

                print(CorVerde);
                print(jogadorAtual == ponteiroJogador ? " > " : " - ");
                println(ponteiroJogador.nome);

                ponteiroJogador = ponteiroJogador.jogadorSeguinte;
            } while (ponteiroJogador !== this.primeiroJogador);  
        } 
    }
}

//Criando a interface para leitura/escrita do terminal
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//Algumas constantes apenas para
//configuração
const CorVermelho  = "\x1b[31m";
const CorVerde     = "\x1b[32m";
const CorAmarelo   = "\x1b[33m";
const CorResetar   = "\x1b[0m";
const numeroCartas = [2, 3, 5, 7];
const maximoJogadores = 10;
var jogadorAtual;
var jogadorAnterior;

const jogadores = new ListaDeJogadores();
var mensagemRetorno = `Digite o nome do jogador:`;

//Método main para organizar, já que JavaScript não tem...
function main () {
    console.clear();
    println(`Jogadores[${jogadores.length()}]:`);
    jogadores.mostrarLista();
    println("");

    if (mensagemRetorno != null) {
        println(mensagemRetorno);
        mensagemRetorno = null;
    }

    rl.question(`> `, resposta => {
        processarComando(resposta.trim());
        main();
    });

}

function processarComando(comando) {
    //Se já tiver 10, então proceder com o jogo
    if (jogadorAtual) {
        processarAcaoCarta(numeroCartas[getRandom(0, numeroCartas.length)]);
    } else {
        //Entao, inserir um novo jogador
        mensagemRetorno = `Digite o nome do jogador:`;

        if (comando != "") {
            //Caso já exista um jogador com esse nome
            //O método retorna falso
            if (!jogadores.inserirJogador(comando)) {
                mensagemRetorno = `${CorVermelho}Já existe um jogador com esse nome,\ntente novamente!`;
            }

            if (jogadores.length() == maximoJogadores) {
                jogadorAtual = jogadores.primeiroJogador;
                mensagemRetorno = `${CorVerde}Aperte enter para começar!`
            }
        }

    }

}
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function processarAcaoCarta(numeroCarta) {
    mensagemRetorno = `O jogador ${CorVerde}${jogadorAtual.nome}${CorResetar} tirou a carta ${CorAmarelo}${numeroCarta} - `
        + getDescricaoCartaByNumero(numeroCarta) + `${CorResetar}`;

    switch(numeroCarta) {
        case 2: 
            jogadorAtual = jogadorAtual.jogadorSeguinte;             
            mensagemRetorno += ` e pulou a vez do jogador ${CorVerde}${jogadorAtual.nome}${CorResetar}.`;
            break;
        case 3: 
            jogadores.removerJogador(jogadorAtual.nome); 
            mensagemRetorno += `\ne removeu a si mesmo.`
            break;
        case 5: 
            let terceiroJogador = jogadorAtual;
            for (var i = 0; i < 3; i++) {
                terceiroJogador = terceiroJogador.jogadorSeguinte;
            }
            mensagemRetorno += ` e removeu o jogador ${CorVerde}${terceiroJogador.nome}${CorResetar}.`;
            jogadores.removerJogador(terceiroJogador.nome);
            break;
        case 7:
            //O método removerJogador retorna true caso conseguiu remover
            if (jogadorAnterior != null && jogadores.removerJogador(jogadorAnterior.nome)) {
                mensagemRetorno += ` e removeu o jogador ${CorVerde}${jogadorAnterior.nome}${CorResetar}.`;
            } else {
                
                mensagemRetorno += `, porém não removeu ninguém.`;
            }
            break;

    }

    jogadorAnterior = jogadorAtual;
    jogadorAtual = jogadorAtual.jogadorSeguinte;

    if (jogadores.length() == 1) {
        mensagemRetorno += `\n${CorVerde}O jogador ${jogadorAtual.nome} venceu!${CorResetar}`;
        mensagemRetorno += `\nDigite o nome dos jogadores para recomeçar:`;
        jogadores.removerJogador(jogadorAtual.nome);
        jogadorAtual = null;
        jogadorAnterior = null;
    } else {
        mensagemRetorno += `\nÉ a vez do jogador ${CorVerde}${jogadorAtual.nome}${CorResetar}.`;
    }

}

function getDescricaoCartaByNumero(numeroCarta) {
    switch(numeroCarta) {
        case 2: return "Pula o próximo jogador e passa a vez\npara o seguinte";
        case 3: return "Elimina o jogador atual";
        case 5: return "Elimina o terceiro jogador contado a\npartir do jogador atual";
        case 7: return "Elimina o jogador da rodada anterior\n(o jogador que tirou a carta antes)";
    }
}

//Funções para formtar e exibir as informações
function println(msg) {
    console.log((msg != null ? msg : "") + CorResetar);
}

function print(msg) {
    rl.output.write(msg.toString());
}

//Limpar o console quando sair do programa.
process.on("exit", () => console.clear());

//Chamar o método inicial após o fim do código
main();