const resultDiv = document.querySelector(".result");
const wordElement = resultDiv.querySelector("#word");
const phonetics = resultDiv.querySelector(".phonetics");
const mainAurio = resultDiv.querySelector("#pronunciation");
const wordDefinition = resultDiv.querySelector(".word-definition");
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const handle = async(e) => {
  if(e.keyCode === 13){
    const word = e.target.value;
    //Request to API
    const result = await fetch(url + word);
    const dataPromise = await result.json();
    const data = dataPromise[0];
    resultDiv.style.display = "block";
    wordElement.innerText = data.word;
    data.phonetics.map( (obj) => {
      if("text" in obj){
        phonetics.innerText = obj.text;
      }
    });
  }
}

