import { Report } from "@/models/Report"
import apiClient from "./ApiClient"

/**
 * Reports a user for a given reason
 * @param userId  The id of the user to report
 * @param reason  The reason for the report
 * @returns       True if successful, otherwise false
 */
export async function reportUser(userId: number, reason: string): Promise<boolean> {
  const url = "/reports"
  const requestBody = {
    "userId": userId,
    "reason": reason,
  }
  const response = await apiClient(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
  })

  return response.status === 201
}

/**
 * Fetches every report
 * @returns Every report
 */
export async function retrieveAllReports(): Promise<Report[]> {
  const url = "/reports/all"
  const response = await apiClient(url)

  if (response.status !== 200) {
    throw new Error("An error occurred while fetching reports")
  }

  return await response.json()
}

/**
 * Deletes a report, banning the user or not
 * @param reportId  The id of the report to delete
 * @param banUser   Whether to ban the reported user
 * @returns         Whether the transaction was successful
 */
export async function deleteReport(reportId: number, banUser: boolean): Promise<boolean> {
  const url = "/reports"
  const params = `?reportId=${reportId}&banUser=${banUser}`
  const response = await apiClient(url + params, { method: "DELETE" })

  return response.status === 200
}
