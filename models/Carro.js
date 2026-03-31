class Obj {
    constructor(x, y, w, h, a) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.img = new Image()
        this.img.src = a
    }

    des_carro() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }

    des_quad() {
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h)
    }

    des_carro_manual() {
        des.beginPath()
        des.lineWidth = '5'
        des.strokeStyle = 'rgb(186, 186, 186)'
        des.fillStyle = 'darkorange'
        des.rect(this.x + 60, this.y - 50, 10, 10)
        des.stroke()
        des.fill()

        des.beginPath()
        des.rect(this.x + 60, this.y - 10, 10, 10)
        des.stroke()
        des.fill()

        des.beginPath()
        des.rect(this.x + 10, this.y - 52, 10, 10)
        des.stroke()
        des.fill()

        des.beginPath()
        des.rect(this.x + 10, this.y - 8, 10, 10)
        des.stroke()
        des.fill()

        des.beginPath()
        des.moveTo(this.x, this.y - 50)
        des.lineTo(this.x, this.y)
        des.lineTo(this.x + 50, this.y - 10)
        des.lineTo(this.x + 50, this.y - 40)
        des.closePath()
        des.lineWidth = '5'
        des.strokeStyle = 'rgb(186, 186, 186)'
        des.fillStyle = this.a
        des.stroke()
        des.fill()

        des.beginPath()
        des.rect(this.x + 50, this.y - 40, 20, 30)
        des.stroke()
        des.fill()

        des.beginPath()
        des.rect(this.x + 70, this.y - 50, 10, 50)
        des.stroke()
        des.fill()
    }
}

class Player extends Obj {

    dir = 0
    dir2 = 0
    vida = 5
    pontos = 0

    mov_car() {
        this.y += this.dir
        this.x += this.dir2

        if (this.y <= 0) this.y = 0
        if (this.y >= 700) this.y = 700
        if (this.x <= 0) this.x = 0
        if (this.x >= 1140) this.x = 1140
    }

    colid(objeto) {
        return (
            this.x < objeto.x + objeto.w &&
            this.x + this.w > objeto.x &&
            this.y < objeto.y + objeto.h &&
            this.y + this.h > objeto.y
        )
    }

    point(objeto) {
        if (objeto.x + objeto.w < this.x && objeto.x > -200) {
            return true
        }
        return false
    }
}

class Inimigo extends Obj {

    vel = 14

    recomeca() {
        this.x = 1300
        this.y = Math.floor(Math.random() * (638 - 62) + 62)
        this.pontuado = false
    }

    mov_car() {
        this.x -= this.vel
        if (this.x <= -200) {
            this.recomeca()
        }
    }
}

class Coletavel extends Obj {

    vel = 10
    ativo = true
    tempoRespawn = 0
    tempoMax = 240

    recomeca() {
        this.x = 1300
        this.y = Math.floor(Math.random() * (650 - 62) + 62)
        this.pontuado = false
        this.ativo = true
    }

    esconder() {
        this.x = -500
        this.ativo = false
        this.tempoRespawn = 0
    }

    mov_car() {
        if (this.ativo) {
            this.x -= this.vel
            if (this.x <= -200) {
                this.esconder()
            }
        } else {
            this.tempoRespawn++
            if (this.tempoRespawn >= this.tempoMax) {
                this.recomeca()
            }
        }
    }
}

class Text {
    des_text(text, x, y, cor, font) {
        des.fillStyle = cor
        des.lineWidth = '5'
        des.font = font
        des.fillText(text, x, y)
    }
}

class Tiro extends Obj {

    constructor(x, y, w, h, a) {
        super(x, y, w || 20, h || 10, a || 'red')
        this.vel = 10
    }

    mover() {
        this.x += this.vel
    }

    desenhar() {
        this.des_quad()
    }

    colide(obj) {
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }
}

class Boss extends Obj {

    constructor(x, y, w, h, a, vida) {
        super(x, y, w, h, a)
        this.vida = vida || 50 
        this.tempoTiro = 0
        this.dirY = 2
    }

    atualizar() {
        if (this.x > 1100) {
            this.x -= 2
        }

        this.y += this.dirY

        if (this.y <= 0) {
            this.y = 0
            this.dirY *= -1
        }
        if (this.y >= 700) {
            this.y = 700
            this.dirY *= -1
        }

        this.tempoTiro++
        if (this.tempoTiro > 60) {
            this.tempoTiro = 0
        
            // tiro reto
            tirosBoss.push(
                new TiroBoss(this.x, this.y + this.h / 2, 20, 10, 'purple', -10, 0)
            )
        
            // diagonal cima
            tirosBoss.push(
                new TiroBoss(this.x, this.y + this.h / 2, 20, 10, 'purple', -10, -4)
            )
        
            // diagonal baixo
            tirosBoss.push(
                new TiroBoss(this.x, this.y + this.h / 2, 20, 10, 'purple', -10, 4)
            )
        }
    }

    levarDano() {
        this.vida--
        if (this.vida <= 0) {
            bossMorto = true
            bossAtivo = false
        }
    }
}

class TiroBoss extends Obj {

    constructor(x, y, w, h, a, velX, velY) {
        super(x, y, w || 20, h || 10, a || 'purple')
        this.velX = velX || -10
        this.velY = velY || 0
    }

    mover() {
        this.x += this.velX
        this.y += this.velY
    }

    desenhar() {
        this.des_quad()
    }

    colide(obj) {
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }
}

class BarraVida {
    desenhar(x, y, vidaAtual, vidaMax, cor, label) {
        const largura = 150
        const altura = 14
        const preenchimento = (vidaAtual / vidaMax) * largura

        // sombra
        des.shadowColor = cor
        des.shadowBlur = 8

        // fundo da barra
        des.fillStyle = '#222'
        des.fillRect(x, y, largura, altura)

        // preenchimento
        des.fillStyle = cor
        des.fillRect(x, y, preenchimento, altura)

        // borda
        des.shadowBlur = 0
        des.strokeStyle = 'white'
        des.lineWidth = 1.5
        des.strokeRect(x, y, largura, altura)

        // label
        des.fillStyle = 'white'
        des.font = 'bold 13px monospace'
        des.fillText(label + ' ' + vidaAtual + '/' + vidaMax, x, y - 5)
    }
}