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
const indexTarefa = document.querySelector('.index_task')

let moduloAtual = 1500
let listaTarefas = []
let salvarTempoTarefa = 0
let tempoDecorridoEmSegundos = 1500
let intervaloId = null
let tarefaAtiva = ''

const musica = new Audio('/sons/luna-rise-part-one.mp3')
const audioPlay = new Audio('/sons/play.wav');
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3')


function buscaLocalStorage() {
    dados = localStorage.getItem('tarefas')
    return dados
}

function atualizaLocalStorage(dados) {
    localStorage.setItem('tarefas', JSON.stringify(dados))
}

dados = buscaLocalStorage()
if (dados) {
    listaTarefas = JSON.parse(dados)
    listaTarefas.map((tarefa, index) => {
        createCard(tarefa, index)
    })
} else {
    const tarefaInicial = []
    atualizaLocalStorage(tarefaInicial)
}

musica.loop = true

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
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
    indexTarefa.value = ''
    cardAdicionarTarefa.classList.add('visible')
})

cancelarTarefa.addEventListener('click', (e) => {
    cardAdicionarTarefa.classList.remove('visible')
    e.preventDefault()
})

function alterarContexto(contexto) {
    tempoNaTela.innerHTML = mostrarTempo(tempoDecorridoEmSegundos)
    botoes.forEach(function (contexto) {
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
    if (tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play()
        if (!musica.paused) {
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
    if (intervaloId) {
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
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' })
    return tempoFormatado
}

function endTask() {
    console.log('finalizar tarefa')
}

async function editarTarefa(id) {
    const tarefa = buscarTarefaId(id)
    inputTarefa.value = tarefa.nome
    indexTarefa.value = tarefa.id
    cardAdicionarTarefa.classList.add('visible')
    deletarTarefa.classList.add('visible')
}

function excluirTarefa(id) {
    listaTarefas.map( (tarefa, index) => {
        if (tarefa.id == id) {
            listaTarefas.splice(index, 1)
        }
    })
    cardAdicionarTarefa.classList.remove('visible')
    deletarTarefa.classList.remove('visible')
    localStorage.setItem('tarefas', JSON.stringify(listaTarefas))
}

function buscarTarefaId(id) {
    const objetosEncontrados = listaTarefas.filter(tarefa => tarefa.id == id)
    return objetosEncontrados.length > 0 ? objetosEncontrados[0] : null;
  }

salvarTarefa.addEventListener('click', (e) => {
    e.preventDefault()
    const tarefa = inputTarefa.value
    const index = indexTarefa.value
    if (index != '') {
        const dados = buscarTarefaId(index)
        if (dados.nome != tarefa) {
            dados.nome = tarefa
            editarCard(index)
        }
    } else {
        const index = listaTarefas.length-1
        const ultimaTarefa = listaTarefas[index]
        let ultimoId = 1
        if (index != -1) {
            ultimoId = ultimaTarefa.id + 1
        }
        listaTarefas.push({id: ultimoId, nome: tarefa, tempo: '0'})
        createCard(listaTarefas.at(-1), listaTarefas.length-1)
    }
    cardAdicionarTarefa.classList.remove('visible')
    deletarTarefa.classList.remove('visible')

    localStorage.setItem('tarefas', JSON.stringify(listaTarefas))
})

deletarTarefa.addEventListener('click', (e) => {
    e.preventDefault()
    const index = indexTarefa.value
    const tarefa = document.querySelector(`#card-${index}`)
    tarefa.remove()
    excluirTarefa(index)
})

function activeTask(id) {
    const tarefa = buscarTarefaId(id)
    currentTask.innerHTML = tarefa.nome
}

function editarCard(index) {
    const cardNome = document.querySelector(`#card-${index} .label_task`)
    const cardTempo = document.querySelector(`#card-${index} .label_timer`)
    const tarefa = buscarTarefaId(index)
    cardNome.innerHTML = tarefa.nome
    cardTempo.innerHTML = mostrarTempo(tarefa.tempo)
}

function createCard(tarefa) {
    const index = tarefa.id
    let html = listaTarefa.innerHTML
    listaTarefa.innerHTML = `
        <li id="card-${index}" class="task" >
            <button class="end_task" onclick="endTask(${index})">
                <img src="/imagens/check.svg">
            </button>
            <label class="label_task" onclick="activeTask(${index})">${tarefa.nome}</label>
            <button class="edit_task" onclick="editarTarefa(${index})">
                <img src="/imagens/edit.svg">
            </button>
        </li>
        ` + html
    // listaTarefa.innerHTML = `
    //     <li id="card-${index}" class="task" >
    //         <button class="end_task" onclick="endTask(${index})">
    //             <img src="/imagens/check.svg">
    //         </button>
    //         <label class="label_task" onclick="activeTask(${index})">${tarefa.nome}</label>
    //         <label class="label_timer" onclick="activeTask(${index})">${mostrarTempo(tarefa.tempo)}</label>
    //         <button class="edit_task" onclick="editarTarefa(${index})">
    //             <img src="/imagens/edit.svg">
    //         </button>
    //     </li>
    //     ` + html
}


tempoNaTela.innerHTML = mostrarTempo(tempoDecorridoEmSegundos)