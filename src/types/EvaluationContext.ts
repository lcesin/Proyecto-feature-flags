export interface EvaluationContext {
  environment?: string;
  user?: {
    id: string;
    [key: string]: any;
  };
}