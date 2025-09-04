import React from "react";

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full">
      {/* 📱 Mobile: horizontal progress tracker */}
      <div className="sm:hidden relative flex items-center justify-between w-full px-6 py-8">
        {/* Progress line (background) */}
        <div className="absolute top-1/2 left-6 right-6 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-inner-soft"></div>
        {/* Progress line (filled) */}
        <div
          className="absolute top-1/2 left-6 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 rounded-full shadow-glow transition-all duration-1000 ease-out"
          style={{ width: `calc(12px + ${(currentStep / (steps.length - 1)) * (100 - 24)}%)` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {/* Circle marker */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 shadow-xl transform transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 text-white scale-125 animate-glow"
                    : isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-110"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 scale-100"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {/* Step label */}
              <span
                className={`mt-3 text-xs text-center font-bold truncate w-full transition-all duration-300 ${
                  isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* 💻 Desktop: stepper with circles & lines */}
      <div className="hidden sm:flex items-center justify-center mb-16 px-8">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full border-4 font-bold text-xl shadow-xl transform transition-all duration-700 ${
                    isActive
                      ? "border-blue-500 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-600 text-white scale-125 animate-glow"
                      : isCompleted
                      ? "border-green-500 bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-110"
                      : "border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 scale-100"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`mt-4 text-base font-bold text-center transition-all duration-300 ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-8 relative">
                  <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-inner-soft"></div>
                  <div
                    className={`h-2 bg-gradient-to-r from-green-500 via-blue-500 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-glow ${
                      isCompleted ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
