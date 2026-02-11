import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  EmbodiedState,
  PostureState,
  FacialExpression,
  GestureType,
  BodyPoseResult,
  FaceMeshResult,
  EmbodiedAxesInference,
  CameraPermission,
} from '@/types/embodied';

const DEFAULT_STATE: EmbodiedState = {
  posture: 'neutral',
  facialExpression: 'neutral',
  gestureDetected: 'none',
  confidence: 0,
  isActive: false,
};

// Infer posture from shoulder/hip keypoints
function inferPosture(pose: BodyPoseResult | null): PostureState {
  if (!pose || pose.keypoints.length === 0) return 'neutral';
  
  const leftShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
  const rightShoulder = pose.keypoints.find(k => k.name === 'right_shoulder');
  const leftHip = pose.keypoints.find(k => k.name === 'left_hip');
  const rightHip = pose.keypoints.find(k => k.name === 'right_hip');
  
  if (!leftShoulder || !rightShoulder) return 'neutral';
  
  // Calculate shoulder tension from position relative to hips
  const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
  
  if (leftHip && rightHip) {
    const hipWidth = Math.abs(rightHip.x - leftHip.x);
    const ratio = shoulderWidth / hipWidth;
    
    // Hunched/tense: shoulders narrower than hips
    if (ratio < 0.9) return 'tense';
    // Open/engaged: shoulders wider than hips
    if (ratio > 1.3) return 'engaged';
    // Relaxed: natural ratio
    if (ratio > 1.1) return 'relaxed';
  }
  
  return 'neutral';
}

// Infer expression from face mesh landmarks
function inferExpression(face: FaceMeshResult | null): FacialExpression {
  if (!face || face.keypoints.length < 100) return 'neutral';
  
  // Simplified analysis using key facial landmarks
  // Mouth corners (indices 61, 291) and eyebrows (70, 300)
  const keypoints = face.keypoints;
  
  // Check for smile - mouth corners raised relative to center
  const leftMouth = keypoints[61];
  const rightMouth = keypoints[291];
  const topLip = keypoints[13];
  
  if (leftMouth && rightMouth && topLip) {
    const mouthOpenness = topLip.y - ((leftMouth.y + rightMouth.y) / 2);
    const mouthWidth = Math.abs(rightMouth.x - leftMouth.x);
    
    // Smiling: wide mouth, corners up
    if (mouthWidth > 50 && mouthOpenness < 5) return 'smiling';
    
    // Focused: narrow, tight
    if (mouthWidth < 30) return 'focused';
  }
  
  // Check eyebrow tension
  const leftBrow = keypoints[70];
  const rightBrow = keypoints[300];
  const leftEye = keypoints[159];
  
  if (leftBrow && leftEye) {
    const browHeight = leftEye.y - leftBrow.y;
    // Raised brows = calm/open
    if (browHeight > 25) return 'calm';
    // Furrowed = stressed
    if (browHeight < 15) return 'stressed';
  }
  
  return 'neutral';
}

// Detect gestures from hand positions relative to body
function inferGesture(pose: BodyPoseResult | null): GestureType {
  if (!pose || pose.keypoints.length === 0) return 'none';
  
  const leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
  const rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');
  const nose = pose.keypoints.find(k => k.name === 'nose');
  const leftShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
  
  if (!leftWrist || !rightWrist || !nose || !leftShoulder) return 'none';
  
  // Pointing: one hand extended forward, higher than shoulder
  if (rightWrist.y < leftShoulder.y - 50 && rightWrist.confidence > 0.5) {
    return 'pointing';
  }
  
  // Open palm: both hands at chest level, spread
  if (
    leftWrist.y > leftShoulder.y &&
    rightWrist.y > leftShoulder.y &&
    Math.abs(leftWrist.x - rightWrist.x) > 200
  ) {
    return 'open_palm';
  }
  
  // Wave: hand above head level
  if (rightWrist.y < nose.y - 50 || leftWrist.y < nose.y - 50) {
    return 'wave';
  }
  
  return 'none';
}

// Map embodied state to emotional axes (0-100 scale)
function mapToEmotionalAxes(state: EmbodiedState): EmbodiedAxesInference {
  const base = 50;
  const confidence = state.confidence;
  
  let love = base;
  let magic = base;
  let calm = base;
  let open = base;
  let free = base;
  
  // Posture influences
  switch (state.posture) {
    case 'relaxed':
      calm += 20 * confidence;
      free += 15 * confidence;
      break;
    case 'engaged':
      magic += 20 * confidence;
      open += 15 * confidence;
      break;
    case 'tense':
      calm -= 20 * confidence;
      free -= 15 * confidence;
      break;
  }
  
  // Facial expression influences
  switch (state.facialExpression) {
    case 'smiling':
      love += 25 * confidence;
      magic += 15 * confidence;
      break;
    case 'focused':
      magic += 20 * confidence;
      calm += 10 * confidence;
      break;
    case 'calm':
      calm += 25 * confidence;
      open += 15 * confidence;
      break;
    case 'stressed':
      calm -= 25 * confidence;
      love -= 10 * confidence;
      break;
  }
  
  // Gesture influences
  switch (state.gestureDetected) {
    case 'open_palm':
      open += 25 * confidence;
      love += 15 * confidence;
      break;
    case 'thumbs_up':
      magic += 20 * confidence;
      free += 15 * confidence;
      break;
    case 'wave':
      free += 20 * confidence;
      open += 15 * confidence;
      break;
  }
  
  // Clamp values
  return {
    love: Math.min(100, Math.max(0, Math.round(love))),
    magic: Math.min(100, Math.max(0, Math.round(magic))),
    calm: Math.min(100, Math.max(0, Math.round(calm))),
    open: Math.min(100, Math.max(0, Math.round(open))),
    free: Math.min(100, Math.max(0, Math.round(free))),
  };
}

export function useEmbodiedState() {
  const [state, setState] = useState<EmbodiedState>(DEFAULT_STATE);
  const [permission, setPermission] = useState<CameraPermission>('pending');
  const [bodyPose, setBodyPose] = useState<BodyPoseResult | null>(null);
  const [faceMesh, setFaceMesh] = useState<FaceMeshResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const bodyPoseModelRef = useRef<any>(null);
  const faceMeshModelRef = useRef<any>(null);
  const isRunningRef = useRef(false);
  
  // Request camera permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      setPermission('granted');
      return true;
    } catch (err) {
      console.error('Camera permission denied:', err);
      setPermission('denied');
      return false;
    }
  }, []);
  
  // Initialize models (ml5 removed — stub for future integration)
  const initModels = useCallback(async (video: HTMLVideoElement) => {
    console.warn('Embodied state: ml5 has been removed. Body/face detection is disabled.');
    videoRef.current = video;
    return false;
  }, []);
  
  // Start detection loop
  const startDetection = useCallback(async () => {
    if (!videoRef.current || isRunningRef.current) return;
    
    isRunningRef.current = true;
    setState(prev => ({ ...prev, isActive: true }));
    
    const detectLoop = async () => {
      if (!isRunningRef.current || !videoRef.current) return;
      
      try {
        // Detect body pose
        if (bodyPoseModelRef.current) {
          const poses = await bodyPoseModelRef.current.detect(videoRef.current);
          if (poses && poses.length > 0) {
            setBodyPose(poses[0]);
          }
        }
        
        // Detect face mesh
        if (faceMeshModelRef.current) {
          const faces = await faceMeshModelRef.current.detect(videoRef.current);
          if (faces && faces.length > 0) {
            setFaceMesh(faces[0]);
          }
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
      
      // Continue loop
      if (isRunningRef.current) {
        requestAnimationFrame(detectLoop);
      }
    };
    
    detectLoop();
  }, []);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    isRunningRef.current = false;
    setState(prev => ({ ...prev, isActive: false }));
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);
  
  // Update state when pose/face changes
  useEffect(() => {
    if (!bodyPose && !faceMesh) return;
    
    const posture = inferPosture(bodyPose);
    const expression = inferExpression(faceMesh);
    const gesture = inferGesture(bodyPose);
    
    // Calculate average confidence
    const poseConf = bodyPose?.score || 0;
    const faceConf = faceMesh?.keypoints?.length ? 0.8 : 0;
    const avgConf = (poseConf + faceConf) / 2;
    
    setState({
      posture,
      facialExpression: expression,
      gestureDetected: gesture,
      confidence: avgConf,
      isActive: true,
    });
  }, [bodyPose, faceMesh]);
  
  // Infer emotional axes from current state
  const inferEmotionalAxes = useCallback((): EmbodiedAxesInference => {
    return mapToEmotionalAxes(state);
  }, [state]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);
  
  return {
    state,
    permission,
    bodyPose,
    faceMesh,
    requestPermission,
    initModels,
    startDetection,
    stopDetection,
    inferEmotionalAxes,
    videoRef,
    streamRef,
  };
}
