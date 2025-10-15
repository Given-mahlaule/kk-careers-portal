import { supabase } from '../lib/supabase'

/**
 * Service for handling job application submissions
 */
export class ApplicationService {
  
  /**
   * Upload a file to Supabase Storage
   * @param {File} file - The file to upload
   * @param {string} folder - The storage folder (e.g., 'cvs', 'cover-letters')
   * @param {string} applicationId - Unique application ID for file naming
   * @returns {Promise<{url: string, fileName: string}>}
   */
  static async uploadFile(file, folder, applicationId) {
    if (!file) return { url: null, fileName: null }
    
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${applicationId}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      
      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('File upload error:', error)
        throw new Error(`Failed to upload ${folder}: ${error.message}`)
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)
      
      return {
        url: publicUrl,
        fileName: file.name // Keep original name for display
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }
  
  /**
   * Submit a complete job application
   * @param {Object} formData - The complete form data
   * @param {string} userId - Optional user ID if user is logged in
   * @returns {Promise<{success: boolean, applicationId: string, error?: string}>}
   */
  static async submitApplication(formData, userId = null) {
    try {
      // Generate unique application ID
      const applicationId = crypto.randomUUID()
      
      // Upload files in parallel
      const uploadPromises = []
      
      if (formData.cv?.file) {
        uploadPromises.push(
          this.uploadFile(formData.cv.file, 'cvs', applicationId)
            .then(result => ({ type: 'cv', ...result }))
        )
      }
      
      if (formData.coverLetter?.file) {
        uploadPromises.push(
          this.uploadFile(formData.coverLetter.file, 'cover-letters', applicationId)
            .then(result => ({ type: 'coverLetter', ...result }))
        )
      }
      
      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises)
      
      // Process upload results
      let cvFileUrl = null, cvFileName = null
      let coverLetterFileUrl = null, coverLetterFileName = null
      
      uploadResults.forEach(result => {
        if (result.type === 'cv') {
          cvFileUrl = result.url
          cvFileName = result.fileName
        } else if (result.type === 'coverLetter') {
          coverLetterFileUrl = result.url
          coverLetterFileName = result.fileName
        }
      })
      
      // Prepare application data
      const applicationData = {
        id: applicationId,
        user_id: userId, // Link to authenticated user if logged in
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        city: formData.city,
        country: formData.country,
        experiences: formData.experiences || [],
        educations: formData.educations || [],
        languages: formData.languages || [],
        cv_file_url: cvFileUrl,
        cv_file_name: cvFileName,
        cover_letter_file_url: coverLetterFileUrl,
        cover_letter_file_name: coverLetterFileName,
        status: 'pending',
        source: 'careers-portal'
      }
      
      // Insert into database
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
      
      if (error) {
        console.error('Database insert error:', error)
        throw new Error(`Failed to save application: ${error.message}`)
      }
      
      console.log('Application submitted successfully:', data[0])
      
      return {
        success: true,
        applicationId: applicationId,
        data: data[0]
      }
      
    } catch (error) {
      console.error('Application submission error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  /**
   * Get application by ID
   * @param {string} applicationId 
   * @returns {Promise<Object>}
   */
  static async getApplication(applicationId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching application:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Get all applications (for admin use later)
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>}
   */
  static async getApplications(filters = {}) {
    try {
      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching applications:', error)
      return { success: false, error: error.message }
    }
  }
}