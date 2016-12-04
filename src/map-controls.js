/**
 * Created by tuomas on 12/3/16.
 */
import Vue from 'vue';
import template from './map-controls.tpl.html';
import bus from './bus';

let MapControls = Vue.extend({
  template: template,
  data: function () {
    return {
      selectedYear: 1932,
      validInput: true,
      animation: true
    }
  },
  mounted: function () {
    bus.$on('yearChangeComplete', (year) => {
      this.selectedYear = year;
    })
  },
  methods: {
    toggleAnimation: function () {
      this.$emit('animationToggle', this.animation);
    },
    validateYearInput: function (event) {
      this.validInput = (this.selectedYear >= 1912 && this.selectedYear <= 1966);
      if (this.validInput) {
        //Notify map about new value:
        this.animationYear = this.selectedYear;
        this.$emit('selectedYear', this.selectedYear);
      }
    },
    inputActivated: function () {
      // Disable animation
      this.animation = false;
      this.$emit('animationToggle', this.animation);
    }
  }
});

Vue.component('map-controls', MapControls);
export default MapControls;