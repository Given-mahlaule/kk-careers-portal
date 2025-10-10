import { Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const businessTypes = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'logistics', label: 'Logistics & Warehousing' },
  { value: 'construction', label: 'Construction' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'government', label: 'Government' },
  { value: 'ngo', label: 'Non-Profit/NGO' },
  { value: 'other', label: 'Other' }
];

const locations = [
  { value: 'johannesburg', label: 'Johannesburg' },
  { value: 'pretoria', label: 'Pretoria' },
  { value: 'sandton', label: 'Sandton' },
  { value: 'midrand', label: 'Midrand' },
  { value: 'centurion', label: 'Centurion' },
  { value: 'boksburg', label: 'Boksburg' },
  { value: 'kempton-park', label: 'Kempton Park' },
  { value: 'germiston', label: 'Germiston' },
  { value: 'vanderbijlpark', label: 'Vanderbijlpark' },
  { value: 'other-gauteng', label: 'Other - Gauteng' },
  { value: 'remote', label: 'Remote' }
];

export default function WorkExperience({ data, onUpdate, errors }) {
  const experiences = data.experiences || [{}];

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    onUpdate({ experiences: updatedExperiences });
  };

  const addExperience = () => {
    onUpdate({ 
      experiences: [...experiences, {}] 
    });
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      onUpdate({ experiences: updatedExperiences });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600">List your work experience, starting with your most recent position.</p>
      </div>

      {experiences.map((experience, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Position {index + 1}
              {experience.current && (
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Current
                </span>
              )}
            </h3>
            {experiences.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name={`startDate-${index}`}
              type="date"
              value={experience.startDate || ''}
              onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
              required
              error={errors?.experiences?.[index]?.startDate}
            />

            <Input
              label="End Date"
              name={`endDate-${index}`}
              type="date"
              value={experience.endDate || ''}
              onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
              error={errors?.experiences?.[index]?.endDate}
              disabled={experience.current}
            />

            <Input
              label="Company Name"
              name={`companyName-${index}`}
              value={experience.companyName || ''}
              onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
              required
              error={errors?.experiences?.[index]?.companyName}
            />

            <Select
              label="Type of Business"
              name={`businessType-${index}`}
              value={experience.businessType || ''}
              onChange={(e) => handleExperienceChange(index, 'businessType', e.target.value)}
              options={businessTypes}
              error={errors?.experiences?.[index]?.businessType}
            />

            <Input
              label="Job Title"
              name={`jobTitle-${index}`}
              value={experience.jobTitle || ''}
              onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
              required
              error={errors?.experiences?.[index]?.jobTitle}
            />

            <Select
              label="Location"
              name={`location-${index}`}
              value={experience.location || ''}
              onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
              options={locations}
              error={errors?.experiences?.[index]?.location}
            />

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={experience.current || false}
                  onChange={(e) => {
                    handleExperienceChange(index, 'current', e.target.checked);
                    if (e.target.checked) {
                      handleExperienceChange(index, 'endDate', '');
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">This is my current position</span>
              </label>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Position
      </Button>
    </div>
  );
}