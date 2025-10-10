export const validateProfileInformation = (data) => {
  const errors = {};
  
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }
  
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^[0-9+\-\s()]+$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }
  
  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }
  
  if (!data.country?.trim()) {
    errors.country = 'Country is required';
  }
  
  return errors;
};

export const validateWorkExperience = (data) => {
  const errors = {};
  
  if (!data.experiences || data.experiences.length === 0) {
    errors.experiences = [{ general: 'At least one work experience is required' }];
    return errors;
  }
  
  errors.experiences = [];
  
  data.experiences.forEach((exp, index) => {
    const expErrors = {};
    
    if (!exp.startDate) {
      expErrors.startDate = 'Start date is required';
    }
    
    if (!exp.current && !exp.endDate) {
      expErrors.endDate = 'End date is required for non-current positions';
    }
    
    if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
      expErrors.endDate = 'End date must be after start date';
    }
    
    if (!exp.companyName?.trim()) {
      expErrors.companyName = 'Company name is required';
    }
    
    if (!exp.jobTitle?.trim()) {
      expErrors.jobTitle = 'Job title is required';
    }
    
    errors.experiences[index] = expErrors;
  });
  
  return errors;
};

export const validateEducation = (data) => {
  const errors = {};
  
  if (!data.educations || data.educations.length === 0) {
    errors.educations = [{ general: 'At least one education entry is required' }];
    return errors;
  }
  
  errors.educations = [];
  
  data.educations.forEach((edu, index) => {
    const eduErrors = {};
    
    if (!edu.institutionName?.trim()) {
      eduErrors.institutionName = 'Institution name is required';
    }
    
    if (edu.startDate && edu.endDate && edu.startDate > edu.endDate) {
      eduErrors.endDate = 'End date must be after start date';
    }
    
    errors.educations[index] = eduErrors;
  });
  
  return errors;
};

export const validateLanguageSkills = (data) => {
  const errors = {};
  
  if (!data.languages || data.languages.length === 0) {
    errors.languages = [{ general: 'At least one language is required' }];
    return errors;
  }
  
  errors.languages = [];
  
  data.languages.forEach((lang, index) => {
    const langErrors = {};
    
    if (!lang.language) {
      langErrors.language = 'Language selection is required';
    }
    
    if (!lang.proficiency) {
      langErrors.proficiency = 'Proficiency level is required';
    }
    
    errors.languages[index] = langErrors;
  });
  
  return errors;
};

export const validateDocumentUpload = (data) => {
  const errors = {};
  
  if (!data.cv) {
    errors.cv = 'CV upload is required';
  }
  
  return errors;
};

export const validateStep = (step, data) => {
  switch (step) {
    case 1:
      return validateProfileInformation(data);
    case 2:
      return validateWorkExperience(data);
    case 3:
      return validateEducation(data);
    case 4:
      return validateLanguageSkills(data);
    case 5:
      return validateDocumentUpload(data);
    default:
      return {};
  }
};

export const hasErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return false;
  
  const checkNestedErrors = (obj) => {
    for (const key in obj) {
      const value = obj[key];
      if (Array.isArray(value)) {
        return value.some(item => item && typeof item === 'object' && Object.keys(item).length > 0);
      } else if (typeof value === 'object' && value !== null) {
        if (checkNestedErrors(value)) return true;
      } else if (value) {
        return true;
      }
    }
    return false;
  };
  
  return checkNestedErrors(errors);
};