'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

exports.index = function(req, res) {

  req.session.regenerate(function() {
    res.render('index', {
      user: req.user || null
    });
  });
};

exports.generatePlots = function(req, res) {
  var sourceFileName = req.params.sessionId + '_' + req.params.mediaId + '.txt';
  var sourceFilePath = path.resolve(__dirname, '../../MaxMSP/EmotionInMotion/data/', sourceFileName);
  var targetFolder = path.resolve(__dirname, '../../public/modules/core/img/plots');
  var scriptLocation = path.resolve(__dirname, '../../dataPlot.py');
  var scriptExecution = spawn("python", [scriptLocation, sourceFilePath, targetFolder]);

    // Function to convert an Uint8Array to a string
    var uint8arrayToString = function(data){
        return String.fromCharCode.apply(null, data);
    };

    // Handle normal output
    scriptExecution.stdout.on('data', function(data) {
        console.log(uint8arrayToString(data));
    });

    // Handle error output
    scriptExecution.stderr.on('data', function(data) {
        // As said before, convert the Uint8Array to a readable string.
        console.log(uint8arrayToString(data));
    });

  return res.status(200).json({sourceFilePath: sourceFilePath, targetFOlder: targetFolder});
};