import { Sandpack } from '@codesandbox/sandpack-react';
import { useState } from 'react';
import { generateComponent } from './api';
import reactLogo from '/react.svg';

const defaultComponent = `import React from 'react';

export const App = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
    </div>
  );
};

export default App;
`;

function App() {
  const [useTs, setUseTs] = useState(true);
  const [prompt, setPrompt] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [template, setTemplate] = useState('react-ts');
  const [code, setCode] = useState(defaultComponent);

  const getCode = (response: string) => {
    const start = response.indexOf('import');

    if (start === -1) {
      setErrorMessage(
        'There was an error generating your component. Please try again.'
      );
      setCode(defaultComponent);
      return;
    }

    const lastComma = response.lastIndexOf(';') + 1;
    const lastCurlyBrace = response.lastIndexOf('}') + 1;

    setCode(
      response.slice(
        start,
        lastComma > lastCurlyBrace ? lastComma : lastCurlyBrace
      )
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = () => {
    setErrorMessage('');
    if (prompt.trim() === '') {
      setErrorMessage('Please enter a prompt');
      return;
    }
    setLoading(true);
    setTemplate(useTs ? 'react-ts' : 'react');
    generateComponent(useTs, prompt.trim()).then((data: string) => {
      getCode(data);
      setLoading(false);
    });
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center gap-16 bg-black">
      <main className="flex-1 flex flex-col justify-between max-w-4xl m-12">
        <div className="flex flex-col items-center gap-4">
          <img src={reactLogo} className="w-24 h-24" />
          <h1 className="text-6xl max-w-6xl text-center font-extrabold text-cyan-400">
            React Components with AI
          </h1>
        </div>
        <div className="w-full max-w-2xl mx-auto px-4">
          <textarea
            className="block w-full mt-8 lg:mt-2 px-4 py-2 mb-4 bg-gray-700 border-gray-700 text-white placeholder:text-gray-400  resize-none border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            placeholder="Blue button with a text that says 'Click me'"
            value={prompt}
            onChange={handleChange}
            style={{ minHeight: '1rem' }}
            disabled={loading}
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex items-center mb-4">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={useTs}
              disabled={loading}
              onChange={() => {
                setUseTs(!useTs);
              }}
              className="w-4 h-4 bg-gray-900 accent-cyan-400 text-white"
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-white"
            >
              Use TypeScript?
            </label>
          </div>
          <button
            className="block w-full px-4 py-2  bg-cyan-600 rounded-md focus:outline-none hover:bg-cyan-700 disabled:bg-cyan-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span
              className={`text-lg font-bold text-white ${
                loading && 'animate-pulse'
              }`}
            >
              {loading ? 'Generating component...' : 'Generate component'}
            </span>
          </button>
          <div
            className={`mt-4 font-bold text-lg text-red-500 text-center h-4`}
          >
            {errorMessage}
          </div>
        </div>
        {code && (
          <div className="border-white border-8 mt-12 lg:mt-2">
            <Sandpack
              customSetup={{
                dependencies: {
                  '@fortawesome/fontawesome-svg-core': 'latest',
                  '@fortawesome/react-fontawesome': 'latest',
                  '@fortawesome/free-solid-svg-icons': 'latest',
                  '@fortawesome/free-regular-svg-icons': 'latest',
                },
              }}
              options={{
                externalResources: ['https://cdn.tailwindcss.com'],
                wrapContent: true,
              }}
              files={
                template === 'react-ts'
                  ? {
                      'App.tsx': {
                        code,
                      },
                    }
                  : {
                      'App.js': {
                        code,
                      },
                    }
              }
              template={template as any}
              theme="dark"
            />
          </div>
        )}
      </main>
      <footer className="w-full flex-shrink flex items-center justify-center bg-black text-white h-12 tracking-wide text-base font-semibold">
        <span style={{ fontFamily: 'Manrope' }}>NICO MOYANO 2023</span>
      </footer>
    </div>
  );
}

export default App;
