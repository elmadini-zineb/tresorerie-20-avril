import type { Fournisseur, Client, Invoice, MouvementBancaire, Reconciliation, CompteComptable, EnterpriseClient } from './types'

export const comptesCharges: CompteComptable[] = [
  { code: '611100', label: 'Achats marchandises A', type: 'CHARGE' },
  { code: '612270', label: 'Achats fournitures de bureau', type: 'CHARGE' },
  { code: '614000', label: 'Location et charges locatives', type: 'CHARGE' },
  { code: '618000', label: 'Autres charges externes', type: 'CHARGE' },
]

export const comptesProduits: CompteComptable[] = [
  { code: '711100', label: 'Ventes marchandises', type: 'PRODUIT' },
  { code: '714000', label: 'Travaux factures', type: 'PRODUIT' },
  { code: '716000', label: 'Produits activites annexes', type: 'PRODUIT' },
]

export const fournisseurs: Fournisseur[] = [
  {
    id: 'f1', raisonSociale: 'ELECTROTECH MAROC', ice: '002345678901234', identifiantFiscal: '12345678',
    rc: 'RC-CASA-123456', adresse: '123 Boulevard Mohammed V', ville: 'Casablanca', pays: 'Maroc',
    rib: '011780000123456789012345', banqueDomiciliataire: 'Attijariwafa Bank',
    emailFacturation: 'compta@electrotech.ma', telephone: '+212522123456',
    delaiPaiement: 60, modePaiement: 'Virement', tauxTvaDefaut: 20,
    statut: 'Actif', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'f2', raisonSociale: 'FOURNITURES BUREAU PLUS', ice: '002987654321098', identifiantFiscal: '87654321',
    rc: 'RC-RABAT-654321', adresse: '45 Avenue Hassan II', ville: 'Rabat', pays: 'Maroc',
    rib: '022780000987654321098765', banqueDomiciliataire: 'BMCE Bank',
    emailFacturation: 'factures@bureauplus.ma', telephone: '+212537654321',
    delaiPaiement: 30, modePaiement: 'Cheque', tauxTvaDefaut: 20,
    statut: 'Actif', createdAt: new Date('2024-02-01'), updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'f3', raisonSociale: 'TRANSPORT EXPRESS MAGHREB', ice: '002111222333444', identifiantFiscal: '11122233',
    rc: 'RC-MARR-111222', adresse: '78 Zone Industrielle Sidi Ghanem', ville: 'Marrakech', pays: 'Maroc',
    rib: '033780000111222333444555', banqueDomiciliataire: 'Banque Populaire',
    emailFacturation: 'comptabilite@transport-express.ma', telephone: '+212524111222',
    delaiPaiement: 45, modePaiement: 'Virement', tauxTvaDefaut: 14,
    statut: 'Actif', createdAt: new Date('2024-03-10'), updatedAt: new Date('2024-03-10'),
  },
]

export const clients: Client[] = [
  {
    id: 'c1', raisonSociale: 'SOCIETE MINIERE PHOSBOUCRAA', ice: '002555666777888', identifiantFiscal: '55566677',
    rc: 'RC-LAAY-555666', adresse: 'Zone Industrielle Phosboucraa', ville: 'Laayoune', pays: 'Maroc',
    rib: '044780000555666777888999', banqueDomiciliataire: 'CIH Bank',
    emailFacturation: 'factures@phosboucraa.ma', telephone: '+212528555666',
    delaiPaiement: 90, modePaiement: 'Virement', tauxTvaDefaut: 20,
    segment: 'GE', statut: 'Actif', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'c2', raisonSociale: 'COOPERATIVE AGRICOLE SOUSS', ice: '002333444555666', identifiantFiscal: '33344455',
    adresse: '12 Avenue des FAR', ville: 'Agadir', pays: 'Maroc',
    rib: '055780000333444555666777', banqueDomiciliataire: 'Credit Agricole',
    emailFacturation: 'comptabilite@coopsouss.ma', telephone: '+212528333444',
    delaiPaiement: 60, modePaiement: 'Virement', tauxTvaDefaut: 20,
    segment: 'PME', statut: 'Actif', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15'),
  },
]

export const enterpriseClients: EnterpriseClient[] = [
  { id: 'EC001', companyName: 'Atlas Industrie SA', ice: '001111222233344', sector: 'Industrie', contactName: 'Youssef El Mansouri', contactEmail: 'youssef@atlas-industrie.ma', contactPhone: '+212522334455', plan: 'enterprise', status: 'active', createdAt: '2025-10-15', monthlyFee: 25000, usersCount: 24 },
  { id: 'EC002', companyName: 'Souss Distribution', ice: '005556667778889', sector: 'Distribution', contactName: 'Salma El Idrissi', contactEmail: 'salma@souss-distribution.ma', contactPhone: '+212528778899', plan: 'professional', status: 'trial', createdAt: '2026-01-08', monthlyFee: 12000, usersCount: 8 },
]

export const invoices: Invoice[] = [
  {
    id: 'inv1', type: 'RECUE', numero: 'FA-2026-0142', tiersId: 'f1', tiersNom: 'ELECTROTECH MAROC', tiersIce: '002345678901234',
    dateEmission: new Date('2026-01-15'), dateEcheance: new Date('2026-03-15'), source: 'ERP',
    lignes: [{ id: 'l1', description: 'Equipement informatique', compte: '612270', compteLabel: 'Achats fournitures de bureau', quantite: 10, prixUnitaireHT: 5000, tauxTva: 20, montantHT: 50000, montantTva: 10000, montantTTC: 60000 }],
    montantHT: 50000, montantTva: 10000, montantTTC: 60000, montantDu: 60000, devise: 'MAD',
    statutPaiement: 'Non payee', status: 'RAPPROCHE', createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'inv2', type: 'RECUE', numero: 'FA-2026-0187', tiersId: 'f2', tiersNom: 'FOURNITURES BUREAU PLUS', tiersIce: '002987654321098',
    dateEmission: new Date('2026-02-01'), dateEcheance: new Date('2026-03-03'), source: 'MANUELLE',
    lignes: [{ id: 'l2', description: 'Fournitures de bureau', compte: '612270', compteLabel: 'Achats fournitures de bureau', quantite: 1, prixUnitaireHT: 15000, tauxTva: 20, montantHT: 15000, montantTva: 3000, montantTTC: 18000 }],
    montantHT: 15000, montantTva: 3000, montantTTC: 18000, montantDu: 18000, devise: 'MAD',
    statutPaiement: 'Non payee', status: 'ECART_DETECTE', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01'),
  },
  {
    id: 'inv3', type: 'RECUE', numero: 'FA-2026-0234', tiersId: 'f3', tiersNom: 'TRANSPORT EXPRESS MAGHREB', tiersIce: '002111222333444',
    dateEmission: new Date('2026-02-20'), dateEcheance: new Date('2026-04-05'), source: 'OCR',
    lignes: [{ id: 'l3', description: 'Services de transport Q1', compte: '618000', compteLabel: 'Autres charges externes', quantite: 1, prixUnitaireHT: 85000, tauxTva: 14, montantHT: 85000, montantTva: 11900, montantTTC: 96900 }],
    montantHT: 85000, montantTva: 11900, montantTTC: 96900, montantDu: 96900, devise: 'MAD',
    statutPaiement: 'Non payee', status: 'NON_RAPPROCHE', createdAt: new Date('2026-02-20'), updatedAt: new Date('2026-02-20'),
  },
  {
    id: 'inv4', type: 'EMISE', numero: 'FC-2026-0089', tiersId: 'c1', tiersNom: 'SOCIETE MINIERE PHOSBOUCRAA', tiersIce: '002555666777888',
    dateEmission: new Date('2026-01-25'), dateEcheance: new Date('2026-04-25'), source: 'ERP',
    lignes: [{ id: 'l4', description: 'Prestations de conseil IT', compte: '714000', compteLabel: 'Travaux factures', quantite: 1, prixUnitaireHT: 350000, tauxTva: 20, montantHT: 350000, montantTva: 70000, montantTTC: 420000 }],
    montantHT: 350000, montantTva: 70000, montantTTC: 420000, montantDu: 420000, devise: 'MAD',
    statutPaiement: 'Non payee', status: 'RAPPROCHE', createdAt: new Date('2026-01-25'), updatedAt: new Date('2026-01-25'),
  },
  {
    id: 'inv5', type: 'EMISE', numero: 'FC-2026-0112', tiersId: 'c2', tiersNom: 'COOPERATIVE AGRICOLE SOUSS', tiersIce: '002333444555666',
    dateEmission: new Date('2026-02-10'), dateEcheance: new Date('2026-04-10'), source: 'MANUELLE',
    lignes: [{ id: 'l5', description: 'Licence logiciel annuelle', compte: '716000', compteLabel: 'Produits activites annexes', quantite: 1, prixUnitaireHT: 120000, tauxTva: 20, montantHT: 120000, montantTva: 24000, montantTTC: 144000 }],
    montantHT: 120000, montantTva: 24000, montantTTC: 144000, montantDu: 144000, devise: 'MAD',
    statutPaiement: 'Partielle', status: 'JUSTIFIE', createdAt: new Date('2026-02-10'), updatedAt: new Date('2026-02-10'),
  },
]

export const mouvementsBancaires: MouvementBancaire[] = [
  { id: 'mb1', reference: 'VIR-2026-001542', dateValeur: new Date('2026-01-18'), montant: 60000, libelle: 'VIR ELECTROTECH MAROC FA-2026-0142', banque: 'Attijariwafa Bank', sens: 'DEBIT' },
  { id: 'mb2', reference: 'VIR-2026-002187', dateValeur: new Date('2026-02-05'), montant: 17500, libelle: 'VIR FOURNITURES BUREAU', banque: 'BMCE Bank', sens: 'DEBIT' },
  { id: 'mb3', reference: 'VIR-2026-003089', dateValeur: new Date('2026-02-01'), montant: 420000, libelle: 'VIR PHOSBOUCRAA FC-2026-0089', banque: 'CIH Bank', sens: 'CREDIT' },
  { id: 'mb4', reference: 'VIR-2026-004112', dateValeur: new Date('2026-02-15'), montant: 100000, libelle: 'VIR PARTIEL COOP SOUSS', banque: 'Credit Agricole', sens: 'CREDIT' },
]

export const reconciliations: Reconciliation[] = [
  { id: 'r1', invoice: invoices[0], mouvement: mouvementsBancaires[0], erpEntry: { reference: 'ERP-2026-0142', montant: 60000, date: new Date('2026-01-15') }, score: { montant: 40, date: 22, referenceFacture: 25, contrepartie: 10, total: 97 }, status: 'RAPPROCHEE' },
  { id: 'r2', invoice: invoices[1], mouvement: mouvementsBancaires[1], erpEntry: { reference: 'ERP-2026-0187', montant: 18000, date: new Date('2026-02-01') }, score: { montant: 35, date: 20, referenceFacture: 0, contrepartie: 8, total: 63 }, status: 'ECART_DETECTE', justification: '' },
  { id: 'r3', invoice: invoices[2], score: { montant: 0, date: 0, referenceFacture: 0, contrepartie: 0, total: 0 }, status: 'NON_RAPPROCHEE' },
  { id: 'r4', invoice: invoices[3], mouvement: mouvementsBancaires[2], erpEntry: { reference: 'ERP-2026-0089', montant: 420000, date: new Date('2026-01-25') }, score: { montant: 40, date: 23, referenceFacture: 25, contrepartie: 10, total: 98 }, status: 'RAPPROCHEE' },
  { id: 'r5', invoice: invoices[4], mouvement: mouvementsBancaires[3], erpEntry: { reference: 'ERP-2026-0112', montant: 144000, date: new Date('2026-02-10') }, score: { montant: 28, date: 20, referenceFacture: 0, contrepartie: 8, total: 56 }, status: 'ECART_DETECTE', justification: 'Paiement partiel recu. Le client a effectue un acompte de 100 000 MAD.', justificationDate: new Date('2026-02-20') },
]

export const additionalReconciliations: Reconciliation[] = [
  { id: 'r6', invoice: { ...invoices[0], id: 'inv6', numero: 'FA-2026-0298', tiersNom: 'ATLAS EQUIPEMENTS SA', montantTTC: 245000, montantHT: 204166.67, montantTva: 40833.33, dateEmission: new Date('2026-02-28') }, mouvement: { id: 'mb5', reference: 'VIR-2026-005298', dateValeur: new Date('2026-03-02'), montant: 245000, libelle: 'VIR ATLAS EQUIP FA-2026-0298', banque: 'Attijariwafa Bank', sens: 'DEBIT' }, score: { montant: 40, date: 24, referenceFacture: 25, contrepartie: 10, total: 99 }, status: 'RAPPROCHEE' },
  { id: 'r7', invoice: { ...invoices[0], id: 'inv7', numero: 'FA-2026-0312', tiersNom: 'TECH SOLUTIONS RABAT', montantTTC: 78500, montantHT: 65416.67, montantTva: 13083.33, dateEmission: new Date('2026-03-05') }, mouvement: { id: 'mb6', reference: 'VIR-2026-006312', dateValeur: new Date('2026-03-08'), montant: 78000, libelle: 'VIR TECH SOLUTIONS', banque: 'BMCE Bank', sens: 'DEBIT' }, score: { montant: 38, date: 23, referenceFacture: 0, contrepartie: 9, total: 70 }, status: 'ECART_DETECTE' },
]

export const dashboardStats = {
  facturesEnAttente: 12,
  rapprocheesCeMois: 47,
  ecartsDetectes: 8,
  tvaNette: 156000,
}
