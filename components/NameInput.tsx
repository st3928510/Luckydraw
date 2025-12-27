
import React, { useState, useMemo } from 'react';
import { Upload, Trash2, Zap, AlertCircle, UserPlus } from 'lucide-react';

interface NameInputProps {
  onNamesSubmit: (names: string[]) => void;
}

const MOCK_NAMES = [
  "陳大文", "林小明", "張美玲", "王小華", "李茂盛",
  "趙子龍", "孫尚香", "周杰倫", "蔡依林", "張學友",
  "劉德華", "郭富城", "黎明", "陳奕迅", "林俊傑"
];

export const NameInput: React.FC<NameInputProps> = ({ onNamesSubmit }) => {
  const [inputText, setInputText] = useState('');
  
  const currentNames = useMemo(() => {
    return inputText.split(/\r?\n/).map(n => n.trim()).filter(n => n.length > 0);
  }, [inputText]);

  const duplicates = useMemo(() => {
    const seen = new Set();
    const dups = new Set();
    currentNames.forEach(name => {
      const lowerName = name.toLowerCase();
      if (seen.has(lowerName)) {
        dups.add(lowerName);
      }
      seen.add(lowerName);
    });
    return Array.from(dups);
  }, [currentNames]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  const loadMockData = () => {
    setInputText(MOCK_NAMES.join('\n'));
  };

  const removeDuplicates = () => {
    const unique = Array.from(new Set(currentNames));
    setInputText(unique.join('\n'));
  };

  const handleSubmit = () => {
    if (currentNames.length > 0) {
      onNamesSubmit(currentNames);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">歡迎使用 HR 數位工具箱</h2>
        <p className="text-gray-500">匯入員工名單，開始您的抽籤或分組任務</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
          <Upload className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="mt-2 text-sm font-medium text-gray-600">上傳 CSV / TXT 檔案</span>
          <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
        </label>

        <button 
          onClick={loadMockData}
          className="flex flex-col items-center justify-center h-40 border-2 border-indigo-100 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100 transition-colors group"
        >
           <Zap className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
           <span className="mt-2 text-sm font-medium text-gray-600">載入模擬名單</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">員工姓名清單</label>
          {duplicates.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                <AlertCircle className="w-3 h-3" />
                偵測到 {duplicates.length} 個重複姓名
              </span>
              <button 
                onClick={removeDuplicates}
                className="text-xs font-bold text-red-500 hover:text-red-700 underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                移除重複項
              </button>
            </div>
          )}
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="請在此貼上姓名，每行一個姓名..."
          className={`w-full h-48 p-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${
            duplicates.length > 0 ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'
          }`}
        />
        
        <button
          onClick={handleSubmit}
          disabled={currentNames.length === 0}
          className={`w-full py-4 font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1 active:scale-95 ${
            currentNames.length === 0 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          <span>確認名單 ({currentNames.length} 人) 並開始</span>
        </button>
      </div>
    </div>
  );
};
