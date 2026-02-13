
import React from 'react';
import { ProductAnalysis } from '../types';

interface AnalysisStageProps {
  analysis: ProductAnalysis;
  onConfirm: () => void;
}

export const AnalysisStage: React.FC<AnalysisStageProps> = ({ analysis, onConfirm }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">视觉特征识别结果</h2>
        <button 
          onClick={onConfirm}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          确认并开始规划文案
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">色彩系统 (Palette)</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: analysis.mainColor }}></div>
              <div>
                <p className="text-sm font-bold">建议主色</p>
                <code className="text-xs text-gray-500">{analysis.mainColor}</code>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: analysis.secondaryColor }}></div>
              <div>
                <p className="text-sm font-bold">辅助色</p>
                <code className="text-xs text-gray-500">{analysis.secondaryColor}</code>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg border shadow-sm" style={{ backgroundColor: analysis.backgroundColor }}></div>
              <div>
                <p className="text-sm font-bold">背景基调</p>
                <code className="text-xs text-gray-500">{analysis.backgroundColor}</code>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">产品属性分析</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">所属品类</p>
              <p className="text-lg font-bold text-blue-600">{analysis.category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">核心材质</p>
              <p className="text-lg font-bold text-gray-800">{analysis.material}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs text-gray-500 uppercase mb-2">识别到的核心特征</p>
            <div className="flex flex-wrap gap-2">
              {analysis.features.map((f, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs text-gray-500 uppercase mb-2">视觉风格关键词</p>
            <div className="flex flex-wrap gap-2">
              {analysis.styleKeywords.map((k, i) => (
                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
