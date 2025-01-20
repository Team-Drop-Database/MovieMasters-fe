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
