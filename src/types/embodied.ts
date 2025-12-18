// ml5.js Embodied Interaction Types

export type PostureState = 'tense' | 'neutral' | 'relaxed' | 'engaged';
export type FacialExpression = 'neutral' | 'smiling' | 'focused' | 'stressed' | 'calm';
export type GestureType = 'none' | 'pointing' | 'open_palm' | 'thumbs_up' | 'wave';

export interface EmbodiedState {
  posture: PostureState;
  facialExpression: FacialExpression;
  gestureDetected: GestureType;
  confidence: number;
  isActive: boolean;
}

export interface BodyPoseKeypoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}

export interface BodyPoseResult {
  keypoints: BodyPoseKeypoint[];
  score: number;
}

export interface FaceMeshKeypoint {
  x: number;
  y: number;
  z?: number;
}

export interface FaceMeshResult {
  keypoints: FaceMeshKeypoint[];
  box?: {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    width: number;
    height: number;
  };
}

export interface EmbodiedAxesInference {
  love: number;
  magic: number;
  calm: number;
  open: number;
  free: number;
}

export interface EmbodiedDesignContext {
  bodyAwarePatterns: string[];
  gesturalAffordances: string[];
  somaticConsiderations: string[];
}

export type CameraPermission = 'pending' | 'granted' | 'denied' | 'unavailable';
