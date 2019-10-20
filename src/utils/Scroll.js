// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = {37: 1, 38: 1, 39: 1, 40: 1};

const preventDefault = (e) => {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

const preventDefaultForScrollKeys = (e) => {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

class Scroll {
    disable() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove  = preventDefault; // mobile
        document.onkeydown  = preventDefaultForScrollKeys;
      }

    enable() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        document.removeEventListener('wheel', preventDefault, {passive: false}); // Enable scrolling in Chrome
        window.onmousewheel = document.onmousewheel = null; 
        window.onwheel = null; 
        window.ontouchmove = null;  
        document.onkeydown = null;  
    }
}

export default Scroll;