


  //------------------------------------------------------------
  //------------------------------------------------------------
  var mean = function (arr) {

      var sum = 0;
      var length = arr.length;
      for (var i = 0; i < length; i++) {

          sum = sum + arr[i]
      }

      var mean = sum / length;
      return mean;

  }
  //------------------------------------------------------------
  //------------------------------------------------------------
      var variance = function (arr, std_type) {

      var sum = 0;
      var v = 0;
      var arr_length = arr.length;
      var this_mean = mean(arr);

      if (arr_length > 1) {
          for (var i = 0; i < arr_length; i++) {

              v = v + (arr[i] - this_mean) * (arr[i] - this_mean);
          }

          if (std_type == 's') {

              return v / (arr_length - 1);
          }
          else {

              return v / arr_length;
          }
      }
      else {

          return 0;
      }
  }
  //------------------------------------------------------------
  //------------------------------------------------------------
  var zFact = function (arr, mean, std) {

      var z = arr.map(function (d) {

          return ((d - mean) / std);
      });

      return z;
  }
  //------------------------------------------------------------
  //------------------------------------------------------------
  var pVal = function (norm, normSort) {
              
      var length = norm.length;
      var si = 0;
      var ad1 = 0;
      var ad2 = 0;
      var p1, p2, p3, p4, pval, test;
              
      for (var i = 0; i < length; i++) {
                  
          si = si + (2 * (i + 1) - 1) * (Math.log(norm[i]) + Math.log(normSort[i]))
      }
              
      ad1 = -si / length - length;
      ad2 = ad1 * (1 + 0.75 / length + 2.25 / Math.pow(length, 2));
              
              
      if (ad2 < 13 && ad2 >= 0.6) {
                  
          p1 = Math.exp(1.2937 - 5.709 * ad2 + 0.0186 * Math.pow(ad2, 2));
      }
      else {
          p1 = 0;
      }
              
      if (ad2 < 0.6 && ad2 >= 0.34) {
                  
          p2 = Math.exp(0.9177 - 4.279 * ad2 - 1.38 * Math.pow(ad2, 2));
      }
      else {
          p2 = 0;
      }
              
      if (ad2 < 0.34 && ad2 >= 0.2) {
                  
          p3 = 1 - Math.exp(-8.318 + 42.796 * ad2 - 59.938 * Math.pow(ad2, 2));
      }
      else {
                  
          p3 = 0;
      }
              
      if (ad2 < 0.2 && ad2 >= 0.2) {
                  
          p4 = 1 - Math.exp(-13.436 + 101.14 * ad2 - 223.73 * Math.pow(ad2, 2));
      }
      else {
                  
          p4 = 0;
      }
              
      pval = Math.max(p1, p2, p3, p4);
              
      if (pval < 0.0005) {
                  
          test = false
      }
      else {
                  
          test = true
      }
              
      var normTest = { pValue: pval, test: test }
      return normTest
  }
  //------------------------------------------------------------
  //------------------------------------------------------------
  var normDist = function (arr) {
              
      var B1 = 0.319381530;
      var B2 = -0.356563782;
      var B3 = 1.781477937;
      var B4 = -1.821255978;
      var B5 = 1.330274429;
      var P = 0.2316419;
      var C = 0.39894228;
              
      var norm = arr.map(function(d) {
                  
          if (d >= 0) {
                      
              var t = (1.0 / (1.0 + P * d));
              return (1.0 - C * Math.exp(-d * d / 2.0) * t * (t * (t * (t * (t * B5 + B4) + B3) + B2) + B1));
          }
          else if (d < 0) {
              var t = (1.0 / (1.0 - P * d))
                      
              return (C * Math.exp(-d * d / 2.0) * t * (t * (t * (t * (t * B5 + B4) + B3) + B2) + B1))
          }

      });
              
      return norm;
  }
  //------------------------------------------------------------
  //------------------------------------------------------------
  export const stdSample = function (arr) {
              
      return Math.sqrt(variance(arr, 's'));

  }
  //------------------------------------------------------------
  //------------------------------------------------------------
  export const stdPopulation = function (arr) {
              
      return Math.sqrt(variance(arr, 'p'));
  }
  //------------------------------------------------------------
  //------------------------------------------------------------

  var check = function (arr) {
   

      if (arr && arr.length >= 1) {
      
          var data = {};
          data.data = arr.sort(function (a, b) { return a - b; });
          data.mean = mean(data.data);
          data.stdP = stdPopulation(data.data, data.mean)
          data.stdS = stdSample(data.data, data.mean)
          data.zFact = zFact(data.data, data.mean, data.stdS);
          data.normDist = normDist(data.zFact);
          data.normDistInv = data.normDist.map(function (d) { return 1 - d; });
          data.normSort = data.normDistInv.sort(function (a, b) { return a - b; });
          data.normalTest = pVal(data.normDist, data.normSort)

          return { data: data.data, mean: data.mean, stdP: data.stdP, stdS: data.stdS, pValue: data.normalTest.pValue, normal: data.normalTest.test }

      }
      else {

          return;
      }

  }
  //------------------------------------------------------------
  //------------------------------------------------------------


