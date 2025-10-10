import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kk-careers-form-data';

export const useFormData = () => {
  const [formData, setFormData] = useState(() => {
    // Load saved data from localStorage on initialization
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        // Default form structure
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        houseNumber: '',
        streetName: '',
        city: '',
        zipCode: '',
        country: '',
        experiences: [{}],
        educations: [{}],
        languages: [{}],
        cv: null,
        coverLetter: null
      };
    } catch (error) {
      console.error('Error loading form data:', error);
      return {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        houseNumber: '',
        streetName: '',
        city: '',
        zipCode: '',
        country: '',
        experiences: [{}],
        educations: [{}],
        languages: [{}],
        cv: null,
        coverLetter: null
      };
    }
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    try {
      // Don't save file objects to localStorage
      const dataToSave = { ...formData };
      if (dataToSave.cv?.file) {
        dataToSave.cv = { ...dataToSave.cv, file: null };
      }
      if (dataToSave.coverLetter?.file) {
        dataToSave.coverLetter = { ...dataToSave.coverLetter, file: null };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData]);

  const updateFormData = (updates) => {
    setFormData(prevData => ({
      ...prevData,
      ...updates
    }));
  };

  const clearFormData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        houseNumber: '',
        streetName: '',
        city: '',
        zipCode: '',
        country: '',
        experiences: [{}],
        educations: [{}],
        languages: [{}],
        cv: null,
        coverLetter: null
      });
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  const getStepData = (step) => {
    switch (step) {
      case 1:
        return {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          houseNumber: formData.houseNumber,
          streetName: formData.streetName,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        };
      case 2:
        return { experiences: formData.experiences };
      case 3:
        return { educations: formData.educations };
      case 4:
        return { languages: formData.languages };
      case 5:
        return { 
          cv: formData.cv, 
          coverLetter: formData.coverLetter 
        };
      default:
        return {};
    }
  };

  return {
    formData,
    updateFormData,
    clearFormData,
    getStepData
  };
};