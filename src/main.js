import Vue from 'vue'
import MigrationMap from './migration-map.js'

import 'bootstrap/dist/css/bootstrap.css'
import './styles.css'

Vue.config.debug = process.env.NODE_ENV !== 'production';

const App = new Vue({
  el: '#app',
  components: {
    MigrationMap
  }
});
