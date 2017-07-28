# Simplezoom

Add a simple and lightweight zoom functionality to images, videos or any other element.

## How to use

### Get the module

```bash
npm install simplezoom --save
```

### Import it into your project

```javascript
var Simplezoom = require('simplezoom');
```

### Initialize Simplezoom on an element

```javascript
var myImage = document.querySelector('.my-image');
	
new Simplezoom(myImage);
```

### Optionally add options

```javascript
var myImage = document.querySelector('.my-image');
	
new Simplezoom(myImage, {
	'delay': 500,
	'padding': 100
});
```

### Available options

#### `padding` (Number)
default: `50` (in pixels)

#### `openDelay` (Number)
default: `0` (in milliseconds)

#### `closeDelay` (Number)
default: `0` (in milliseconds)

#### `transitionDuration` (Number)
default: `350` (in milliseconds)

#### `closeOnScroll` (Boolean)
Close when scrolling

default: `true`

#### `closeOnEscape` (Boolean)
Close with pressing the escape key

default: `true`

#### `onOpen` (Function)
callback function called when opening starts

#### `onOpenComplete` (Function)
callback functions called when opening is finished

#### `onClose` (Function)
callback function called when closing starts

#### `onCloseComplete` (Function)
callback functions called when closing is finished
