import diccionarioQuechua from "./diccionarioQuechua"
import diccionarioEspanol from "./diccionarioEspanol"
console.log(diccionarioQuechua)
function traductor(){
  this.traducir = (idioma,texto)=>{
    var nTexto = texto;
    if(idioma!="espanol")
    {
      if(diccionarioQuechua[nTexto]!=undefined)
      {
        nTexto = diccionarioQuechua[nTexto]
      }
    }
    else
    {
      if(diccionarioEspanol[nTexto]!=undefined)
      {
        nTexto = diccionarioEspanol[nTexto]
      }
    }
    return nTexto;
  }
}

export default new traductor();
