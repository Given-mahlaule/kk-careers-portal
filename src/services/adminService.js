import { supabase } from '../lib/supabase'

/**
 * Service for admin operations
 */
export class AdminService {
  
  /**
   * Get all applications with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  static async getApplications(options = {}) {
    try {
      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (options.status) {
        query = query.eq('status', options.status)
      }

      if (options.searchTerm) {
        query = query.or(`first_name.ilike.%${options.searchTerm}%,last_name.ilike.%${options.searchTerm}%,email.ilike.%${options.searchTerm}%`)
      }

      // Apply pagination
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit
        const to = from + options.limit - 1
        query = query.range(from, to)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        success: true,
        applications: data || [],
        total: count
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      return {
        success: false,
        error: error.message,
        applications: [],
        total: 0
      }
    }
  }

  /**
   * Get application by ID
   * @param {string} applicationId 
   * @returns {Promise<Object>}
   */
  static async getApplicationById(applicationId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (error) throw error

      return {
        success: true,
        application: data
      }
    } catch (error) {
      console.error('Error fetching application:', error)
      return {
        success: false,
        error: error.message,
        application: null
      }
    }
  }

  /**
   * Update application status
   * @param {string} applicationId 
   * @param {string} status 
   * @param {string} notes 
   * @returns {Promise<Object>}
   */
  static async updateApplicationStatus(applicationId, status, notes = '') {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()

      if (error) throw error

      return {
        success: true,
        application: data[0]
      }
    } catch (error) {
      console.error('Error updating application:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>}
   */
  static async getDashboardStats() {
    try {
      // Get total applications
      const { count: totalApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })

      // Get applications by status
      const { data: statusData } = await supabase
        .from('applications')
        .select('status')

      // Calculate status counts
      const statusCounts = statusData?.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {}) || {}

      // Get recent applications (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: recentApplications } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      return {
        success: true,
        stats: {
          total: totalApplications || 0,
          pending: statusCounts.pending || 0,
          reviewing: statusCounts.reviewing || 0,
          approved: statusCounts.approved || 0,
          rejected: statusCounts.rejected || 0,
          recent: recentApplications || 0
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        success: false,
        error: error.message,
        stats: {
          total: 0,
          pending: 0,
          reviewing: 0,
          approved: 0,
          rejected: 0,
          recent: 0
        }
      }
    }
  }

  /**
   * Download file from storage
   * @param {string} filePath 
   * @returns {Promise<Object>}
   */
  static async downloadFile(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath)

      if (error) throw error

      return {
        success: true,
        file: data
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Get file URL for display/download
   * @param {string} filePath 
   * @returns {string}
   */
  static getFileUrl(filePath) {
    if (!filePath) return null
    
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }
}