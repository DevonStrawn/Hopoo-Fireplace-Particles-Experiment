


var canvas = document.getElementById('tutorial');

var background = new Image();
var foreground = new Image();
var particleImages = [];
var particle1 = new Image();
var particle2 = new Image();
var particle3 = new Image();
var particle4 = new Image();
var particleImages = [particle1, particle2, particle3, particle4];

function init()
{
	background.src = 'Assets/HopoosOriginalBG.png';
	foreground.src = 'Assets/HopoosOriginalFG.png';
	particle1.src = 'Assets/HopoosOriginalParticle1.png';
	particle2.src = 'Assets/HopoosOriginalParticle2.png';
	particle3.src = 'Assets/HopoosOriginalParticle3.png';
	particle4.src = 'Assets/HopoosOriginalParticle4.png';

	// Wait for the images to load before continuing.

	var numImagesLoaded = 0;
	particleImages.map(function (particleImage)
	{
		particleImage.onload = function (event)
		{
			numImagesLoaded++
			if (numImagesLoaded === particleImages.length)
			{
				window.requestAnimationFrame(draw);
			}
		}
	})

}

function ParticleSystem(x, y, radiusX, radiusY, velocityX, velocityY, birthRate, lifetime, images, sizeStart, sizeEnd, maxParticles, color, flicker)
{
	this.x = x
	this.y = y
	this.radiusX = radiusX
	this.radiusY = radiusY
	this.velocityX = velocityX
	this.velocityY = velocityY
	this.birthRate = birthRate
	this.lifetime = lifetime
	this.images = images
	this.sizeStart = sizeStart
	this.sizeEnd = sizeEnd
	this.maxParticles = maxParticles
	this.color = color
	this.flicker = flicker

	this.particles = []
	this.numParticlesEmitted = 0
	this.timeAlive = 0
}

particlePool = [];
function GetParticle(lifetime, initialX, initialY, velocityX, velocityY, image, initialRotation, angularVelocity)
{
	if (particlePool.length <= 0)
	{
		var particle = new Particle(lifetime, initialX, initialY, velocityX, velocityY, image, initialRotation, angularVelocity);
		return particle
	}

	var particle = particlePool.pop()
	particle.Initialize(lifetime, initialX, initialY, velocityX, velocityY, image, initialRotation, angularVelocity);
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

		particle.rotation += deltaSeconds * particle.angularVelocity

		if (this.flicker)
			particle.flicker != particle.flicker
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

			// Choose a random particle image
			var imageIndex = Math.round(Math.random() * (this.images.length - 1))
			var image = this.images[imageIndex]

			var newParticle = GetParticle(this.lifetime,
				this.x + Math.random() * this.radiusX - this.radiusX / 2.0, this.y + Math.random() * this.radiusY - this.radiusY / 2.0,
				this.velocityX + Math.random(), this.velocityY + Math.random() * 12.0,
				image,
				Math.random() * Math.PI - Math.PI / 2.0, Math.random() * Math.PI / 10.0 - Math.PI / 20.0)

			if (this.flicker)
				newParticle.flicker = Math.random() > 0.5
			else
				newParticle.flicker = false

			this.particles.push(newParticle)
		}

		this.lastParticleCreatedTime = this.currentTime
	}

//	particles.push(new Particle(3, 50.0, 100.0, 0.0, -4.0))
}

function Particle(lifetime, initialX, initialY, velocityX, velocityY, image, initialRotation, angularVelocity)
{
	this.Initialize(lifetime, initialX, initialY, velocityX, velocityY, image, initialRotation, angularVelocity)
}
Particle.prototype.Initialize = function(lifetime, initialX, initialY, velocityX, velocityY, image, initialRotation, angularVelocity)
{
	this.lifetime = lifetime
	this.x = initialX
	this.y = initialY
	this.velocityX = velocityX
	this.velocityY = velocityY
	this.image = image
	this.rotation = initialRotation
	this.angularVelocity = angularVelocity

	this.timeAlive = 0
}

var particleSystems = [];

var velocityY = -80.0
var maxParticles = 600;
particleSystems.push(new ParticleSystem(306.0, 184.0,    12.0, 3.0,    -0.5, velocityY,   280.0, 1.0,   particleImages,  2.0, 0.35,   maxParticles, "#82301E", false))
particleSystems.push(new ParticleSystem(306.0, 184.0,    12.0, 3.0,    -0.5, velocityY,   170.0, 0.65,   particleImages,  1.5, 0.35,   maxParticles, "#FF7E28", false))
particleSystems.push(new ParticleSystem(306.0, 187.0,    12.0, 3.0,    -0.5, velocityY,   123.0, 0.5,   particleImages,   0.75, 0.25,  maxParticles*3, "#FFD65E", false))
particleSystems.push(new ParticleSystem(306.0, 187.0,    32.0, 3.0,    -0.5, velocityY,   23.0, 0.55,   particleImages,   0.75, 0.25,  maxParticles, "#FFD65E", true))
particleSystems.push(new ParticleSystem(306.0, 187.0,    22.0, 3.0,    -0.5, velocityY,   23.0, 0.8,   particleImages,    0.5, 0.25,   maxParticles, "#FFD65E", true))
//particleSystems.push(new ParticleSystem(???))
//particleSystems.push(new ParticleSystem(???))

function lerp(a, b, t)
{
	return a + t * (b - a)
}

// Store images that we colorized.  Key is string formed from image's src & color string.
var colorizedImageCache = {}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function ColorizeImage(img, color)
{
	var rgb = hexToRgb(color)
	var r = rgb.r
	var g = rgb.g
	var b = rgb.b

    var c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var imgData=ctx.getImageData(0, 0, c.width, c.height);
    for (var i=0; i < imgData.data.length; i += 4)
    {
/*
		imgData.data[i]= r | imgData.data[i];
		imgData.data[i+1]= g | imgData.data[i+1];
		imgData.data[i+2]= b | imgData.data[i+2];
*/
        imgData.data[i]= (r * imgData.data[i]) >> 8;
        imgData.data[i+1]= (g * imgData.data[i+1]) >> 8;
        imgData.data[i+2]= (b * imgData.data[i+2]) >> 8;
    }
    ctx.putImageData(imgData,0,0);
    return c;
}

var lastSeconds = new Date().getTime() / 1000.0;
function draw()
{
	window.requestAnimationFrame(draw);


	var ctx = canvas.getContext('2d')
	ctx.drawImage(background, 0, 0)

	var time = new Date();
	var seconds = new Date().getTime() / 1000;
	var deltaSeconds = seconds - lastSeconds;

	// Move origin of particle systems randomly left & right
	particleSystems.map(function (particleSystem)
	{
		particleSystem.x = 306 + Math.random() * 2 + Math.sin(seconds * 24.0) * 2.0 + Math.sin(seconds * 8.7) * 2.0
	})

	ctx.fillStyle = "rgba(0, 0, 200, 1.0)";
	particleSystems.map(function (particleSystem)
	{
		particleSystem.Tick(deltaSeconds)

		particleSystem.particles.map(function (particle)
		{
			var colorizedImage = colorizedImageCache[[particleSystem.color, particle.image.src]]
			if (colorizedImage == undefined)
			{
				colorizedImage = ColorizeImage(particle.image, particleSystem.color)
				colorizedImageCache[[particleSystem.color, particle.image.src]] = colorizedImage
			}

			var size = lerp(particleSystem.sizeStart, particleSystem.sizeEnd, particle.timeAlive / particle.lifetime)

			// TODO Rotate before drawing.
			ctx.save()

//			ctx.translate(-particle.x * 2.0, -particle.y * 2.0)
			ctx.translate(particle.x, particle.y)
			ctx.rotate(particle.rotation)

//			ctx.drawImage(colorizedImage, particle.x * 2.0, particle.y * 2.0, size * 4, size * 4);
			if (particle.flicker != true)
				ctx.drawImage(colorizedImage, 0, 0, size * 4, size * 4);

			ctx.restore()
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
