import { Sandpack } from '@codesandbox/sandpack-react';
import { useState } from 'react';
import { generateComponent } from './api';
import reactLogo from '/react.svg';

const defaultComponent = `import React from 'react';

export const App = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hola mundo!</h1>
    </div>
  );
};

export default App;
`;

function App() {
  const [useTs, setUseTs] = useState(true);
  const [prompt, setPrompt] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [template, setTemplate] = useState('react-ts');
  const [code, setCode] = useState(defaultComponent);

  const getCode = (response: string) => {
    const start = response.indexOf('import');

    if (start === -1) {
      setError(true);
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
    setError(false);
    setLoading(true);
    setTemplate(useTs ? 'react-ts' : 'react');
    generateComponent(useTs, prompt.trim()).then((data: string) => {
      getCode(data);
      setLoading(false);
      setPrompt('');
    });
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center gap-16 bg-white">
      <main className="flex-1 flex flex-col justify-between max-w-4xl m-12">
        <div className="flex flex-col items-center gap-4">
          <img src={reactLogo} className="w-24 h-24" />
          <h1 className="text-6xl max-w-6xl text-center font-bold text-black">
            Genera componentes con IA
          </h1>
        </div>
        <div className="w-full max-w-2xl mx-auto px-4">
          <textarea
            className="block w-full px-4 py-2 mb-4 text-black placeholder:text-gray-500  resize-none border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Escribe aquí lo que necesitas"
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
              className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded"
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              TypeScript
            </label>
          </div>
          <button
            className="block w-full px-4 py-2  bg-cyan-500 rounded-md focus:outline-none hover:bg-cyan-700 disabled:bg-cyan-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span
              className={`text-lg font-bold text-white ${
                loading && 'animate-pulse'
              }`}
            >
              {loading ? 'Generando...' : 'Generar'}
            </span>
          </button>
          <div
            className={`mt-4 text-red-500 text-center e ${
              !error && 'invisible'
            }`}
          >
            No se pudo generar el componente
          </div>
        </div>
        {code && (
          <div className="border-white border-8">
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
      <footer className="w-full flex-shrink flex items-center justify-center bg-black text-white h-12 tracking-widest text-lg">
        <span style={{ fontFamily: 'Manrope' }}>NICO MOYANO 2023</span>
      </footer>
    </div>
  );
}

export default App;
