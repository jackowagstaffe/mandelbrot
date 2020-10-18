// Settings
const width = 1000
const height = 1000

// Mandelbrot Functions

/**
 * Draw a frame of the madelbrot onto the canvas
 */
const mandelbrot = (canvas, width, height, colourMap = (n) => [n, n, n], zoomLevel, offsetX, offsetY) => {

  const context = canvas.getContext('2d')

  /**
   * ImageData contains an array of pixels with Red Green Blue and Alpha values 0 - 255
   */
  const imageData = context.createImageData(width, height)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const colours = colourMap(getMandelbrotPixel(width, height, x, y, zoomLevel, offsetX, offsetY))
      updatePixel(
        imageData, 
        width, 
        x,
        y,
        colours[0],
        colours[1],
        colours[2]
      )
    }
  }

  context.putImageData(imageData, 0, 0)
}

/**
 * Get data for a pixel of the Mandelbrot
 */
const getMandelbrotPixel = (width, height, x, y, zoomLevel, offsetX, offsetY) => {
  const minX = ((-2 / zoomLevel) + (offsetX / width * 2)) 
  const maxX = ((2 / zoomLevel) + (offsetX / width * 2)) 
  const minY = ((-2 / zoomLevel) + (offsetY / width * 2))
  const maxY = ((2 / zoomLevel) + (offsetY / width * 2))
  const maxIterations = 1000

  // Map the a and b values to the x and y size
  const initialA = minX + ((x / width) * (maxX - minX))
  const initialB = minY + ((y / height) * (maxY - minY))

  let a = initialA
  let b = initialB
  let n = 0
  while (n < maxIterations) {
     const newA = ((a * a) - (b * b)) + initialA
     const newB = (2 * a * b) + initialB

     a = newA
     b = newB

     if (Math.abs(a + b) > 16) { // test to find if the absolute value is tending towards infinity (50 in this case)
       break
     }

     n++
  }
  let bright = Math.sqrt(n / maxIterations) * 255
  if (n === maxIterations) {
    bright = 0
  }

  return bright
}

/**
 * Update a pixel of html5 ImageData using coordinates and rgb value
 */
const updatePixel = (imageData, width, x, y, red = 0, green = 0, blue = 0, alpha = 255) => {
  const pixelIndex = (x + (y * width)) * 4

  imageData.data[pixelIndex] = red
  imageData.data[pixelIndex + 1] = green
  imageData.data[pixelIndex + 2] = blue
  imageData.data[pixelIndex + 3] = alpha
}

/**
 * Update a pixel of html5 ImageData using coordinates and a single brightness value value
 */
const updateGrayscalePixel = (imageData, width, x, y, brightness, alpha = 255) => updatePixel(imageData, width, x, y, brightness, brightness, brightness, alpha)

const colourMap = (n) => {
  if (n === 0) {
    return [0,0,0]
  }

  const r = 20
  const g = -40
  const b = 50

  return [(n + r) % 255, (n + g) % 255, (n + b) % 255]
}

// Set up the canvas and draw the mandelbrot

window.onload = () => {
  const canvas = document.createElement('canvas')
  let zoomLevel = 1
  let offsetX = 0
  let offsetY = 0
  canvas.width = width
  canvas.height = height
  mandelbrot(canvas, width, height, colourMap, zoomLevel, offsetX, offsetY)
  
  document.body.insertBefore(canvas, document.body.childNodes[0])

  // Handle the user interaction of the Mandelbrot rendering
  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    offsetX += (x - (width / 2)) / zoomLevel
    offsetY += (y - (height / 2)) / zoomLevel
    zoomLevel = zoomLevel * 2

    mandelbrot(canvas, width, height, colourMap, zoomLevel, offsetX, offsetY)
  }

  canvas.addEventListener('click', handleClick, false)
}