import GEMINI from './GEMINI_API.js'

const message = prompt('Write Your Prompt Here !!')
const container = document.querySelector('.container')

const APIURL = GEMINI.API + '?key=' + GEMINI.KEY;

const generateAIResponse = async (prompt) => {
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
    try{
    cleanUp(data.candidates[0].content.parts[0].text)
    }
    catch{
        container.innerHTML = '<b>API Working Slow...</b> Try Again....'
    }

}
generateAIResponse(message)

function cleanUp(data) {
    const cleanData = data
        .replace(/\* \*\*/g, '<br><b>')
        .replace(/\*\*/g, '</b>')
        .replace(/\./g, '.<br>')
        .replace(/\:/g, ' :<br>')
        
    container.innerHTML = cleanData
}