# Simplezoom

Add a simple and lightweight zoom functionality to images, videos or any other element.

## How to use

```bash
npm install simplezoom --save
```

### Import or require the module

```javascript
import Simplezoom from 'simplezoom';
```

or

```javascript
var Simplezoom = require('simplezoom');
```

### Initialize on an element

```javascript
var myImage = document.querySelector('.my-image');
	
new Simplezoom(myImage);
```

### Optionally add some options

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
_close when scrolling_

default: `true`


#### `closeOnEscape` (Boolean)
_close with pressing the escape key_

default: `true`


#### `onOpen` (Function)
_callback function called when opening starts_


#### `onOpenComplete` (Function)
_callback functions called when opening is finished_


#### `onClose` (Function)
_callback function called when closing starts_


#### `onCloseComplete` (Function)
_callback functions called when closing is finished_

### API

Use the `open()` and `close()` methods to manually open and close Simplezoom
