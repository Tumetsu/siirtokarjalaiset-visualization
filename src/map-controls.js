/**
 * Created by tuomas on 12/3/16.
 */
import Vue from 'vue';
import template from './map-controls.tpl.html';

let MapControls = Vue.extend({
  template: template,
  data: function () {
    return {
      selectedYear: 1944,
      animationYear: 1944,
      validInput: true,
      animation: true
    }
  },
  mounted: function () {
    this.animationInterval = setInterval(this.animateYears, 2000);
  },
  destroyed: function () {
    clearInterval(this.animationInterval);
  },
  methods: {
    animateYears: function () {
      if (this.animation) {
        this.animationYear += 1;
        if (this.animationYear > 1966) {
          this.animationYear = 1912;
        }

        this.selectedYear = this.animationYear;
        this.$emit('selectedYear', this.selectedYear);
      }
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
      this.animation = false;
    }
  }
});

Vue.component('map-controls', MapControls);
export default MapControls;