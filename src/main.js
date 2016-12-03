import Vue from 'vue'
import MigrationMap from './migration-map.js'
import MapControls from './map-controls';

import 'bootstrap-loader';
import './styles.css'

Vue.config.debug = process.env.NODE_ENV !== 'production';

const App = new Vue({
  el: '#app',
  components: {
    MigrationMap,
    MapControls
  }
});
