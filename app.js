const img = document.getElementById("img")
const input = document.getElementById("input")
var animationID;
var canvas = document.createElement("canvas")
document.body.insertBefore(canvas, document.body.firstChild)
canvas.width = innerWidth
canvas.height = innerHeight
const c = canvas.getContext("2d")

const gap = 4
var mouse = {
    x: undefined,
    y: undefined,
    radius: 10000
}

window.addEventListener("mousemove", function(event)
{
    mouse.x = event.clientX
    mouse.y = event.clientY
    console.log(event)
})

window.addEventListener("touchmove", function(){
    const touch = event.touches[0]
    mouse.x = touch.clientX
    mouse.y = touch.clientY
})

function random_in_range(min, max)
{
    return Math.floor(Math.random() * (max - min) + min)
}

c.drawImage(img, (canvas.width - img.width)/2, (canvas.height - img.height)/2)

class Particle
{
    constructor(x, y, color)
    {
        this.Origin_x = x;
        this.Origin_y = y
        this.color = color

        this.x = random_in_range(0, canvas.width)
        this.y = random_in_range(0, canvas.height)
        this.size = gap

        this.dx = 0;
        this.dy = 0
        this.distance = 0
        this.vx = 0
        this.vy = 0
        this.force = 0
        this.friction = 0.98
        this.angle = 0
        this.ease = 0.03
    }

    draw()
    {
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, this.size, this.size)
    }

    update()
    {
        this.dx = mouse.x - this.x
        this.dy = mouse.y - this.y
        this.distance = this.dx * this.dx + this.dy * this.dy
        this.force = -  mouse.radius / this.distance

        if(this.distance < mouse.radius)
        {
            this.angle = Math.atan2(this.dy, this.dx)
            this.vx += this.force * Math.cos(this.angle)
            this.vy += this.force * Math.sin(this.angle)
        }
        this.x += (this.vx *= this.friction) + (this.Origin_x - this.x) * this.ease
        this.y += (this.vy *= this.friction) + (this.Origin_y - this.y) * this.ease
        this.draw()
    }
    
    
    spread()
    {
        this.x = random_in_range(-100, canvas.width + 100)
        this.y = random_in_range(-100, canvas.height + 100)

    }
}

class Effect
{
    constructor()
    {
        this.particle_array = []

    }

    init()
    {
        this.particle_array.length = 0
        const pixels = c.getImageData(0, 0, canvas.width, canvas.height).data
        for(var y = 0; y<canvas.height; y+=gap)
            for(var x = 0; x <canvas.width; x += gap)
        {
            const index = (y * canvas.width + x) * 4
            const r = pixels[index]
            const g = pixels[index + 1]
            const b = pixels[index + 2]
            const alpha = pixels[index + 3]
            if(alpha > 0)
            {
                const color = `rgb(${r}, ${g}, ${b})`
                this.particle_array.push(new Particle(x, y, color))
            }
        }
    }
    spread()
    {
        for(var particle of this.particle_array)
            particle.spread()
    }

    update()
    {
        for(var particle of this.particle_array)
            particle.update();
    }
    animate()
    {
        requestAnimationFrame(this.animate)
        console.log("shit")
    }
}

var effect = new Effect()
effect.init()

function animate()
{
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    effect.update()
}
animate()


input.addEventListener("change", function(event)
{
    const file = input.files[0];
    if(file)
    {
        cancelAnimationFrame(animationID)
        const image1 = new Image();
        image1.onload = ()=>
        {
            c.clearRect(0, 0, canvas.width, canvas.height)
            c.drawImage(image1, (canvas.width - img.width)/2, (canvas.height - img.height)/2)
        }
        image1.src = URL.createObjectURL(file)
        var ef = new Effect();
        ef.init()
        animate(ef)
    }
})

console.log(effect.particle_array.length)