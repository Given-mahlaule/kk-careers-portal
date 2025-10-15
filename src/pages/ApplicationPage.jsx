import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Container from '../components/ui/Container';
import ProgressStepper from '../components/ui/ProgressStepper';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

// Form step components
import ProfileInformation from '../components/forms/ProfileInformation';
import WorkExperience from '../components/forms/WorkExperience';
import Education from '../components/forms/Education';
import LanguageSkills from '../components/forms/LanguageSkills';
import DocumentUpload from '../components/forms/DocumentUpload';

// Hooks and utilities
import { useFormData } from '../hooks/useFormData';
import { validateStep, hasErrors } from '../utils/validation';
import { ApplicationService } from '../services/applicationService';

import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  { id: 'profile', title: 'Profile' },
  { id: 'experience', title: 'Experience' },
  { id: 'education', title: 'Education' },
  { id: 'languages', title: 'Languages' },
  { id: 'documents', title: 'Documents' }
];

export default function ApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { formData, updateFormData, clearFormData, getStepData } = useFormData();

  const handleStepClick = (step) => {
    // Allow clicking on current step or any previous step
    if (step <= currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleNext = () => {
    const stepData = getStepData(currentStep);
    const stepErrors = validateStep(currentStep, stepData);
    
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    // Validate all steps
    let allErrors = {};
    let hasAnyErrors = false;
    
    for (let i = 1; i <= 5; i++) {
      const stepData = getStepData(i);
      const stepErrors = validateStep(i, stepData);
      if (hasErrors(stepErrors)) {
        allErrors[i] = stepErrors;
        hasAnyErrors = true;
      }
    }
    
    if (hasAnyErrors) {
      setErrors(allErrors);
      // Go to first step with errors
      for (let i = 1; i <= 5; i++) {
        if (allErrors[i] && hasErrors(allErrors[i])) {
          setCurrentStep(i);
          break;
        }
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting application to Supabase:', formData);
      
      // Submit to Supabase
      const result = await ApplicationService.submitApplication(formData);
      
      if (result.success) {
        console.log('Application submitted successfully! ID:', result.applicationId);
        
        // Clear form data
        clearFormData();
        
        // Navigate to success page with application ID
        navigate('/success', { 
          state: { 
            applicationId: result.applicationId,
            applicantName: `${formData.firstName} ${formData.lastName}`
          } 
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleFormUpdate = (updates) => {
    updateFormData(updates);
  };

  const renderStepContent = () => {
    const stepData = getStepData(currentStep);
    const stepErrors = errors[currentStep] || errors;

    switch (currentStep) {
      case 1:
        return (
          <ProfileInformation
            data={stepData}
            onUpdate={handleFormUpdate}
            errors={stepErrors}
          />
        );
      case 2:
        return (
          <WorkExperience
            data={stepData}
            onUpdate={handleFormUpdate}
            errors={stepErrors}
          />
        );
      case 3:
        return (
          <Education
            data={stepData}
            onUpdate={handleFormUpdate}
            errors={stepErrors}
          />
        );
      case 4:
        return (
          <LanguageSkills
            data={stepData}
            onUpdate={handleFormUpdate}
            errors={stepErrors}
          />
        );
      case 5:
        return (
          <DocumentUpload
            data={stepData}
            onUpdate={handleFormUpdate}
            errors={stepErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Container variant="default">
        <div className="w-full max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Join Our Team
            </h1>
            <p className="text-base text-gray-600 max-w-4xl mx-auto">
              Complete your profile to apply for opportunities with KK Labour Services. 
              We're looking for talented individuals to join our growing team.
            </p>
          </div>

          {/* Progress Stepper */}
          <ProgressStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          {/* Form Content */}
          <Card className="mb-4 shadow-lg">
            <CardContent className="p-4">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center"
              size="sm"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Previous
            </Button>

            <div className="text-xs text-gray-600 font-medium">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep === 5 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center"
                size="sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                {!isSubmitting && <CheckCircle className="w-3 h-3 ml-1" />}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center"
                size="sm"
              >
                Next
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}