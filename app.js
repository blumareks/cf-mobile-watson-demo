/**
 * Copyright 2014, 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express    = require('express'),
  app          = express(),
  watson       = require('watson-developer-cloud');
var fs = require('fs');

// Bootstrap application settings
require('./config/express')(app);

// For local development, replace username and password
var textToSpeech = watson.text_to_speech({
                                         username: 'login',
                                         password: 'password',
                                         version: 'v1',
                                         url: 'https://stream.watsonplatform.net/text-to-speech/api'
});

app.get('/api/synthesize', function(req, res, next) {
        var params = {
        text: req.query.text, //"hello it is watson"
        voice: req.query.voice, //'en-US_MichaelVoice',
        accept: 'audio/wav'
        };
        
        // Pipe the synthesized text to a file
        var transcript = textToSpeech.synthesize(params);
        transcript.on('response', function(response) {
              response.headers['content-disposition'] = 'attachment; filename=transcript.wav';
          });
          transcript.on('error', function(error) {
            next(error);
          });
          transcript.pipe(res);
        
        //.pipe(fs.createWriteStream('output.wav'));
        
        
//  var transcript = textToSpeech.synthesize(req.query);
//  transcript.on('response', function(response) {
//    if (req.query.download) {
//      response.headers['content-disposition'] = 'attachment; filename=transcript.wav';
//    }
//  });
//  transcript.on('error', function(error) {
//    next(error);
//  });
//  transcript.pipe(res);
});

// Return the list of voices
// app.get('/api/voices', function(req, res, next) {
//   textToSpeech.voices(function (error, voices) {
//     if (error)
//       next(error);
//     else
//       res.json(voices);
//   });
// });

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
