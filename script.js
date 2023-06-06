const resultDiv = document.querySelector(".result");
const wordElement = resultDiv.querySelector("#word");
const phonetics = resultDiv.querySelector(".phonetics");
const mainAudio = resultDiv.querySelector("#pronunciation");
const wordDefinition = resultDiv.querySelector(".word-definition");
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const wordType = resultDiv.querySelector("#word-type");
const wordMeaning = resultDiv.querySelector("#word-meaning");
const synonymsDiv = resultDiv.querySelector(".synonyms");

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const checkDivElements = (divElement, tagElement, titleElement) => {
  if(divElement.querySelectorAll(`${tagElement}`).length < 1){
    divElement.style.display = "none";
    document.querySelector(`.${titleElement}`).style.display = "none";
  }else{
    divElement.style.display = "block";
    document.querySelector(`.${titleElement}`).style.display = "block";
  }
}

const hideElements = (wordEntered) => {
  wordElement.innerText = `No Definitions Found for "${wordEntered}"`;
  phonetics.style.display = "none";
  mainAudio.style.display = "none";
  document.querySelector(".meaning-title").style.display = "none";
  message = "<p>Sorry pal, we couldn't find definitions for the word you were looking for.</p>"
  resolution = "<p>You can try the search again at later time or head to the web instead.</p>"
  wordMeaning.innerHTML += message;
  wordMeaning.innerHTML += resolution;
  checkDivElements(wordType, "p", "type-title");
  checkDivElements(synonymsDiv, "p", "synonym-title");
}

const handle = async(e) => {
  if(e.keyCode === 13){
    //Initialize elements
    wordType.innerHTML = ""
    wordMeaning.innerHTML = ""
    synonymsDiv.innerHTML = ""
    phonetics.style.removeProperty("display");
    mainAudio.style.removeProperty("display");
    resultDiv.style.display = "block";
    const word = e.target.value;
    //Request to API
    const result = await fetch(url + word);
    if(!result.ok){
      hideElements(word);
      return;
    }
    const dataPromise = await result.json();
    const data = dataPromise[0];
    //Set Word 
    wordElement.innerText = capitalizeFirstLetter(data.word);
    //Set audio and Phonetics
    data.phonetics.map( (obj) => {
      if("audio" in obj && obj.audio != ""){
        phonetics.innerText = obj.text;
        mainAudio.src = obj.audio;
      }
    });
    data.meanings.map( (obj) => {
      //Set Word type
      pWordType = `<p>${capitalizeFirstLetter(obj.partOfSpeech)}</p>`
      wordType.innerHTML += pWordType;
      //Set Meanings
      if(obj.definitions[0] != "" && wordMeaning.querySelectorAll("li").length < 2){
        liWordMeaning = `<li><span>${obj.definitions[0].definition}</span></li>`
        wordMeaning.innerHTML += liWordMeaning;
      }
      //Set Synonyms
      if(obj.synonyms.length != 0){
        obj.synonyms.map( (synonym) => {
          const pSynonym = `<p class="pills">${capitalizeFirstLetter(synonym)}</p>`
          synonymsDiv.innerHTML += pSynonym;
        });
      }
      //Hide Divs that are Empty
      checkDivElements(wordType, "p", "type-title");
      checkDivElements(wordMeaning,"li", "meaning-title");
      checkDivElements(synonymsDiv, "p", "synonym-title");
    });
  }
}

