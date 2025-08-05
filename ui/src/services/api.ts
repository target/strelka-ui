import axios from 'axios'
import type {
  ApiKeyCheckResponse,
  AuthApiKeyResponse,
  LoginResponse,
  MimeTypeStatsResponse,
  ResubmitRequest,
  ResubmitResponse,
  Scan,
  SearchScanOptions,
  SearchScanResponse,
  StatusResponse,
} from './api.types'

import { APP_CONFIG } from '../config'

/**
 * The Axios client instance.
 */
export const client = axios.create({
  baseURL: `${APP_CONFIG.BACKEND_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: APP_CONFIG.API_TIMEOUT || 8000,
  withCredentials: true,
})
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('isAuthenticated')
      // redirect to login page
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

/**
 * Checks the availability of the VirusTotal API key.
 *
 * This function sends a GET request to the `/check-vt-api-key` endpoint
 * to verify if the VirusTotal API key is available.
 *
 * @returns {Promise<ApiKeyCheckResponse>} The result of the API key check.
 *
 * @throws Will throw an error if the request fails.
 */
export async function checkVtApiKey(): Promise<ApiKeyCheckResponse> {
  try {
    const resp = await client.get('/strelka/check_vt_api_key')
    return resp.data
  } catch (error) {
    console.error('checkVtApiKey error:', error)
    throw error
  }
}

/**
 * Login user with the provided username and password.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<LoginResponse>} A promise that resolves to the login response.
 * @throws Will throw an error if the login request fails.
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    return client.post(
      '/auth/login',
      { username, password },
      { timeout: APP_CONFIG.LOGIN_TIMEOUT },
    )
  } catch (error) {
    console.error('login error:', error)
    throw error
  }
}

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 * @throws Will throw an error if the logout request fails.
 */
export async function logout(): Promise<void> {
  try {
    await client.get('/auth/logout')
  } catch (error) {
    console.error('logout error:', error)
    throw error
  }
}

/**
 * Fetches the user's API key.
 *
 * @returns {Promise<AuthApiKeyResponse>} The user's API key.
 * @throws Will throw an error if the request fails.
 */
export async function fetchAuthApiKey(): Promise<AuthApiKeyResponse> {
  try {
    const resp = await client.get('/auth/apikey')
    return resp.data
  } catch (error) {
    console.error('fetchAuthApiKey error:', error)
    throw error
  }
}

/**
 * Fetches the database status.
 *
 * @returns {Promise<StatusResponse>} The result of the database status check.
 * @throws Will throw an error if the request fails.
 */
export async function fetchDatabaseStatus(): Promise<StatusResponse> {
  try {
    const resp = await client.get('/strelka/status/database', {
      timeout: 5000, // 5 seconds
    })
    return resp.data
  } catch (error) {
    console.error('fetchDatabaseStatus error:', error)
    throw error
  }
}

/**
 * Fetches the Strelka backend status.
 *
 * @returns {Promise<StatusResponse>} The result of the Strelka status check.
 * @throws Will throw an error if the request fails.
 */
export async function fetchStrelkaStatus(): Promise<StatusResponse> {
  try {
    const resp = await client.get('/strelka/status/strelka', {
      timeout: 5000, // 5 seconds
    })
    return resp.data
  } catch (error) {
    console.error('fetchStrelkaStatus error:', error)
    throw error
  }
}

/**
 * Fetch a scan result by its ID.
 *
 * @param {string} scanId - The ID of the scan to fetch.
 *
 * @returns {Promise<Scan>} The scan result.
 * @throws Will throw an error if the request fails.
 */
export async function fetchScanById(scanId: string): Promise<Scan> {
  try {
    const resp = await client.get(`/strelka/scans/${scanId}`)
    return resp.data
  } catch (error) {
    // check if the error is a 404
    if (error.response && error.response.status === 404) {
      return null
    }
    console.error('fetchScanById error:', error)
    throw error
  }
}

/**
 * Fetches the MIME type statistics from the server.
 *
 * @returns {Promise<MimeTypeStatsResponse>} The MIME type statistics.
 * @throws Will throw an error if the request fails.
 */
export async function fetchMimeTypeStats(): Promise<MimeTypeStatsResponse> {
  try {
    const resp = await client.get('/strelka/scans/mime-type-stats')
    return resp.data
  } catch (error) {
    console.error('fetchMimeTypeStats error:', error)
    throw error
  }
}

interface ScanStatsResponse {
  all_time: number
  seven_days: number
  thirty_days: number
  twentyfour_hours: number
}

export async function fetchScanStats(): Promise<ScanStatsResponse> {
  try {
    const resp = await client.get('/strelka/scans/stats')
    return resp.data
  } catch (error) {
    console.error('fetchScanStats error:', error)
    throw error
  }
}

/**
 * Searches scans based on the provided query parameters.
 *
 * @param {string} searchQuery - The search query.
 * @param {number} page - The current page number.
 * @param {number} pageSize - The number of items per page.
 * @param {string} sortField - The field to sort by.
 * @param {string} sortOrder - The order to sort (ascend/descend).
 * @param {string[]} excludeSubmitters - The submitters to exclude.
 * @returns {Promise<SearchScanResponse>} The search results.
 * @throws Will throw an error if the request fails.
 */
export async function searchScans(
  opts: SearchScanOptions,
): Promise<SearchScanResponse> {
  const {
    searchQuery,
    page,
    pageSize,
    sortField,
    sortOrder,
    excludeSubmitters,
  } = opts
  const searchUrl = `/strelka/scans?search=${searchQuery}&page=${page}&per_page=${pageSize}&exclude_submitters=${excludeSubmitters?.join(',')}&sortField=${sortField}&sortOrder=${sortOrder}`
  try {
    const resp = await client.get(searchUrl)
    return resp.data
  } catch (error) {
    console.error('searchScans error:', error)
    throw error
  }
}

/**
 * Resubmit a file for analysis from S3 storage
 */
export async function resubmitFile(
  submissionId: string,
  request?: ResubmitRequest,
): Promise<ResubmitResponse> {
  try {
    const resp = await client.post(`/strelka/resubmit/${submissionId}`, request)
    return resp.data
  } catch (error) {
    console.error('resubmitFile error:', error)
    throw error
  }
}

/**
 * Check if file resubmission feature is enabled
 */
export async function checkResubmissionEnabled(): Promise<boolean> {
  try {
    // We can check this by attempting to get status or by using environment variable
    // For now, we'll assume it's enabled if the S3 configuration is available
    // This could be enhanced with a specific endpoint if needed
    return true
  } catch (error) {
    console.error('checkResubmissionEnabled error:', error)
    return false
  }
}
