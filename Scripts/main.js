var canvas = document.getElementById('tutorial');

var background = new Image();
var foreground = new Image();
var particle1 = new Image();
var particle2 = new Image();
var particle3 = new Image();

function init()
{
	background.src = 'Assets/HopoosOriginalBG.png';
	foreground.src = 'Assets/HopoosOriginalFG.png';
	particle1.src = 'Assets/Particle1.png';
	particle2.src = 'Assets/Particle2.png';
	particle3.src = 'Assets/Particle3.png';
	window.requestAnimationFrame(draw);
}

function ParticleSystem(x, y, radiusX, radiusY, velocityX, velocityY, birthRate, lifetime, image, sizeStart, sizeEnd, maxParticles)
{
	this.x = x
	this.y = y
	this.radiusX = radiusX
	this.radiusY = radiusY
	this.velocityX = velocityX
	this.velocityY = velocityY
	this.birthRate = birthRate
	this.lifetime = lifetime
	this.image = image
	this.sizeStart = sizeStart
	this.sizeEnd = sizeEnd
	this.maxParticles = maxParticles

	this.particles = [];
	this.numParticlesEmitted = 0;
	this.timeAlive = 0;
}

particlePool = [];
function GetParticle(lifetime, initialX, initialY, velocityX, velocityY)
{
	if (particlePool.length <= 0)
	{
		var particle = new Particle(lifetime, initialX, initialY, velocityX, velocityY);
		return particle
	}

	var particle = particlePool.pop()
	particle.Initialize(lifetime, initialX, initialY, velocityX, velocityY);
	return particle
}
function RetireParticle(particle)
{
	particlePool.push(particle)
}

ParticleSystem.prototype.Tick = function(deltaSeconds)
{
	this.timeAlive += deltaSeconds

	// Update particles positions.
	this.particles.map(function (particle)
	{
		particle.timeAlive += deltaSeconds

		particle.x += deltaSeconds * particle.velocityX
		particle.y += deltaSeconds * particle.velocityY
	})

	// Remove dead particles.
	var deadParticles = _.select(this.particles, function (particle) { return particle.timeAlive > particle.lifetime } );
	deadParticles.map(function (particle)
	{
		RetireParticle(particle)
	})
	this.particles = _.difference(this.particles, deadParticles)

	// Create new particles.
	this.currentTime = this.currentTime === undefined ? 0 : this.currentTime + deltaSeconds
	if (this.lastParticleCreatedTime === undefined || this.currentTime - this.lastParticleCreatedTime > 1.0 / this.birthRate)
	{
		// Emit all the particles we need in order to "catch up"

		var expectedParticlesCreateByNow = this.timeAlive * this.birthRate

		var numParticlesToEmit = Math.max(0, expectedParticlesCreateByNow - this.numParticlesEmitted)

		for (var i = 0; i < numParticlesToEmit; i++)
		{
			if (this.particles.length > this.maxParticles)
				break;

			this.numParticlesEmitted += 1

			this.particles.push(GetParticle(this.lifetime,
				this.x + Math.random() * this.radiusX - this.radiusX / 2.0, this.y + Math.random() * this.radiusY - this.radiusY / 2.0,
				this.velocityX + Math.random(), this.velocityY + Math.random() * 12.0))			
		}

		this.lastParticleCreatedTime = this.currentTime
	}

//	particles.push(new Particle(3, 50.0, 100.0, 0.0, -4.0))
}

function Particle(lifetime, initialX, initialY, velocityX, velocityY)
{
	this.Initialize(lifetime, initialX, initialY, velocityX, velocityY)
}
Particle.prototype.Initialize = function(lifetime, initialX, initialY, velocityX, velocityY)
{
	this.lifetime = lifetime
	this.x = initialX
	this.y = initialY
	this.velocityX = velocityX
	this.velocityY = velocityY

	this.timeAlive = 0
}

var particleSystems = [];

var maxParticles = 400;
particleSystems.push(new ParticleSystem(306.0, 184.0,    20.0, 3.0,    -0.5, -60.0,   180.0, 1.25,   particle1,  2.5, 0.5,   maxParticles))
particleSystems.push(new ParticleSystem(306.0, 184.0,    15.0, 3.0,    -0.5, -60.0,   137.0, 0.75,   particle2,  2.0, 0.5,   maxParticles))
particleSystems.push(new ParticleSystem(306.0, 184.0,    12.0, 3.0,    -0.5, -60.0,   123.0, 1.25,   particle3,  1.0, 0.5,   maxParticles))
//particleSystems.push(new ParticleSystem(???))
//particleSystems.push(new ParticleSystem(???))

function lerp(a, b, t)
{
	return a + t * (b - a)
}


var lastSeconds = new Date().getTime() / 1000.0;
function draw()
{
	window.requestAnimationFrame(draw);


	var ctx = canvas.getContext('2d')

/*
	ctx.mozImageSmoothingEnabled = false
	ctx.webkitImageSmoothingEnabled = false
	ctx.msImageSmoothingEnabled = false
	ctx.imageSmoothingEnabled = false


//	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = "#3C1D16";
//	ctx.clearRect(0,0,150,150); // clear canvas
	ctx.fillRect(0,0,150,150); // clear canvas
*/
	ctx.drawImage(background, 0, 0)

	var time = new Date();
	var seconds = new Date().getTime() / 1000;
	var deltaSeconds = seconds - lastSeconds;

/*
	ctx.fillStyle = "rgb(200,0,0)";
	ctx.fillRect (10, 10, 55, 50);

	ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
	ctx.fillRect (30, 30, 55, 50);
*/

	// Move origin of particle systems randomly left & right
	particleSystems.map(function (particleSystem)
	{
		particleSystem.x = 306 + Math.sin(seconds * 3.0) * 2.0 + Math.sin(seconds * 8.7) * 2.0
	})

	ctx.fillStyle = "rgba(0, 0, 200, 1.0)";
	particleSystems.map(function (particleSystem)
	{
		particleSystem.Tick(deltaSeconds)

		particleSystem.particles.map(function (particle)
		{
			var size = lerp(particleSystem.sizeStart, particleSystem.sizeEnd, particle.timeAlive / particle.lifetime)
			ctx.drawImage(particleSystem.image, particle.x, particle.y, size * 2, size * 2);
		})
	})


//	ctx.translate(105,0);
//	ctx.drawImage(particle1,Math.sin(seconds) * 20.0,0);
//	ctx.drawImage(particle1,Math.sin(time.getMilliseconds() * 1.0 / 500.0) * 20.0,0);
/*
	ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
	ctx.translate(105,0);
//	ctx.fillRect(0,-12,50,24); // Shadow
	ctx.drawImage(particle1,-12,-12);
*/

	ctx.drawImage(foreground, 0, 0)

	lastSeconds = seconds


}

if (!canvas.getContext)
{
  // canvas-unsupported code here
}
else
{
	init();
}