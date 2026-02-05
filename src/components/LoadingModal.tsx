import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface LoadingModalProps {
  onLoadComplete: () => void;
}

const LOADING_STEPS = [
  "Carregando configurações...",
  "Carregando categorias...",
  "Preparando o jogo...",
];

const LoadingModal = ({ onLoadComplete }: LoadingModalProps) => {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const totalDuration = 30000; // Total loading time in ms (30 seconds)
    const stepDuration = totalDuration / LOADING_STEPS.length;
    const progressInterval = 50;
    const progressIncrement = (100 / totalDuration) * progressInterval;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    const completeTimer = setTimeout(() => {
      setOpen(false);
      onLoadComplete();
    }, totalDuration + 300);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadComplete]);

  return (
    <Dialog open={open}>
      <DialogContent className="loading-modal" hideCloseButton>
        <div className="loading-content">
          <div className="loading-logo">
            <span className="loading-title">Quiz Master</span>
            <div className="loading-spinner" />
          </div>
          
          <div className="loading-progress-container">
            <Progress value={progress} className="loading-progress-bar" />
            <span className="loading-percentage">{Math.round(progress)}%</span>
          </div>
          
          <p className="loading-step">{LOADING_STEPS[currentStep]}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
