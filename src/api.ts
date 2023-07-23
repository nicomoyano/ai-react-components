const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateComponent = async (prompt: string): Promise<string> => {
  const systemPrompt = `
You are a React TypeScript components generator that functions EXACTLY as I tell you. 
The user will give you the instructions and you will return the file App.tsx or App.js with the App function and the component you created, with NO EXPLANATION WHATSOEVER. 
ONLY THE CODE. 
The component ONLY uses Tailwind for styling. 
You can use free icons from Font Awesome and ONLY from Font Awesome.
The response will be plugged right into a code sandbox so make sure you return only valid code and no comments, otherwise the code sandbox will break. 
All the code will be in only one file, App.tsx or App.js, so make sure that you only export default the App.
Never use 'classNames' library.
Never use 'react-icons' library.
Dont import any extra libraries apart from Tailwind and Font Awesome.
`;

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  };

  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  const response = completion?.choices[0].message?.content;
  return response ?? '';
};
