import GEMINI from './GEMINI_API.js'

// const message = prompt('Write Your Prompt Here !!')
const APIURL = GEMINI.API + '?key=' + GEMINI.KEY;


const userForm = document.querySelector('form')
const chatBox = document.querySelector('.chat-box')
const userInput = document.querySelector('#prompt-input')

let user = true

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value
    fillChatBox(message, user)
    generateAIResponse(message, !user)
    userInput.value = '';
})

const generateAIResponse = async (prompt, user) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    const body = JSON.stringify({
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    });
    
    const response = await fetch(APIURL, {
        method: 'POST',
        headers: headers,
        body: body
    })
    const data = await response.json()

    // console.log(data.candidates[0].content.parts[0].text);
    try {
        cleanUp(
            data.candidates[0]
            .content.parts[0]
            .text, user)
    }
    catch {
        chatBox.innerHTML = '<b>API Working Slow...</b> Try Again....'
    }

}


function cleanUp(data, user) {
    const cleanData = data
        .replace(/\* \*\*/g, '<br><b>')
        .replace(/\*\*/g, '</b>')
        .replace(/\./g, '.<br>')
        .replace(/\:/g, ' :<br>')

    fillChatBox(cleanData, user)
}


function fillChatBox(data, user) {

    // chatBox.innerHTML += `<div class="${user ? 'user-message' : 'bot-message'}">
    //         <h5>${user ? 'User' : 'Bot'}</h5>
    //             <p id="${user ? 'user-prompt' : 'ai-response'}">${data}</p>
    //          </div>`;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add(user ? 'user-message' : 'bot-message');

    const label = document.createElement('h5');
    label.textContent = user ? 'User' : 'Bot';
    messageDiv.appendChild(label);
    
    const messagePara = document.createElement('p');
    messagePara.id = user ? 'user-prompt' : 'ai-response';
    messageDiv.appendChild(messagePara);
    
    chatBox.appendChild(messageDiv);
    if (!user) {
        let i = 0;
        const typingSpeed = 100;

        function typeMessage() {
            if (i < data.length) {
                messagePara.innerHTML += data.charAt(i);
                i++;
                setTimeout(typeMessage, typingSpeed);
            }
        }
        typeMessage();
    } else {
        messagePara.innerHTML = data;
    }
    chatBox.scrollBy(0,chatBox.scrollHeight)
}