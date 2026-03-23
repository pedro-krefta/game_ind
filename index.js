let des = document.getElementById('des').getContext('2d')

let inimigo = new Inimigo(1900, 325, 80, 50, '../img/obstaculo.png')
let inimigo2 = new Inimigo(1900, 125, 80, 50, '../img/obstaculo.png')
let inimigo3 = new Inimigo(1900, 400, 80, 50, '../img/obstaculo.png')
let player = new Player(100, 325, 80, 50, '../img/player.png')

let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let motor = new Audio('./img/motor.wav')
let batida = new Audio('./img/batida.mp3')
motor.volume = 0.5
motor.loop = true
batida.volume = 0.5

let jogar = true
let fase = 1

document.addEventListener('keydown', (e)=>{
    if(e.key === 's'){
        player.dir = +10
    console.log(player.dir)
    }else if(e.key === 'w'){
        player.dir = -10
    console.log(player.dir)
    }
    
})

document.addEventListener('keyup', (e)=>{
    if(e.key === 'w' || e.key === 's'){
        player.dir = 0   
    }
})


document.addEventListener('keydown', (e)=>{
    if(e.key === 'a'){
        player.dir2 = -10
    console.log(player.dir)
    }else if(e.key === 'd'){
        player.dir2 = 10
    console.log(player.dir)
    }
    
})

document.addEventListener('keyup', (e)=>{
    if(e.key === 'a' || e.key === 'd'){
        player.dir2 = 0   
    }
})
function game_over() {
    if (player.vida <= 0) {
        jogar = false
        motor.pause()
        // música com o jogo parado
    }
}

function ver_fase() { 
    if (player.pontos > 20 && fase === 1) {
        fase = 2
        inimigo.vel = 4
        inimigo2.vel = 4
        inimigo3.vel = 4
    } else if (player.pontos > 40 && fase === 2) {
        fase = 3
        inimigo.vel = 6
        inimigo2.vel = 6
        inimigo3.vel = 6
    }
}

function colisao() {
    if (player.colid(inimigo)) {
        batida.play()
        inimigo.recomeca()
        player.vida -= 1

    }
    if (player.colid(inimigo2)) {
        batida.play()
        inimigo2.recomeca()
        player.vida -= 1
    }
    if (player.colid(inimigo3)) {
        batida.play()
        inimigo3.recomeca()
        player.vida -= 1
    }
    // console.log('vida: ', player.vida)
}

function pontuacao() {
    if (player.point(inimigo)) {
        player.pontos += 5
        inimigo.recomeca()
    }
    if (player.point(inimigo2)) {
        player.pontos += 5
        inimigo2.recomeca()
    }
    if (player.point(inimigo3)) {
        player.pontos += 5
        inimigo3.recomeca()
    }
}

function desenha() {

    if (jogar) {
        inimigo.des_carro()
        inimigo2.des_carro()
        inimigo3.des_carro()
        player.des_carro()
        t1.des_text('Pontos: ' + player.pontos, 1000, 40, 'yellow', '26px Arial')
        t2.des_text('Vidas: ' + player.vida, 40, 40, 'red', '26px Arial')
        fase_txt.des_text('Fase: ' + fase, 550, 40, 'white', '26px Arial')
    }else{
        t1.des_text('GAME OVER', 450, 350, 'yellow', '60px Arial')
        t2.des_text('Pontuação Final: ' + player.pontos, 480, 400, 'white', '25px Arial')
    }

}

function atualiza() {
    if (jogar) {
        player.mov_car()
        // player.anim('carro_00')
        inimigo.mov_car()
        inimigo2.mov_car()
        inimigo3.mov_car()
        colisao()
        pontuacao()
        ver_fase()
        game_over()
    }
}

function main() {
    des.clearRect(0, 0, 1920, 1080)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

main()