import {Dimensions} from 'react-native';
import EventEmitter from 'EventEmitter'; // ERROR. The Expo team has been notified.
/*
 Window Resize Stub
*/
window.emitter = new EventEmitter();
window.addEventListener = (eventName, listener) => window.emitter.addListener(eventName, listener);
window.removeEventListener = (eventName, listener) => window.emitter.removeListener(eventName, listener);

let { width, height } = Dimensions.get('window');
window.innerWidth = window.clientWidth = width;
window.innerHeight = window.clientHeight = height;

Dimensions.addEventListener('change', ({ screen: { width, height, scale } }) => {
  window.scale = scale;
  window.innerWidth = window.clientWidth = width;
  window.innerHeight = window.clientHeight = height;
  window.emitter.emit('resize');
})
