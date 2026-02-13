
import React from 'react';
import { StoryboardItem } from '../types';

interface GenerationStageProps {
  storyboards: StoryboardItem[];
  progress: number;
  total: number;
}

export const GenerationStage: React.FC<GenerationStageProps> = ({ storyboards, progress, total }) => {
  
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    storyboards.forEach((item, index) => {
      if (item.generatedImageUrl) {
        // Adding a slight delay to avoid browser blocking multiple downloads
        setTimeout(() => {
          downloadImage(item.generatedImageUrl!, `Product_Scene_${item.id}_${item.type}.png`);
        }, index * 200);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-800 mb-4">
          {progress === total ? '全部分镜生成完毕' : '正在批量产出高质量图片'}
        </h2>
        <div className="w-full max-w-md mx-auto h-3 bg-gray-100 rounded-full overflow-hidden border">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
        <p className="mt-4 text-gray-500 font-medium">
          {progress === total 
            ? `共 ${total} 张分镜已就绪` 
            : `正在生成第 ${progress} / ${total} 张分镜...`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {storyboards.map((item) => (
          <div key={item.id} className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white aspect-[3/4] border-4 border-white transition-all hover:scale-[1.02]">
            {item.generatedImageUrl ? (
              <div className="relative h-full w-full">
                <img src={item.generatedImageUrl} alt={item.title} className="w-full h-full object-cover" />
                
                {/* Individual Download Button */}
                <button 
                  onClick={() => downloadImage(item.generatedImageUrl!, `Scene_${item.id}.png`)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  title="下载单张图片"
                >
                  <i className="fas fa-download"></i>
                </button>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
                  <h4 className="text-white text-xl font-black leading-tight drop-shadow-lg">{item.overlayText}</h4>
                  <div className="mt-2 w-10 h-1 bg-blue-400 rounded-full"></div>
                </div>
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-gray-800">
                  {item.type}
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 animate-pulse p-6">
                <i className="fas fa-spinner fa-spin text-3xl text-blue-300 mb-4"></i>
                <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">{item.title}</p>
                <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-100 animate-[loading_2s_infinite]"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {progress === total && (
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={downloadAll}
            className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-lg shadow-2xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 w-full sm:w-auto"
          >
            下载全套详情图包 <i className="fas fa-file-archive ml-2"></i>
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-900 rounded-full font-black text-lg shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 w-full sm:w-auto"
          >
            开始新项目 <i className="fas fa-plus ml-2"></i>
          </button>
        </div>
      )}
    </div>
  );
};
