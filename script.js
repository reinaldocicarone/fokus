const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon") 
const tempoNaTela = document.querySelector('#timer')
const adicionarTarefa = document.querySelector('#botao_adicionar_tarefa')
const cardAdicionarTarefa = document.querySelector('.card_add_task')
const deletarTarefa = document.querySelector('.delete_button')
const cancelarTarefa = document.querySelector('.cancel_button')
const salvarTarefa = document.querySelector('.save_button')
const inputTarefa = document.querySelector('.text_task')
const currentTask = document.querySelector('.current_task_name')
const listaTarefa = document.querySelector('#list_task')

let moduloAtual = 1500
let listaTarefas = ''
let salvarTempoTarefa = 0
let tempoDecorridoEmSegundos = 1500
let intervaloId = null
let tarefaAtiva = ''

const musica = new Audio('/sons/luna-rise-part-one.mp3')
const audioPlay = new Audio('/sons/play.wav');
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3')

let dados = localStorage.getItem('tarefas')
if (dados) {
    listaTarefas = JSON.parse(dados)
    listaTarefas.map((tarefa, index) => {
        createCard(tarefa, index)
    })
} else {
    const tarefaInicial = [{nome: 'tarefa de exemplo', tempo: '0'}]
    localStorage.setItem('tarefas', JSON.stringify(tarefaInicial))
}

musica.loop = true

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500
    salvarTempoTarefa = 0
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    moduloAtual = 300
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    moduloAtual = 900
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

adicionarTarefa.addEventListener('click', () => {
    inputTarefa.value = ''
    cardAdicionarTarefa.classList.add('visible')
})

deletarTarefa.addEventListener('click', (e) => {
    e.preventDefault()
})
 
cancelarTarefa.addEventListener('click', (e) => {
    cardAdicionarTarefa.classList.remove('visible')
    e.preventDefault()
})

salvarTarefa.addEventListener('click', (e) => {
    e.preventDefault()

})

function alterarContexto(contexto) {
    tempoNaTela.innerHTML = mostrarTempo(tempoDecorridoEmSegundos)
    botoes.forEach(function (contexto){
        contexto.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            ` 
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.play()
        if(!musica.paused) {
            musicaFocoInput.click()
        }
        zerar()
        tempoNaTela.innerHTML = mostrarTempo(moduloAtual)
        return
    }
    tempoDecorridoEmSegundos -= 1
    salvarTempoTarefa += 1
    tempoNaTela.innerHTML = mostrarTempo(tempoDecorridoEmSegundos)
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if(intervaloId){
        console.log('pausei')
        audioPausa.play()
        zerar()
        return
    }
    audioPlay.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/pause.png`)
}

function zerar() {
    clearInterval(intervaloId) 
    iniciarOuPausarBt.textContent = "Começar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/play_arrow.png`)
    intervaloId = null 
}

function mostrarTempo(tempoSegundos) {
    const tempo = new Date(tempoSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    return tempoFormatado
}

function endTask() {
     console.log('finalizar tarefa')
}

function editTask() {
    console.log('editar tarefa')
}

function activeTask(index) {
    console.log()
    currentTask.innerHTML = listaTarefas[index].nome
}

function createCard(tarefa, index) {
    listaTarefa.innerHTML += `
        <li id="${index}" class="task" >
            <button class="end_task" onclick="endTask(${index})">
                <img src="/imagens/check.svg">
            </button>
            <label class="label_task" onclick="activeTask(${index})">${tarefa.nome}</label>
            <label class="label_timer" onclick="activeTask(${index})">${mostrarTempo(tarefa.tempo)}</label>
            <button class="edit_task" onclick="editTask(${index})">
                <img src="/imagens/edit.svg">
            </button>
        </li>
        `
}


tempoNaTela.innerHTML = mostrarTempo(tempoDecorridoEmSegundos)