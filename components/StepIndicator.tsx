
import React from 'react';
import { GenerationStep } from '../types';

interface StepIndicatorProps {
  currentStep: GenerationStep;
}

const STEPS = [
  { id: GenerationStep.UPLOAD, label: '上传产品' },
  { id: GenerationStep.ANALYSIS, label: '视觉分析' },
  { id: GenerationStep.PLANNING, label: '智能规划' },
  { id: GenerationStep.EDITING, label: '交互编辑' },
  { id: GenerationStep.GENERATING, label: '批量生成' },
  { id: GenerationStep.COMPLETE, label: '完成' }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full py-4 px-6 bg-white border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCurrent 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                      : isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-2 transition-colors ${idx < currentIdx ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
