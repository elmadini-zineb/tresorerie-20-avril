// User and Role Types
export type UserRole = 'TRESORIER' | 'ADMIN_CLIENT' | 'ADMIN_BANQUE'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  lastLogin?: Date
  isActive: boolean
}

// Supplier/Client Types
export interface Fournisseur {
  id: string
  raisonSociale: string
  ice: string
  identifiantFiscal: string
  rc: string
  adresse: string
  ville: string
  pays: string
  rib: string
  banqueDomiciliataire?: string
  emailFacturation?: string
  telephone?: string
  delaiPaiement: number
  modePaiement: 'Virement' | 'Chèque' | 'Espèces' | 'Prélèvement'
  tauxTvaDefaut: number
  statut: 'Actif' | 'Inactif'
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  raisonSociale: string
  ice: string
  identifiantFiscal: string
  rc?: string
  adresse: string
  ville: string
  pays: string
  rib: string
  banqueDomiciliataire?: string
  emailFacturation?: string
  telephone?: string
  delaiPaiement: number
  modePaiement: 'Virement' | 'Chèque' | 'Espèces' | 'Prélèvement'
  tauxTvaDefaut: number
  segment?: 'TPE' | 'PME' | 'GE' | 'Public'
  statut: 'Actif' | 'Inactif'
  createdAt: Date
  updatedAt: Date
}

export interface EnterpriseClient {
  id: string
  companyName: string
  ice: string
  sector: string
  contactName: string
  contactEmail: string
  contactPhone: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'trial'
  createdAt: string
  monthlyFee: number
  usersCount: number
}

// Invoice Types
export type InvoiceType = 'RECUE' | 'EMISE'
export type InvoiceSource = 'MANUELLE' | 'ERP' | 'OCR'
export type InvoiceStatus = 'EN_ATTENTE' | 'RAPPROCHE' | 'ECART_DETECTE' | 'NON_RAPPROCHE' | 'JUSTIFIE'
export type PaymentStatus = 'Non payée' | 'Partielle' | 'Payée'

export interface InvoiceLine {
  id: string
  description: string
  compte: string // Accounting code
  compteLabel: string
  quantite: number
  prixUnitaireHT: number
  tauxTva: number
  montantHT: number
  montantTva: number
  montantTTC: number
}

export interface Invoice {
  id: string
  type: InvoiceType
  numero: string
  tiersId: string
  tiersNom: string
  tiersIce: string
  dateEmission: Date
  dateEcheance: Date
  source: InvoiceSource
  lignes: InvoiceLine[]
  montantHT: number
  montantTva: number
  montantTTC: number
  montantDu: number
  devise: 'MAD' | 'EUR' | 'USD' | 'GBP'
  statutPaiement: PaymentStatus
  modePaiementEffectif?: 'Virement' | 'Chèque' | 'Espèces'
  referencePaiement?: string
  description?: string
  pieceJointe?: string
  status: InvoiceStatus
  createdAt: Date
  updatedAt: Date
}

// Bank Movement Types
export interface MouvementBancaire {
  id: string
  reference: string
  dateValeur: Date
  montant: number
  libelle: string
  banque: string
  sens: 'CREDIT' | 'DEBIT'
}

// Reconciliation Types
export interface ReconciliationScore {
  montant: number
  date: number
  referenceFacture: number
  contrepartie: number
  total: number
}

export interface Reconciliation {
  id: string
  invoice: Invoice
  mouvement?: MouvementBancaire
  erpEntry?: {
    reference: string
    montant: number
    date: Date
  }
  score: ReconciliationScore
  status: 'RAPPROCHEE' | 'ECART_DETECTE' | 'NON_RAPPROCHEE'
  justification?: string
  justificationDate?: Date
  validatedBy?: string
  validationDate?: Date
  rejectionComment?: string
}

// Report Types
export interface CPCEntry {
  tiers: string
  categorie: string
  compte: string
  montantHT: number
  tva: number
  montantTTC: number
}

export interface TVAEntry {
  taux: number
  baseHT: number
  montantTva: number
  nbFactures: number
}

// Chart of Accounts
export interface CompteComptable {
  code: string
  label: string
  type: 'CHARGE' | 'PRODUIT'
}

// Admin Configuration
export interface ReconciliationConfig {
  scoreMinAuto: number
  scoreMinSuggestion: number
  toleranceMontant: number
  toleranceDate: number
}

// Notification
export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  createdAt: Date
}
