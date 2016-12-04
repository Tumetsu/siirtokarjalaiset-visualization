import Vue from 'vue';
import template from './migration-map.tpl.html';
import migrationData from '../assets/migrationdata.json';
import {createPointArraysByYearFromDataset} from './populate-map';
import mapStyles from './map-styles.json';
import TWEEN from 'tween.js';
import bus from './bus';
import maxBy from 'lodash/maxBy';

let MigrationMap = Vue.extend({
  template: template,
  data: function () {
    return {
      map: null,
      pointArraysByYear: createPointArraysByYearFromDataset(migrationData),
      heatmap: null,
      animation: true,
      currentYear: 1932,
      maxIntensity: 0,
      animationInProgress: false
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
      data: new google.maps.MVCArray(this.pointArraysByYear['1932']),
      radius: 50
    });

    let gradient = [
      'rgba(0, 255, 0, 0)',
      'rgba(0, 255, 0, 1)',
      'rgba(51, 255, 0, 1)',
      'rgba(102, 255, 0, 1)',
      'rgba(153, 255, 0, 1)',
      'rgba(204, 255, 0, 1)',
      'rgba(255, 255, 0, 1)',
      'rgba(255, 204, 0, 1)',
      'rgba(255, 153, 0, 1)',
      'rgba(255, 102, 0, 1)',
      'rgba(255, 51, 0, 1)',
      'rgba(255, 0, 0, 1)',
    ];
    this.heatmap.set('gradient', gradient);

    // Gradient legend:
    // http://stackoverflow.com/questions/19385363/howto-create-legend-for-google-heatmap
    let gradientCss = '(left';
    for (let i = 0; i < gradient.length; ++i) {
      gradientCss += ', ' + gradient[i];
    }
    gradientCss += ')';

    $('#legendGradient').css('background', '-webkit-linear-gradient' + gradientCss);
    $('#legendGradient').css('background', '-moz-linear-gradient' + gradientCss);
    $('#legendGradient').css('background', '-o-linear-gradient' + gradientCss);
    $('#legendGradient').css('background', 'linear-gradient' + gradientCss);

    this.heatmap.set('opacity', 1);
    this.heatmap.setMap(this.map);
    this.updateGradientLegend(1932);
    this.animate();
  },
  methods: {
    'animationToggle': function (animationState) {
      this.animation = animationState;
      this.animate();
    },
    'animate': function () {
      // During animation, call this function recursively from tween functions
      if (this.animation && !this.animationInProgress) {
        this.currentYear += 1;
        if (this.currentYear > 1966) {
          this.currentYear = 1912;
        }
        this.selectedYear(this.currentYear, 1000);
      }
    },
    'updateGradientLegend': function (year) {
      // Gradient legend:
      // http://stackoverflow.com/questions/19385363/howto-create-legend-for-google-heatmap
      this.maxIntensity = maxBy(this.pointArraysByYear[year.toString()], 'weight').weight;
      let legendWidth = $('#legendGradient').outerWidth();
      let rangeStep = this.maxIntensity / 3;
      $('#legend .marker').empty();

      for (let i = 0; i <= 3; ++i) {
        let offset = i * legendWidth / 3;
        if (i > 0 && i < 3) {
          offset -= 0.5;
        } else if (i == 5) {
          offset -= 1;
        }

        $('#legend').append($('<div class="marker">').css({
          'position': 'absolute',
          'left': 16 + offset + 'px',
          'top': '15px',
          'width': '1px',
          'height': '3px',
          'background': 'black'
        }));
        $('#legend').append($('<div class="marker">>').css({
          'position': 'absolute',
          'left': (16 + offset - 5) + 'px',
          'top': '18px',
          'width': '10px',
          'text-align': 'center'
        }).html(Math.floor(rangeStep * i)));
      }
    },
    'selectedYear': function (year, delay=0) {
      // Change to different year
      let mapAlpha = {alpha: 1};
      let fadeout = new TWEEN.Tween(mapAlpha).to({alpha: 0}, 1000).delay(delay);
      let fadein = new TWEEN.Tween(mapAlpha).to({alpha: 1}, 1000);
      this.heatmap.set('opacity', 1);
      this.currentYear = year;
      this.animationInProgress = true;

      fadeout.onUpdate(() => {
        this.heatmap.set('opacity', mapAlpha.alpha);
      });
      fadein.onUpdate(() => {
        this.heatmap.set('opacity', mapAlpha.alpha);
      });

      fadein.onComplete(() => {
        this.heatmap.set('opacity', 1);
        this.animationInProgress = false;
        this.animate();
      });

      fadeout.onComplete(() => {
        // Change heatmap to new data set
        this.heatmap.setMap(null);
        this.heatmap = new google.maps.visualization.HeatmapLayer({
          data: new google.maps.MVCArray(this.pointArraysByYear[year.toString()]),
          radius: 50
        });

        mapAlpha.alpha = 0;
        this.heatmap.setMap(this.map);
        this.heatmap.set('opacity', mapAlpha.alpha);
        bus.$emit('yearChangeComplete', this.currentYear);
        this.updateGradientLegend(year);
        fadein.start();
      });
      fadeout.start();
    }
  }
});

Vue.component('migration-map', MigrationMap);
export default MigrationMap;
