document.addEventListener("DOMContentLoaded", () => {
    // Speech Recognition to capture audio to text.
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    
    recognition.continuous = false; // Stop listening after capturing one phrase
    recognition.interimResults = false; // Final results only

    // Capture HTML elements
    let recordBtn = document.getElementById("recordBtn");
    let recognizedText = document.getElementById("recognizedText");
    let targetLang = document.getElementById("targetLang");
    let sourceLang = document.getElementById("sourceLang");
    let translatedText = document.getElementById("translatedText");

    // Start the recognition on button click
    recordBtn.addEventListener("click", () => {
        let sourceLangValue = sourceLang.value; // Get the selected source language
    recognition.lang = sourceLangValue; // Set the recognition language dynamically
        recognition.start();
    });

    // Capture the recognized text
    recognition.onresult = (e) => {
        let transcript = e.results[0][0].transcript; 
        recognizedText.textContent = transcript;

        // Llama a la función de traducción
        translateText(transcript);
    };

    // Función para traducir el texto
    async function translateText(text) {
        let sourceLangValue = sourceLang.value; // Obtén el idioma de origen del select
        let targetLangValue = targetLang.value; // Obtén el idioma de destino del select
        let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangValue}|${targetLangValue}`;

        try {
            let response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();
            if (data.responseData && data.responseData.translatedText) {
                translatedText.textContent = data.responseData.translatedText; // Muestra el texto traducido
                speakTranslatedText(data.responseData.translatedText); // Llama a la función para hablar el texto traducido
            } else {
                console.error("No se pudo obtener la traducción.");
            }
        } catch (error) {
            console.error("Error en la traducción:", error);
        }
    }

    // Función para hablar el texto traducido
    function speakTranslatedText(text) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang.value; // Establecer el idioma de la síntesis
        window.speechSynthesis.speak(utterance); // Iniciar la síntesis de voz
    }
});
