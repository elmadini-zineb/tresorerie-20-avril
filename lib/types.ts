export type UserRole = 'TRESORIER' | 'ADMIN_CLIENT' | 'ADMIN_BANQUE'

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
  modePaiement: 'Virement' | 'Cheque' | 'Especes' | 'Prelevement'
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
  modePaiement: 'Virement' | 'Cheque' | 'Especes' | 'Prelevement'
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

export type InvoiceType = 'RECUE' | 'EMISE'
export type InvoiceSource = 'MANUELLE' | 'ERP' | 'OCR'
export type InvoiceStatus = 'EN_ATTENTE' | 'RAPPROCHE' | 'ECART_DETECTE' | 'NON_RAPPROCHE' | 'JUSTIFIE'
export type PaymentStatus = 'Non payee' | 'Partielle' | 'Payee'

export interface InvoiceLine {
  id: string
  description: string
  compte: string
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
  modePaiementEffectif?: 'Virement' | 'Cheque' | 'Especes'
  referencePaiement?: string
  description?: string
  pieceJointe?: string
  status: InvoiceStatus
  createdAt: Date
  updatedAt: Date
}

export interface MouvementBancaire {
  id: string
  reference: string
  dateValeur: Date
  montant: number
  libelle: string
  banque: string
  sens: 'CREDIT' | 'DEBIT'
}

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
  erpEntry?: { reference: string; montant: number; date: Date }
  score: ReconciliationScore
  status: 'RAPPROCHEE' | 'ECART_DETECTE' | 'NON_RAPPROCHEE'
  justification?: string
  justificationDate?: Date
  validatedBy?: string
  validationDate?: Date
  rejectionComment?: string
}

export interface CompteComptable {
  code: string
  label: string
  type: 'CHARGE' | 'PRODUIT'
}
