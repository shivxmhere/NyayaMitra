const GEMINI_API_KEY = "AIzaSyC8E_7FY7k0Ws69YmPmfZzwozgtahbBaWk";

export const generateGeminiContent = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      })
    });
    
    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }
    
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Attempt to extract suggested actions if it's formatted like the backend
    let actions = [];
    const actionMatch = text.match(/\[ACTIONS\](.*?)\[\/ACTIONS\]/s);
    if (actionMatch) {
      actions = actionMatch[1].split('|').map(a => a.trim()).filter(a => a);
      text = text.replace(/\[ACTIONS\].*?\[\/ACTIONS\]/s, '').trim();
    } else {
      // Default actions based on language
      if (prompt.includes('hindi')) {
        actions = ['DLSA से संपर्क करें', 'सुनवाई की तारीख'];
      } else {
        actions = ['Contact DLSA', 'Next Hearing Date'];
      }
    }
    
    // Clean up markdown formatting for simple display
    // text = text.replace(/\*\*/g, '');
    
    return {
      response: text,
      suggested_actions: actions
    };
  } catch (err) {
    console.error('Gemini error:', err);
    throw err;
  }
};
