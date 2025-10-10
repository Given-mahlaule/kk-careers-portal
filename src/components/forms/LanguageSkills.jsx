import { Plus, Trash2 } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';

const languages = [
  { value: 'afrikaans', label: 'Afrikaans' },
  { value: 'english', label: 'English' },
  { value: 'zulu', label: 'Zulu (isiZulu)' },
  { value: 'xhosa', label: 'Xhosa (isiXhosa)' },
  { value: 'sotho', label: 'Sotho (Sesotho)' },
  { value: 'tswana', label: 'Tswana (Setswana)' },
  { value: 'pedi', label: 'Pedi (Sepedi)' },
  { value: 'venda', label: 'Venda (Tshivenda)' },
  { value: 'tsonga', label: 'Tsonga (Xitsonga)' },
  { value: 'swati', label: 'Swati (siSwati)' },
  { value: 'ndebele', label: 'Ndebele (isiNdebele)' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'mandarin', label: 'Mandarin Chinese' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'other', label: 'Other' }
];

const proficiencyLevels = [
  { value: 'native', label: 'Native/Mother Tongue' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' },
  { value: 'beginner', label: 'Beginner' }
];

export default function LanguageSkills({ data, onUpdate, errors }) {
  const languages_list = data.languages || [{}];

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...languages_list];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    onUpdate({ languages: updatedLanguages });
  };

  const addLanguage = () => {
    onUpdate({ 
      languages: [...languages_list, {}] 
    });
  };

  const removeLanguage = (index) => {
    if (languages_list.length > 1) {
      const updatedLanguages = languages_list.filter((_, i) => i !== index);
      onUpdate({ languages: updatedLanguages });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Language Skills</h2>
        <p className="text-gray-600">List all languages you can speak, read, or write, including your proficiency level.</p>
      </div>

      {languages_list.map((language, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Language {index + 1}</h3>
            {languages_list.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Language"
              name={`language-${index}`}
              value={language.language || ''}
              onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
              options={languages}
              required
              error={errors?.languages?.[index]?.language}
            />

            <Select
              label="Proficiency Level"
              name={`proficiency-${index}`}
              value={language.proficiency || ''}
              onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
              options={proficiencyLevels}
              required
              error={errors?.languages?.[index]?.proficiency}
            />
          </div>

          {/* Proficiency breakdown */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Speaking</label>
              <Select
                name={`speaking-${index}`}
                value={language.speaking || ''}
                onChange={(e) => handleLanguageChange(index, 'speaking', e.target.value)}
                options={proficiencyLevels}
                placeholder="Level"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Reading</label>
              <Select
                name={`reading-${index}`}
                value={language.reading || ''}
                onChange={(e) => handleLanguageChange(index, 'reading', e.target.value)}
                options={proficiencyLevels}
                placeholder="Level"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Writing</label>
              <Select
                name={`writing-${index}`}
                value={language.writing || ''}
                onChange={(e) => handleLanguageChange(index, 'writing', e.target.value)}
                options={proficiencyLevels}
                placeholder="Level"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Listening</label>
              <Select
                name={`listening-${index}`}
                value={language.listening || ''}
                onChange={(e) => handleLanguageChange(index, 'listening', e.target.value)}
                options={proficiencyLevels}
                placeholder="Level"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addLanguage}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Language
      </Button>
    </div>
  );
}