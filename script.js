import GEMINI from './GEMINI_API.js'

const APIURL = GEMINI.API + '?key=' + GEMINI.KEY;
const userForm = document.querySelector('form')
const chatBox = document.querySelector('.chat-box')
const userInput = document.querySelector('#prompt-input')
let user = true
let stopChat = false


userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = userInput.value
    if(userInput.value === '') return
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
        .replace(/\*\*(.*?)\*\*/g, "<br><b>$1</b>")
    fillChatBox(cleanData, user)
}




function fillChatBox(data, user) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(user ? 'user-message' : 'bot-message');

    const label = document.createElement('h3');
    label.textContent = user ? 'User' : 'Bot';
    messageDiv.appendChild(label);

    const messagePara = document.createElement('p');
    messagePara.id = user ? 'user-prompt' : 'ai-response';
    messageDiv.appendChild(messagePara);

    const stopAI = document.createElement('button');
    stopAI.classList.add('stop-ai');
    stopAI.textContent = 'Stop AI';

    if (!user) {
        messageDiv.append(stopAI);
    }

    stopAI.addEventListener('click', ()=> {
        stopChat = true
        stopAI.remove();
    });

    chatBox.appendChild(messageDiv);
    if (!user) {
        let i = 0;
        const typingSpeed = 10;

        function typeMessage() {
            if (i < data.length) {
                if (!stopChat) {
                const typedData = data.substring(0, i + 1);
                messagePara.innerHTML = typedData;
                i++;
                setTimeout(typeMessage, typingSpeed);
                } else {
                    stopChat = false;
                }
            }
        }
        typeMessage();
    } else {
        messagePara.innerHTML = data;
    }
    chatBox.scrollBy(0, chatBox.scrollHeight)
}