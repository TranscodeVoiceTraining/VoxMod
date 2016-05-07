var voxmod = voxmod || {};

var MATHS = {
  //mathematical functions
  meanOfArray: function (array){
    var sumOfItems = 0;
    for (var i = 0; i < array.length; i++) {
      sumOfItems += array[i];
    }
    return sumOfItems / array.length;
  },

  standardDeviation: function (array){
    var mean = this.meanOfArray(array);
    var variance = array.reduce(function(a,b){
      return Math.pow((mean - b),2) + a;
    }, 0)/array.length;

    return Math.sqrt(variance);
   }
};
Object.freeze(MATHS);

voxmod.maths = MATHS;