import React from 'react';
import './App.css';
import objectDetectionSketch from './ObjectDetectionSketch';

import P5Wrapper from 'react-p5-wrapper';

export default class app extends React.Component {
constructor(props)
{
  super(props)
  window.idioma = "quechua"
}
  render() {
      return (
        <div>
          <h1>T'ikraq - IA</h1>
          <input type="button" value = "Cambiar Idioma" onClick={()=>
              {
                //console.log(window.idioma)
                if(window.idioma == "quechua")
                  window.idioma = "espanol"
                else
                  window.idioma = "quechua"
          }}></input>
          <P5Wrapper sketch={objectDetectionSketch} />
        </div>
      )
    }
}
