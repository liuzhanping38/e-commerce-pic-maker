
import React, { useState } from 'react';

interface UploadStageProps {
  onNext: (image: string, prompt: string, lang: string) => void;
}

export const UploadStage: React.FC<UploadStageProps> = ({ onNext }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [lang, setLang] = useState('中文');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">1. 上传产品底图</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">产品原图 (PNG/JPG)</label>
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              image ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {image ? (
              <img src={image} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                <p className="text-gray-500">点击或拖拽上传产品图</p>
              </>
            )}
            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">产品基础描述</label>
          <input 
            type="text" 
            placeholder="例如：极简陶瓷茶点碟" 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">目标市场语言</label>
          <select 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="中文">中文 (Chinese)</option>
            <option value="Japanese">日语 (Japanese)</option>
            <option value="English">英语 (English)</option>
            <option value="Korean">韩语 (Korean)</option>
            <option value="Spanish">西班牙语 (Spanish)</option>
          </select>
        </div>

        <button 
          onClick={() => image && onNext(image, prompt, lang)}
          disabled={!image || !prompt}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          开始智能分析 <i className="fas fa-magic ml-2"></i>
        </button>
      </div>
    </div>
  );
};
