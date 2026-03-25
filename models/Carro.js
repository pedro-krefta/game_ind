class Obj{
    constructor(x,y,w,h,a){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.img = new Image()
        this.img.src = a
    }

    des_carro(){
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }

    

    des_quad(){
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h,this.a)
    }

    des_carro_manual() {
        // Roda dianteira esquerda (agora superior frente)
        des.beginPath()
        des.lineWidth = '5'
        des.strokeStyle = 'rgb(186, 186, 186)'
        des.fillStyle = 'darkorange'
        des.rect(this.x + 60, this.y-50, 10, 10) 
        des.stroke()
        des.fill()
    
        // Roda dianteira direita (agora inferior frente)
        des.beginPath()
        des.rect(this.x + 60, this.y-10, 10, 10)
        des.stroke()
        des.fill()
    
        // Roda traseira esquerda (agora superior trás)
        des.beginPath()
        des.rect(this.x + 10, this.y-52, 10, 10)
        des.stroke()
        des.fill()
    
        // Roda traseira direita (agora inferior trás)
        des.beginPath()
        des.rect(this.x + 10, this.y-8, 10, 10)
        des.stroke()
        des.fill()
    
        // Trapézio do corpo (Corpo principal rotacionado)
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
    
        // Corpo frente (retângulo do "nariz")
        des.beginPath()
        des.rect(this.x + 50, this.y - 40, 20, 30)
        des.stroke()
        des.fill()
    
        // Asa frontal (vertical na ponta direita)
        des.beginPath()
        des.rect(this.x + 70, this.y - 50, 10, 50)
        des.stroke()
        des.fill()
    }    
}

class Player extends Obj{

    dir = 0
    dir2 = 0
    vida = 5
    pontos = 0
    frame = 1
    tempo = 0

    mov_car(){
        this.y += this.dir
        this.x += this.dir2
        // Limites da tela
        if(this.y <= 0){
            this.y = 0
        }if(this.y >= 700){ // 1200 - 60 (largura do carro)
            this.y = 700
        }
        
        if(this.x <= 0){
            this.x = 0
        }if(this.x >= 1140){ // 1200 - 60 (largura do carro)
            this.x = 1140
        }
    }

    colid(objeto){
        if((this.x < objeto.x + objeto.w)&&
          (this.x + this.w > objeto.x)&&
          (this.y < objeto.y + objeto.h)&&
          (this.y + this.h > objeto.y)){
            return true
        }else{
            return false
        }
    }

    point(objeto){
        if(objeto.x + objeto.w < this.x && objeto.x > -200){
            return true
        }else{
            return false
        }
    }

    

    
}

class Inimigo extends Obj{

    vel = 2

    recomeca(){
        this.x = 1300
        this.y =  Math.floor(Math.random() * (638 - 62) + 62)
        this.pontuado = false
    }

    mov_car(){
        this.x -= this.vel
        if(this.x <= - 200){            
            this.recomeca()         
        }
    }
}

class Text{
    des_text(text,x,y,cor,font){
        des.fillStyle = cor
        des.lineWidth = '5'
        des.font = font
        des.fillText(text,x,y)
    }
}

class Tiro extends Obj {

    vel = 10
    w = 20
    h = 10
    a = 'red'

    mover(){
        this.x += this.vel
    }

    desenhar(){
        this.des_quad()
    }

    colide(obj){
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }
}
class Boss extends Obj {

    vida = 10
    tempoTiro = 0
    dirY = 2 

    atualizar(){

        this.x = 1450

        this.y += this.dirY

        if(this.y <= 0){
            this.y = 0
            this.dirY *= -1
        }


        if(this.y >= 700){
            this.y = 700
            this.dirY *= -1
        }


        this.tempoTiro++

        if(this.tempoTiro > 120){
            this.tempoTiro = 0

            let t = new TiroBoss()
            t.x = this.x
            t.y = this.y + this.h / 2

            tirosBoss.push(t)
        }
    }

    levarDano(){
        this.vida--

        if(this.vida <= 0){
            bossMorto = true
            bossAtivo = false
        }
    }
}
class TiroBoss extends Obj {

    vel = -10
    w = 20
    h = 10
    a = 'purple'

    mover(){
        this.x += this.vel
    }

    desenhar(){
        this.des_quad()
    }

    colide(obj){
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }
}