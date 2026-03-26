let des = document.getElementById('des').getContext('2d')

let inimigo = new Inimigo(1900, 325, 150, 120, '../img/obstaculo01.png')
let inimigo2 = new Inimigo(1900, 125, 150, 120, '../img/obstaculo01.png')
let inimigo3 = new Inimigo(1900, 400, 150, 120, '../img/obstaculo01.png')
let inimigo4 = new Inimigo(1900, 200, 150, 120, '../img/obstaculo01.png')
let player = new Player(100, 325, 150, 120, '../img/player01.png')
let player2 = new Player(100, 325, 150, 120, '../img/player_02.png')

let item = new Coletavel(1900, 100, 100, 80, '../img/coletavel.png')


let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let boss = null
let bossAtivo = false
let bossMorto = false
let pontoBoss = 400
let tirosBoss = []

// let motor = new Audio('./img/motor.wav')
// let batida = new Audio('./img/batida.mp3')
// motor.volume = 0.5
// motor.loop = true
// batida.volume = 0.5

let jogar = true
let fase = 1
let tiros = []

document.addEventListener('keydown', (e)=>{
    if(e.key === 'w') player.dir = -10
    if(e.key === 's') player.dir = 10
    if(e.key === 'a') player.dir2 = -10
    if(e.key === 'd') player.dir2 = 10

    if(e.key === 'ArrowUp') player2.dir = -10
    if(e.key === 'ArrowDown') player2.dir = 10
    if(e.key === 'ArrowLeft') player2.dir2 = -10
    if(e.key === 'ArrowRight') player2.dir2 = 10
})

document.addEventListener('keyup', (e)=>{
    if(e.key === 'w' || e.key === 's') player.dir = 0
    if(e.key === 'a' || e.key === 'd') player.dir2 = 0

    
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown') player2.dir = 0
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') player2.dir2 = 0

    if(e.key === 'f') {
        tiros.push(new Tiro(player.x + player.w, player.y + player.h/2, 10, 5, 'yellow'))
    }

    if(e.key === 'Enter') {
        tiros.push(new Tiro(player2.x + player2.w, player2.y + player2.h/2, 10, 5, 'blue'))
    }
})

function game_over() {
    if (player.vida <= 0 && player2.vida <= 0) {
        jogar = false
        // motor.pause()
        // música com o jogo parado
    }
}

function ver_fase() { 
    if (player.pontos > 200 && fase === 1) {
        fase = 2
        inimigo.vel = 3
        inimigo2.vel = 3
        inimigo3.vel = 3
    } else if (player.pontos > 300 && fase === 2) {
        fase = 3
    inimigo.vel = 5
    inimigo2.vel = 5
    inimigo3.vel = 5
    inimigo4.vel = 5
   
    }
    
}

function colisao() {

    if (bossAtivo) return


    if (player.colid(inimigo)) {
        // batida.play()
        inimigo.recomeca()
        player.vida -= 1

    }
    if (player.colid(inimigo2)) {
        // batida.play()
        inimigo2.recomeca()
        player.vida -= 1
    }
    if (player.colid(inimigo3)) {
        // batida.play()
        inimigo3.recomeca()
        player.vida -= 1
    }
    if (player.colid(inimigo4)) {
        // batida.play()
        inimigo4.recomeca()
        player.vida -= 1
    }
    if (player2.colid(inimigo)) {
        // batida.play()
        inimigo.recomeca()
        player2.vida -= 1

    }
    if (player2.colid(inimigo2)) {
        // batida.play()
        inimigo2.recomeca()
        player2.vida -= 1
    }
    if (player2.colid(inimigo3)) {
        // batida.play()
        inimigo3.recomeca()
        player2.vida -= 1
    }
    if (player2.colid(inimigo4)) {
        // batida.play()
        inimigo4.recomeca()
        player2.vida -= 1
    }
    if (player.colid(item)) {
        // batida.play()
        item.esconder()
        player.vida += 1
    }
    if (player2.colid(item)) {
        // batida.play()
        item.esconder()
        player2.vida += 1
    }
    // console.log('vida: ', player.vida)
}

function pontuacao() {
    if (player.point(inimigo) && !inimigo.pontuado) {
        player.pontos -= 5
        inimigo.pontuado = true
        inimigo.recomeca()
    }
    if (player.point(inimigo2) && !inimigo2.pontuado) {
        player.pontos -= 5
        inimigo2.pontuado = true
        inimigo2.recomeca()
    }
    if (player.point(inimigo3) && !inimigo3.pontuado) {
        player.pontos -= 5
        inimigo3.pontuado = true
        inimigo3.recomeca()
    }
    if (player.point(inimigo4) && !inimigo4.pontuado) {
        player.pontos -= 5
        inimigo4.pontuado = true
        inimigo4.recomeca()
    }
}

function desenharPlayers() {
    if (player.vida > 0) player.des_carro()
    if (player2.vida > 0) player2.des_carro()
}

function desenha() {
    tirosBoss.forEach(t => t.desenhar())
    if (jogar) {
        inimigo.des_carro()
        inimigo2.des_carro()
        inimigo3.des_carro()
        inimigo4.des_carro()
        item.des_carro()
        desenharPlayers()
        tiros.forEach(t => t.desenhar())
        if (bossAtivo && boss) {
        boss.des_carro()
        }
        if (bossAtivo && boss) {
        t1.des_text('BOSS VIDA: ' + boss.vida, 800, 80, 'red', '30px Arial')
        }
        t1.des_text('Pontos: ' + player.pontos, 1000, 40, 'yellow', '26px Arial')
        t2.des_text('Vidas: ' + player.vida, 40, 40, 'red', '26px Arial')
        fase_txt.des_text('Fase: ' + fase, 550, 40, 'white', '26px Arial')
        t2.des_text('Vidas: ' + player2.vida, 40, 80, 'red', '26px Arial')
      
    }else{
        t1.des_text('GAME OVER', 450, 350, 'yellow', '60px Arial')
        t2.des_text('Pontuação Final: ' + player.pontos, 480, 400, 'white', '25px Arial')
    }

}

function colisao_tiro(){
    tiros.forEach((t, i)=>{

        if(t.colide(inimigo)){
            inimigo.recomeca()
            tiros.splice(i,1)
            player.pontos += 5
        }

        if(t.colide(inimigo2)){
            inimigo2.recomeca()
            tiros.splice(i,1)
            player.pontos += 5
        }

        if(t.colide(inimigo3)){
            inimigo3.recomeca()
            tiros.splice(i,1)
            player.pontos += 5
        }

        if(t.colide(inimigo4)){
            inimigo4.recomeca()
            tiros.splice(i,1)
            player.pontos += 5
        }

        if (bossAtivo && boss && t.colide(boss)) {
            boss.levarDano()
            tiros.splice(i,1)
        }
        if(t.colide(inimigo)){
            inimigo.recomeca()
            tiros.splice(i,1)
            player2.pontos += 5
        }

        if(t.colide(inimigo2)){
            inimigo2.recomeca()
            tiros.splice(i,1)
            player2.pontos += 5
        }

        if(t.colide(inimigo3)){
            inimigo3.recomeca()
            tiros.splice(i,1)
            player2.pontos += 5
        }

        if(t.colide(inimigo4)){
            inimigo4.recomeca()
            tiros.splice(i,1)
            player2.pontos += 5
        }

        if (bossAtivo && boss && t.colide(boss)) {
            boss.levarDano()
            tiros.splice(i,1)
        }


    })
}

function colisao_tiroBoss(){
    tirosBoss.forEach((t, i)=>{
        if(t.colide(player)){
            player.vida--
            tirosBoss.splice(i,1)
        }
    })
}



function atualiza_tiros(){
    tiros.forEach((t, i)=>{
        t.mover()

        if(t.x > 1920){
            tiros.splice(i,1)
        }
    })
}

function atualiza_tirosBoss(){
    tirosBoss.forEach((t, i)=>{
        t.mover()

        if(t.x < -50){
            tirosBoss.splice(i,1)
        }
    })
}

function bossFight(){
    if (player.pontos >= pontoBoss && !bossAtivo && !bossMorto) {
        console.log("CRIANDO BOSS")
        boss = new Boss(1800, 200, 150, 150, '../img/boss.png', 10)
        bossAtivo = true

        inimigo.x = -500
        inimigo2.x = -500
        inimigo3.x = -500
        inimigo4.x = -500
    }
}


function atualizarBoss() {
    if (bossAtivo && boss) {
        boss.atualizar()
    }
}

function atualizarInimigos() {
    if (bossAtivo) return

    inimigo.mov_car()
    inimigo2.mov_car()
    inimigo3.mov_car()
    inimigo4.mov_car()
}

function atualizarPlayer1() {
    if (player.vida > 0) {
        player.mov_car()
    }
}

function atualizarPlayer2() {
    if (player2.vida > 0) {
        player2.mov_car()
    }
}



function atualiza() {
    if (jogar) {
        atualizarInimigos()
        atualizarPlayer1()
        atualizarPlayer2()
        item.mov_car()
        bossFight()
        atualizarBoss()
        atualiza_tirosBoss()
        colisao_tiroBoss()
        atualiza_tiros()
        colisao_tiro()
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