
export enum GenerationStep {
  UPLOAD = 'UPLOAD',
  ANALYSIS = 'ANALYSIS',
  PLANNING = 'PLANNING',
  EDITING = 'EDITING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE'
}

export interface ProductAnalysis {
  mainColor: string;
  secondaryColor: string;
  backgroundColor: string;
  features: string[];
  material: string;
  category: string;
  styleKeywords: string[];
}

export interface StoryboardItem {
  id: number;
  type: 'Cover' | 'CloseUp' | 'Feature' | 'Usage' | 'Craftsmanship' | 'Size' | 'Set' | 'Advice';
  title: string;
  description: string;
  visualPrompt: string;
  overlayText: string;
  generatedImageUrl?: string;
}

export interface AppState {
  step: GenerationStep;
  originalImage: string | null;
  basePrompt: string;
  targetLanguage: string;
  analysis: ProductAnalysis | null;
  storyboards: StoryboardItem[];
}
