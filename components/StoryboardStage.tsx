
import React from 'react';
import { StoryboardItem } from '../types';

interface StoryboardStageProps {
  storyboards: StoryboardItem[];
  onUpdate: (id: number, field: string, value: string) => void;
  onGenerate: () => void;
}

export const StoryboardStage: React.FC<StoryboardStageProps> = ({ storyboards, onUpdate, onGenerate }) => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">内容分镜规划</h2>
          <p className="text-gray-500">您可以点击任意分镜进行二次编辑（文案、背景或氛围）</p>
        </div>
        <button 
          onClick={onGenerate}
          className="bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-green-700 transition-all transform hover:scale-105"
        >
          确认规划并生成图片 <i className="fas fa-sparkles ml-2"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {storyboards.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col space-y-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded-md">分镜 {item.id}</span>
              <span className="text-[10px] uppercase font-bold text-blue-500">{item.type}</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">分镜标题</label>
                <input 
                  type="text" 
                  value={item.title}
                  onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
                  className="w-full text-sm font-bold border-b focus:border-blue-500 outline-none py-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">画面展示文案</label>
                <textarea 
                  value={item.overlayText}
                  onChange={(e) => onUpdate(item.id, 'overlayText', e.target.value)}
                  rows={2}
                  className="w-full text-xs border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">视觉提示词 (AI 生成背景参考)</label>
                <textarea 
                  value={item.visualPrompt}
                  onChange={(e) => onUpdate(item.id, 'visualPrompt', e.target.value)}
                  rows={4}
                  className="w-full text-[11px] text-gray-600 bg-gray-50 border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
