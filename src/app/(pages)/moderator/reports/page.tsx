"use client"

import React from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import { redirect } from "next/navigation";
import { Report } from "@/models/Report";
import { deleteReport, retrieveAllReports } from "@/services/ReportService";
import { Button } from "@/components/generic/Button";

export default function ReportsScreen() {
  const { isModerator, loading } = useAuthContext()
  const [reports, setReports] = React.useState<Report[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function fetchReports() {
    try {
      const response = await retrieveAllReports()
      setReports(response)
    } catch (exception: any) {
      setErrorMessage((exception as Error).message)
    }
  }

  async function handleDeleteReport(report: Report, banUser: boolean) {
    const success = await deleteReport(report.id, banUser)
    if (success) {
      if (banUser) {
        const newReports = reports.filter(item => item.user.id !== report.user.id)
        setReports(newReports)
      } else {
        const newReports = reports.filter(item => item.id !== report.id)
        setReports(newReports)
      }
    }
  }

  React.useEffect(() => {
    if (!loading) {
      if (!isModerator) {
        redirect('/');
      }
    }
  }, [loading]);

  React.useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="m-5">
      { errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <table className="w-full table-auto border-separate border-spacing-y-4">
        <thead>
          <tr>
            <th className="text-left p-3">Reported User</th>
            <th colSpan={3} className="text-left p-3">Reason for Report</th>
          </tr>
        </thead>
        <tbody>
          { reports.map(report => (
            <ReportListItem report={report} onDelete={handleDeleteReport} key={report.id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

type ReportListItemProps = {
  report: Report
  onDelete: (reportId: Report, banUser: boolean) => void
}

function ReportListItem({ report, onDelete }: ReportListItemProps) {
  return (
    <tr>
      <td className="p-4 rounded-l-lg border-l-4 border-y-4 border-neutral-800">
        <span>
          {report.user.username}
        </span>
      </td>
      <td className="p-4 border-y-4 border-neutral-800">
        <span>
          {report.reason}
        </span>
      </td>
      <td className="p-4 rounded-r-lg border-r-4 border-y-4 border-neutral-800 flex justify-end gap-3">
        <Button text="Ban" onClick={() => onDelete(report, true)} className="w-fit" />
        <Button text="Don't Ban" onClick={() => onDelete(report, false)} className="w-fit" />
      </td>
    </tr>
  )
}
