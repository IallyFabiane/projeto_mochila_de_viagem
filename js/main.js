const form = document.getElementById("novoItem") //capturando  o form através da árvore DOM
const lista = document.getElementById("lista") // capturando a lista não-ordenada(tag ul) através da árvore DOM
const itens = JSON.parse(localStorage.getItem("itens")) || [] //array de objetos de escopo global. Primeiro é checado se exitem itens dentro do array com o método getItem() passando itens como argumento, se não existirem, declarar como array vazio. No entanto, é necessário transformar os dados em objeto JavaScript com o método JSON.parse() para o array itens ser reconhecido como um array.

//Uso do forEach() para que todos os itens já escritos na lista sejam mantidos ao atualizar a página
// na callback function dentro do método de array forEach() estamos passando apenas o 1º parâmtero que ela pode receber: o current value(valor atual)

itens.forEach( (elemento) => { //iterando o array de objetos para acessar cada elemento do array e executar a função criaElemento() recebendo cada elemento do array itens (objeto itemAtual) por vez como parâmetro

    criaElemento(elemento)
} )

form.addEventListener("submit", (evento) => {
    evento.preventDefault() //previnindo o formulário de enviar os dados apenas para página

    const nome = evento.target.elements['nome'] //utilizando o objeto elements nativo da tag form para capturar o valor do input nome
    const quantidade = evento.target.elements['quantidade'] //utilizando o objeto elements nativo da tag form para capturar o valor do input quantidade


    const existe = itens.find( elemento => elemento.nome === nome.value ) //variável que armazena os itens da lista que já existem. Através do método find(retorna true ou false), passamos como parâmetro uma arrow function que recebe cada elemento do array de objetos itens captura a propriedade nome de cada objeto itemAtual e comparando com o valor da propriedade nome do objeto itemAtual

    const itemAtual = { //objeto que contém os valores do nome e da quantidade do item que está sendo adicionado 
        "nome": nome.value,
        "quantidade": quantidade.value
    }

    //incrementando itens da lista que já existem, evitando a duplicação de objetos com a mesma propriedade nome. Para isso, utilizaremos outra propriedade identificadora: o id.
    if (existe) { //bloco if verifica se existe === true e se verdadeiro adiciona um id no objeto itemAtual que será o mesmo id da constante existe
        itemAtual.id = existe.id
        
        atualizaElemento(itemAtual) //função atualizaElemneto() recebendo como argumento o objeto itemAtual

        itens[itens.findIndex(elemento => elemento.id === existe.id)] = itemAtual // se o id do elemento for igual ao id de existe o método findIndex() retornará true contendo o índice desse elemento. Com a notação de colchetes conseguimos capturar o índice do array itens e atribuí-lo ao objeto itemAtual sobrescrevendo o localStorage durante a atualização de alguma propriedade do objeto itemAtual
    } else {
        itemAtual.id = itens[itens.length -1] ? (itens[itens.length-1]).id + 1 : 0; //se o array existir(verificação que ocorre através da informação que recebemos do tamnaho do array - 1) acessamos o id do último elemento do array e somamos 1; senão, o id será 0

        criaElemento(itemAtual)

        itens.push(itemAtual) // o array de objetos itens recebe o objeto itemAtual e armazena ao final do array através da função push
    }

    localStorage.setItem("itens", JSON.stringify(itens)) //função setItem() da WEB API client-side localStorage recebendo a chave o array de objetos chamado itens e o valor no formato JSON

    nome.value = "" //limpando o input para receber informações adicionais depois
    quantidade.value = "" //limpando o input para receber informações adicionais depois
})

function criaElemento(item) { //a função criaElemento() recebe o objeto itemAtual como argumento
    const novoItem = document.createElement("li") // criando o elemento HTML li dentro do elemento pai ul dinamicamente
    novoItem.classList.add("item") //adicionando a classe CSS item ao elemento li

    const numeroItem = document.createElement("strong") // criando  o elemento HTML strong
    numeroItem.innerHTML = item.quantidade //o innerHTML recebe o valor do input quantidade
    numeroItem.dataset.id = item.id //o numeroItem (variável que guarda a quantidade dos itens adicionados a lista) recebe um id através da propriedade dataset que corresponde a propriedade id do objeto itemAtual
    novoItem.appendChild(numeroItem) //o método appendChild() insere um elemento novo em um elemento já existente que o innerHTML já recebeu
    
    novoItem.innerHTML += item.nome //incrementando o novoItem utilizando o innerHTML para receber o valor do input nome

    novoItem.appendChild(botaoDeleta(item.id)) //a função botaoDeleta() é adicionada ao elemento HTML li através do appendChild()

    lista.appendChild(novoItem) //o elemento HTML ul recebe o novoItem (elemento li) adicionado contendo os valores dos inputs nome e quantidade
}

function atualizaElemento(item) { //a função atualizaElemento() recebe um objeto do array de objetos itens como parâmetro
    document.querySelector("[data-id='"+item.id,"']").innerHTML = item.quantidade //com o document.querySelector() conseguimos capturar o elemento HTML strong (que agora se chama numeroItem) através do data-attribute data-id (que será incrementado ao passo que novos objetos itemAtual forem sendo empurrados para dentro do array de objetos itens) que foi passado através da propriedade dataset dentro da função criaElemento(). O innerHTML precisa ser utilizado porque estamos lidando com um elemento HTML.
}

function botaoDeleta(id) { //cria o elemento HTML button
    const elementoBotao = document.createElement("button") //criando o elemento HTML button
    elementoBotao.innerText = "X" // texto que aparece dentro do botão

    elementoBotao.addEventListener("click", function() { //associação do evento de clicar no botão
        deletaElemento(this.parentNode, id) // a função deletaBotao() recebe como argumento o botão específico que foi clicado (através da palavra-chave this) e o seu elemento pai (ou nó pai) que é a tag li através do parentNode o id do objeto itemAtual a ser deletado também é passado como argumento
    })

    return elementoBotao
}

function deletaElemento(tag, id) {
    tag.remove() // a função deletaElemento() recebe como parâmetros a tag a ser deletada e o id do elemento a ser deletado

    itens.splice(itens.findIndex(elemento => elemento.id === id), 1) //usando o método de array splice(o que queremos remover, remove 1 elemento a partir da posição do array indicada) removeremos o índice do array de objetos itens retornado através da procura de índice dentro desse array a partir do uso do método findIndex(recebe uma arrow function que recebe um elemento do array e compara se esse elemento tem o mesmo id do elemento que foi acionado com o evento de clicar, se sim ele retorna o id desse elemento)
    localStorage.setItem("itens", JSON.stringify(itens)) // deletando do localStorage
}