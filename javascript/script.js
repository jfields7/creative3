let times = [];

Vue.component('graph', {
  props: ['times'],
  template: '#graph-template',
  computed: {
    points: function(){
      let size = this.times.length;
      return this.times.map(function(time,i){
        let x = time.x;
        let y = 200 - time.y;
        return x + ',' + y
      }).join(' ');
    }
  },
})

new Vue({
  el: '#simulator',
  data: {
    angle: 45,
    vi: 100,
    g: 9.8,
    m: 1,
    r: 0.1,
    vw: 0,
    times: times,
    h: 0.1,
  },
  computed: {
    distance: function(){
      if(this.times.length > 0){
        return this.times[this.times.length-1].x.toPrecision(5);
      }
      else{
        return 0;
      }
    },
    hmax: function(){
      let max = 0;
      for (let i = 0; i < this.times.length; i++){
        max = Math.max(this.times[i].y,max);
      };
      return max.toPrecision(5);
    },
    air: function(){
      return (this.times.length*this.h).toPrecision(5);
    },
  },
  methods:{
    beginSimulation: function (){
      "use strict";
      // Define the constants we'll need for the Runge-Kutta scheme.
      let cnsts = {
        g: this.g,
        m: this.m,
        c: 0.25*(2*this.r)*(2*this.r),
        vw: this.vw,
        h: this.h,
      };
      // Now we'll calculate all the points we need.
      // Start by constructing the starting point.
      let time = {
        vx: this.vi*Math.cos(this.angle*Math.PI/180),
        x: 0,
        vy: this.vi*Math.sin(this.angle*Math.PI/180),
        y: 0,
      };
      // Delete all the old points.
      this.times.length = 0;
      // Add the new point.
      this.times.push(time);
      // Now start looping either until our point is no longer visible or we
      // run too long (i.e., no gravity, ridiculous power, etc...)
      let size = this.times.length;
      while (this.times[size-1].y >= 0 && size <= 1000){
        this.times.push(rk4(this.times[size-1],cnsts));
        size = size + 1;
      }
    },
  },
})
