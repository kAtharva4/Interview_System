// src/utils/api.js
const API_KEYS = {
    questions: "AIzaSyB4VvEVRha0l2T3rTxLAVdhSx_H9w0U6k8",
    feedback: "AIzaSyAym_JyZSEs2j6Xx6biCLJ-6su0oZ9Ouwk",
    modelAnswers: "AIzaSyDOumQ902Tql8Q3kGxIJd5SEr2HqfdD9TY",
    aptitudeQuestions: "AIzaSyCRDt1YIcAdFPqxH3iR2X7vU-yqyZluB1c",
    aptitudeFeedback: "AIzaSyDLZfQkmAIIDRY07tIONJO5Ro_c5-KxUyU",
  };
  // AIzaSyCKcpNa9YC1DDz2-EIxvC0ueEZ_mvD7VaE
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  
  export async function callGeminiAPI(prompt, keyType = 'questions') {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEYS[keyType]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
  
  export function cleanText(text) {
    return text.replace(/\*\*/g, '')
               .replace(/\*/g, '')
               .replace(/#/g, '')
               .replace(/```/g, '')
               .replace(/`/g, '')
               .replace(/\[|\]/g, '');
  }