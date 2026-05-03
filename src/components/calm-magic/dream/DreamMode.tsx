import React, { useState } from 'react';
import PromptPicker from './PromptPicker';
import PrdUploader from './PrdUploader';
import DreamSequence from './DreamSequence';
import type { DreamPrompt } from '@/data/dreamPrompts';

type Step = 'prompt' | 'upload' | 'dream';

const DreamMode: React.FC = () => {
  const [step, setStep] = useState<Step>('prompt');
  const [prompt, setPrompt] = useState<DreamPrompt | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const restart = () => {
    setStep('prompt');
    setPrompt(null);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      {step === 'prompt' && (
        <PromptPicker
          onChoose={(p) => { setPrompt(p); setStep('upload'); }}
        />
      )}
      {step === 'upload' && prompt && (
        <PrdUploader
          question={prompt.text}
          onSubmit={(f) => { setFile(f); setStep('dream'); }}
          onBack={() => setStep('prompt')}
        />
      )}
      {step === 'dream' && prompt && file && (
        <DreamSequence question={prompt.text} file={file} onRestart={restart} />
      )}
    </div>
  );
};

export default DreamMode;
