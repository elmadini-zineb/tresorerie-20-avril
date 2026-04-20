// Format utilities for reconciliation module

export const formatAmount = (amount: number, currency: string = 'MAD'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const getScoreColor = (score: number): string => {
  if (score >= 85) return '#16A34A'  // Green
  if (score >= 60) return '#D97706'  // Orange
  return '#DC2626'  // Red
}

export const getScoreBgClass = (score: number): string => {
  if (score >= 85) return 'bg-[#16A34A]'
  if (score >= 60) return 'bg-[#D97706]'
  return 'bg-[#DC2626]'
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    RAPPROCHEE: '#16A34A',
    SUGGESTION_EN_ATTENTE: '#3B82F6',
    ECART_DETECTE: '#D97706',
    NON_RAPPROCHE: '#DC2626',
    JUSTIFIE: '#8B5CF6',
  }
  return colors[status] || '#64748B'
}

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    RAPPROCHEE: 'Rapprochée',
    SUGGESTION_EN_ATTENTE: 'Suggestion en attente',
    ECART_DETECTE: 'Écart détecté',
    NON_RAPPROCHE: 'Non rapprochée',
    JUSTIFIE: 'Justifiée',
  }
  return labels[status] || status
}

export const getSourceColor = (source: string): string => {
  const colors: Record<string, string> = {
    ERP: 'bg-[#7C3AED] text-white',
    OCR: 'bg-[#3B6FD4] text-white',
    MANUELLE: 'bg-[#64748B] text-white',
  }
  return colors[source] || 'bg-gray-400 text-white'
}
