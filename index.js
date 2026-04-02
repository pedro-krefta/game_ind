// Variáveis globais usadas diretamente pelo Carro.js
let des
let tirosBoss = []

// Aguarda o evento disparado pelo menu antes de iniciar o jogo
document.addEventListener('iniciarJogo', () => {

    // ── Lê o modo direto do elemento HTML
    const IS_1P = document.getElementById('gameMode').value === '1p'

    des = document.getElementById('des').getContext('2d')

    let inimigo  = new Inimigo(1900, 325, 150, 120, '../img/obstaculo01.png')
    let inimigo2 = new Inimigo(1900, 125, 150, 120, '../img/obstaculo01.png')
    let inimigo3 = new Inimigo(1900, 400, 150, 120, '../img/obstaculo01.png')
    let inimigo4 = new Inimigo(1900, 200, 150, 120, '../img/obstaculo01.png')
    let player  = new Player(100, 325, 150, 120, '../img/player01.png')
    let player2 = new Player(100, 325, 150, 120, '../img/player_02.png')
    let item = new Coletavel(1900, 100, 100, 80, '../img/coletavel.png')

    // Em modo 1P, player2 começa morto e fora da tela
    if (IS_1P) {
        player2.vida = 0
        player2.x    = -999999
    }

    let bg1 = new Image()
    let bg2 = new Image()
    let bg3 = new Image()
    bg1.src = '../img/cenario01.png'
    bg2.src = '../img/cenario02.png'
    bg3.src = '../img/cenario03.png'

    let t1 = new Text()
    let t2 = new Text()
    let fase_txt = new Text()

    let barraVida1 = new BarraVida()
    let barraVida2 = new BarraVida()

    let boss = null
    let bossAtivo = false
    let bossMorto = false
    let pontoBoss = 400
    tirosBoss = []

    let trilha      = new Audio('./img/trilha.mp3')
    let somTiro     = new Audio('./img/tiro.mp3')
    let somGameOver = new Audio('./img/gameOver.mp3')
    trilha.volume = 0.5
    trilha.loop = true
    somTiro.volume = 0.1

    let jogar = true
    let fase = 1
    let tiros = []
    let animFrameId = null
    let trilhaTocando = false


    document.addEventListener('keydown', (e) => {
        if (!trilhaTocando) {
            trilha.play()
            trilhaTocando = true
        }

        // ── Player 1 (sempre ativo)
        if (e.key === 'w') player.dir  = -10
        if (e.key === 's') player.dir  =  10
        if (e.key === 'a') player.dir2 = -10
        if (e.key === 'd') player.dir2 =  10

        // ── Player 2 (só no modo 2P)
        if (!IS_1P) {
            if (e.key === 'ArrowUp')    player2.dir  = -10
            if (e.key === 'ArrowDown')  player2.dir  =  10
            if (e.key === 'ArrowLeft')  player2.dir2 = -10
            if (e.key === 'ArrowRight') player2.dir2 =  10
        }

        // ── Tiro Player 1
        if (e.key === 'f' && player.vida > 0) {
            tiros.push(new Tiro(player.x + player.w, player.y + player.h / 2, 20, 10, 'yellow'))
            somTiro.currentTime = 0
            somTiro.play()
        }

        // ── Tiro Player 2 (só no modo 2P)
        if (!IS_1P && e.key === 'Enter' && player2.vida > 0) {
            tiros.push(new Tiro(player2.x + player2.w, player2.y + player2.h / 2, 20, 10, 'blue'))
            somTiro.currentTime = 0
            somTiro.play()
        }
    })

    document.addEventListener('keyup', (e) => {
        if (e.key === 'w' || e.key === 's') player.dir  = 0
        if (e.key === 'a' || e.key === 'd') player.dir2 = 0

        if (!IS_1P) {
            if (e.key === 'ArrowUp'    || e.key === 'ArrowDown')  player2.dir  = 0
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowRight') player2.dir2 = 0
        }
    })

    function game_over() {
        if (player.vida  < 0) player.vida  = 0
        if (player2.vida < 0) player2.vida = 0

        const p1Morto = player.vida  <= 0
        const p2Morto = IS_1P ? true : player2.vida <= 0

        if (p1Morto && p2Morto) {
            jogar = false
            somGameOver.play()
            desenha()
        }
    }

    function ver_fase() {
        let totalPontos = player.pontos + player2.pontos

        if (totalPontos > 200 && fase === 1) {
            fase = 2
            inimigo.vel  = 16
            inimigo2.vel = 16
            inimigo3.vel = 16
            inimigo4.vel = 16
        } else if (totalPontos > 300 && fase === 2) {
            fase = 3
            inimigo.vel  = 18
            inimigo2.vel = 18
            inimigo3.vel = 18
            inimigo4.vel = 18
        }
    }

    function colisao() {
        if (bossAtivo) return

        const inimigos = [inimigo, inimigo2, inimigo3, inimigo4]
        const players  = IS_1P ? [player] : [player, player2]

        players.forEach(p => {
            if (p.vida <= 0) return

            inimigos.forEach(ini => {
                if (p.colid(ini)) {
                    ini.recomeca()
                    p.vida -= 1
                }
            })

            if (p.colid(item)) {
                item.esconder()
                p.vida += 1
            }
        })
    }

    function pontuacao() {
        const inimigos = [inimigo, inimigo2, inimigo3, inimigo4]

        inimigos.forEach(ini => {
            if (ini.x + ini.w < player.x && ini.x > -200 && !ini.pontuado) {
                ini.pontuado = true
            }
        })
    }

    function desenharPlayers() {
        if (player.vida > 0)            player.des_carro()
        if (!IS_1P && player2.vida > 0) player2.des_carro()
    }

    function desenha() {
        des.clearRect(0, 0, 1920, 1080)

        if (fase === 1) des.drawImage(bg1, 0, 0, 1920, 1080)
        else if (fase === 2) des.drawImage(bg2, 0, 0, 1920, 1080)
        else if (fase === 3) des.drawImage(bg3, 0, 0, 1920, 1080)

        if (jogar) {
            if (!bossAtivo) {
                inimigo.des_carro()
                inimigo2.des_carro()
                inimigo3.des_carro()
                inimigo4.des_carro()
            }

            item.des_carro()
            desenharPlayers()

            tiros.forEach(t => t.desenhar())
            tirosBoss.forEach(t => t.desenhar())

            if (bossAtivo && boss) {
                boss.des_carro()

                des.fillStyle = '#333'
                des.fillRect(500, 20, 400, 20)

                des.fillStyle = 'purple'
                des.fillRect(500, 20, (boss.vida / 10) * 400, 20)

                des.strokeStyle = 'white'
                des.lineWidth = 2
                des.strokeRect(500, 20, 400, 20)

                t1.des_text('BOSS', 670, 55, 'white', 'bold 16px monospace')
            }

            if (bossMorto) {
                t1.des_text('BOSS DERROTADO!', 450, 80, 'lime', '30px Arial')
            }

            // HUD Player 1 (sempre)
            t1.des_text('P1 Pontos: ' + player.pontos, 1000, 40, 'yellow', '26px Arial')
            barraVida1.desenhar(40, 50, player.vida, 5, '#ff4444', 'P1')

            // HUD Player 2 (só no modo 2P)
            if (!IS_1P) {
                barraVida2.desenhar(40, 90, player2.vida, 5, '#44aaff', 'P2')
                t2.des_text('P2 Pontos: ' + player2.pontos, 1000, 80, 'orange', '26px Arial')
            }

            fase_txt.des_text('Fase: ' + fase, 550, 40, 'white', '26px Arial')

        } else {
            t1.des_text('GAME OVER', 450, 300, 'yellow', '60px Arial')
            t2.des_text('P1 Pontuação Final: ' + player.pontos, 430, 380, 'white', '25px Arial')

            if (!IS_1P) {
                t2.des_text('P2 Pontuação Final: ' + player2.pontos, 430, 420, 'orange', '25px Arial')
            }

            t1.des_text('Pressione F5 para recomeçar', 400, 480, 'yellow', '28px Arial')
        }
    }

    function colisao_tiro() {
        const inimigos = [inimigo, inimigo2, inimigo3, inimigo4]

        for (let i = tiros.length - 1; i >= 0; i--) {
            let t = tiros[i]
            let acertou = false

            for (let ini of inimigos) {
                if (t.colide(ini)) {
                    ini.recomeca()
                    if (t.a === 'yellow') player.pontos  += 5
                    else                  player2.pontos += 5
                    tiros.splice(i, 1)
                    acertou = true
                    break
                }
            }

            if (!acertou && bossAtivo && boss && t.colide(boss)) {
                boss.levarDano()
                if (t.a === 'yellow') player.pontos  += 1
                else                  player2.pontos += 1
                tiros.splice(i, 1)
            }
        }
    }

    function colisao_tiroBoss() {
        for (let i = tirosBoss.length - 1; i >= 0; i--) {
            let t = tirosBoss[i]

            if (player.vida > 0 && t.colide(player)) {
                player.vida--
                tirosBoss.splice(i, 1)
                continue
            }

            if (!IS_1P && player2.vida > 0 && t.colide(player2)) {
                player2.vida--
                tirosBoss.splice(i, 1)
            }
        }
    }

    function atualiza_tiros() {
        for (let i = tiros.length - 1; i >= 0; i--) {
            tiros[i].mover()
            if (tiros[i].x > 1920) {
                tiros.splice(i, 1)
            }
        }
    }

    function atualiza_tirosBoss() {
        for (let i = tirosBoss.length - 1; i >= 0; i--) {
            tirosBoss[i].mover()
            if (tirosBoss[i].x < -50) {
                tirosBoss.splice(i, 1)
            }
        }
    }

    function bossFight() {
        let totalPontos = player.pontos + player2.pontos

        if (totalPontos >= pontoBoss && !bossAtivo && !bossMorto) {
            boss = new Boss(1800, 200, 150, 150, '../img/boss.png')
            bossAtivo = true

            inimigo.x  = -500
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
        if (player.vida > 0) player.mov_car()
    }

    function atualizarPlayer2() {
        if (!IS_1P && player2.vida > 0) player2.mov_car()
    }

    function atualiza() {
        if (!jogar) return

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

    function main() {
        desenha()
        atualiza()
        requestAnimationFrame(main)
    }

    main()
})