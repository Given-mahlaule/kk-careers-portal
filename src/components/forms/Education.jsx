import { Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const educationTypes = [
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'degree', label: 'Bachelor\'s Degree' },
  { value: 'honours', label: 'Honours Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'doctorate', label: 'Doctorate/PhD' },
  { value: 'other', label: 'Other' }
];

const institutionTypes = [
  { value: 'university', label: 'University' },
  { value: 'university-technology', label: 'University of Technology' },
  { value: 'college', label: 'College' },
  { value: 'technical-college', label: 'Technical College' },
  { value: 'high-school', label: 'High School' },
  { value: 'training-institute', label: 'Training Institute' },
  { value: 'online', label: 'Online Institution' },
  { value: 'other', label: 'Other' }
];

const fieldOfStudy = [
  { value: 'business', label: 'Business & Management' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'it', label: 'Information Technology' },
  { value: 'finance', label: 'Finance & Accounting' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'manufacturing', label: 'Manufacturing & Operations' },
  { value: 'health', label: 'Health Sciences' },
  { value: 'education', label: 'Education' },
  { value: 'social-sciences', label: 'Social Sciences' },
  { value: 'arts', label: 'Arts & Humanities' },
  { value: 'science', label: 'Natural Sciences' },
  { value: 'trades', label: 'Trades & Technical Skills' },
  { value: 'other', label: 'Other' }
];

const gradeOptions = [
  { value: 'distinction', label: 'Distinction (75%+)' },
  { value: 'cum-laude', label: 'Cum Laude (70-74%)' },
  { value: 'credit', label: 'Credit (60-69%)' },
  { value: 'pass', label: 'Pass (50-59%)' },
  { value: 'a', label: 'A (80%+)' },
  { value: 'b', label: 'B (70-79%)' },
  { value: 'c', label: 'C (60-69%)' },
  { value: 'd', label: 'D (50-59%)' },
  { value: 'matric', label: 'Matric Certificate' },
  { value: 'other', label: 'Other' }
];

export default function Education({ data, onUpdate, errors }) {
  const educations = data.educations || [{}];

  const handleEducationChange = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value
    };
    onUpdate({ educations: updatedEducations });
  };

  const addEducation = () => {
    onUpdate({ 
      educations: [...educations, {}] 
    });
  };

  const removeEducation = (index) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter((_, i) => i !== index);
      onUpdate({ educations: updatedEducations });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">List your educational background, starting with your highest qualification.</p>
      </div>

      {educations.map((education, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Education {index + 1}</h3>
            {educations.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Type of Education"
              name={`educationType-${index}`}
              value={education.educationType || ''}
              onChange={(e) => handleEducationChange(index, 'educationType', e.target.value)}
              options={educationTypes}
              error={errors?.educations?.[index]?.educationType}
            />

            <Select
              label="Type of School / Academic Institution"
              name={`institutionType-${index}`}
              value={education.institutionType || ''}
              onChange={(e) => handleEducationChange(index, 'institutionType', e.target.value)}
              options={institutionTypes}
              error={errors?.educations?.[index]?.institutionType}
            />

            <Input
              label="School / Academic Institution"
              name={`institutionName-${index}`}
              value={education.institutionName || ''}
              onChange={(e) => handleEducationChange(index, 'institutionName', e.target.value)}
              required
              error={errors?.educations?.[index]?.institutionName}
              className="md:col-span-2"
            />

            <Input
              label="Start Date"
              name={`startDate-${index}`}
              type="date"
              value={education.startDate || ''}
              onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
              error={errors?.educations?.[index]?.startDate}
            />

            <Input
              label="End Date"
              name={`endDate-${index}`}
              type="date"
              value={education.endDate || ''}
              onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
              error={errors?.educations?.[index]?.endDate}
            />

            <Select
              label="Degree"
              name={`degree-${index}`}
              value={education.degree || ''}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              options={educationTypes}
              error={errors?.educations?.[index]?.degree}
            />

            <Select
              label="Main Area of Education"
              name={`fieldOfStudy-${index}`}
              value={education.fieldOfStudy || ''}
              onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
              options={fieldOfStudy}
              error={errors?.educations?.[index]?.fieldOfStudy}
            />

            <Select
              label="Grade"
              name={`grade-${index}`}
              value={education.grade || ''}
              onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
              options={gradeOptions}
              error={errors?.educations?.[index]?.grade}
            />

            <Input
              label="Exact name of major"
              name={`major-${index}`}
              value={education.major || ''}
              onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
              placeholder="e.g., Bachelor of Commerce in Finance"
              error={errors?.educations?.[index]?.major}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name={`additionalInfo-${index}`}
                value={education.additionalInfo || ''}
                onChange={(e) => handleEducationChange(index, 'additionalInfo', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Any additional relevant information about this qualification..."
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addEducation}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Qualification
      </Button>
    </div>
  );
}