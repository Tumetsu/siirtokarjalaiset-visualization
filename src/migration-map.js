import Vue from 'vue';
import template from './migration-map.tpl.html';
import migrationData from '../assets/migrationdata.json';
import {createPointArraysByYearFromDataset} from './populate-map';
import mapStyles from './map-styles.json';

var MigrationMap = Vue.extend({
  template: template,
  data: function () {
    return {
      map: null,
      pointArraysByYear: createPointArraysByYearFromDataset(migrationData),
      heatmap: null
    }
  },
  mounted: function () {
    // Initialize and set up google maps
    let mapOptions = {
      zoom: 7,
      center: new google.maps.LatLng(62.244747, 25.747218400000065),
      mapTypeControlOptions: {
        mapTypeIds: ['satellite', 'hybrid', 'terrain', 'aubergine']
      }
    };

    let styledMapType = new google.maps.StyledMapType(mapStyles, {name: 'Tumma'});

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    this.map.mapTypes.set('aubergine', styledMapType);
    this.map.setMapTypeId('aubergine');

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: new google.maps.MVCArray(this.pointArraysByYear['1944'])
    });

    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 50);
    this.heatmap.setMap(this.map);
  },
  methods: {
    'selectedYear': function (year) {
      // Change to different year
      this.heatmap.setMap(null);

      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: new google.maps.MVCArray(this.pointArraysByYear[year.toString()]),
        radius: 50
      });
      this.heatmap.setMap(this.map);
    }
  }
});

Vue.component('migration-map', MigrationMap);
export default MigrationMap;
