import GEMINI from './GEMINI_API.js'

const message = prompt('Write Your Prompt Here !!')

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
    console.log(data.candidates[0].content.parts[0].text);

}
generateAIResponse(message)