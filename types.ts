
export enum Recommendation {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

export interface AnalysisResult {
  prediction: string;
  recommendation: Recommendation;
  confidence: number;
  rationale: string;
}
