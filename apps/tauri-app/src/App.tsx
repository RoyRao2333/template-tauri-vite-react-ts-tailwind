import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './index.css';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className='m-0 flex min-h-screen items-center justify-center bg-[#f6f6f6] text-center font-[Inter,Avenir,Helvetica,Arial,sans-serif] text-base leading-6 font-normal text-[#0f0f0f] dark:bg-[#2f2f2f] dark:text-[#f6f6f6]'>
      <div className='flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-10'>
        <h1 className='text-center'>Welcome to Tauri + React</h1>

        <div className='flex justify-center'>
          <a
            href='https://vite.dev'
            target='_blank'
            className='font-medium text-[#646cff] no-underline hover:text-[#535bf2] dark:hover:text-[#24c8db]'
          >
            <img
              src='/vite.svg'
              className='h-[6em] p-[1.5em] transition-[filter] duration-[750ms] will-change-[filter] hover:drop-shadow-[0_0_2em_#747bff]'
              alt='Vite logo'
            />
          </a>
          <a
            href='https://tauri.app'
            target='_blank'
            className='font-medium text-[#646cff] no-underline hover:text-[#535bf2] dark:hover:text-[#24c8db]'
          >
            <img
              src='/tauri.svg'
              className='h-[6em] p-[1.5em] transition-[filter] duration-[750ms] will-change-[filter] hover:drop-shadow-[0_0_2em_#24c8db]'
              alt='Tauri logo'
            />
          </a>
          <a
            href='https://react.dev'
            target='_blank'
            className='font-medium text-[#646cff] no-underline hover:text-[#535bf2] dark:hover:text-[#24c8db]'
          >
            <img
              src={reactLogo}
              className='h-[6em] p-[1.5em] transition-[filter] duration-[750ms] will-change-[filter] hover:drop-shadow-[0_0_2em_#61dafb]'
              alt='React logo'
            />
          </a>
        </div>
        <p className='text-balance'>
          Click on the Tauri, Vite, and React logos to learn more.
        </p>

        <form
          className='flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center'
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id='greet-input'
            className='w-full min-w-0 rounded-lg border border-transparent bg-white px-[1.2em] py-[0.6em] font-[inherit] text-[1em] font-medium text-[#0f0f0f] shadow-[0_2px_2px_rgba(0,0,0,0.2)] outline-none transition-[border-color] duration-[250ms] dark:bg-[#0f0f0f98] dark:text-white sm:w-[30rem]'
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder='Enter a name...'
          />
          <button
            type='submit'
            className='cursor-pointer rounded-lg border border-transparent bg-white px-[1.6em] py-[0.6em] font-[inherit] text-[1em] font-medium text-[#0f0f0f] shadow-[0_2px_2px_rgba(0,0,0,0.2)] outline-none transition-[border-color] duration-[250ms] hover:border-[#396cd8] active:border-[#396cd8] active:bg-[#e8e8e8] dark:bg-[#0f0f0f98] dark:text-white dark:active:bg-[#0f0f0f69]'
          >
            Greet
          </button>
        </form>
        <p className='min-h-8'>{greetMsg}</p>
      </div>
    </main>
  );
}

export default App;
