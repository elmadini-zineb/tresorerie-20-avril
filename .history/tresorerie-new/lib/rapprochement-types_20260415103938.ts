// ============== RAPPROCHEMENT TYPES ==============
// Types dédiés au module Rapprochement Bancaire

export type InvoiceType = 'RECUE' | 'EMISE'
export type InvoiceSource = 'MANUELLE' | 'ERP' | 'OCR'
export type InvoiceStatus = 'EN_ATTENTE' | 'RAPPROCHE' | 'ECART_DETECTE' | 'NON_RAPPROCHEE' | 'JUSTIFIE' | 'SUGGESTION_EN_ATTENTE' | 'NON_RAPPROCHE'
export type PaymentStatus = 'Non payée' | 'Partielle' | 'Payée'

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
  referenceInterne?: string;
  tiersId: string
  tiersNom: string
  tiersIce?: string | null
  dateEmission: Date
  dateEcheance?: Date
  source: InvoiceSource
  lignes?: InvoiceLine[]
  montantHT: number
  montantTva: number
  montantTTC: number
  montantDu?: number
  devise: 'MAD' | 'EUR' | 'USD' | 'GBP'
  statutPaiement?: PaymentStatus
  modePaiementEffectif?: 'Virement' | 'Chèque' | 'Espèces'
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

export interface Fournisseur {
  id: string
  raisonSociale: string
  ice?: string
  identifiantFiscal?: string;
  rc?: string;
  adresse?: string
  ville?: string
  pays?: string;
  rib?: string;
  banqueDomiciliataire?: string;
  emailFacturation?: string;
  telephone?: string;
  modePaiement?: 'Virement' | 'Chèque' | 'Espèces' | 'Prélèvement';
  tauxTvaDefaut?: number;
  statut?: 'Actif' | 'Inactif';
  delaiPaiement: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Client {
  id: string
  raisonSociale: string
  ice?: string
  adresse?: string
  ville?: string
  delaiPaiement: number;
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
  erpEntry?: {
    reference: string
    montant: number
    date: Date
  }
  score: ReconciliationScore
  status: 'RAPPROCHEE' | 'ECART_DETECTE' | 'NON_RAPPROCHEE' | 'SUGGESTION_EN_ATTENTE'
  justification?: string
  justificationDate?: Date
  validatedBy?: string
  validationDate?: Date
}

export type JustificationReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ValidationQueueItem {
  id: string
  invoiceId: string
  reconciliationId: string
  justification: string
  status: JustificationReviewStatus
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionComment?: string
  submissionCount: number
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}
