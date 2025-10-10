import { Check, User, Briefcase, GraduationCap, MessageCircle, Upload } from "lucide-react";

const stepIcons = {
  1: User,
  2: Briefcase,
  3: GraduationCap,
  4: MessageCircle,
  5: Upload
};

export default function ProgressStepper({ steps, currentStep, onStepClick }) {
  return (
    <div className="max-w-3xl mx-auto py-6 mb-8">
      <div className="relative">
        {/* Background connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 mx-8"></div>
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-600 mx-8 transition-all duration-500"
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * (100 - 16)}%` 
          }}
        ></div>
        
        <div className="flex items-center justify-between relative px-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isClickable = stepNumber <= currentStep;
            const StepIcon = stepIcons[stepNumber] || User; // Fallback to User icon

            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-all duration-300 transform
                    ${isCompleted 
                      ? 'border-green-600 bg-green-600 text-white shadow-md scale-105' 
                      : isCurrent 
                      ? 'border-blue-600 text-blue-600 bg-white shadow-sm scale-105' 
                      : 'border-gray-300 text-gray-500 bg-white'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : isCurrent ? (
                    <StepIcon className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <StepIcon className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
                
                {/* Step Label */}
                <span className={`
                  mt-2 text-xs font-semibold text-center max-w-20
                  ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}