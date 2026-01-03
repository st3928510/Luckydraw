
import React, { useState } from 'react';
import { Users2, Shuffle, Sparkles, Download } from 'lucide-react';
import { Group } from '../types';
import { getGroupThemes } from '../services/gemini';

interface GroupingProps {
  names: string[];
}

export const Grouping: React.FC<GroupingProps> = ({ names }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const performGrouping = async () => {
    setIsProcessing(true);
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const result: Group[] = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push({
        id: Math.floor(i / groupSize) + 1,
        name: `第 ${Math.floor(i / groupSize) + 1} 組`,
        members: shuffled.slice(i, i + groupSize),
      });
    }

    const themes = await getGroupThemes(result.length);
    const enriched = result.map((g, idx) => ({
      ...g,
      theme: themes[idx] || g.name
    }));

    setGroups(enriched);
    setIsProcessing(false);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    const headers = ["組別ID", "創意隊名", "成員名單"];
    const rows = groups.flatMap(group =>
      group.members.map(member => ({
        "組別ID": group.id,
        "創意隊名": group.theme || group.name,
        "成員名單": member
      }))
    );

    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "分組結果");
      XLSX.writeFile(workbook, `分組結果_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-100 rounded-2xl">
            <Users2 className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">自動分組器</h3>
            <p className="text-sm text-gray-500">設定每組人數，AI 將會為每組生成有趣的創意隊名</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-32">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">每組人數</label>
            <input
              type="number"
              min="2"
              max={names.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value))}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={performGrouping}
              disabled={isProcessing}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:bg-gray-200"
            >
              {isProcessing ? (
                <Shuffle className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shuffle className="w-5 h-5" />
                  <span>開始分組</span>
                </>
              )}
            </button>

            {groups.length > 0 && (
              <button
                onClick={downloadCSV}
                className="py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all"
                title="下載分組結果 Excel"
              >
                <Download className="w-5 h-5 text-indigo-500" />
                <span className="hidden sm:inline">匯出 Excel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform">
            <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">組別 ID: {group.id}</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <h4 className="text-lg font-black truncate">{group.theme || group.name}</h4>
            </div>
            <div className="p-5 flex-1 space-y-2">
              {group.members.map((member, mIdx) => (
                <div key={mIdx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-[10px] font-bold text-indigo-400 border border-indigo-100">
                    {mIdx + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{member}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">
              共 {group.members.length} 位成員
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full text-gray-300">
              <Users2 className="w-10 h-10" />
            </div>
            <p className="text-gray-400 font-medium italic">尚未進行分組。請設定每組人數並點擊「開始分組」。</p>
          </div>
        )}
      </div>
    </div>
  );
};
