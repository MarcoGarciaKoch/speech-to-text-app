# Speech To Text App

This project consist of the creation of an app that recognizes your voice and transcribes it to text.
 

This was one of the first projects I did during my Full Stack Development Bootcamp and technological stack used was:

- **HTML**
- **CSS**
- **JavaScript**

The application has the following main features:

- The user can create a new card with the speech.
- The user can copy the message to the clipboard. 
- The user can listen the message saved in the card.
- The user can delete the card with the message. 


# Repository Structure

It only consists on the app client side.


# Front End

One of the remarkable implementations is the use of the Speech Recognition API when clicking the recording button.

```js
const recordBtn = document.querySelector('.record-button');
let waves = document.querySelector('.waves');
let recording = false; // state variable para saber si estamos grabando o no
let speechRecognition; // objeto que lee el micro
let recordingText = ''; // texto donde voy guardando la grabación

if ("webkitSpeechRecognition" in window) {
    speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.lang = 'es-ES';

    speechRecognition.onstart = () => {
        recording=true;
        recordingText = '';
        document.querySelector(".record-status").style.display = "none";
        document.querySelector(".record-listening").style.display = "block";
        waves.style.visibility = 'visible';
    };

    speechRecognition.onend = () => {
        recording=false;
        document.querySelector(".record-status").style.display = "block";
        document.querySelector(".record-listening").style.display = "none";
        waves.style.visibility = 'hidden';
    };

    speechRecognition.onError = console.error; // le asocio la función que pinta errores en la consola

    speechRecognition.onresult = e => recordingText += e.results[e.resultIndex][0].transcript;
} else {
    console.log("Speech Recognition Not Available")
}

recordBtn.addEventListener('click', () => {
    recordBtn.classList.toggle('record__button--recording');
    if (!recording) {
        // empezar a grabar
        speechRecognition.start()
    } else {
        // terminar de grabar
        speechRecognition.stop();
        // creo una task en mi app
        createTask(recordingText);
    }
});
```

Also to mention the use of the `SpeechSynthesisUtterance` API to convert the text message into voice.
To persist the information, `Local Storage` has been used.


# Deployment

The application has been deployed using GitHub Pages on the following url:

- https://marcogarciakoch.github.io/speech-to-text-app/

# Local setup

Although it is deployed in GitHub Pages, it can be configured to run in a local environment.

To do so, the following steps must be performed:

1. Clone the monorepo
    > git clone https://github.com/MarcoGarciaKoch/speech-to-text-app.git

2. Now you can test the app running the option `Open with Live Server` over the `spech-to-text.html` file.

