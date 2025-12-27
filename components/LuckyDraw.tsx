
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCcw, UserCheck, Trash2, Wand2 } from 'lucide-react';
import { getWinnerAnnouncement } from '../services/gemini';

declare const confetti: any;

interface LuckyDrawProps {
  names: string[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ names }) => {
  const [candidates, setCandidates] = useState<string[]>(names);
  const [winners, setWinners] = useState<{name: string, prize: string, aiMsg?: string}[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [prizeName, setPrizeName] = useState('特等獎');
  const [repeatMode, setRepeatMode] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const spin = () => {
    if (isSpinning || candidates.length === 0) return;

    setIsSpinning(true);
    let speed = 50;
    let duration = 3000;
    const startTime = Date.now();

    intervalRef.current = window.setInterval(() => {
      setDisplayIndex(Math.floor(Math.random() * candidates.length));
      
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        clearInterval(intervalRef.current!);
        const winnerIndex = Math.floor(Math.random() * candidates.length);
        const winner = candidates[winnerIndex];
        finishDraw(winner);
      }
    }, speed);
  };

  const finishDraw = async (winner: string) => {
    setIsSpinning(false);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#818cf8', '#fbbf24']
    });

    const aiMsg = await getWinnerAnnouncement(winner, prizeName);
    
    setWinners(prev => [{ name: winner, prize: prizeName, aiMsg }, ...prev]);

    if (!repeatMode) {
      setCandidates(prev => prev.filter(c => c !== winner));
    }
  };

  const reset = () => {
    if (confirm("確定要重置所有抽籤紀錄嗎？")) {
      setCandidates(names);
      setWinners([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              抽籤設定
            </h3>
            <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              剩餘 {candidates.length} 位候選人
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">獎項名稱</label>
              <input
                type="text"
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-semibold text-gray-600">抽籤規則</label>
              <button
                onClick={() => setRepeatMode(!repeatMode)}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  repeatMode 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                {repeatMode ? <RefreshCcw className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                {repeatMode ? "允許重複中獎" : "不重複中獎 (移除已中獎者)"}
              </button>
            </div>
          </div>

          <div className="relative h-48 bg-gray-900 rounded-3xl overflow-hidden shadow-inner border-4 border-gray-800 flex items-center justify-center">
            <div className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-center px-4 ${isSpinning ? 'animate-pulse' : ''}`}>
              {candidates.length > 0 ? (isSpinning ? candidates[displayIndex] : "準備好了嗎？") : "名單已抽完"}
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || candidates.length === 0}
            className={`w-full py-6 text-2xl font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 ${
              isSpinning || candidates.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] shadow-indigo-200'
            }`}
          >
            {isSpinning ? "旋轉中..." : "開始抽籤！"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <h4 className="font-bold text-indigo-900 text-lg">獲獎紀錄</h4>
          <button onClick={reset} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
          {winners.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50 py-20">
              <Trophy className="w-12 h-12" />
              <p>尚無獲獎紀錄</p>
            </div>
          )}
          {winners.map((win, idx) => (
            <div key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{win.name}</span>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{win.prize}</span>
              </div>
              {win.aiMsg && (
                <div className="flex items-start gap-2 text-xs italic text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <Wand2 className="w-3 h-3 mt-0.5 text-purple-400" />
                  <p>{win.aiMsg}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
