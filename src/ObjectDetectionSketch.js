import * as p5 from 'p5'
import "p5/lib/addons/p5.dom";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceapi from 'face-api.js';

import traductor from "./traductor"
//const traductor = require('./traductor');
//console.log(traductor.traducir("perro"))

const MODEL_URL = '/models'

export default function sketch (p) {

    let capture = null;
    let cocossdModel = null;

    let cocoDrawings = [];
    let faceDrawings = [];


    function showCocoSSDResults(results) {
        cocoDrawings = results;
      //  console.log(results)
    }

    function showFaceDetectionData(data) {
        faceDrawings = data;
    }

    p.setup = async function () {
        p.frameRate(1);

        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadAgeGenderModel(MODEL_URL);
        await faceapi.loadFaceExpressionModel(MODEL_URL);

        p.createCanvas(1280, 720);
        const constraints = {
            video: {
              mandatory: {
                minWidth: 1280,
                minHeight: 720
              },
              optional: [{ maxFrameRate: 40 }]
            },
            audio: false
          };

        capture = p.createCapture(constraints, () => {
        });


        capture.id("video_element");
        capture.size(1280, 720);
        capture.hide();

        cocoSsd.load().then((model) => {
            try {
                cocossdModel = model;
            } catch(e) {
                console.log(e);
            }

        }).catch((e) => {
            console.log("Error occured : ", e);
        });

    };

    p.draw = async () => {
        if (!capture) {
            return;
        }
        p.background(200);
        p.image(capture, 0, 0, 1280* 0.75,720);
        p.fill(0,0,0,0);

        cocoDrawings.map((drawing) => {
            if (drawing) {
                console.log(window.idioma)
                drawing.class = traductor.traducir(window.idioma,drawing.class)
                p.textSize(20);
                p.strokeWeight(1);
                const textX = drawing.bbox[0]*1.5+drawing.bbox[2]*1.5;
                const textY = drawing.bbox[1]+drawing.bbox[3]*1.25;

                const confidenetext = "Confidence: "+ drawing.score.toFixed(1);
                const textWidth = p.textWidth(confidenetext);

                const itemTextWidth = p.textWidth(drawing.class);
                p.text(drawing.class, textX-itemTextWidth-10, textY-50);

                p.text(confidenetext, textX-textWidth-10, textY-10);
                p.strokeWeight(4);
                p.stroke('rgb(100%,100%,100%)');
                p.rect(drawing.bbox[0]*1.5, drawing.bbox[1]*1.25, drawing.bbox[2]*1.5, drawing.bbox[3]*1.5);
            }
        });

        faceDrawings.map((drawing) => {
            if (drawing) {
                p.textSize(15);
                p.strokeWeight(1);

                const textX = drawing.detection.box._x+drawing.detection.box._width;
                const textY = drawing.detection.box._y+drawing.detection.box._height;

                const confidencetext = "Gender: "+ drawing.gender;
                const textWidth = p.textWidth(confidencetext);
                p.text(confidencetext, textX-textWidth-10, textY-60);


                const agetext = "Age: "+ drawing.age.toFixed(0);
                const ageTextWidth = p.textWidth(agetext);
                p.text(agetext, textX-ageTextWidth-10, textY-30);

                const copiedExpression = drawing.expressions;
                const expressions = Object.keys(copiedExpression).map((key) => {
                    const value = copiedExpression[key];
                    return value;
                })

                const max = Math.max(...expressions);

                const expression_value = Object.keys(copiedExpression).filter((key) => {
                    return copiedExpression[key] === max;
                })[0];

                const expressiontext = "Mood: "+ expression_value;
                const expressionWidth = p.textWidth(expressiontext);
                p.text(expressiontext, textX-expressionWidth-10, textY-10);

                p.strokeWeight(4);
                p.stroke('rgb(100%,100%,100%)');
                p.rect(drawing.detection.box._x, drawing.detection.box._y, drawing.detection.box._width, drawing.detection.box._height);
            }
        });
        //faceapi.detectAllFaces(document.getElementById("video_element")).then((caras)=>{console.log("_-----------------caras",caras)}).catch((e)=>{console.log("error",e)});
        //console.log(car)
        // faceapi.detectAllFaces(document.getElementById(capture.id())).withAgeAndGender().withFaceExpressions().then((data) => {
        //     showFaceDetectionData(data);
        //     console.log("face",data);
        // }).catch((e)=>{console.log("error",e)});

        if(capture.loadedmetadata) {
          //console.log("----------------**********")
            if (cocossdModel) {
                cocossdModel
                .detect(document.getElementById("video_element"))
                .then(showCocoSSDResults)
                .catch((e) => {
                    console.log("Exception : ", e);
                });
            }
        }
    }
  };
