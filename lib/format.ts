export function formatAmount(amount: number, currency = 'MAD'): string {
  return `${new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} ${currency}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'EN_ATTENTE': return 'bg-gray-100 text-gray-600 border border-gray-200'
    case 'RAPPROCHE': case 'RAPPROCHEE': return 'bg-green-50 text-green-700 border border-green-200'
    case 'ECART_DETECTE': return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'NON_RAPPROCHE': case 'NON_RAPPROCHEE': return 'bg-red-50 text-red-700 border border-red-200'
    case 'JUSTIFIE': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'Actif': return 'bg-green-50 text-green-700 border border-green-200'
    case 'Inactif': return 'bg-gray-100 text-gray-600 border border-gray-200'
    default: return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'EN_ATTENTE': return 'En attente'
    case 'RAPPROCHE': case 'RAPPROCHEE': return 'Rapprochee'
    case 'ECART_DETECTE': return 'Ecart detecte'
    case 'NON_RAPPROCHE': case 'NON_RAPPROCHEE': return 'Non rapprochee'
    case 'JUSTIFIE': return 'Justifie'
    default: return status
  }
}

export function getSourceColor(source: string): string {
  switch (source) {
    case 'ERP': return 'bg-violet-50 text-violet-700 border border-violet-200'
    case 'OCR': return 'bg-blue-50 text-blue-700 border border-blue-200'
    default: return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#16A34A'
  if (score >= 60) return '#D97706'
  return '#DC2626'
}

export function getScoreBgClass(score: number): string {
  if (score >= 85) return 'bg-[#16A34A]'
  if (score >= 60) return 'bg-[#D97706]'
  return 'bg-[#DC2626]'
}
