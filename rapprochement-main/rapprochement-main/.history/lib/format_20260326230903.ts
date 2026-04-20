// Format amount in Moroccan format (French with space thousands separator)
export function formatAmount(amount: number, currency: string = 'MAD'): string {
  const formatted = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${formatted} ${currency}`
}

export function formatCurrency(amount: number): string {
  return formatAmount(amount, 'MAD')
}

// Format date in DD/MM/YYYY format
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Parse date from DD/MM/YYYY format
export function parseDate(dateString: string): Date | null {
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  const [day, month, year] = parts.map(Number)
  return new Date(year, month - 1, day)
}

// Format ICE (Moroccan company identifier)
export function formatICE(ice: string): string {
  // ICE format: 15 digits
  return ice.replace(/(\d{3})(\d{6})(\d{6})/, '$1 $2 $3')
}

// Format RIB (Moroccan bank account number)
export function formatRIB(rib: string): string {
  // RIB format: 24 digits split in groups of 4
  return rib.replace(/(.{4})/g, '$1 ').trim()
}

// Get status color class
export function getStatusColor(status: string): string {
  switch (status) {
    case 'EN_ATTENTE':
      return 'bg-gray-100 text-gray-600 border border-gray-200'
    case 'RAPPROCHE':
    case 'RAPPROCHEE':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'ECART_DETECTE':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'NON_RAPPROCHE':
    case 'NON_RAPPROCHEE':
      return 'bg-red-50 text-red-700 border border-red-200'
    case 'JUSTIFIE':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'Actif':
      return 'bg-green-50 text-green-700 border border-green-200'
    case 'Inactif':
      return 'bg-gray-100 text-gray-600 border border-gray-200'
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

// Get status label
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'EN_ATTENTE':
      return 'En attente'
    case 'RAPPROCHE':
    case 'RAPPROCHEE':
      return 'Rapprochée'
    case 'ECART_DETECTE':
      return 'Écart détecté'
    case 'NON_RAPPROCHE':
    case 'NON_RAPPROCHEE':
      return 'Non rapprochée'
    case 'JUSTIFIE':
      return 'Justifié'
    default:
      return status
  }
}

// Get source badge color
export function getSourceColor(source: string): string {
  switch (source) {
    case 'ERP':
      return 'bg-violet-50 text-violet-700 border border-violet-200'
    case 'OCR':
      return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'MANUELLE':
      return 'bg-gray-100 text-gray-600 border border-gray-200'
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

// Calculate score color
export function getScoreColor(score: number): string {
  if (score >= 85) return '#16A34A' // Green
  if (score >= 60) return '#D97706' // Orange
  return '#DC2626' // Red
}

// Get score background class
export function getScoreBgClass(score: number): string {
  if (score >= 85) return 'bg-[#16A34A]'
  if (score >= 60) return 'bg-[#D97706]'
  return 'bg-[#DC2626]'
}
