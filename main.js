

//the whole code starts when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {


    // we capture the speech recognition from the browser(Google) to capture audio to text.
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;//the webkit is to allow compatibility with older browsers
    let recognition = new SpeechRecognition();//we create an object of it
    
    //Some configuration
    recognition.continuous = false; // stops listening after capturing 1 phrase (i will change this ,eventually)
    recognition.interimResults = false; // final results only, it can be temporary results while the user is speaking(we dont want that (for now))

    // Capture HTML elements by their ids
    let recordBtn = document.getElementById("recordBtn");//button to start
    let recognizedText = document.getElementById("recognizedText");//the area where the text recognized will be written on
    let targetLang = document.getElementById("targetLang");//the selected translate language
    let sourceLang = document.getElementById("sourceLang");//the source language, the one in the audio
    let translatedText = document.getElementById("translatedText");//the area where the translated text will be written on

/*
Dynamic setting of the source language (audio language) based on the user´s selection 
every time the record button is clicked
*/
    recordBtn.addEventListener("click", () => {
        let sourceLangValue = sourceLang.value; // get the selected source language
        recognition.lang = sourceLangValue; // set the recognition language dynamically based on user selection we just captured
        recognition.start(); //start the recording
    });

    // Captures the recognized text from the audio
    //it means this: 
    /*
    sets an event handler for the onresult event , so that the event is triggered
    when the speech(audio) recognition service has processed it.

    The e parameter contains all info about the recognition result
    */
    recognition.onresult = (e) => {
        let transcript = e.results[0][0].transcript; //it cointains a list of recgnition results
       
        recognizedText.textContent = transcript;//updates the html element to show the recognized text

        //after capturing it, we pass the transcript to the function taht will transalte it
        translateText(transcript);
    };



/*
Function to TransLate 
++++++++++++++++++++++
ASYNC FUNCTION: An asynchronous function in JavaScript is a special type of function that 
allows you to perform operations that take time, such as fetching data from a server, 
without blocking the execution of other code. This is particularly useful in web applications
 where you don't want the user interface to freeze while waiting for a network response.
*/

    async function translateText(text) {
        let sourceLangValue = sourceLang.value; // the selected language of the audio
        let targetLangValue = targetLang.value; // the selected language for translation
        let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangValue}|${targetLangValue}`;

        try {
            let response = await fetch(apiUrl);//this makes a request
            //the await keyword pauses the execution of the function until the returned value is fetched
            if (!response.ok) {//checks if the response is NOT OK
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();//This line parses the JSON response from the API. The result is stored in the data variable for further processing.


            if (data.responseData && data.responseData.translatedText) {
                translatedText.textContent = data.responseData.translatedText; // shows the traslated data into the html element
                speakTranslatedText(data.responseData.translatedText); //call the function that will convert the text to speech
            } else {
                console.error("No se pudo obtener la traducción.");
            }
        } catch (error) {
            console.error("Error en la traducción:", error);
        }
    }

    

    /*
    Function to Convert Translated text to speech
    
    */
    function speakTranslatedText(text) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang.value; // Establecer el idioma de la síntesis
        window.speechSynthesis.speak(utterance); // Iniciar la síntesis de voz
    }
});
