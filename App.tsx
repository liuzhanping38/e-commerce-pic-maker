
import React, { useState, useEffect, useCallback } from 'react';
import { GenerationStep, ProductAnalysis, StoryboardItem } from './types';
import { GeminiService } from './services/gemini';
import { StepIndicator } from './components/StepIndicator';
import { UploadStage } from './components/UploadStage';
import { AnalysisStage } from './components/AnalysisStage';
import { StoryboardStage } from './components/StoryboardStage';
import { GenerationStage } from './components/GenerationStage';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [step, setStep] = useState<GenerationStep>(GenerationStep.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [basePrompt, setBasePrompt] = useState('');
  const [language, setLanguage] = useState('中文');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [storyboards, setStoryboards] = useState<StoryboardItem[]>([]);
  const [genProgress, setGenProgress] = useState(0);

  const handleUploadNext = async (image: string, prompt: string, lang: string) => {
    setOriginalImage(image);
    setBasePrompt(prompt);
    setLanguage(lang);
    setStep(GenerationStep.ANALYSIS);
    
    try {
      const result = await gemini.analyzeProduct(image, prompt);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("分析失败，请检查 API Key 是否有效。");
      setStep(GenerationStep.UPLOAD);
    }
  };

  const handleConfirmAnalysis = async () => {
    if (!analysis) return;
    setStep(GenerationStep.PLANNING);
    
    try {
      const plans = await gemini.planStoryboards(analysis, language);
      setStoryboards(plans);
      setStep(GenerationStep.EDITING);
    } catch (err) {
      console.error(err);
      alert("文案规划失败。");
      setStep(GenerationStep.ANALYSIS);
    }
  };

  const updateStoryboard = (id: number, field: string, value: string) => {
    setStoryboards(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const generateImages = async () => {
    setStep(GenerationStep.GENERATING);
    setGenProgress(0);
    
    if (!originalImage) return;

    for (let i = 0; i < storyboards.length; i++) {
      try {
        const generatedUrl = await gemini.generateSceneImage(originalImage, storyboards[i]);
        setStoryboards(prev => prev.map((item, idx) => 
          idx === i ? { ...item, generatedImageUrl: generatedUrl } : item
        ));
        setGenProgress(i + 1);
      } catch (err) {
        console.error(`分镜 ${i + 1} 生成失败`, err);
      }
    }
    
    setStep(GenerationStep.COMPLETE);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-white">
            <i className="fas fa-bolt"></i>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase">电商一键美工</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">多模态 AI 详情图系统 v2.5</span>
          <div className="h-6 w-px bg-gray-200"></div>
          <i className="fas fa-user-circle text-gray-400 text-xl"></i>
        </div>
      </header>

      <StepIndicator currentStep={step} />

      <main className="container mx-auto mt-8">
        {step === GenerationStep.UPLOAD && (
          <UploadStage onNext={handleUploadNext} />
        )}

        {(step === GenerationStep.ANALYSIS || (step === GenerationStep.PLANNING && !storyboards.length)) && analysis && (
          <AnalysisStage analysis={analysis} onConfirm={handleConfirmAnalysis} />
        )}

        {(step === GenerationStep.EDITING || step === GenerationStep.PLANNING) && storyboards.length > 0 && (
          <StoryboardStage 
            storyboards={storyboards} 
            onUpdate={updateStoryboard} 
            onGenerate={generateImages} 
          />
        )}

        {(step === GenerationStep.GENERATING || step === GenerationStep.COMPLETE) && (
          <GenerationStage 
            storyboards={storyboards} 
            progress={genProgress} 
            total={storyboards.length} 
          />
        )}

        {step === GenerationStep.ANALYSIS && !analysis && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">正在识别产品特征...</p>
          </div>
        )}

        {step === GenerationStep.PLANNING && !storyboards.length && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">正在智能规划 8 个营销分镜...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
