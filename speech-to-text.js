
// utilizo el operador de nullish coalescing operator para inicializar cuando tengo null o undefined en el local
const tasks = JSON.parse(localStorage.getItem('tasks')) ?? []; // variable que me va a almacenar la información y NO la visualización

tasks.forEach(t => printTaskToHTML(t)); // pintamos las tareas que tengamos guardadas


// borra la card con un evento click
function removeTask(e,text) {
    const parentLi = e.path.find(e => e.classList.contains('tasks__item')); // Array de HTML Elements
    parentLi.remove(); // elimino el li padre
    const i = tasks.findIndex(t => t === text); // busco la posicion donde está mi tarea a borrar
    tasks.splice(i,1); // eliminar la posicion encontrada
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
    // actualizar el local con el nuevo array --> lo que habia antes MENOS la tarea que he eliminado
}

// hablamos con el reproductor de voz
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

// Copiamos el mensaje en el clipboard
function copyToClipboard(e,text) {
    navigator.clipboard.writeText(text);
    const copiedText = 'Message copied to clipboard';
    const parentLi = e.path.find(e => e.classList.contains('tasks__item')); // Array de HTML Elements
    const copiedAlert = parentLi.children[0].children[2].children[0];
    copiedAlert.classList.remove('copy-alert');
    copiedAlert.textContent = '';
    copiedAlert.classList.add('copy-alert');
    copiedAlert.textContent = copiedText;
}

function generateHTMLTaskFooter(text) {
    const actionCopy = document.createElement('button');
    actionCopy.classList.add('clipboard-button');
    const copyIcon = document.createElement('i');
    copyIcon.classList.add('fa-solid');
    copyIcon.classList.add('fa-copy');
    const copiedAlert = document.createElement('p');
    actionCopy.addEventListener('click', e => copyToClipboard(e,text));

    const actionSpeak = document.createElement('button');
    actionSpeak.classList.add('voice-button');
    const speakIcon = document.createElement('i');
    speakIcon.classList.add('fa-solid');
    speakIcon.classList.add('fa-ear-listen');
    actionSpeak.addEventListener('click', () => speak(text));

    const actionDelete = document.createElement('button');
    actionDelete.classList.add('remove-button');
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid');
    deleteIcon.classList.add('fa-trash-can');
    actionDelete.addEventListener('click', e => removeTask(e,text)); // asignamos la funcion de borrar

    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.classList.add('action-buttons__container')
    const actions = document.createElement('footer');
    actions.classList.add('clip-rem-buttons__container');
    
    actions.appendChild(copiedAlert);
    actionButtonsContainer.appendChild(actionCopy);
    actionCopy.appendChild(copyIcon);
    actionButtonsContainer.appendChild(actionSpeak);
    actionSpeak.appendChild(speakIcon);
    actionButtonsContainer.appendChild(actionDelete);
    actionDelete.appendChild(deleteIcon);
    actions.appendChild(actionButtonsContainer);

    return actions; // devuelvo el contenedor con sus hijos ya hechos append
}

function printTaskToHTML(text) {

    const title = document.createElement('h2');
    title.classList.add('title-text');
    title.textContent = 'Text:';

    const content = document.createElement('p');
    content.classList.add('text')
    content.textContent = text;

    const actions = generateHTMLTaskFooter(text); // el footer con los botones

    const cardContainer = document.createElement('article');
    cardContainer.classList.add('task__container');
    cardContainer.appendChild(title);
    cardContainer.appendChild(content);
    cardContainer.appendChild(actions);

    const listItem = document.createElement('li');
    listItem.classList.add('tasks__item');
    listItem.appendChild(cardContainer);

    document.querySelector('.tasks__list').appendChild(listItem);
}

// crea un task dentro de mi app
function createTask(text){
    printTaskToHTML(text);
    tasks.push(text); // lo guardo en mi variable de datos
    localStorage.setItem('tasks', JSON.stringify(tasks)); // guardo en el local
}

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