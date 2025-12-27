
import React, { useState } from 'react';
import { NameInput } from './components/NameInput';
import { LuckyDraw } from './components/LuckyDraw';
import { Grouping } from './components/Grouping';
import { AppMode } from './types';
import { Gift, Users2, LayoutGrid, RotateCcw, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.SETUP);

  const handleNamesSubmit = (newList: string[]) => {
    setNames(newList);
    setMode(AppMode.LUCKY_DRAW);
  };

  const resetList = () => {
    if (confirm("確定要清除目前名單並返回設定頁面嗎？")) {
      setNames([]);
      setMode(AppMode.SETUP);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 glass-morphism border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-none">HR TOOLBOX</h1>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">專業行政管理套件</p>
            </div>
          </div>

          {mode !== AppMode.SETUP && (
            <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl border border-gray-200">
              <button
                onClick={() => setMode(AppMode.LUCKY_DRAW)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  mode === AppMode.LUCKY_DRAW 
                  ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>獎品抽籤</span>
              </button>
              <button
                onClick={() => setMode(AppMode.GROUPING)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  mode === AppMode.GROUPING 
                  ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Users2 className="w-4 h-4" />
                <span>自動分組</span>
              </button>
            </div>
          )}

          {mode !== AppMode.SETUP && (
            <button
              onClick={resetList}
              className="hidden md:flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置名單
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        {mode === AppMode.SETUP ? (
          <NameInput onNamesSubmit={handleNamesSubmit} />
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setMode(AppMode.SETUP)}
                className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                返回修改名單
              </button>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">目前名單庫</span>
                <p className="text-sm font-black text-gray-800">{names.length} 名員工</p>
              </div>
            </div>

            {mode === AppMode.LUCKY_DRAW ? (
              <LuckyDraw names={names} />
            ) : (
              <Grouping names={names} />
            )}
          </div>
        )}
      </main>

      <footer className="py-8 text-center border-t border-gray-200">
        <p className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em]">專為世界級的人資團隊打造</p>
      </footer>
    </div>
  );
};

export default App;
