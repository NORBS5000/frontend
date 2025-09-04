import React from "react";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, steps }) => {
  return (
    <div>
      {/* 📱 Mobile: horizontal progress tracker */}
      <div className="sm:hidden relative flex items-center justify-between w-full px-2">
        {/* Progress line (background) */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
        {/* Progress line (filled) */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-600 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Circle marker */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
              >
                {index + 1}
              </div>
              {/* Step label */}
              <span
                className={`mt-1 text-[10px] text-center font-medium truncate w-full
                  ${isActive ? "text-blue-600" : "text-gray-600"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* 💻 Desktop: stepper with circles & lines */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold shrink-0
                  ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
              >
                {index + 1}
              </div>

              <span
                className={`ml-3 text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {step}
              </span>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
