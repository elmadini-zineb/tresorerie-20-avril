type ReportSection = {
  title: string
  rows: Array<{ label: string; value: string }>
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export async function exportReportPdf(params: {
  reportName: string
  periodLabel: string
  companyName: string
  generatedAt: Date
  sections: ReportSection[]
}) {
  if (typeof window === 'undefined') {
    return
  }

  const { jsPDF } = await import('jspdf')
  const { reportName, periodLabel, companyName, generatedAt, sections } = params
  const doc = new jsPDF()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Adria Treasury', 14, 16)

  doc.setFontSize(12)
  doc.text(reportName, 14, 24)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Entreprise: ${companyName}`, 14, 32)
  doc.text(`Période: ${periodLabel}`, 14, 38)
  doc.text(`Date de génération: ${generatedAt.toLocaleString('fr-FR')}`, 14, 44)

  let y = 54
  sections.forEach((section) => {
    if (y > 260) {
      doc.addPage()
      y = 20
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(section.title, 14, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    section.rows.forEach((row) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(row.label, 16, y)
      doc.text(row.value, 190, y, { align: 'right' })
      y += 5
    })

    y += 4
  })

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Document généré le ${generatedAt.toLocaleString('fr-FR')} — Confidentiel`,
      14,
      290
    )
  }

  doc.save(`${reportName.replace(/\s+/g, '_')}.pdf`)
}

export async function exportReportExcel(params: {
  fileName: string
  sheetName: string
  rows: Array<Record<string, string | number>>
}) {
  if (typeof window === 'undefined') {
    return
  }

  const ExcelJS = await import('exceljs')
  const { Workbook } = ExcelJS.default || ExcelJS
  const { fileName, sheetName, rows } = params
  
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet(sheetName)
  
  if (rows.length > 0) {
    const headers = Object.keys(rows[0])
    worksheet.columns = headers.map(header => ({ header, key: header }))
    rows.forEach(row => worksheet.addRow(row))
  }
  
  const buffer = await workbook.xlsx.writeBuffer()
  downloadBlob(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `${fileName}.xlsx`
  )
}
