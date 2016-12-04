import Vue from 'vue'
import MigrationMap from './migration-map.js'
import MapControls from './map-controls';

import 'bootstrap-loader';
import './styles.css'
import TWEEN from 'tween.js';

Vue.config.debug = process.env.NODE_ENV !== 'production';

// Set animation loop
animate();
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}

const App = new Vue({
  el: '#app',
  components: {
    MigrationMap,
    MapControls
  }
});