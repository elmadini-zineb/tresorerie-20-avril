"use client"

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
// --- FILTER STATE DEFAULTS ---
const DEFAULT_FLUX_FILTERS = {
  account: 'ALL',
  sources: ['CBS', 'ERP', 'ADRIA', 'MANUEL', 'AI'],
  certitudes: ['CONFIRME', 'PROBABLE', 'INCERTAIN'],
  statut: 'ALL',
  sens: 'ALL',
  dateFrom: '',
  dateTo: '',
  montantMin: '',
  montantMax: '',
};
const DEFAULT_COMPTE_FILTERS = {
  account: 'ALL',
  dateFrom: '',
  dateTo: '',
  typeOp: 'ALL',
  montantMin: '',
  montantMax: '',
  libelle: '',
};
const DEFAULT_ENTREPRISE_FILTERS = {
  search: '',
  segment: 'ALL',
};
const DEFAULT_CBS_SYNC_FILTERS = {
  search: '',
};
const DEFAULT_MOUVEMENT_FILTERS = {
  account: 'ALL',
  dateFrom: '',
  dateTo: '',
  typeOp: 'ALL',
  montantMin: '',
  montantMax: '',
  libelle: '',
};
const DEFAULT_USER_FILTERS = {
  search: '',
  role: 'ALL',
};
const DEFAULT_CAT_FILTERS = {
  account: 'ALL',
  dateFrom: '',
  dateTo: '',
  sens: 'ALL',
  source: 'ALL',
};
const DEFAULT_RAPPROCH_FILTERS = {
  account: 'ALL',
  banqueSource: 'ALL',
  dateFrom: '',
  dateTo: '',
  statut: 'ALL',
};
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Landmark, FileText, TrendingUp, RefreshCw, Globe, Link2, Bell, BarChart2,
  Settings, LogOut, Menu, ChevronDown, ChevronUp, Eye, EyeOff, Edit, Trash2, Check, X,
  Plus, Download, Upload, Search, RotateCcw, AlertTriangle, TrendingDown, Clock, Building2,
  Users, Copy, Filter, Calendar, Info, Lock, CheckCircle, FileX, ArrowUpRight, ArrowDownRight,
  Loader2, Play, Mail, Save, Wifi
} from 'lucide-react'
import {
  ComposedChart, BarChart, LineChart, PieChart, AreaChart, ResponsiveContainer,
  Bar, Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts'

// ============== MOCK DATA ==============
const MOCK_USERS = [
  { id:'u1', nom:'Karim Benchekroun', email:'karim@techcorp.ma', password:'demo123', role:'TRESORIER', entreprise_id:'e1',
    permissions:{ canDeclareFlux:true, canValidateFlux:false, canDeleteFlux:false, canImportERP:true, canImportExcel:true, canExport:true, canAccessReporting:true, canConfigureAlertes:true, canAccessMultiDevises:true, canAccessRapprochement:true, canManageUsers:false, canConfigureCBS:false, canViewAllClients:false }},
  { id:'u2', nom:'Nadia El Fassi', email:'nadia@techcorp.ma', password:'demo123', role:'ADMIN_CLIENT', entreprise_id:'e1',
    permissions:{ canDeclareFlux:true, canValidateFlux:true, canDeleteFlux:true, canImportERP:true, canImportExcel:true, canExport:true, canAccessReporting:true, canConfigureAlertes:true, canAccessMultiDevises:true, canAccessRapprochement:true, canManageUsers:true, canConfigureCBS:false, canViewAllClients:false }},
  { id:'u3', nom:'Youssef Tazi', email:'youssef@backoffice-banque.ma', password:'demo123', role:'BACKOFFICE_BANQUE', entreprise_id:null,
    permissions:{ canDeclareFlux:false, canValidateFlux:false, canDeleteFlux:false, canImportERP:false, canImportExcel:false, canExport:true, canAccessReporting:true, canConfigureAlertes:false, canAccessMultiDevises:false, canAccessRapprochement:false, canManageUsers:false, canConfigureCBS:false, canViewAllClients:true }},
  { id:'u4', nom:'Samira Idrissi', email:'samira@adria-admin.ma', password:'demo123', role:'ADMIN_BANQUE', entreprise_id:null,
    permissions:{ canDeclareFlux:false, canValidateFlux:false, canDeleteFlux:false, canImportERP:false, canImportExcel:false, canExport:true, canAccessReporting:true, canConfigureAlertes:false, canAccessMultiDevises:false, canAccessRapprochement:false, canManageUsers:false, canConfigureCBS:true, canViewAllClients:true }},
]

const MOCK_ENTREPRISES = [
  { id:'e1', nom:'TechCorp Maroc SARL', client_code:'TCM-001', segment:'PME', statut:'ACTIF',
    nb_comptes:4, solde_consolide_mad:2668987, nb_alertes:2, flux_en_attente:3,
    modules_actifs:['dashboard','flux','prevision','rapprochement','multidevises','erp','alertes','reporting'] },
  { id:'e2', nom:'Atlas Distribution SA', client_code:'ATD-002', segment:'CORPORATE', statut:'ACTIF',
    nb_comptes:1, solde_consolide_mad:3200000, nb_alertes:0, flux_en_attente:1,
    modules_actifs:['dashboard','flux','prevision','alertes','reporting'] },
  { id:'e3', nom:'Horizon Import Export', client_code:'HIE-003', segment:'PME', statut:'EN_ATTENTE',
    nb_comptes:0, solde_consolide_mad:0, nb_alertes:0, flux_en_attente:0,
    modules_actifs:['dashboard','flux'] },
]

const MOCK_COMPTES = [
  { id:'c1', entreprise_id:'e1', account_number:'007780001234567890001', banque:'Crédit Agricole du Maroc', devise:'MAD', type:'Courant principal',  solde:1842650, seuil_min:300000, seuil_critique:100000, statut:'ACTIF' },
  { id:'c2', entreprise_id:'e1', account_number:'007780001234567890002', banque:'Crédit Agricole du Maroc', devise:'EUR', type:'Devises EUR',         solde:24300,   seuil_min:5000,   seuil_critique:2000,   statut:'ACTIF' },
  { id:'c3', entreprise_id:'e1', account_number:'022140001234567890003', banque:'Attijariwafa Bank',        devise:'USD', type:'Devises USD',         solde:18750,   seuil_min:3000,   seuil_critique:1000,   statut:'ACTIF' },
  { id:'c4', entreprise_id:'e1', account_number:'007780001234567890004', banque:'Crédit Agricole du Maroc', devise:'MAD', type:'Compte salaires',     solde:520000,  seuil_min:200000, seuil_critique:50000,  statut:'ACTIF' },
  { id:'c5', entreprise_id:'e2', account_number:'011250002234567890005', banque:'BMCE Bank',                devise:'MAD', type:'Courant principal',  solde:3200000, seuil_min:500000, seuil_critique:200000, statut:'ACTIF' },
]

const MOCK_FLUX = [
  { id:'f1',  account_number:'007780001234567890001', source:'CBS',    reference:'CBS-2025-0423',    contrepartie:'CNSS Maroc',           montant:87400,  devise:'MAD', date_previsionnelle:'2025-03-05', date_execution:'2025-03-05', sens:'DECAISSEMENT', certitude:'CONFIRME',  certitude_coeff:1.0, categorie:'Charges sociales', statut:'EXECUTE',    confidence_score:null, is_duplicate:false },
  { id:'f2',  account_number:'007780001234567890001', source:'ERP',    reference:'ERP-FAC-2025-0178', contrepartie:'Client Alpha SARL',    montant:245000, devise:'MAD', date_previsionnelle:'2025-03-15', date_execution:null,         sens:'ENCAISSEMENT', certitude:'PROBABLE',  certitude_coeff:0.7, categorie:'Ventes clients',   statut:'VALIDE',     confidence_score:null, is_duplicate:false },
  { id:'f3',  account_number:'007780001234567890001', source:'ADRIA',  reference:'ADR-VIR-2025-0056', contrepartie:'Fournisseur Beta SARL',montant:120000, devise:'MAD', date_previsionnelle:'2025-03-20', date_execution:null,         sens:'DECAISSEMENT', certitude:'CONFIRME',  certitude_coeff:1.0, categorie:'Fournisseurs',     statut:'EN_ATTENTE', confidence_score:null, is_duplicate:false },
  { id:'f4',  account_number:'007780001234567890004', source:'ERP',    reference:'ERP-SAL-2025-0310', contrepartie:'Masse salariale Mars', montant:480000, devise:'MAD', date_previsionnelle:'2025-03-28', date_execution:null,         sens:'DECAISSEMENT', certitude:'CONFIRME',  certitude_coeff:1.0, categorie:'RH - Salaires',    statut:'VALIDE',     confidence_score:null, is_duplicate:false },
  { id:'f5',  account_number:'007780001234567890002', source:'MANUEL', reference:'MAN-2025-0012',     contrepartie:'Techno Export GmbH',   montant:15000,  devise:'EUR', date_previsionnelle:'2025-03-25', date_execution:null,         sens:'ENCAISSEMENT', certitude:'PROBABLE',  certitude_coeff:0.7, categorie:'Ventes clients',   statut:'EN_ATTENTE', confidence_score:null, is_duplicate:false },
  { id:'f6',  account_number:'022140001234567890003', source:'AI',     reference:'AI-PRED-2025-0089', contrepartie:'US Supplier Corp',     montant:8500,   devise:'USD', date_previsionnelle:'2025-04-05', date_execution:null,         sens:'DECAISSEMENT', certitude:'INCERTAIN', certitude_coeff:0.3, categorie:'Fournisseurs',     statut:'BROUILLON',  confidence_score:0.62, is_duplicate:false },
  { id:'f7',  account_number:'007780001234567890001', source:'CBS',    reference:'CBS-2025-0410',     contrepartie:'DGI Impôts',           montant:58200,  devise:'MAD', date_previsionnelle:'2025-03-31', date_execution:null,         sens:'DECAISSEMENT', certitude:'CONFIRME',  certitude_coeff:1.0, categorie:'Fiscalité',        statut:'VALIDE',     confidence_score:null, is_duplicate:false },
  { id:'f8',  account_number:'007780001234567890001', source:'MANUEL', reference:'MAN-2025-0013',     contrepartie:'Bail Bureau Casablanca',montant:35000, devise:'MAD', date_previsionnelle:'2025-04-01', date_execution:null,         sens:'DECAISSEMENT', certitude:'CONFIRME',  certitude_coeff:1.0, categorie:'Immobilier',       statut:'VALIDE',     confidence_score:null, is_duplicate:false },
  { id:'f9',  account_number:'007780001234567890001', source:'AI',     reference:'AI-PRED-2025-0090', contrepartie:'Client Beta SA',       montant:180000, devise:'MAD', date_previsionnelle:'2025-04-10', date_execution:null,         sens:'ENCAISSEMENT', certitude:'INCERTAIN', certitude_coeff:0.3, categorie:'Ventes clients',   statut:'BROUILLON',  confidence_score:0.45, is_duplicate:false },
  { id:'f10', account_number:'007780001234567890001', source:'ERP',    reference:'ERP-FAC-2025-0180', contrepartie:'Client Alpha SARL',    montant:245000, devise:'MAD', date_previsionnelle:'2025-03-15', date_execution:null,         sens:'ENCAISSEMENT', certitude:'PROBABLE',  certitude_coeff:0.7, categorie:'Ventes clients',   statut:'VALIDE',     confidence_score:null, is_duplicate:true  },
  { id:'f11', account_number:'007780001234567890001', source:'CBS',    reference:'CBS-2025-0380',     contrepartie:'Assurance MAMDA',      montant:12400,  devise:'MAD', date_previsionnelle:'2025-03-10', date_execution:'2025-03-10', sens:'DECAISSEMENT', certitude:'CONFIRME',  certitude_coeff:1.0, categorie:'Assurances',       statut:'EXECUTE',    confidence_score:null, is_duplicate:false },
  { id:'f12', account_number:'007780001234567890001', source:'ERP',    reference:'ERP-FAC-2025-0201', contrepartie:'Client Gamma SARL',    montant:320000, devise:'MAD', date_previsionnelle:'2025-04-15', date_execution:null,         sens:'ENCAISSEMENT', certitude:'PROBABLE',  certitude_coeff:0.7, categorie:'Ventes clients',   statut:'EN_ATTENTE', confidence_score:null, is_duplicate:false },
]

const MOCK_MOUVEMENTS_CBS = [
  { id:'m1',  account_number:'007780001234567890001', date_valeur:'2025-03-05', date_operation:'2025-03-05', montant:87400,  sens:'DEBIT',  libelle:'COTISATION CNSS MARS 2025',  reference:'CBS-REF-045623', contrepartie:'CNSS',                 statut_rapprochement:'RAPPROCHE',     flux_id:'f1',  anomalie:null },
  { id:'m2',  account_number:'007780001234567890001', date_valeur:'2025-03-10', date_operation:'2025-03-10', montant:320000, sens:'CREDIT', libelle:'VIR RECU CLIENT GAMMA',      reference:'CBS-REF-045701', contrepartie:'Client Gamma SARL',    statut_rapprochement:'NON_RAPPROCHE', flux_id:null,  anomalie:null },
  { id:'m3',  account_number:'007780001234567890001', date_valeur:'2025-03-12', date_operation:'2025-03-12', montant:119800, sens:'DEBIT',  libelle:'VIR FOURNISSEUR BETA',       reference:'CBS-REF-045812', contrepartie:'Fournisseur Beta SARL', statut_rapprochement:'ANOMALIE',      flux_id:'f3',  anomalie:'Écart montant: 200 MAD' },
  { id:'m4',  account_number:'007780001234567890001', date_valeur:'2025-03-15', date_operation:'2025-03-15', montant:58200,  sens:'DEBIT',  libelle:'PAIEMENT DGI ACOMPTE',       reference:'CBS-REF-046001', contrepartie:'DGI',                  statut_rapprochement:'NON_RAPPROCHE', flux_id:null,  anomalie:null },
  { id:'m5',  account_number:'007780001234567890001', date_valeur:'2025-03-10', date_operation:'2025-03-10', montant:12400,  sens:'DEBIT',  libelle:'PRLV ASSURANCE MAMDA',       reference:'CBS-REF-045720', contrepartie:'MAMDA Assurance',      statut_rapprochement:'RAPPROCHE',     flux_id:'f11', anomalie:null },
]

const MOCK_TAUX = [
  { devise:'EUR', taux_achat:10.82, taux_vente:10.95, variation_24h:+0.12, historique_7j:[10.70,10.72,10.68,10.75,10.79,10.81,10.82] },
  { devise:'USD', taux_achat:9.94,  taux_vente:10.07, variation_24h:-0.08, historique_7j:[10.02,9.99,9.97,9.96,9.95,9.95,9.94] },
  { devise:'GBP', taux_achat:12.54, taux_vente:12.71, variation_24h:+0.05, historique_7j:[12.48,12.50,12.51,12.49,12.52,12.53,12.54] },
]

const MOCK_ALERTES = [
  { id:'a1', type:'SOLDE_BAS',               compte_id:'c1', account_number:'007780001234567890001', titre:'Solde bas prévu',              message:'Solde prévisionnel sous le seuil dans 3 jours — 285,000 MAD prévu vs seuil 300,000 MAD', date:'2025-03-28', dismissed:false, severity:'WARNING' },
  { id:'a2', type:'TENSION_PREVISIONNELLE',  compte_id:'c4', account_number:'007780001234567890004', titre:'Tension prévisionnelle',       message:'Seuil critique atteint dans 12 jours après virement masse salariale avril', date:'2025-03-27', dismissed:false, severity:'CRITICAL' },
  { id:'a3', type:'FLUX_NON_RAPPROCHE',      compte_id:'c1', account_number:'007780001234567890001', titre:'Flux non rapproché',           message:'Le mouvement CBS-REF-045701 (320,000 MAD) n\'a pas de correspondance ERP depuis 5 jours', date:'2025-03-26', dismissed:false, severity:'WARNING' },
]

const MOCK_CBS_SYNCS = [
  { id:'s1', date:'2025-03-29', heure:'08:14', source:'Crédit Agricole du Maroc', format:'MT940',   nb_enregistrements:24, duree_ms:342, statut:'SUCCES',   error:null },
  { id:'s2', date:'2025-03-28', heure:'08:05', source:'Crédit Agricole du Maroc', format:'MT940',   nb_enregistrements:18, duree_ms:287, statut:'SUCCES',   error:null },
  { id:'s3', date:'2025-03-27', heure:'08:10', source:'Attijariwafa Bank',        format:'CAMT053', nb_enregistrements:6,  duree_ms:412, statut:'SUCCES',   error:null },
]

const CATEGORY_RULES = [
  { keywords:['salaire','paie','rémunération','masse salariale'], category:'RH - Salaires',    weight:0.92 },
  { keywords:['loyer','bail','location','immobilier'],            category:'Immobilier',        weight:0.90 },
  { keywords:['cnss','cotisation','retraite'],                    category:'Charges sociales',  weight:0.95 },
  { keywords:['facture','fournisseur'],                           category:'Fournisseurs',      weight:0.72 },
  { keywords:['impôt','taxe','dgi','tva'],                        category:'Fiscalité',         weight:0.93 },
  { keywords:['client','vente','commande','encaissement'],        category:'Ventes clients',    weight:0.70 },
  { keywords:['banque','crédit','emprunt','remboursement'],       category:'Financier',         weight:0.85 },
  { keywords:['assurance'],                                       category:'Assurances',        weight:0.88 },
  { keywords:['électricité','eau','téléphone','internet','aws','azure','cloud'], category:'Charges fixes', weight:0.80 },
]

const autoCategorie = (text: string) => {
  const lower = (text||'').toLowerCase()
  let best = { cat:'Autre', score:0 }
  CATEGORY_RULES.forEach(r => {
    const match = r.keywords.some(k => lower.includes(k))
    if (match && r.weight > best.score) best = { cat:r.category, score:r.weight }
  })
  return best.cat
}

// Generate time series data (delayed until client-side)
const generateTimeSeries = () => {
  const data = []
  const baseDate = new Date('2025-03-01')
  let solde = 1842650
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const isPast = i < 30
    
    // Use fixed values to avoid hydration mismatch
    const enc = isPast ? 125000 + (i * 1000) : null
    const dec = isPast ? 90000 + (i * 500) : null
    const enc_prev = !isPast ? 110000 + ((60 - i) * 900) : null
    const dec_prev = !isPast ? 82000 + ((60 - i) * 400) : null
    
    if (isPast && enc && dec) solde = solde + enc - dec
    
    data.push({
      date: dateStr,
      solde,
      enc_reel: enc,
      dec_reel: dec,
      enc_prev,
      dec_prev
    })
  }
  return data
}

const TIME_SERIES = generateTimeSeries()

// ============== ROLE BADGE COLORS ==============
const ROLE_COLORS: Record<string, string> = {
  TRESORIER: '#3B6FD4',
  ADMIN_CLIENT: '#7C3AED',
  BACKOFFICE_BANQUE: '#D97706',
  ADMIN_BANQUE: '#DC2626'
}

// ============== SOURCE BADGE COLORS ==============
const SOURCE_COLORS: Record<string, string> = {
  CBS: '#6B7280',
  ERP: '#3B6FD4',
  ADRIA: '#1B2E5E',
  MANUEL: '#7C3AED',
  AI: '#D97706'
}

// ============== CERTITUDE BADGE COLORS ==============
const CERTITUDE_COLORS: Record<string, string> = {
  CONFIRME: '#16A34A',
  PROBABLE: '#D97706',
  INCERTAIN: '#DC2626'
}

// ============== STATUT BADGE COLORS ==============
const STATUT_COLORS: Record<string, string> = {
  BROUILLON: '#6B7280',
  EN_ATTENTE: '#D97706',
  VALIDE: '#16A34A',
  REJETE: '#DC2626',
  EXECUTE: '#1B2E5E'
}

// ============== MAIN APP COMPONENT ==============
export default function TreasuryApp() {

  // --- All hooks must be declared unconditionally at the top ---
  // Prevision Tabs
  const [previsionSubTab, setPrevisionSubTab] = useState<string>('graphique')
  // Global state
  const [globalSaveLoading, setGlobalSaveLoading] = useState(false)
  const [justifierTexte, setJustifierTexte] = useState('')
  const [newGroupeCouleur, setNewGroupeCouleur] = useState<string>('')
  // ERP config
  const [erpConfigModified, setErpConfigModified] = useState(false)
  const [erpConfigs, setErpConfigs] = useState<Array<any>>([])
  const [erpConfigDrawer, setErpConfigDrawer] = useState<{ open: boolean; entreprise: any | null }>({ open: false, entreprise: null })
  const [erpConfigTab, setErpConfigTab] = useState<string>('mode_echange')
  const currentErpConfig = erpConfigs.find(c => c.entreprise_id === erpConfigDrawer.entreprise?.id)
  // Add erpSaveLoading state for ERP config save button
  const [erpSaveLoading, setErpSaveLoading] = useState(false)
  // Add updateErpConfig helper
  const updateErpConfig = (entrepriseId: string, changes: Partial<any>) => {
    setErpConfigs(prev => prev.map(cfg => cfg.entreprise_id === entrepriseId ? { ...cfg, ...changes } : cfg))
  }
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [loginEmail, setLoginEmail] = useState('karim@techcorp.ma')
  const [loginPassword, setLoginPassword] = useState('demo123')
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Groupes & Permissions
  const [groupes, setGroupes] = useState<Array<{ id: string; label: string; couleur: string }>>([])
  const [selectedGroupe, setSelectedGroupe] = useState<string | null>(null)
  const [groupePermissions, setGroupePermissions] = useState<Record<string, Record<string, boolean>>>({})
  const [newGroupeNom, setNewGroupeNom] = useState('')
  const [addGroupeModal, setAddGroupeModal] = useState(false)
  // Justifier Modal
  const [justifierModal, setJustifierModal] = useState<{ open: boolean; anomalie: any | null }>({ open: false, anomalie: null })
  // User Drawer & Form
  const [userDrawer, setUserDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; data: any | null }>({ open: false, mode: 'create', data: null })
  const [userFormData, setUserFormData] = useState<{ prenom: string; nom: string; email: string; role: string; comptes: any[] }>({ prenom: '', nom: '', email: '', role: 'TRESORIER', comptes: [] })
  // Editing Value for Params
  const [editingValue, setEditingValue] = useState<string>('')
  const [globalParamsModified, setGlobalParamsModified] = useState(false)
  // Additional state hooks for missing variables
  // Fix: Type for usersLocal to allow both user types (with/without password)
  type UserType = typeof MOCK_USERS[number] | {
    id: string;
    nom: string;
    email: string;
    role: string;
    entreprise_id: string | null;
    statut: string;
    derniere_connexion: string;
    comptes_accessibles: any[];
    permissions: Record<string, boolean>;
    password?: string;
  }
  const [usersLocal, setUsersLocal] = useState<UserType[]>(() => {
    try {
      const s = typeof window !== 'undefined' ? window.localStorage.getItem('usersLocal') : null
      if (s) return JSON.parse(s)
    } catch (e) {
      // ignore
    }
    return MOCK_USERS
  })
  const [loginLogs, setLoginLogs] = useState<string[]>([])
  const [seuilModified, setSeuilModified] = useState(false)
  const [editingSeuil, setEditingSeuil] = useState<string | null>(null)

  // Categories state (used in parametrage)
  const [categories, setCategories] = useState<any[]>([])
  const [newCatNom, setNewCatNom] = useState('')
  const [newCatSens, setNewCatSens] = useState<'ENCAISSEMENT' | 'DECAISSEMENT'>('ENCAISSEMENT')
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [editCatNom, setEditCatNom] = useState('')
  const [editCatSens, setEditCatSens] = useState<'ENCAISSEMENT' | 'DECAISSEMENT'>('ENCAISSEMENT')

  // Simple toast helper (wrapper around sonner)
  const addToast = (message: string, variant?: 'success' | 'warning' | 'info' | 'error') => {
    try {
      if (variant === 'success' && (toast as any).success) return (toast as any).success(message)
      if (variant === 'error' && (toast as any).error) return (toast as any).error(message)
      // Sonner exposes direct helpers in runtime; fallback to generic toast
      toast(message)
    } catch (e) {
      // fallback: console
      console.log('[toast]', variant, message)
    }
  }

  // Modal helper to open a confirmation dialog
  const openConfirmModal = (title: string, message: string, onConfirm: () => void, danger = false) => {
    setModal({ open: true, title, message, onConfirm, danger })
  }
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Persist usersLocal and restore session on mount (if a previous user was stored)
  useEffect(() => {
    try {
      // restore current user from sessionStorage (search in persisted usersLocal first)
      const s = sessionStorage.getItem('currentUser')
      if (s) {
        const parsed = JSON.parse(s)
        const u = usersLocal.find(x => x.id === parsed.id) || MOCK_USERS.find(x => x.id === parsed.id)
        if (u) setCurrentUser(u)
      }
    } catch (e) {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep usersLocal persisted so created users survive reloads
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('usersLocal', JSON.stringify(usersLocal))
    } catch (e) {
      // ignore
    }
  }, [usersLocal])
  const [catBudgets, setCatBudgets] = useState<Record<string, number>>({})
  const [previsionComptes, setPrevisionComptes] = useState<string[]>([])
  const [previsionHorizon, setPrevisionHorizon] = useState(30)
  const [previsionSources, setPrevisionSources] = useState(['CBS', 'ERP', 'ADRIA', 'MANUEL', 'AI'])
  const [previsionCertitudes, setPrevisionCertitudes] = useState(['CONFIRME', 'PROBABLE', 'INCERTAIN'])
  const [previsionScenario, setPrevisionScenario] = useState<'realiste' | 'optimiste' | 'pessimiste'>('realiste')
  const [previsionData, setPrevisionData] = useState<any[]>([])
  const [previsionCalculated, setPrevisionCalculated] = useState(false)
  const [previsionLoading, setPrevisionLoading] = useState(false)
  const [mdComptesInclus, setMdComptesInclus] = useState<string[]>([])
  const [mdSimulateur, setMdSimulateur] = useState<{ montant: string | number, devise: string, typeOp: string }>({ montant: '', devise: 'MAD', typeOp: 'PAIEMENT' })
  const [mdResultats, setMdResultats] = useState<any[]>([])
  const [mdAnalyseLoading, setMdAnalyseLoading] = useState(false)
  const [mdAnalyseDone, setMdAnalyseDone] = useState(false)
  const [mdSimulationHistory, setMdSimulationHistory] = useState<any[]>([])
  const [groupeModified, setGroupeModified] = useState(false)
  const [seuils, setSeuils] = useState<any[]>([])
  // FILTER STATE HOOKS
  const [fluxFilters, setFluxFilters] = useState({ ...DEFAULT_FLUX_FILTERS })
  const [fluxFiltersApplied, setFluxFiltersApplied] = useState({ ...DEFAULT_FLUX_FILTERS })
  const [compteFilters, setCompteFilters] = useState({ ...DEFAULT_COMPTE_FILTERS })
  const [compteFiltersApplied, setCompteFiltersApplied] = useState({ ...DEFAULT_COMPTE_FILTERS })
  const [entrepriseFilters, setEntrepriseFilters] = useState({ ...DEFAULT_ENTREPRISE_FILTERS })
  const [entrepriseFiltersApplied, setEntrepriseFiltersApplied] = useState({ ...DEFAULT_ENTREPRISE_FILTERS })
  const [cbsSyncFilters, setCbsSyncFilters] = useState({ ...DEFAULT_CBS_SYNC_FILTERS })
  const [cbsSyncFiltersApplied, setCbsSyncFiltersApplied] = useState({ ...DEFAULT_CBS_SYNC_FILTERS })
  const [mouvementFilters, setMouvementFilters] = useState({ ...DEFAULT_MOUVEMENT_FILTERS })
  const [mouvementFiltersApplied, setMouvementFiltersApplied] = useState({ ...DEFAULT_MOUVEMENT_FILTERS })
  const [userFilters, setUserFilters] = useState({ ...DEFAULT_USER_FILTERS })
  const [userFiltersApplied, setUserFiltersApplied] = useState({ ...DEFAULT_USER_FILTERS })
  const [catFilters, setCatFilters] = useState({ ...DEFAULT_CAT_FILTERS })
  const [catFiltersApplied, setCatFiltersApplied] = useState({ ...DEFAULT_CAT_FILTERS })
  const [rapprochFilters, setRapprochFilters] = useState({ ...DEFAULT_RAPPROCH_FILTERS })
  const [rapprochFiltersApplied, setRapprochFiltersApplied] = useState({ ...DEFAULT_RAPPROCH_FILTERS })
  // Navigation state
  const pathname = usePathname()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isRapprochementOpen, setIsRapprochementOpen] = useState(false)
  const [breadcrumb, setBreadcrumb] = useState(['Trésorerie', 'Tableau de bord'])
  // Analysis scope
  const [analysisScope, setAnalysisScope] = useState({
    selectedAccount: 'ALL',
    sources: ['CBS','ERP','ADRIA','MANUEL','AI'],
    certitudes: ['CONFIRME','PROBABLE'],
    dateFrom: '',
    dateTo: '',
  })
  // Data state
  const [flux, setFlux] = useState(MOCK_FLUX)
  const [alertes, setAlertes] = useState(MOCK_ALERTES)
  const [entreprises, setEntreprises] = useState(MOCK_ENTREPRISES)
  const [mouvements, setMouvements] = useState(MOCK_MOUVEMENTS_CBS)
  const [cbsSyncs] = useState(MOCK_CBS_SYNCS)
  // UI state
  const [toasts, setToasts] = useState<Array<{id: number, msg: string, type: string}>>([])
  const [unreadCount, setUnreadCount] = useState(3)
  const [bellOpen, setBellOpen] = useState(false)
  const [bellAccountFilter, setBellAccountFilter] = useState('ALL')
  const [alertePageFilters, setAlertePageFilters] = useState({ account: 'ALL', type: 'ALL', statut: 'active' as 'active' | 'dismissed' | 'ALL' })
  const [alertePageFiltersApplied, setAlertePageFiltersApplied] = useState({ account: 'ALL', type: 'ALL', statut: 'active' as 'active' | 'dismissed' | 'ALL' })
  const [loadingExports, setLoadingExports] = useState<Record<string, boolean>>({})
  const [showSourceFilter, setShowSourceFilter] = useState(false)
  const [showCertitudeFilter, setShowCertitudeFilter] = useState(false)
  const [selectedDashboardAccount, setSelectedDashboardAccount] = useState('ALL')
  // Modal state
  const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: () => {}, danger: false })
  // Drawer state
  const [drawer, setDrawer] = useState({ open: false, mode: 'view', data: null as typeof MOCK_FLUX[0] | null, type: '' })
  // Correction 1 - Parametrage tabs navigation
  const [parametrageTab, setParametrageTab] = useState<'utilisateurs' | 'groupes' | 'modules' | 'alertes_seuils' | 'categories'>('utilisateurs')
  const [parametrageCbsTab, setParametrageCbsTab] = useState<'connexion_ebics' | 'flux_donnees' | 'acces_entreprises' | 'params_globaux'>('connexion_ebics')
  // Correction 2 - Dossier entreprise drawer
  const [dossierEntreprise, setDossierEntreprise] = useState<typeof MOCK_ENTREPRISES[0] | null>(null)
  const [dossierOpen, setDossierOpen] = useState(false)
  const [dossierTab, setDossierTab] = useState<'overview' | 'flux' | 'alertes' | 'prevision' | 'cbs' | 'historique_cbs'>('overview')
  // Correction 3 - Reporting
  const [selectedReportAccount, setSelectedReportAccount] = useState('ALL')
  const [selectedReportClient, setSelectedReportClient] = useState<string | null>(null)
  const [bankReportTab, setBankReportTab] = useState<'par_client' | 'consolide'>('par_client')
  const [customReport, setCustomReport] = useState({ type: 'flux_declares', accounts: ['ALL'], dateFrom: '', dateTo: '', format: 'excel' })
  const [customReportLoading, setCustomReportLoading] = useState(false)
  // Correction 4 - Parametrage CBS complet
  const DEFAULT_CBS_FORM_CONFIG = {
    host: 'cbs.creditagricole.ma',
    port: '443',
    protocole: 'H004',
    format: 'MT940',
    timeout: '30',
    devises: 'MAD, EUR, USD, GBP',
    partenaire_id: 'TECHCORP-MA-001',
    user_id: 'KARIM-ADM',
  }
  const [cbsFormConfig, setCbsFormConfig] = useState(DEFAULT_CBS_FORM_CONFIG)
  const [cbsFormModified, setCbsFormModified] = useState(false)
  const [cbsTestLoading, setCbsTestLoading] = useState(false)
  const [cbsSaveLoading, setCbsSaveLoading] = useState(false)
  const [cbsFlux, setCbsFlux] = useState([
    { id:'cf1', nom:'Soldes temps réel', description:'Consultation soldes en temps réel via EBICS', format:'ISO 20022', frequence:'tempsReel', actif:true, derniere_synchro:'2025-03-29 08:14', prochain_sync:'Temps réel', statut:'ACTIF' },
    { id:'cf2', nom:'Historique transactions', description:'Relevés de transactions passées MT940', format:'MT940', frequence:'heures', actif:true, derniere_synchro:'2025-03-29 08:00', prochain_sync:'2025-03-29 09:00', statut:'ACTIF' },
    { id:'cf3', nom:'Taux de change', description:'Cours des devises étrangères en temps réel', format:'JSON', frequence:'heures', actif:true, derniere_synchro:'2025-03-29 07:30', prochain_sync:'2025-03-29 08:30', statut:'ACTIF' },
    { id:'cf4', nom:'Relevés officiels MT940', description:'Relevés bancaires officiels format SWIFT', format:'MT940', frequence:'quotidien', actif:true, derniere_synchro:'2025-03-29 06:00', prochain_sync:'2025-03-30 06:00', statut:'ACTIF' },
    { id:'cf5', nom:'Virements permanents', description:'Ordres de virement récurrents programmés', format:'PAIN.001', frequence:'quotidien', actif:true, derniere_synchro:'2025-03-29 06:05', prochain_sync:'2025-03-30 06:05', statut:'ACTIF' },
    { id:'cf6', nom:'Prévision flux CBS', description:'Projections de trésorerie calculées par le CBS', format:'CAMT053', frequence:'quotidien', actif:true, derniere_synchro:'2025-03-29 06:10', prochain_sync:'2025-03-30 06:10', statut:'ACTIF' },
    { id:'cf7', nom:'Positions multi-devises', description:'Valorisation des positions en devises étrangères', format:'ISO 15022', frequence:'hebdomadaire', actif:false, derniere_synchro:'2025-03-24 06:00', prochain_sync:'2025-03-31 06:00', statut:'INACTIF' },
  ])
  const [syncoLoading, setSyncoLoading] = useState<Record<string, boolean>>({})
  const [globalParams, setGlobalParams] = useState([
    { key:'seuil_alerte_global', label:'Seuil alerte global', valeur:'500000', unit:'MAD', description:'Seuil déclenchant une alerte sur tous les clients', impact:'Toutes les entreprises', modifie_le:'01/03/2025' },
    { key:'timeout_session', label:'Timeout session', valeur:'30', unit:'minutes', description:'Durée d\'inactivité avant déconnexion automatique', impact:'Tous les utilisateurs', modifie_le:'15/01/2025' },
    { key:'devises_autorisees', label:'Devises autorisées', valeur:'MAD, EUR, USD, GBP', unit:'', description:'Devises actives sur la plateforme', impact:'Comptes multi-devises', modifie_le:'01/01/2025' },
    { key:'format_releves', label:'Format relevés CBS', valeur:'MT940', unit:'', description:'Format par défaut des relevés bancaires', impact:'Interface ERP/EBICS', modifie_le:'01/03/2025' },
    { key:'horizon_prevision', label:'Horizon prévision défaut', valeur:'30', unit:'jours', description:'Horizon affiché par défaut dans la prévision', impact:'Tableau de bord', modifie_le:'10/02/2025' },
    { key:'score_matching_min', label:'Score matching minimum', valeur:'70', unit:'%', description:'Score minimum pour accepter un rapprochement automatique', impact:'Rapprochement bancaire', modifie_le:'15/02/2025' },
    { key:'duree_retention', label:'Durée rétention données', valeur:'24', unit:'mois', description:'Durée de conservation des données de trésorerie', impact:'Stockage et archivage', modifie_le:'01/01/2025' },
  ])
  const [editingParam, setEditingParam] = useState<string | null>(null)
  // --- Fix: Move handleLogin above login JSX ---
  const handleLogin = () => {
    const attempt = `attempt: ${new Date().toISOString()} - ${loginEmail}`
    setLoginLogs(l => [attempt, ...l].slice(0, 10))
    console.log('[login] attempt', { email: loginEmail })
    setLoginError('')
    const email = (loginEmail || '').trim().toLowerCase()
    const password = loginPassword || ''
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs.')
      setLoginLogs(l => [`failed: empty fields - ${email}`, ...l].slice(0,10))
      return
    }

    // Try persisted users first, then fallback to mock users
    const findMatch = (list: typeof usersLocal) => list.find(u => ((u.email || '').toLowerCase().trim() === email) && ((u.password || '') === password))
    let user = findMatch(usersLocal as any)
    if (!user) user = findMatch(MOCK_USERS as any)

    if (!user) {
      console.log('[login] failed for', email)
      setLoginError('Identifiants incorrects. Veuillez réessayer.')
      setLoginLogs(l => [`failed: wrong creds - ${email}`, ...l].slice(0,10))
      return
    }

    console.log('[login] success', { id: user.id, email: user.email, role: user.role })
    setLoginLogs(l => [`success: ${user.email} (${user.role})`, ...l].slice(0,10))
    setCurrentUser(user as any)
    setLoginError('')
    try { sessionStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email, role: user.role })) } catch (e) {}

    if (user.role === 'BACKOFFICE_BANQUE' || user.role === 'ADMIN_BANQUE') {
      setActivePage('dashboard_banque')
      setBreadcrumb(['Banque', 'Tableau de bord'])
    } else {
      setActivePage('dashboard')
      setBreadcrumb(['Trésorerie', 'Tableau de bord'])
    }
  }

  // Module check
  const isModuleActive = (moduleName: string) => {
    if (!currentUser?.entreprise_id) return true
    const ent = entreprises.find(e => e.id === currentUser.entreprise_id)
    return ent?.modules_actifs?.includes(moduleName) ?? false
  }

  // Permission helper: check current user's permissions
  const canDoAction = (permKey: keyof UserType['permissions']) => {
    try {
      return !!currentUser?.permissions && !!currentUser?.permissions[permKey]
    } catch (e) {
      return false
    }
  }
  
  // Download helper
  const downloadFile = (filename: string, content: string) => {
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + content], { type:'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }
  
  const handleExport = (key: string, filename: string, csvContent: string) => {
    setLoadingExports(p => ({...p, [key]:true}))
    setTimeout(() => {
      downloadFile(filename, csvContent)
      setLoadingExports(p => ({...p, [key]:false}))
      addToast(`${filename} téléchargé avec succès`, 'success')
    }, 1500)
  }

  const handleDossierExport = (key: string, filename: string, content: string) => {
    handleExport(key, filename, content)
  }

  const handleCbsFieldChange = (field: keyof typeof cbsFormConfig, value: string) => {
    setCbsFormConfig(prev => ({ ...prev, [field]: value }))
    setCbsFormModified(true)
  }

  const handleCbsSave = () => {
    setCbsSaveLoading(true)
    setTimeout(() => {
      setCbsSaveLoading(false)
      setCbsFormModified(false)
      addToast('✓ Configuration EBICS enregistrée', 'success')
    }, 1200)
  }

  const handleCbsTest = () => {
    setCbsTestLoading(true)
    setTimeout(() => {
      setCbsTestLoading(false)
      addToast(`✓ Connexion EBICS active — Host: ${cbsFormConfig.host} — Ping: 32ms — Certificat valide`, 'success')
    }, 2000)
  }
  
  // CSV generators
  const generateCSV_flux = () => {
    const headers = 'Référence;Compte;Source;Certitude;Sens;Contrepartie;Montant;Devise;Date prévisionnelle;Statut'
    const rows = flux.map(f => 
      `${f.reference};${f.account_number};${f.source};${f.certitude};${f.sens};${f.contrepartie};${f.montant};${f.devise};${f.date_previsionnelle};${f.statut}`
    ).join('\n')
    return headers + '\n' + rows
  }
  
  // CORRECTION 3 - Report generators
  const REPORT_DEFINITIONS = [
    {
      key: 'position_quotidienne',
      titre: 'Position de trésorerie quotidienne',
      description: 'Soldes en temps réel et flux du jour par compte',
      icon: BarChart2,
      generator: (accountFilter: string) => {
        const comptes = accountFilter === 'ALL' 
          ? userComptes 
          : userComptes.filter(c => c.account_number === accountFilter)
        const header = "Compte;Banque;Devise;Solde actuel;Seuil min;Seuil critique;Statut seuil;Flux enc. (MAD);Flux déc. (MAD)"
        const rows = comptes.map(c => {
          const fluxDuJour = flux.filter(f => f.account_number === c.account_number && f.statut === 'EXECUTE')
          const enc = fluxDuJour.filter(f => f.sens === 'ENCAISSEMENT').reduce((s, f) => s + f.montant, 0)
          const dec = fluxDuJour.filter(f => f.sens === 'DECAISSEMENT').reduce((s, f) => s + f.montant, 0)
          const statut = c.solde > c.seuil_min ? 'OK' : c.solde > c.seuil_critique ? 'Attention' : 'Critique'
          return `${c.account_number};${c.banque};${c.devise};${c.solde};${c.seuil_min};${c.seuil_critique};${statut};${enc};${dec}`
        })
        return [header, ...rows].join('\n')
      }
    },
    {
      key: 'rapprochement',
      titre: 'Rapport de rapprochement',
      description: 'Opérations rapprochées, anomalies et correspondances',
      icon: RefreshCw,
      generator: (accountFilter: string) => {
        const mvts = accountFilter === 'ALL' 
          ? mouvements 
          : mouvements.filter(m => m.account_number === accountFilter)
        const header = "Date;Montant;Contrepartie;Libellé CBS;Statut;Flux ID;Anomalie"
        const rows = mvts.map(m => 
          `${m.date_valeur};${m.montant};${m.contrepartie};${m.libelle};${m.statut_rapprochement};${m.flux_id || 'N/A'};${m.anomalie || 'N/A'}`
        )
        return [header, ...rows].join('\n')
      }
    },
    {
      key: 'flux_declares',
      titre: 'Flux déclarés',
      description: 'Liste complète des flux prévisionnels filtrés',
      icon: FileText,
      generator: (accountFilter: string) => {
        const f = accountFilter === 'ALL'
          ? filteredFlux
          : filteredFlux.filter(fl => fl.account_number === accountFilter)
        const header = "Référence;Source;Contrepartie;Montant;Devise;Date;Sens;Certitude;Statut"
        const rows = f.map(fl =>
          `${fl.reference};${fl.source};${fl.contrepartie};${fl.montant};${fl.devise};${fl.date_previsionnelle};${fl.sens};${fl.certitude};${fl.statut}`
        )
        return [header, ...rows].join('\n')
      }
    },
    {
      key: 'prevision',
      titre: 'Prévision de trésorerie',
      description: 'Scénarios prévisionnels sur 30, 60 et 90 jours',
      icon: TrendingUp,
      generator: () => {
        const header = "Date;Solde;Encaissements;Décaissements;Solde net"
        const rows = TIME_SERIES.slice(30, 60).map(ts =>
          `${ts.date};${ts.solde};${ts.enc_prev || 0};${ts.dec_prev || 0};${(ts.enc_prev || 0) - (ts.dec_prev || 0)}`
        )
        return [header, ...rows].join('\n')
      }
    },
    {
      key: 'categories',
      titre: 'Analyse par catégorie',
      description: 'Répartition encaissements/décaissements par catégorie',
      icon: PieChart,
      generator: (accountFilter: string) => {
        const f = accountFilter === 'ALL'
          ? filteredFlux
          : filteredFlux.filter(fl => fl.account_number === accountFilter)
        const categories: Record<string, { enc: number, dec: number }> = {}
        f.forEach(fl => {
          if (!categories[fl.categorie]) categories[fl.categorie] = { enc: 0, dec: 0 }
          if (fl.sens === 'ENCAISSEMENT') categories[fl.categorie].enc += fl.montant
          else categories[fl.categorie].dec += fl.montant
        })
        const header = "Catégorie;Encaissements;Décaissements;Net"
        const rows = Object.entries(categories).map(([cat, vals]) =>
          `${cat};${vals.enc};${vals.dec};${vals.enc - vals.dec}`
        )
        return [header, ...rows].join('\n')
      }
    },
    {
      key: 'multidevises',
      titre: 'Exposition multi-devises',
      description: 'Positions de change et recommandations',
      icon: Globe,
      generator: () => {
        const header = "Devise;Solde;Taux achat;Taux vente;Équivalent MAD"
        const rows = userComptes
          .filter(c => c.devise !== 'MAD')
          .map(c => {
            const taux = MOCK_TAUX.find(t => t.devise === c.devise)
            const equiv = c.solde * (taux?.taux_achat || 1)
            return `${c.devise};${c.solde};${taux?.taux_achat};${taux?.taux_vente};${equiv.toFixed(2)}`
          })
        return [header, ...rows].join('\n')
      }
    },
  ]
  
  const generateCSV_consolide = () => {
    const header = 'Client;Code;Segment;Statut;Compte;Banque;Devise;Solde;Seuil min;Statut seuil;Flux en attente;Alertes actives'
    const rows: string[] = []
    entreprises.forEach(e => {
      const comptes = MOCK_COMPTES.filter(c => c.entreprise_id === e.id)
      if (comptes.length === 0) {
        rows.push(`${e.nom};${e.client_code};${e.segment};${e.statut};—;—;—;—;—;—;${e.flux_en_attente};${e.nb_alertes}`)
        return
      }
      comptes.forEach(c => {
        const fluxEnAttente = flux.filter(f => f.account_number === c.account_number && f.statut === 'EN_ATTENTE').length
        const alertesActives = alertes.filter(a => a.account_number === c.account_number && !a.dismissed).length
        const statutSeuil = c.solde > c.seuil_min ? 'OK' : c.solde > c.seuil_critique ? 'Attention' : 'Critique'
        rows.push(`${e.nom};${e.client_code};${e.segment};${e.statut};${c.account_number};${c.banque};${c.devise};${c.solde};${c.seuil_min};${statutSeuil};${fluxEnAttente};${alertesActives}`)
      })
    })
    return [header, ...rows].join('\n')
  }

  const generateCSV_clientReport = (entrepriseId: string | null, type: 'position' | 'flux' | 'consolide') => {
    const e = entreprises.find(x => x.id === entrepriseId)
    if (!e) return 'Aucun client sélectionné'
    const comptes = MOCK_COMPTES.filter(c => c.entreprise_id === e.id)
    const accountNumbers = comptes.map(c => c.account_number)
    const fluxClient = flux.filter(f => accountNumbers.includes(f.account_number))

    if (type === 'flux') {
      const header = 'Référence;Compte;Source;Sens;Contrepartie;Montant;Devise;Date prév.;Statut'
      return [header, ...fluxClient.map(f => `${f.reference};${f.account_number};${f.source};${f.sens};${f.contrepartie};${f.montant};${f.devise};${f.date_previsionnelle};${f.statut}`)].join('\n')
    }

    if (type === 'position') {
      const header = 'Compte;Banque;Devise;Solde;Seuil min;Seuil critique;Statut seuil'
      return [header, ...comptes.map(c => {
        const statut = c.solde > c.seuil_min ? 'OK' : c.solde > c.seuil_critique ? 'Attention' : 'Critique'
        return `${c.account_number};${c.banque};${c.devise};${c.solde};${c.seuil_min};${c.seuil_critique};${statut}`
      })].join('\n')
    }

    return generateCSV_consolide()
  }
  
  // Login handler
  
  // Navigation handler
  const navigate = (page: string, crumbs: string[]) => {
    setActivePage(page)
    setBreadcrumb(crumbs)
    setCurrentPage(1)
  }
  
  // Get accounts for current user
  const userComptes = useMemo(() => {
    if (!currentUser?.entreprise_id) return MOCK_COMPTES
    return MOCK_COMPTES.filter(c => c.entreprise_id === currentUser.entreprise_id)
  }, [currentUser])
  
  // Generic conversion helper
  const toMAD = (montant: number, devise: string) => {
    if (devise === 'MAD') return montant
    const taux = MOCK_TAUX.find(t => t.devise === devise)
    return montant * (taux?.taux_achat || 1)
  }

  // Filter flux based on applied filters
  const filteredFlux = useMemo(() => {
    return flux.filter(f => {
      if (fluxFiltersApplied.account !== 'ALL' && f.account_number !== fluxFiltersApplied.account) return false
      if (!fluxFiltersApplied.sources.includes(f.source)) return false
      if (!fluxFiltersApplied.certitudes.includes(f.certitude)) return false
      if (fluxFiltersApplied.statut !== 'ALL' && f.statut !== fluxFiltersApplied.statut) return false
      if (fluxFiltersApplied.sens !== 'ALL' && f.sens !== fluxFiltersApplied.sens) return false
      if (fluxFiltersApplied.dateFrom && f.date_previsionnelle < fluxFiltersApplied.dateFrom) return false
      if (fluxFiltersApplied.dateTo && f.date_previsionnelle > fluxFiltersApplied.dateTo) return false
      if (fluxFiltersApplied.montantMin && f.montant < Number(fluxFiltersApplied.montantMin)) return false
      if (fluxFiltersApplied.montantMax && f.montant > Number(fluxFiltersApplied.montantMax)) return false
      return true
    })
  }, [flux, fluxFiltersApplied])

  const alertesFiltrees = useMemo(() => {
    return alertes.filter(a => {
      if (alertePageFiltersApplied.account !== 'ALL' && a.account_number !== alertePageFiltersApplied.account) return false
      if (alertePageFiltersApplied.type !== 'ALL' && a.type !== alertePageFiltersApplied.type) return false
      if (alertePageFiltersApplied.statut === 'active' && a.dismissed) return false
      if (alertePageFiltersApplied.statut === 'dismissed' && !a.dismissed) return false
      return true
    })
  }, [alertePageFiltersApplied, alertes])
  
  // Paginated flux
  const paginatedFlux = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredFlux.slice(start, start + pageSize)
  }, [filteredFlux, currentPage, pageSize])
  
  // Total pages
  const totalPages = Math.ceil(filteredFlux.length / pageSize)
  
  // Dashboard scoped data
  const dashboardComptes = useMemo(() => (
    selectedDashboardAccount === 'ALL'
      ? MOCK_COMPTES.filter(c => c.entreprise_id === currentUser?.entreprise_id)
      : MOCK_COMPTES.filter(c => c.account_number === selectedDashboardAccount)
  ), [selectedDashboardAccount, currentUser])

  const dashboardFlux = useMemo(() => flux.filter(f =>
    dashboardComptes.some(c => c.account_number === f.account_number)
  ), [flux, dashboardComptes])

  const buildDashboardChartData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const comptesFiltres = selectedDashboardAccount === 'ALL'
      ? MOCK_COMPTES.filter(c => c.entreprise_id === currentUser?.entreprise_id)
      : MOCK_COMPTES.filter(c => c.account_number === selectedDashboardAccount)
    const accountNumbers = comptesFiltres.map(c => c.account_number)
    const result: any[] = []

    for (let i = -29; i <= 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dateStr = d.toISOString().slice(0, 10)
      const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
      const isPast = i <= 0
      const fluxDuJour = flux.filter(f => accountNumbers.includes(f.account_number))

      if (isPast) {
        const enc_reel = fluxDuJour
          .filter(f => f.sens === 'ENCAISSEMENT' && f.statut === 'EXECUTE' && f.date_execution === dateStr)
          .reduce((s, f) => s + toMAD(f.montant, f.devise), 0)
        const dec_reel = fluxDuJour
          .filter(f => f.sens === 'DECAISSEMENT' && f.statut === 'EXECUTE' && f.date_execution === dateStr)
          .reduce((s, f) => s + toMAD(f.montant, f.devise), 0)
        result.push({ date: dateStr, label, enc_reel: enc_reel > 0 ? enc_reel : 0, dec_reel: dec_reel > 0 ? dec_reel : 0, enc_prev: undefined, dec_prev: undefined })
      } else {
        const enc_prev = fluxDuJour
          .filter(f => f.sens === 'ENCAISSEMENT' && ['VALIDE', 'EN_ATTENTE'].includes(f.statut) && f.date_previsionnelle === dateStr)
          .reduce((s, f) => s + toMAD(f.montant * (f.certitude_coeff || 1), f.devise), 0)
        const dec_prev = fluxDuJour
          .filter(f => f.sens === 'DECAISSEMENT' && ['VALIDE', 'EN_ATTENTE'].includes(f.statut) && f.date_previsionnelle === dateStr)
          .reduce((s, f) => s + toMAD(f.montant * (f.certitude_coeff || 1), f.devise), 0)
        result.push({ date: dateStr, label, enc_reel: 0, dec_reel: 0, enc_prev: enc_prev > 0 ? enc_prev : 0, dec_prev: dec_prev > 0 ? dec_prev : 0 })
      }
    }

    const hasAnyData = result.some(r => r.enc_reel > 0 || r.dec_reel > 0 || r.enc_prev > 0 || r.dec_prev > 0)
    if (!hasAnyData) {
      const demoValues = [87400, 245000, 120000, 58200, 35000, 180000, 320000, 89200, 42600, 156000]
      result.forEach((r, i) => {
        if (i >= 25 && i <= 29) {
          r.enc_reel = demoValues[i - 25] * 1.5
          r.dec_reel = demoValues[i - 25]
        }
        if (i >= 30 && i <= 34) {
          r.enc_prev = demoValues[i - 30] * 1.2
          r.dec_prev = demoValues[i - 30] * 0.8
        }
      })
    }
    return result
  }

  const dashboardChartData = useMemo(() => buildDashboardChartData(), [selectedDashboardAccount, flux, currentUser])

  const dernieresOperations = useMemo(() => {
    const accountNumbers = selectedDashboardAccount === 'ALL'
      ? MOCK_COMPTES.filter(c => c.entreprise_id === currentUser?.entreprise_id).map(c => c.account_number)
      : [selectedDashboardAccount]

    return MOCK_MOUVEMENTS_CBS
      .filter(m => accountNumbers.includes(m.account_number))
      .sort((a, b) => new Date(b.date_operation).getTime() - new Date(a.date_operation).getTime())
      .slice(0, 5)
  }, [selectedDashboardAccount, currentUser])

  // KPI calculations
  const kpis = useMemo(() => {
    const soldeTotal = dashboardComptes.reduce((sum, c) => sum + toMAD(c.solde, c.devise), 0)
    const currentMonth = new Date().getMonth()
    const encaissementsMois = flux
      .filter(f => dashboardComptes.some(c => c.account_number === f.account_number) && f.sens === 'ENCAISSEMENT' && f.statut === 'EXECUTE' && f.date_execution && new Date(f.date_execution).getMonth() === currentMonth)
      .reduce((sum, f) => sum + toMAD(f.montant, f.devise), 0)
    
    const decaissementsMois = flux
      .filter(f => dashboardComptes.some(c => c.account_number === f.account_number) && f.sens === 'DECAISSEMENT' && f.statut === 'EXECUTE' && f.date_execution && new Date(f.date_execution).getMonth() === currentMonth)
      .reduce((sum, f) => sum + toMAD(f.montant, f.devise), 0)
    
    return {
      soldeTotal,
      encaissementsMois,
      decaissementsMois,
      positionNette: encaissementsMois - decaissementsMois
    }
  }, [dashboardComptes, flux])

  const compteMouvements = useMemo(() => {
    return MOCK_MOUVEMENTS_CBS.filter(m => {
      if (compteFiltersApplied.account !== 'ALL' && m.account_number !== compteFiltersApplied.account) return false
      if (compteFiltersApplied.dateFrom && m.date_operation < compteFiltersApplied.dateFrom) return false
      if (compteFiltersApplied.dateTo && m.date_operation > compteFiltersApplied.dateTo) return false
      if (compteFiltersApplied.typeOp !== 'ALL' && m.sens !== compteFiltersApplied.typeOp) return false
      if (compteFiltersApplied.montantMin && m.montant < Number(compteFiltersApplied.montantMin)) return false
      if (compteFiltersApplied.montantMax && m.montant > Number(compteFiltersApplied.montantMax)) return false
      if (compteFiltersApplied.libelle && !m.libelle.toLowerCase().includes(compteFiltersApplied.libelle.toLowerCase())) return false
      return true
    })
  }, [compteFiltersApplied])

  const mouvementsFiltres = useMemo(() =>
    MOCK_MOUVEMENTS_CBS.filter(m => {
      if (rapprochFiltersApplied.account !== 'ALL' && m.account_number !== rapprochFiltersApplied.account) return false
      if (rapprochFiltersApplied.dateFrom && m.date_valeur < rapprochFiltersApplied.dateFrom) return false
      if (rapprochFiltersApplied.dateTo && m.date_valeur > rapprochFiltersApplied.dateTo) return false
      if (rapprochFiltersApplied.statut !== 'ALL' && m.statut_rapprochement !== rapprochFiltersApplied.statut) return false
      return true
    }),
  [rapprochFiltersApplied])

  const entreprisesFiltered = useMemo(() => entreprises.filter(e => {
    if (entrepriseFiltersApplied.search) {
      const q = entrepriseFiltersApplied.search.toLowerCase()
      if (!e.nom.toLowerCase().includes(q) && !e.client_code.toLowerCase().includes(q)) return false
    }
    if (entrepriseFiltersApplied.segment !== 'ALL' && e.segment !== entrepriseFiltersApplied.segment) return false
    return true
  }), [entreprises, entrepriseFiltersApplied])

  const usersFiltres = useMemo(() =>
    usersLocal.filter(u => {
      if (userFiltersApplied.search && !u.nom.toLowerCase().includes(userFiltersApplied.search.toLowerCase()) && !u.email.toLowerCase().includes(userFiltersApplied.search.toLowerCase())) return false
      if (userFiltersApplied.role !== 'ALL' && u.role !== userFiltersApplied.role) return false
      return true
    })
  , [userFiltersApplied, usersLocal])

  const catData = useMemo(() => {
    const fluxCat = flux.filter(f => {
      const c = catFiltersApplied
      if (c.account !== 'ALL' && f.account_number !== c.account) return false
      if (c.dateFrom && f.date_previsionnelle < c.dateFrom) return false
      if (c.dateTo && f.date_previsionnelle > c.dateTo) return false
      if (c.sens !== 'ALL' && f.sens !== c.sens) return false
      if (c.source !== 'ALL' && f.source !== c.source) return false
      return true
    })
    const cats = [...new Set(fluxCat.map(f => f.categorie))]
    return cats.map(cat => {
      const fCat = fluxCat.filter(f => f.categorie === cat)
      const enc = fCat.filter(f => f.sens === 'ENCAISSEMENT').reduce((s, f) => s + f.montant, 0)
      const dec = fCat.filter(f => f.sens === 'DECAISSEMENT').reduce((s, f) => s + f.montant, 0)
      const budget = catBudgets[cat] || 0
      const ecart = enc - dec - budget
      const totalEnc = fluxCat.filter(f => f.sens === 'ENCAISSEMENT').reduce((s, f) => s + f.montant, 0)
      return { cat, nb: fCat.length, enc, dec, budget, ecart, pct: totalEnc > 0 ? ((enc / totalEnc) * 100).toFixed(1) : '0', flux: fCat }
    })
  }, [catFiltersApplied, flux, catBudgets])

  useEffect(() => {
    if (!currentUser) return
    const comptesIds = MOCK_COMPTES.filter(c => c.entreprise_id === currentUser.entreprise_id).map(c => c.account_number)
    setPrevisionComptes(comptesIds)
    setMdComptesInclus(comptesIds)
    setUsersLocal(MOCK_USERS.filter(u => u.entreprise_id === currentUser.entreprise_id))
    setSeuils(MOCK_COMPTES.filter(c => c.entreprise_id === currentUser.entreprise_id).map(c => ({
      ...c,
      alerte_solde: true,
      alerte_tension: true,
      alerte_rapprochement: c.id !== 'c3',
    })))
  }, [currentUser])

  const handleCompteSearch = () => {
    setCompteFiltersApplied({ ...compteFilters })
    setCurrentPage(1)
  }

  const handleCompteReset = () => {
    const empty = { account: 'ALL', dateFrom: '', dateTo: '', typeOp: 'ALL', montantMin: '', montantMax: '', libelle: '' }
    setCompteFilters(empty)
    setCompteFiltersApplied(empty)
    setCurrentPage(1)
  }

  const handleFluxSearch = () => {
    setFluxFiltersApplied({ ...fluxFilters })
    setCurrentPage(1)
  }

  const handleFluxReset = () => {
    const empty = {
      account: 'ALL',
      sources: ['CBS', 'ERP', 'ADRIA', 'MANUEL', 'AI'],
      certitudes: ['CONFIRME', 'PROBABLE', 'INCERTAIN'],
      statut: 'ALL',
      sens: 'ALL',
      dateFrom: '',
      dateTo: '',
      montantMin: '',
      montantMax: '',
    }
    setFluxFilters(empty)
    setFluxFiltersApplied(empty)
    setCurrentPage(1)
  }

  const handleRapprochSearch = () => {
    setRapprochFiltersApplied({ ...rapprochFilters })
  }

  const handleRapprochReset = () => {
    const e = { account: 'ALL', banqueSource: 'ALL', dateFrom: '', dateTo: '', statut: 'ALL' }
    setRapprochFilters(e)
    setRapprochFiltersApplied(e)
  }

  const computePrevision = () => {
    setPrevisionLoading(true)
    setTimeout(() => {
      const today = new Date()
      const rows: any[] = []
      let solde = previsionComptes.reduce((sum, an) => {
        const c = MOCK_COMPTES.find(x => x.account_number === an)
        return sum + (c ? toMAD(c.solde, c.devise) : 0)
      }, 0)
      const seuilMin = previsionComptes.reduce((sum, an) => {
        const c = MOCK_COMPTES.find(x => x.account_number === an)
        return sum + (c?.seuil_min || 0)
      }, 0)
      for (let i = 0; i < previsionHorizon; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        const dateStr = d.toISOString().slice(0, 10)
        const fluxDuJour = flux.filter(f =>
          previsionComptes.includes(f.account_number) &&
          previsionSources.includes(f.source) &&
          previsionCertitudes.includes(f.certitude) &&
          f.date_previsionnelle === dateStr &&
          ['VALIDE', 'EN_ATTENTE', 'BROUILLON'].includes(f.statut)
        )
        const coeffScenario = {
          pessimiste: (f: any) => f.sens === 'ENCAISSEMENT' ? (f.certitude === 'CONFIRME' ? 1 : 0) : f.certitude_coeff,
          realiste: (f: any) => f.certitude_coeff,
          optimiste: (f: any) => Math.min(f.certitude_coeff * 1.2, 1),
        }[previsionScenario] || ((f: any) => f.certitude_coeff)
        const enc = fluxDuJour.filter(f => f.sens === 'ENCAISSEMENT').reduce((s, f) => s + toMAD(f.montant * coeffScenario(f), f.devise), 0)
        const dec = fluxDuJour.filter(f => f.sens === 'DECAISSEMENT').reduce((s, f) => s + toMAD(f.montant * coeffScenario(f), f.devise), 0)
        const soldeOuverture = solde
        solde = solde + enc - dec
        const sante = solde > seuilMin ? 'Bon' : solde > 0 ? 'Attention' : 'Critique'
        rows.push({
          date: dateStr,
          label: `${d.getDate()}/${d.getMonth() + 1}`,
          solde_ouverture: Math.round(soldeOuverture),
          enc_declares: Math.round(enc),
          dec_declares: Math.round(dec),
          solde_cloture: Math.round(solde),
          sante,
          flux_du_jour: fluxDuJour,
        })
      }
      setPrevisionData(rows)
      setPrevisionCalculated(true)
      setPrevisionLoading(false)
      addToast(`✓ Prévision calculée sur ${previsionHorizon} jours — scénario ${previsionScenario}`, 'success')
    }, 1200)
  }

  const handleMdAnalyse = () => {
    setMdAnalyseLoading(true)
    setMdAnalyseDone(false)
    setTimeout(() => {
      const comptesActifs = MOCK_COMPTES.filter(c => mdComptesInclus.includes(c.account_number))
      const soldeTotal = comptesActifs.reduce((s, c) => s + toMAD(c.solde, c.devise), 0)
      const tauxSim = MOCK_TAUX.find(t => t.devise === mdSimulateur.devise)
      const resultats = comptesActifs.map(c => {
        let conversionNecessaire = false
        let coutSpread = 0
        const montantEnDevise = Number(mdSimulateur.montant)
        let soldeApres
        if (c.devise === mdSimulateur.devise) {
          soldeApres = mdSimulateur.typeOp === 'PAIEMENT' ? c.solde - montantEnDevise : c.solde + montantEnDevise
        } else {
          conversionNecessaire = true
          const tauxC = MOCK_TAUX.find(t => t.devise === c.devise)
          const spread = tauxSim ? (tauxSim.taux_vente - tauxSim.taux_achat) : 0
          coutSpread = montantEnDevise * spread
          const montantMAD = montantEnDevise * (tauxSim?.taux_achat || 1)
          const montantEnDeviseC = tauxC ? montantMAD / tauxC.taux_achat : montantMAD
          soldeApres = mdSimulateur.typeOp === 'PAIEMENT' ? c.solde - montantEnDeviseC : c.solde + montantEnDeviseC
        }
        const impactSeuil = soldeApres < c.seuil_critique ? 'CRITIQUE' : soldeApres < c.seuil_min ? 'SOUS_SEUIL' : 'OK'
        const score = coutSpread + (soldeApres < c.seuil_min ? 100 : 0) + Math.abs(toMAD(soldeApres, c.devise) / (soldeTotal || 1) - 0.25) * 10
        return { compte: c, conversionNecessaire, coutSpread: Math.round(coutSpread), soldeApres: Math.round(soldeApres), impactSeuil, score: Math.round(score * 10) / 10 }
      })
      resultats.sort((a, b) => a.score - b.score)
      setMdResultats(resultats)
      setMdAnalyseLoading(false)
      setMdAnalyseDone(true)
      setMdSimulationHistory(prev => [{ ...mdSimulateur, date: new Date().toLocaleTimeString('fr-FR'), recommande: resultats[0]?.compte?.account_number }, ...prev.slice(0, 2)])
    }, 1000)
  }

  const handlePermissionToggle = (groupId: string, permKey: string) => {
    setGroupePermissions((prev: any) => ({ ...prev, [groupId]: { ...prev[groupId], [permKey]: !prev[groupId][permKey] } }))
    setGroupeModified(true)
  }

  const handleSaveGroupePerms = () => {
    setGroupeModified(false)
    addToast('✓ Permissions du groupe enregistrées', 'success')
  }

  const handleSeuilChange = (accountNumber: string, field: string, value: any) => {
    setSeuils(prev => prev.map(s => s.account_number === accountNumber ? { ...s, [field]: value } : s))
    setSeuilModified(true)
  }

  const handleSaveSeuils = () => {
    setSeuilModified(false)
    setEditingSeuil(null)
    addToast('✓ Seuils et alertes enregistrés', 'success')
  }

  const handleAddCategory = () => {
    const nom = newCatNom.trim()
    if (!nom) return
    const exists = categories.some(c => c.nom.toLowerCase() === nom.toLowerCase() && c.sens === newCatSens)
    if (exists) {
      addToast('Cette catégorie existe déjà', 'warning')
      return
    }
    setCategories(prev => [
      ...prev,
      { id: `cat${Date.now()}`, nom, sens: newCatSens, couleur: newCatSens === 'ENCAISSEMENT' ? '#16A34A' : '#DC2626' }
    ])
    setNewCatNom('')
    addToast('✓ Catégorie ajoutée', 'success')
  }

  const handleStartEditCategory = (cat: any) => {
    setEditingCat(cat.id)
    setEditCatNom(cat.nom)
    setEditCatSens(cat.sens)
  }

  const handleSaveCategory = () => {
    if (!editingCat) return
    const nom = editCatNom.trim()
    if (!nom) return
    setCategories(prev => prev.map(c => c.id === editingCat ? {
      ...c,
      nom,
      sens: editCatSens,
      couleur: editCatSens === 'ENCAISSEMENT' ? '#16A34A' : '#DC2626'
    } : c))
    setEditingCat(null)
    setEditCatNom('')
    addToast('✓ Catégorie modifiée', 'success')
  }

  const handleDeleteCategory = (cat: any) => {
    openConfirmModal(
      'Supprimer cette catégorie ?',
      `La catégorie "${cat.nom}" sera supprimée.`,
      () => {
        setCategories(prev => prev.filter(c => c.id !== cat.id))
        setModal(p => ({ ...p, open: false }))
        addToast('✓ Catégorie supprimée', 'success')
      },
      true
    )
  }
  
  // ============== LOGIN PAGE ==============
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111E3F 0%, #1B2E5E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"DM Sans", system-ui, sans-serif'
      }}>
        <div style={{
          width: 400,
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 32,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2E5E' }}>ADRIA</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Business & Technology</div>
          </div>
          
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1B2E5E', marginBottom: 8, textAlign: 'center' }}>
            Espace Trésorerie
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24, textAlign: 'center' }}>
            Connectez-vous pour accéder à votre tableau de bord
          </p>
          
          {loginError && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #DC2626',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: '#DC2626',
              fontSize: 13
            }}>
              {loginError}
            </div>
          )}
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>
              Adresse email
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{
                width: '100%',
                height: 40,
                border: '1px solid #DDE3EF',
                borderRadius: 6,
                padding: '0 12px',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: 40,
                  border: '1px solid #DDE3EF',
                  borderRadius: 6,
                  padding: '0 40px 0 12px',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              height: 40,
              background: '#1B2E5E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
          
          <div style={{
            background: '#EEF3FC',
            borderRadius: 8,
            padding: 16,
            marginTop: 24,
            fontSize: 12
          }}>
            <div style={{ fontWeight: 600, color: '#1B2E5E', marginBottom: 8 }}>
              Comptes de démonstration :
            </div>
            <div style={{ color: '#64748B', lineHeight: 1.8 }}>
              <div>Trésorier : karim@techcorp.ma / demo123</div>
              <div>Admin Client : nadia@techcorp.ma / demo123</div>
              <div>Back-office : youssef@backoffice-banque.ma / demo123</div>
              <div>Admin Banque : samira@adria-admin.ma / demo123</div>
            </div>
          </div>
          </div>
        </div>
      )
    }

  // ============== MAIN APP SHELL ==============
  const isClientRole = (currentUser?.role === 'TRESORIER') || (currentUser?.role === 'ADMIN_CLIENT')
  
  // Client sidebar items
  const clientMenuItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', page: 'dashboard', crumbs: ['Trésorerie', 'Tableau de bord'] },
    { icon: Landmark, label: 'Suivi des Comptes', page: 'comptes', crumbs: ['Trésorerie', 'Suivi des Comptes'] },
    { icon: FileText, label: 'Flux Déclarés', page: 'flux', crumbs: ['Trésorerie', 'Flux Déclarés'] },
    { icon: TrendingUp, label: 'Prévision Trésorerie', page: 'prevision', crumbs: ['Trésorerie', 'Prévision'] },
    { 
      icon: RefreshCw, 
      label: 'Rapprochement', 
      page: 'rapprochement_parent', 
      crumbs: ['Trésorerie', 'Rapprochement'], 
      condition: () => canDoAction('canAccessRapprochement') && isModuleActive('rapprochement'),
      subItems: [
        { label: 'Tableau de bord', page: '/rapprochement-module/dashboard' },
        { label: 'Rapprochement', page: '/rapprochement-module/rapprochement' },
        { label: 'Historique', page: '/rapprochement-module/rapprochement/historique' },
        { label: 'Factures', page: '/rapprochement-module/factures' },
        { label: 'Référentiel Clients', page: '/rapprochement-module/clients' },
        { label: 'Référentiel Fournisseurs', page: '/rapprochement-module/fournisseurs' },
        { label: 'Reporting', page: '/rapprochement-module/rapports/etat-rapprochement' },
      ] 
    },
    { icon: Globe, label: 'Multi-devises', page: 'multidevises', crumbs: ['Trésorerie', 'Multi-devises'], condition: () => canDoAction('canAccessMultiDevises') && isModuleActive('multidevises') },
    { icon: Link2, label: 'Interface ERP/EBICS', page: 'erp', crumbs: ['Trésorerie', 'Interface ERP/EBICS'] },
    { icon: Bell, label: 'Alertes', page: 'alertes', crumbs: ['Trésorerie', 'Alertes'] },
    { icon: BarChart2, label: 'Reporting', page: 'reporting', crumbs: ['Trésorerie', 'Reporting'] },
    { icon: Settings, label: 'Paramétrage', page: 'parametrage', crumbs: ['Trésorerie', 'Paramétrage'], condition: () => canDoAction('canManageUsers') },
  ]
  
  // Bank sidebar items
  const bankMenuItems = [
    { icon: Building2, label: 'Tableau de Bord Banque', page: 'dashboard_banque', crumbs: ['Banque', 'Tableau de bord'] },
    { icon: Users, label: 'Gestion Entreprises', page: 'entreprises', crumbs: ['Banque', 'Gestion Entreprises'] },
    { icon: BarChart2, label: 'Reporting Global', page: 'reporting_banque', crumbs: ['Banque', 'Reporting'] },
    { icon: Settings, label: 'Paramétrage CBS', page: 'parametrage_cbs', crumbs: ['Banque', 'Paramétrage CBS'], condition: () => canDoAction('canConfigureCBS') },
  ]
  
  const menuItems = isClientRole ? clientMenuItems : bankMenuItems
  
  // ============== STATUS BADGE COMPONENT ==============
  const StatusBadge = ({ type, value }: { type: string, value: string }) => {
    let bgColor = '#F1F5F9'
    let textColor = '#64748B'
    
    if (type === 'source') {
      bgColor = SOURCE_COLORS[value] || '#6B7280'
      textColor = '#FFFFFF'
    } else if (type === 'certitude') {
      bgColor = CERTITUDE_COLORS[value] || '#6B7280'
      textColor = '#FFFFFF'
    } else if (type === 'statut') {
      bgColor = STATUT_COLORS[value] || '#6B7280'
      textColor = '#FFFFFF'
    } else if (type === 'sens') {
      bgColor = value === 'ENCAISSEMENT' ? '#DCFCE7' : '#FEE2E2'
      textColor = value === 'ENCAISSEMENT' ? '#16A34A' : '#DC2626'
    }
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: bgColor,
        color: textColor
      }}>
        {type === 'sens' && (value === 'ENCAISSEMENT' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
        {value}
      </span>
    )
  }
  
  // ============== KPI CARD COMPONENT ==============
  const KPICard = ({ title, value, suffix = '', trend, trendLabel }: { title: string, value: number | string, suffix?: string, trend?: number, trendLabel?: string }) => (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
    }}>
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2E5E' }}>
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value} {suffix}
      </div>
      {trend !== undefined && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4, 
          marginTop: 8,
          fontSize: 12,
          color: trend >= 0 ? '#16A34A' : '#DC2626'
        }}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend).toFixed(1)}% {trendLabel}
        </div>
      )}
    </div>
  )
  
  // ============== RENDER PAGE CONTENT ==============
  const renderPageContent = () => {
    switch (activePage) {
      // ============== CLIENT DASHBOARD ==============
      case 'dashboard':
        return (
          <div>
            {/* Account selector */}
            <div style={{ marginBottom: 20 }}>
              <select
                value={selectedDashboardAccount}
                onChange={e => setSelectedDashboardAccount(e.target.value)}
                style={{
                  height: 34,
                  border: '1px solid #DDE3EF',
                  borderRadius: 6,
                  padding: '0 12px',
                  fontSize: 13,
                  minWidth: 300
                }}
              >
                <option value="ALL">Tous les comptes</option>
                {userComptes.map(c => (
                  <option key={c.id} value={c.account_number}>
                    {c.account_number} | {c.banque} | {c.devise}
                  </option>
                ))}
              </select>
            </div>
            
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <KPICard title="Solde Global Consolidé" value={kpis.soldeTotal} suffix="MAD" trend={2.3} trendLabel="vs mois précédent" />
              <KPICard title="Encaissements du mois" value={kpis.encaissementsMois} suffix="MAD" trend={5.1} trendLabel="vs mois précédent" />
              <KPICard title="Décaissements du mois" value={kpis.decaissementsMois} suffix="MAD" trend={-1.8} trendLabel="vs mois précédent" />
              <KPICard 
                title="Position nette" 
                value={kpis.positionNette} 
                suffix="MAD" 
              />
            </div>
            
            {/* Main Chart */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                  Flux de trésorerie — 60 jours (réel + prévisionnel)
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Barres = réalisé | Lignes = prévisionnel
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={dashboardChartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    interval={7}
                    label={{ value: 'Date', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94A3B8' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                    label={{ value: 'Montant (MAD)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94A3B8' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [value > 0 ? `${Number(value).toLocaleString('fr-FR')} MAD` : '—', name]}
                    labelFormatter={(label) => `Période : ${label}`}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DDE3EF' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="enc_reel" name="Encaissements réels" fill="#16A34A" radius={[2,2,0,0]} maxBarSize={18} />
                  <Bar dataKey="dec_reel" name="Décaissements réels" fill="#DC2626" radius={[2,2,0,0]} maxBarSize={18} />
                  <Line dataKey="enc_prev" name="Encaissements prévisionnels" stroke="#22C55E" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls={false} />
                  <Line dataKey="dec_prev" name="Décaissements prévisionnels" stroke="#F87171" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls={false} />
                  <ReferenceLine y={300000} stroke="#D97706" strokeDasharray="4 4" label={{ value: 'Seuil alerte', position: 'insideTopRight', fontSize: 10, fill: '#D97706' }} />
                </ComposedChart>
              </ResponsiveContainer>
              
              <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: '#16A34A', borderRadius: 2 }} />
                  Encaissements réels
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: '#DC2626', borderRadius: 2 }} />
                  Décaissements réels
                </div>
              </div>
            </div>
            
            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Pie Chart */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
                  Répartition des soldes par compte
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart width={280} height={220}>
                    <Pie
                      data={dashboardComptes.map((c, i) => ({ name: `${c.account_number.slice(-6)} | ${c.devise}`, value: Math.round(toMAD(c.solde, c.devise)), fill: ['#1B2E5E', '#3B6FD4', '#16A34A', '#D97706', '#7C3AED'][i % 5] }))}
                      dataKey="value"
                      nameKey="name"
                      cx={110}
                      cy={100}
                      outerRadius={80}
                      label={false}
                      labelLine={false}
                    >
                      {dashboardComptes.map((c, index) => (
                        <Cell key={c.id} fill={['#1B2E5E', '#3B6FD4', '#16A34A', '#D97706', '#7C3AED'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${Number(value).toLocaleString('fr-FR')} MAD`, name]} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" formatter={(value) => <span style={{ fontSize: 11, color: '#64748B' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Recent Operations */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
                  5 dernières opérations
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9' }}>
                      {['Date', 'Compte', 'Libellé', 'Montant', 'Sens'].map(col => (
                        <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dernieresOperations.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                          Aucune opération pour ce compte
                        </td>
                      </tr>
                    ) : dernieresOperations.map(op => (
                      <tr key={op.id} style={{ borderBottom: '1px solid #DDE3EF' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <td style={{ padding: '8px 10px', color: '#1E293B' }}>{op.date_operation}</td>
                        <td style={{ padding: '8px 10px', color: '#64748B', fontFamily: 'monospace', fontSize: 11 }}>...{op.account_number.slice(-6)}</td>
                        <td style={{ padding: '8px 10px', color: '#1E293B', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op.libelle}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: op.sens === 'CREDIT' ? '#16A34A' : '#DC2626' }}>
                          {op.sens === 'CREDIT' ? '+' : '-'}{Number(op.montant).toLocaleString('fr-FR')} MAD
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: op.sens === 'CREDIT' ? '#DCFCE7' : '#FEE2E2', color: op.sens === 'CREDIT' ? '#16A34A' : '#DC2626' }}>
                            {op.sens === 'CREDIT' ? '↑ Crédit' : '↓ Débit'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      
      // ============== FLUX DECLARES ==============
      case 'flux':
        const pendingFlux = filteredFlux.filter(f => f.statut === 'EN_ATTENTE')
        const duplicateFlux = filteredFlux.filter(f => f.is_duplicate)
        
        return (
          <div>
            {/* Filter Zone */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #DDE3EF',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Compte</label>
                  <select
                    value={fluxFilters.account}
                    onChange={e => setFluxFilters(p => ({ ...p, account: e.target.value }))}
                    style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, minWidth: 200 }}
                  >
                    <option value="ALL">Tous les comptes</option>
                    {userComptes.map(c => (
                      <option key={c.id} value={c.account_number}>{c.account_number} | {c.banque} | {c.devise}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Source</label>
                  <button
                    onClick={() => setShowSourceFilter(!showSourceFilter)}
                    style={{
                      height: 34,
                      border: '1px solid #DDE3EF',
                      borderRadius: 6,
                      padding: '0 12px',
                      fontSize: 13,
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 150
                    }}
                  >
                    {fluxFilters.sources.length === 5 ? 'Toutes les sources' : `${fluxFilters.sources.length} sources`}
                    <ChevronDown size={14} />
                  </button>
                  {showSourceFilter && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: '#FFFFFF',
                      border: '1px solid #DDE3EF',
                      borderRadius: 8,
                      padding: 12,
                      zIndex: 100,
                      minWidth: 180,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {['CBS', 'ERP', 'ADRIA', 'MANUEL', 'AI'].map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={fluxFilters.sources.includes(s)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFluxFilters(p => ({ ...p, sources: [...p.sources, s] }))
                              } else {
                                setFluxFilters(p => ({ ...p, sources: p.sources.filter(x => x !== s) }))
                              }
                            }}
                          />
                          <StatusBadge type="source" value={s} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Certitude</label>
                  <button
                    onClick={() => setShowCertitudeFilter(!showCertitudeFilter)}
                    style={{
                      height: 34,
                      border: '1px solid #DDE3EF',
                      borderRadius: 6,
                      padding: '0 12px',
                      fontSize: 13,
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 150
                    }}
                  >
                    {fluxFilters.certitudes.length === 3 ? 'Toutes les certitudes' : `${fluxFilters.certitudes.length} certitudes`}
                    <ChevronDown size={14} />
                  </button>
                  {showCertitudeFilter && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: '#FFFFFF',
                      border: '1px solid #DDE3EF',
                      borderRadius: 8,
                      padding: 12,
                      zIndex: 100,
                      minWidth: 180,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {['CONFIRME', 'PROBABLE', 'INCERTAIN'].map(c => (
                        <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={fluxFilters.certitudes.includes(c)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFluxFilters(p => ({ ...p, certitudes: [...p.certitudes, c] }))
                              } else {
                                setFluxFilters(p => ({ ...p, certitudes: p.certitudes.filter(x => x !== c) }))
                              }
                            }}
                          />
                          <StatusBadge type="certitude" value={c} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleFluxSearch}
                  style={{
                    height: 34,
                    padding: '0 16px',
                    background: '#1B2E5E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Search size={14} />
                  Rechercher
                </button>
                
                <button
                  onClick={handleFluxReset}
                  style={{
                    height: 34,
                    padding: '0 14px',
                    background: '#FFFFFF',
                    color: '#1B2E5E',
                    border: '1px solid #1B2E5E',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <RotateCcw size={13} />
                  Réinitialiser
                </button>
              </div>
            </div>
            
            {/* Results bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#64748B' }}>{filteredFlux.length} résultat(s) trouvé(s)</span>
                {pendingFlux.length > 0 && canDoAction('canValidateFlux') && (
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    background: '#FEF3C7',
                    color: '#D97706',
                    border: '1px solid #FCD34D'
                  }}>
                    ● {pendingFlux.length} en attente
                  </span>
                )}
                {duplicateFlux.length > 0 && (
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    background: '#FEF9C3',
                    color: '#854D0E',
                    border: '1px solid #FDE047'
                  }}>
                    ⚠ {duplicateFlux.length} doublon(s)
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                {canDoAction('canDeclareFlux') && (
                  <button
                    onClick={() => setDrawer({ open: true, mode: 'create', data: null, type: 'flux' })}
                    style={{
                      height: 34,
                      padding: '0 16px',
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Plus size={14} />
                    Ajouter un flux
                  </button>
                )}
                
                {canDoAction('canExport') && (
                  <>
                    <button
                      onClick={() => handleExport('flux_excel', 'flux_declares.csv', generateCSV_flux())}
                      disabled={loadingExports['flux_excel']}
                      style={{
                        height: 34,
                        padding: '0 12px',
                        background: '#FFFFFF',
                        color: '#1B2E5E',
                        border: '1px solid #1B2E5E',
                        borderRadius: 6,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Download size={14} />
                      {loadingExports['flux_excel'] ? 'Export...' : 'Excel'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Table */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', height: 40 }}>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Référence</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Compte</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Source</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Certitude</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sens</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contrepartie</th>
                    <th style={{ padding: '0 12px', textAlign: 'right', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Montant</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date prév.</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Statut</th>
                    <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFlux.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: 40, textAlign: 'center' }}>
                        <FileX size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                        <div style={{ color: '#64748B', fontSize: 14 }}>Aucun résultat pour ces filtres</div>
                        <button
                          onClick={handleFluxReset}
                          style={{ marginTop: 12, background: 'none', border: 'none', color: '#3B6FD4', cursor: 'pointer', fontSize: 13 }}
                        >
                          Réinitialiser les filtres
                        </button>
                      </td>
                    </tr>
                  ) : (
                    paginatedFlux.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #DDE3EF', height: 44 }}>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {f.reference}
                            {f.is_duplicate && (
                              <span title="Ce flux est similaire à un autre. Vérifiez avant de valider." style={{ color: '#D97706' }}>
                                <AlertTriangle size={14} />
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>
                          <div style={{ fontSize: 12 }}>{f.account_number.slice(-8)}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{userComptes.find(c => c.account_number === f.account_number)?.banque}</div>
                        </td>
                        <td style={{ padding: '0 12px' }}><StatusBadge type="source" value={f.source} /></td>
                        <td style={{ padding: '0 12px' }}><StatusBadge type="certitude" value={f.certitude} /></td>
                        <td style={{ padding: '0 12px' }}><StatusBadge type="sens" value={f.sens} /></td>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>{f.contrepartie}</td>
                        <td style={{ padding: '0 12px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>
                          {f.montant.toLocaleString('fr-FR')} {f.devise}
                        </td>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>{new Date(f.date_previsionnelle).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding: '0 12px' }}><StatusBadge type="statut" value={f.statut} /></td>
                        <td style={{ padding: '0 12px' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                            <button
                              onClick={() => setDrawer({ open: true, mode: 'view', data: f, type: 'flux' })}
                              style={{
                                width: 28,
                                height: 28,
                                border: 'none',
                                borderRadius: 6,
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Eye size={16} color="#64748B" />
                            </button>
                            {canDoAction('canValidateFlux') && f.statut === 'EN_ATTENTE' && (
                              <>
                                <button
                                  onClick={() => {
                                    setFlux(p => p.map(x => x.id === f.id ? { ...x, statut: 'VALIDE' } : x))
                                    addToast('Flux validé avec succès')
                                  }}
                                  style={{
                                    width: 28,
                                    height: 28,
                                    border: 'none',
                                    borderRadius: 6,
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Check size={16} color="#16A34A" />
                                </button>
                                <button
                                  onClick={() => {
                                    setModal({
                                      open: true,
                                      title: 'Rejeter le flux',
                                      message: `Êtes-vous sûr de vouloir rejeter le flux ${f.reference} ?`,
                                      onConfirm: () => {
                                        setFlux(p => p.map(x => x.id === f.id ? { ...x, statut: 'REJETE' } : x))
                                        addToast('Flux rejeté')
                                        setModal(p => ({ ...p, open: false }))
                                      },
                                      danger: true
                                    })
                                  }}
                                  style={{
                                    width: 28,
                                    height: 28,
                                    border: 'none',
                                    borderRadius: 6,
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <X size={16} color="#DC2626" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination */}
              {filteredFlux.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderTop: '1px solid #DDE3EF'
                }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    Affichage {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, filteredFlux.length)} sur {filteredFlux.length} résultats
                  </span>
                  
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        background: 'transparent',
                        color: currentPage === 1 ? '#94A3B8' : '#1E293B',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: 13
                      }}
                    >
                      Précédent
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        style={{
                          width: 28,
                          height: 28,
                          border: 'none',
                          borderRadius: 4,
                          background: currentPage === p ? '#1B2E5E' : 'transparent',
                          color: currentPage === p ? '#FFFFFF' : '#1E293B',
                          cursor: 'pointer',
                          fontSize: 13
                        }}
                      >
                        {p}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: 4,
                        background: 'transparent',
                        color: currentPage === totalPages ? '#94A3B8' : '#1E293B',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: 13
                      }}
                    >
                      Suivant
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Lignes par page</span>
                    <select
                      value={pageSize}
                      onChange={e => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      style={{ height: 28, border: '1px solid #DDE3EF', borderRadius: 4, fontSize: 12 }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      // ============== PREVISION ==============
      case 'prevision':
        const previsionFluxFiltres = flux
          .filter(f => previsionComptes.includes(f.account_number))
          .sort((a, b) => new Date(a.date_previsionnelle).getTime() - new Date(b.date_previsionnelle).getTime())
        const previsionCatData = (() => {
          const filtered = catFilters.sens === 'ALL' ? previsionFluxFiltres : previsionFluxFiltres.filter(f => f.sens === catFilters.sens)
          const cats = [...new Set(filtered.map(f => f.categorie).filter(Boolean))]
          const totalEnc = filtered.filter(f => f.sens === 'ENCAISSEMENT').reduce((s, f) => s + f.montant, 0)
          return cats.map(cat => {
            const fCat = filtered.filter(f => f.categorie === cat)
            const enc = fCat.filter(f => f.sens === 'ENCAISSEMENT').reduce((s, f) => s + f.montant, 0)
            const dec = fCat.filter(f => f.sens === 'DECAISSEMENT').reduce((s, f) => s + f.montant, 0)
            const budget = catBudgets[cat] || 0
            return { cat, nb: fCat.length, enc, dec, budget, ecart: enc - dec - budget, pct: totalEnc > 0 ? ((enc / totalEnc) * 100).toFixed(1) : '0.0', flux: fCat }
          })
        })()
        const previsionPieData = previsionCatData.map((d, i) => ({ name: d.cat, value: d.enc + d.dec, fill: ['#1B2E5E','#3B6FD4','#16A34A','#D97706','#7C3AED','#DC2626','#0891B2','#F59E0B'][i % 8] }))
        return (
          <div>
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Left panel - Configurator */}
              <div style={{ width: 280, flexShrink: 0 }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 10,
                  padding: 20,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2E5E', marginBottom: 16 }}>
                    PÉRIMÈTRE D&apos;ANALYSE
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 8 }}>
                      Comptes inclus
                    </label>
                    {userComptes.map(c => (
                      <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input type="checkbox" checked={previsionComptes.includes(c.account_number)} onChange={e => setPrevisionComptes(prev => e.target.checked ? [...prev, c.account_number] : prev.filter(x => x !== c.account_number))} />
                        {c.account_number.slice(-8)} | {c.devise}
                      </label>
                    ))}
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 8 }}>
                      Horizon
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[7, 30, 90].map(h => (
                        <button key={h} style={{
                          flex: 1,
                          height: 32,
                          border: previsionHorizon === h ? '2px solid #1B2E5E' : '1px solid #DDE3EF',
                          borderRadius: 6,
                          background: previsionHorizon === h ? '#EEF3FC' : '#FFFFFF',
                          color: previsionHorizon === h ? '#1B2E5E' : '#64748B',
                          fontSize: 12,
                          cursor: 'pointer'
                        }} onClick={() => setPrevisionHorizon(h)}>
                          {h}j
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 8 }}>
                      Scénario
                    </label>
                    {[{ key: 'pessimiste', label: 'Pessimiste' }, { key: 'realiste', label: 'Réaliste' }, { key: 'optimiste', label: 'Optimiste' }].map(s => (
                      <label key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input type="radio" name="scenario" checked={previsionScenario === s.key} onChange={() => setPrevisionScenario(s.key as any)} />
                        {s.label}
                      </label>
                    ))}
                  </div>
                  
                  <button onClick={computePrevision} style={{
                    width: '100%',
                    height: 34,
                    background: '#1B2E5E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    {previsionLoading ? 'Calcul en cours...' : 'Calculer la prévision'}
                  </button>
                  
                  <div style={{ marginTop: 12, fontSize: 11, color: '#64748B' }}>
                    Dernière mise à jour: il y a 2h
                  </div>
                </div>
              </div>
              
              {/* Right panel - Results */}
              <div style={{ flex: 1 }}>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                  <KPICard title="J+7" value={previsionData[6]?.solde_cloture || 0} suffix="MAD" />
                  <KPICard title="J+30" value={previsionData[29]?.solde_cloture || 0} suffix="MAD" />
                  <KPICard title="J+90" value={previsionData[89]?.solde_cloture || previsionData[previsionData.length - 1]?.solde_cloture || 0} suffix="MAD" />
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: 10,
                    padding: 20
                  }}>
                    <div style={{ fontSize: 12, color: '#92400E', marginBottom: 8 }}>Tension</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#D97706' }}>J+12</div>
                    <div style={{ fontSize: 11, color: '#92400E', marginTop: 8 }}>Seuil atteint</div>
                  </div>
                </div>
                
                {/* Chart */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 10,
                  padding: 20,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                      Prévision de trésorerie — {previsionScenario} — {previsionHorizon} jours
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      Zone colorée = intervalle pessimiste/optimiste
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={previsionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 11, fill: '#64748B' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={v => `${(v/1000000).toFixed(1)}M`}
                        label={{ value: 'Solde (MAD)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748B' } }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString('fr-FR') + ' MAD', '']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        contentStyle={{ borderRadius: 8, border: '1px solid #DDE3EF' }}
                      />
                      <Legend />
                      <Area dataKey="solde_cloture" name="Intervalle" fill="#3B6FD4" fillOpacity={0.1} stroke="none" />
                      <Line type="monotone" dataKey="solde_cloture" name="Solde projeté" stroke="#1B2E5E" strokeWidth={2} dot={false} />
                      <ReferenceLine y={300000} stroke="#D97706" strokeDasharray="3 3" label={{ value: 'Seuil alerte', position: 'right', fill: '#D97706', fontSize: 11 }} />
                      <ReferenceLine y={0} stroke="#DC2626" label={{ value: 'Zéro', position: 'right', fill: '#DC2626', fontSize: 11 }} />
                    </ComposedChart>
                  </ResponsiveContainer>

                  <div style={{
                    display: 'flex',
                    borderBottom: '2px solid #DDE3EF',
                    marginTop: 24,
                    marginBottom: 0,
                  }}>
                    {[
                      { key: 'graphique', label: '📊 Graphique' },
                      { key: 'tableau', label: '📋 Tableau' },
                      { key: 'flux', label: '📄 Flux Déclarés' },
                      { key: 'categories', label: '🏷️ Analyse par Catégorie' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setPrevisionSubTab(tab.key as any)}
                        style={{
                          padding: '10px 16px',
                          fontSize: 13,
                          fontWeight: previsionSubTab === tab.key ? 600 : 500,
                          color: previsionSubTab === tab.key ? '#1B2E5E' : '#94A3B8',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: previsionSubTab === tab.key ? '2px solid #1B2E5E' : '2px solid transparent',
                          marginBottom: -2,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 150ms',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: 16 }}>
                    {previsionSubTab === 'graphique' && <div style={{ fontSize: 12, color: '#64748B' }}>Vue graphique active.</div>}

                    {previsionSubTab === 'tableau' && (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: '#F1F5F9' }}>
                            {['Date', 'Ouverture', 'Encaissements', 'Décaissements', 'Clôture', 'Santé'].map(col => (
                              <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previsionData.slice(0, 12).map((r, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #DDE3EF' }}>
                              <td style={{ padding: '8px 10px' }}>{r.date}</td>
                              <td style={{ padding: '8px 10px' }}>{Number(r.solde_ouverture || 0).toLocaleString('fr-FR')}</td>
                              <td style={{ padding: '8px 10px', color: '#16A34A' }}>+{Number(r.enc_declares || 0).toLocaleString('fr-FR')}</td>
                              <td style={{ padding: '8px 10px', color: '#DC2626' }}>-{Number(r.dec_declares || 0).toLocaleString('fr-FR')}</td>
                              <td style={{ padding: '8px 10px', fontWeight: 600 }}>{Number(r.solde_cloture || 0).toLocaleString('fr-FR')}</td>
                              <td style={{ padding: '8px 10px' }}>{r.sante}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {previsionSubTab === 'flux' && (
                      <div>
                        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>{previsionFluxFiltres.length} flux pour les comptes sélectionnés dans la prévision</div>
                        {previsionFluxFiltres.length === 0 ? (
                          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
                            <FileText size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                            <div>Aucun flux pour les comptes sélectionnés</div>
                          </div>
                        ) : (
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                              <tr style={{ background: '#F1F5F9' }}>
                                {['Référence', 'Compte', 'Source', 'Certitude', 'Contrepartie', 'Montant', 'Date prév.', 'Statut'].map(col => (
                                  <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {previsionFluxFiltres.slice(0, 10).map(f => (
                                <tr key={f.id} style={{ borderBottom: '1px solid #DDE3EF', height: 44 }}>
                                  <td style={{ padding: '0 10px', fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{f.reference}</td>
                                  <td style={{ padding: '0 10px', fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>...{f.account_number.slice(-6)}</td>
                                  <td style={{ padding: '0 10px' }}><StatusBadge type="source" value={f.source} /></td>
                                  <td style={{ padding: '0 10px' }}><StatusBadge type="certitude" value={f.certitude} /></td>
                                  <td style={{ padding: '0 10px', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.contrepartie}</td>
                                  <td style={{ padding: '0 10px', fontWeight: 600, color: f.sens === 'ENCAISSEMENT' ? '#16A34A' : '#DC2626', whiteSpace: 'nowrap' }}>{f.sens === 'ENCAISSEMENT' ? '+' : '-'}{Number(f.montant).toLocaleString('fr-FR')} {f.devise}</td>
                                  <td style={{ padding: '0 10px', whiteSpace: 'nowrap', color: '#64748B' }}>{f.date_previsionnelle}</td>
                                  <td style={{ padding: '0 10px' }}><StatusBadge type="statut" value={f.statut} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {previsionSubTab === 'categories' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                          <label style={{ fontSize: 12, color: '#64748B' }}>Sens :</label>
                          <select value={catFilters.sens} onChange={e => setCatFilters(p => ({ ...p, sens: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13 }}>
                            <option value="ALL">Tous</option>
                            <option value="ENCAISSEMENT">Encaissements</option>
                            <option value="DECAISSEMENT">Décaissements</option>
                          </select>
                          <div style={{ marginLeft: 'auto' }}>
                            <button
                              disabled={!!loadingExports['cat_prev']}
                              onClick={() => handleExport('cat_prev', `categories_prevision_${new Date().toISOString().slice(0,10)}.csv`, ['Catégorie;Nb flux;Encaissements;Décaissements;Budget;Écart;Part (%)', ...previsionCatData.map(d => `${d.cat};${d.nb};${d.enc};${d.dec};${d.budget};${d.ecart};${d.pct}%`)].join('\n'))}
                              style={{ height: 34, padding: '0 14px', background: 'white', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                              {loadingExports['cat_prev'] ? 'Génération...' : '⬇ Exporter CSV'}
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ flex: '0 0 280px', background: 'white', borderRadius: 10, border: '1px solid #DDE3EF', padding: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Répartition par catégorie</div>
                            <ResponsiveContainer width="100%" height={180}>
                              <PieChart>
                                <Pie data={previsionPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={false} labelLine={false}>
                                  {previsionPieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [`${Number(v).toLocaleString('fr-FR')} MAD`, n as string]} contentStyle={{ fontSize: 12 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div style={{ flex: 1, overflow: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                              <thead>
                                <tr style={{ background: '#F1F5F9' }}>
                                  {['Catégorie', 'Nb flux', 'Encaissements', 'Décaissements', 'Budget', 'Écart', '%'].map(col => (
                                    <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, color: '#64748B', textTransform: 'uppercase' }}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {previsionCatData.map(row => (
                                  <tr key={row.cat} style={{ borderBottom: '1px solid #DDE3EF' }}>
                                    <td style={{ padding: '8px 10px', fontWeight: 500 }}>{row.cat}</td>
                                    <td style={{ padding: '8px 10px', color: '#64748B' }}>{row.nb}</td>
                                    <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: 600 }}>{row.enc > 0 ? `+${Number(row.enc).toLocaleString('fr-FR')}` : '—'}</td>
                                    <td style={{ padding: '8px 10px', color: '#DC2626', fontWeight: 600 }}>{row.dec > 0 ? `-${Number(row.dec).toLocaleString('fr-FR')}` : '—'}</td>
                                    <td style={{ padding: '8px 10px' }}>
                                      <span onClick={() => {
                                        const value = prompt('Budget mensuel', String(row.budget || ''))
                                        if (value !== null) setCatBudgets(prev => ({ ...prev, [row.cat]: Number(value || 0) }))
                                      }} style={{ cursor: 'text', color: row.budget ? '#1E293B' : '#94A3B8', textDecoration: 'underline dotted' }}>
                                        {row.budget > 0 ? Number(row.budget).toLocaleString('fr-FR') : 'Cliquez pour saisir'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '8px 10px', fontWeight: 600, color: row.ecart >= 0 ? '#16A34A' : '#DC2626' }}>{row.ecart >= 0 ? '+' : ''}{Number(row.ecart).toLocaleString('fr-FR')}</td>
                                    <td style={{ padding: '8px 10px', color: '#64748B' }}>{row.pct}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      // ============== ALERTES ==============
      case 'alertes':
        return (
          <div>
            <div style={{
              background: '#F8FAFC', border: '1px solid #DDE3EF', borderRadius: 8,
              padding: '12px 16px', display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap',
              marginBottom: 16,
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Compte</div>
                <select
                  value={alertePageFilters.account}
                  onChange={e => setAlertePageFilters(p => ({ ...p, account: e.target.value }))}
                  style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13, minWidth: 220, background: 'white' }}
                >
                  <option value="ALL">Tous les comptes</option>
                  {MOCK_COMPTES
                    .filter(c => currentUser?.entreprise_id ? c.entreprise_id === currentUser.entreprise_id : true)
                    .map(c => (
                      <option key={c.account_number} value={c.account_number}>
                        {c.account_number} | {c.banque.split(' ')[0]} | {c.devise}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Type d&apos;alerte</div>
                <select
                  value={alertePageFilters.type}
                  onChange={e => setAlertePageFilters(p => ({ ...p, type: e.target.value }))}
                  style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13, minWidth: 180, background: 'white' }}
                >
                  <option value="ALL">Tous les types</option>
                  <option value="SOLDE_BAS">Solde bas</option>
                  <option value="TENSION_PREVISIONNELLE">Tension prévisionnelle</option>
                  <option value="FLUX_NON_RAPPROCHE">Flux non rapproché</option>
                  <option value="ECART_CHANGE">Écart de change</option>
                  <option value="ECHEANCE_FLUX">Échéance flux</option>
                </select>
              </div>

              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Statut</div>
                <select
                  value={alertePageFilters.statut}
                  onChange={e => setAlertePageFilters(p => ({ ...p, statut: e.target.value as 'active' | 'dismissed' | 'ALL' }))}
                  style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13, minWidth: 150, background: 'white' }}
                >
                  <option value="active">Actives</option>
                  <option value="dismissed">Dismissées</option>
                  <option value="ALL">Toutes</option>
                </select>
              </div>

              <button
                onClick={() => setAlertePageFiltersApplied({ ...alertePageFilters })}
                style={{ height: 34, padding: '0 16px', background: '#1B2E5E', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Search size={13} /> Rechercher
              </button>
              <button
                onClick={() => {
                  const reset = { account: 'ALL', type: 'ALL', statut: 'active' as 'active' | 'dismissed' | 'ALL' }
                  setAlertePageFilters(reset)
                  setAlertePageFiltersApplied(reset)
                }}
                style={{ height: 34, padding: '0 14px', background: 'white', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <RotateCcw size={13} /> Réinitialiser
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              {alertesFiltrees.length} alerte(s) trouvée(s)
              {alertePageFiltersApplied.account !== 'ALL' && (
                <span style={{ marginLeft: 8, padding: '2px 8px', background: '#EEF3FC', color: '#3B6FD4', borderRadius: 4, fontSize: 11 }}>
                  Compte : ...{alertePageFiltersApplied.account.slice(-6)}
                </span>
              )}
            </div>
            
            {/* Alerts list */}
            {alertesFiltrees.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 60,
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <CheckCircle size={48} color="#16A34A" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 16, color: '#1E293B', fontWeight: 600 }}>Aucune alerte active</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>
                  {alertePageFiltersApplied.account !== 'ALL' ? 'pour ce compte' : 'pour les filtres sélectionnés'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alertesFiltrees.map(a => {
                  const iconMap: Record<string, typeof AlertTriangle> = {
                    SOLDE_BAS: AlertTriangle,
                    TENSION_PREVISIONNELLE: TrendingDown,
                    FLUX_NON_RAPPROCHE: RefreshCw,
                    ECART_CHANGE: Globe,
                    ECHEANCE_FLUX: Clock
                  }
                  const colorMap: Record<string, string> = {
                    CRITICAL: '#DC2626',
                    WARNING: '#D97706',
                    INFO: '#3B6FD4'
                  }
                  const Icon = iconMap[a.type] || AlertTriangle
                  const color = colorMap[a.severity] || '#D97706'
                  
                  return (
                    <div key={a.id} style={{
                      background: '#FFFFFF',
                      borderRadius: 10,
                      padding: 16,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                      borderLeft: `4px solid ${color}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16
                    }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: color + '15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} color={color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{a.titre}</div>
                            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{a.account_number}</div>
                          </div>
                          <button
                            onClick={() => {
                              setAlertes(p => p.map(x => x.id === a.id ? { ...x, dismissed: true } : x))
                              setUnreadCount(p => Math.max(0, p - 1))
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>{a.message}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>{new Date(a.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      
      // ============== BANK DASHBOARD ==============
      case 'dashboard_banque':
        const totalClients = entreprises.filter(e => e.statut === 'ACTIF').length
        const totalEncours = entreprises.reduce((sum, e) => sum + e.solde_consolide_mad, 0)
        const clientsEnAlerte = entreprises.filter(e => e.nb_alertes > 0).length
        
        return (
          <div>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <KPICard title="Clients actifs" value={totalClients} />
              <KPICard title="Encours total MAD" value={totalEncours} />
              <KPICard title="Clients en alerte" value={clientsEnAlerte} />
              <KPICard title="Rapprochements en attente" value={5} />
            </div>
            
            {/* Alerts section */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                ALERTES ET URGENCES
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
                Situations nécessitant une attention immédiate
              </div>
              
              {alertes.filter(a => !a.dismissed).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: '#16A34A' }}>
                  <CheckCircle size={32} style={{ marginBottom: 8 }} />
                  <div>Aucune situation critique — tous les clients sont nominaux</div>
                </div>
              ) : (
                alertes.filter(a => !a.dismissed).map(alerte => {
                  const compteEntrepriseId = MOCK_COMPTES.find(c => c.account_number === alerte.account_number)?.entreprise_id
                  const entrepriseLiee = entreprises.find(e => e.id === compteEntrepriseId)
                  if (!entrepriseLiee) return null
                  return (
                  <div key={alerte.id} style={{
                    padding: 12,
                    borderRadius: 8,
                    background: '#FEF3C7',
                    marginBottom: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#92400E' }}>{entrepriseLiee.nom}</div>
                      <div style={{ fontSize: 12, color: '#B45309' }}>{alerte.titre} • {alerte.account_number}</div>
                    </div>
                    <button
                      onClick={() => {
                        setDossierEntreprise(entrepriseLiee)
                        setDossierTab('alertes')
                        setDossierOpen(true)
                      }}
                      style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: '1px solid #D97706',
                      borderRadius: 6,
                      color: '#D97706',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}>
                      → Voir
                    </button>
                  </div>
                )})
              )}
            </div>
            
            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
                  Flux en attente par entreprise
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={entreprises.filter(e => e.flux_en_attente > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="nom" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="flux_en_attente" fill="#D97706" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
                  Encours par client (MAD)
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={entreprises} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                    <YAxis dataKey="nom" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={120} />
                    <Tooltip formatter={(value: number) => [value.toLocaleString('fr-FR') + ' MAD', 'Solde']} />
                    <Bar dataKey="solde_consolide_mad" fill="#3B6FD4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
      
      // ============== ENTREPRISES (BANQUE) ==============
      case 'entreprises':
        return (
          <div>
            {/* Filter Zone */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #DDE3EF',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Rechercher</label>
                  <input
                    type="text"
                    placeholder="Nom ou code..."
                    value={entrepriseFilters.search}
                    onChange={e => setEntrepriseFilters(p => ({ ...p, search: e.target.value }))}
                    style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Segment</label>
                  <select value={entrepriseFilters.segment} onChange={e => setEntrepriseFilters(p => ({ ...p, segment: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                    <option value="ALL">Tous</option>
                    <option value="PME">PME</option>
                    <option value="CORPORATE">CORPORATE</option>
                  </select>
                </div>
                <button onClick={() => setEntrepriseFiltersApplied({ ...entrepriseFilters })} style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#1B2E5E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Search size={14} />
                  Rechercher
                </button>
                <button onClick={() => { const e = { search: '', segment: 'ALL' }; setEntrepriseFilters(e); setEntrepriseFiltersApplied(e) }} style={{ height: 34, padding: '0 14px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <RotateCcw size={13} /> Réinitialiser
                </button>
              </div>
            </div>
            
            {/* Results bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>{entreprisesFiltered.length} entreprise(s)</span>
              <button
                onClick={() => handleExport('entreprises', 'entreprises.csv', 'Nom;Code;Segment;Solde;Alertes;Statut\n' + entreprisesFiltered.map(e => `${e.nom};${e.client_code};${e.segment};${e.solde_consolide_mad};${e.nb_alertes};${e.statut}`).join('\n'))}
                style={{
                  height: 34,
                  padding: '0 12px',
                  background: '#FFFFFF',
                  color: '#1B2E5E',
                  border: '1px solid #1B2E5E',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Download size={14} />
                Exporter CSV
              </button>
            </div>
            
            {/* Table */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', height: 40 }}>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Entreprise</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Code</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Segment</th>
                    <th style={{ padding: '0 12px', textAlign: 'right', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Solde MAD</th>
                    <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Flux attente</th>
                    <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Alertes</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Statut</th>
                    <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', width: 80 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entreprisesFiltered.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #DDE3EF', height: 44 }}>
                      <td style={{ padding: '0 12px', fontSize: 13, fontWeight: 500 }}>{e.nom}</td>
                      <td style={{ padding: '0 12px', fontSize: 13, color: '#64748B' }}>{e.client_code}</td>
                      <td style={{ padding: '0 12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: e.segment === 'CORPORATE' ? '#EEF3FC' : '#F1F5F9',
                          color: e.segment === 'CORPORATE' ? '#3B6FD4' : '#64748B'
                        }}>
                          {e.segment}
                        </span>
                      </td>
                      <td style={{ padding: '0 12px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>{e.solde_consolide_mad.toLocaleString('fr-FR')}</td>
                      <td style={{ padding: '0 12px', textAlign: 'center' }}>
                        {e.flux_en_attente > 0 && (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#FEF3C7',
                            color: '#D97706'
                          }}>
                            {e.flux_en_attente}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0 12px', textAlign: 'center' }}>
                        {e.nb_alertes > 0 && (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#FEE2E2',
                            color: '#DC2626'
                          }}>
                            {e.nb_alertes}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0 12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: e.statut === 'ACTIF' ? '#DCFCE7' : '#FEF3C7',
                          color: e.statut === 'ACTIF' ? '#16A34A' : '#D97706'
                        }}>
                          {e.statut}
                        </span>
                      </td>
                      <td style={{ padding: '0 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setDossierEntreprise(e)
                            setDossierTab('overview')
                            setDossierOpen(true)
                          }}
                          style={{
                            height: 30,
                            padding: '0 12px',
                            background: '#FFFFFF',
                            color: '#1B2E5E',
                            border: '1px solid #DDE3EF',
                            borderRadius: 6,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Eye size={12} /> Voir dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      
      // ============== SUIVI DES COMPTES ==============
      case 'comptes':
        const comptesViewMode = 'table' as 'table' | 'chart'
        const selectedCompteFilter = compteFiltersApplied.account
        const filteredMouvements = compteMouvements.filter(m => 
          selectedCompteFilter === 'ALL' || m.account_number === selectedCompteFilter
        )
        
        // Calculate running balance
        let runningBalance = selectedCompteFilter !== 'ALL' 
          ? (userComptes.find(c => c.account_number === selectedCompteFilter)?.solde || 0)
          : userComptes.reduce((sum, c) => sum + c.solde, 0)
        
        const mouvementsWithBalance = filteredMouvements.map(m => {
          const impact = m.sens === 'CREDIT' ? m.montant : -m.montant
          runningBalance += impact
          return { ...m, solde_progressif: runningBalance - impact }
        }).reverse()
        
        return (
          <div>
            {/* Filter Zone */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #DDE3EF',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Compte *</label>
                  <select
                    value={compteFilters.account}
                    onChange={e => setCompteFilters(p => ({ ...p, account: e.target.value }))}
                    style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, minWidth: 280 }}
                  >
                    <option value="ALL">Tous les comptes</option>
                    {userComptes.map(c => (
                      <option key={c.id} value={c.account_number}>{c.account_number} | {c.banque} | {c.devise}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Date début</label>
                  <input type="date" value={compteFilters.dateFrom} onChange={e => setCompteFilters(p => ({ ...p, dateFrom: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Date fin</label>
                  <input type="date" value={compteFilters.dateTo} onChange={e => setCompteFilters(p => ({ ...p, dateTo: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Type</label>
                  <select value={compteFilters.typeOp} onChange={e => setCompteFilters(p => ({ ...p, typeOp: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                    <option value="ALL">Tous</option>
                    <option value="DEBIT">Débit</option>
                    <option value="CREDIT">Crédit</option>
                  </select>
                </div>
                <button onClick={handleCompteSearch} style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#1B2E5E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Search size={14} />
                  Rechercher
                </button>
                <button onClick={handleCompteReset} style={{
                  height: 34,
                  padding: '0 14px',
                  background: '#FFFFFF',
                  color: '#1B2E5E',
                  border: '1px solid #1B2E5E',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap'
                }}>
                  <RotateCcw size={13} /> Réinitialiser
                </button>
              </div>
            </div>
            
            {/* Results bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>{filteredMouvements.length} opération(s)</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleExport('mouvements', 'mouvements_compte.csv', 
                    'Date;Libellé;Référence;Débit;Crédit;Solde\n' + 
                    filteredMouvements.map(m => 
                      `${m.date_operation};${m.libelle};${m.reference};${m.sens === 'DEBIT' ? m.montant : ''};${m.sens === 'CREDIT' ? m.montant : ''};`
                    ).join('\n')
                  )}
                  style={{
                    height: 34,
                    padding: '0 12px',
                    background: '#FFFFFF',
                    color: '#1B2E5E',
                    border: '1px solid #1B2E5E',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Download size={14} />
                  Excel
                </button>
              </div>
            </div>
            
            {/* Table */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              overflow: 'hidden',
              marginBottom: 24
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', height: 40 }}>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date opération</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date valeur</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Libellé</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Référence</th>
                    <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contrepartie</th>
                    <th style={{ padding: '0 12px', textAlign: 'right', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Débit</th>
                    <th style={{ padding: '0 12px', textAlign: 'right', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Crédit</th>
                    <th style={{ padding: '0 12px', textAlign: 'right', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {mouvementsWithBalance.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 40, textAlign: 'center' }}>
                        <Calendar size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                        <div style={{ color: '#64748B', fontSize: 14 }}>Aucune transaction sur cette période</div>
                      </td>
                    </tr>
                  ) : (
                    mouvementsWithBalance.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #DDE3EF', height: 44 }}>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>{new Date(m.date_operation).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>{new Date(m.date_valeur).toLocaleDateString('fr-FR')}</td>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>{m.libelle}</td>
                        <td style={{ padding: '0 12px', fontSize: 12, color: '#64748B' }}>{m.reference}</td>
                        <td style={{ padding: '0 12px', fontSize: 13 }}>{m.contrepartie}</td>
                        <td style={{ padding: '0 12px', fontSize: 13, textAlign: 'right', color: '#DC2626', fontWeight: 500 }}>
                          {m.sens === 'DEBIT' ? m.montant.toLocaleString('fr-FR') : ''}
                        </td>
                        <td style={{ padding: '0 12px', fontSize: 13, textAlign: 'right', color: '#16A34A', fontWeight: 500 }}>
                          {m.sens === 'CREDIT' ? m.montant.toLocaleString('fr-FR') : ''}
                        </td>
                        <td style={{ padding: '0 12px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>
                          {m.solde_progressif.toLocaleString('fr-FR')} MAD
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Balance evolution chart */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                  Évolution du solde {selectedCompteFilter !== 'ALL' ? `— ${selectedCompteFilter.slice(-8)}` : ''}
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Progression du solde sur la période sélectionnée
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={TIME_SERIES.slice(0, 30)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    tickFormatter={v => new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    tickFormatter={v => `${(v/1000000).toFixed(1)}M`}
                    label={{ value: 'Solde (MAD)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748B' } }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString('fr-FR') + ' MAD', 'Solde']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                    contentStyle={{ borderRadius: 8, border: '1px solid #DDE3EF' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="solde" name="Solde" stroke="#1B2E5E" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      
      // Helper: Calculer le score de rapprochement basé sur les critères ERP
      const computeMatchScore = (fluxItem: any, mouvement: any) => {
        const erpConfig = erpConfigs.find(c => c.entreprise_id === currentUser?.entreprise_id)
        if (!erpConfig || !erpConfig.criteres_rapprochement) {
          // Si pas de config ERP, utiliser logique simple
          return mouvement.statut_rapprochement === 'RAPPROCHE' ? 85 : (mouvement.statut_rapprochement === 'ANOMALIE' ? 30 : 0)
        }
        
        const criteres = erpConfig.criteres_rapprochement
        let score = 0
        let totalPoids = 0
        
        // Critère: Référence
        const refCrit = criteres.reference
        if (refCrit && refCrit.actif) {
          const refMatch = fluxItem.reference && mouvement.reference && 
            (fluxItem.reference.includes(mouvement.reference.slice(0, 8)) || mouvement.reference.includes(fluxItem.reference.slice(0, 8)))
          score += refMatch ? refCrit.poids : 0
          totalPoids += refCrit.poids
        }
        
        // Critère: Montant
        const montantCrit = criteres.montant
        if (montantCrit && montantCrit.actif) {
          const tolerancePct = montantCrit.tolerance_pct || 0
          const ecartPct = fluxItem.montant ? Math.abs((fluxItem.montant - mouvement.montant) / fluxItem.montant) * 100 : 100
          const montantMatch = ecartPct <= tolerancePct
          score += montantMatch ? montantCrit.poids : 0
          totalPoids += montantCrit.poids
        }
        
        // Critère: Date
        const dateCrit = criteres.date_facture
        if (dateCrit && dateCrit.actif) {
          const fluxDate = new Date(fluxItem.date_previsionnelle).getTime()
          const mouvDate = new Date(mouvement.date_valeur).getTime()
          const dayDiff = Math.abs((fluxDate - mouvDate) / (1000 * 60 * 60 * 24))
          const dateMatch = dayDiff <= (dateCrit.tolerance_jours || 2)
          score += dateMatch ? dateCrit.poids : 0
          totalPoids += dateCrit.poids
        }
        
        // Critère: Contrepartie
        const contrepartieCrit = criteres.contrepartie
        if (contrepartieCrit && contrepartieCrit.actif) {
          const contrMatch = fluxItem.contrepartie && mouvement.contrepartie && 
            (fluxItem.contrepartie.substring(0, 6) === mouvement.contrepartie.substring(0, 6))
          score += contrMatch ? contrepartieCrit.poids : 0
          totalPoids += contrepartieCrit.poids
        }
        
        // Normaliser le score
        return totalPoids > 0 ? Math.round((score / totalPoids) * 100) : 0
      }
      
      // ============== RAPPROCHEMENT BANCAIRE (DÉPRÉCIÉ) ==============
      case 'rapprochement_old':
        if (!isModuleActive('rapprochement')) {
          return (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 60,
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <Lock size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 16, color: '#1B2E5E', fontWeight: 600, marginBottom: 8 }}>Module non activé</div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Le module Rapprochement n&apos;est pas activé pour votre entreprise.</div>
              <button onClick={() => navigate('dashboard', ['Trésorerie', 'Tableau de bord'])} style={{ padding: '8px 16px', background: 'none', border: 'none', color: '#3B6FD4', fontSize: 13, cursor: 'pointer' }}>
                Retour au tableau de bord
              </button>
            </div>
          )
        }
        
        const rapprochementMouvements = mouvementsFiltres
        const rapproches = rapprochementMouvements.filter(m => m.statut_rapprochement === 'RAPPROCHE').length
        const nonRapproches = rapprochementMouvements.filter(m => m.statut_rapprochement === 'NON_RAPPROCHE').length
        const anomalies = rapprochementMouvements.filter(m => m.statut_rapprochement === 'ANOMALIE').length
        const tauxRapprochement = rapprochementMouvements.length > 0 ? Math.round((rapproches / rapprochementMouvements.length) * 100) : 0
        
        return (
          <div>
            {/* Info box */}
            <div style={{
              background: '#EEF3FC',
              border: '1px solid #3B6FD4',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <Info size={20} color="#3B6FD4" />
              <span style={{ fontSize: 13, color: '#1B2E5E' }}>
                Adria reçoit les relevés ERP via le protocole EBICS (format MT940/CAMT053) et les rapproche avec les mouvements réels du CBS.
              </span>
            </div>
            
            {/* Configuration Banner */}
            {currentUser?.role === 'CLIENT' && erpConfigs.length > 0 && (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: 8,
                padding: 12,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <Settings size={18} color="#16A34A" />
                  <div style={{ fontSize: 12, color: '#166534' }}>
                    <strong>Configuration active:</strong> Mode {erpConfigs[0]?.mode_echange || 'N/A'} • 
                    Critères rapprochement actifs • 
                    Rapprochement auto ≥ {erpConfigs[0]?.score_minimum_auto || 70}% • 
                    Suggestion ≥ {erpConfigs[0]?.score_minimum_suggestion || 40}%
                  </div>
                </div>
                <button
                  onClick={() => setErpConfigDrawer({open: true, entreprise: entreprises.find(e => e.id === erpConfigs[0]?.entreprise_id) || null})}
                  style={{
                    padding: '6px 12px',
                    background: '#FFFFFF',
                    border: '1px solid #86EFAC',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#166534',
                    cursor: 'pointer',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Modifier config
                </button>
              </div>
            )}
            
            {/* Filter Zone */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #DDE3EF',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Compte *</label>
                  <select
                    value={rapprochFilters.account}
                    onChange={e => setRapprochFilters(p => ({ ...p, account: e.target.value }))}
                    style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, minWidth: 280 }}
                  >
                    <option value="ALL">Tous les comptes</option>
                    {userComptes.map(c => (
                      <option key={c.id} value={c.account_number}>{c.account_number} | {c.banque} | {c.devise}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Statut</label>
                  <select value={rapprochFilters.statut} onChange={e => setRapprochFilters(p => ({ ...p, statut: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                    <option value="ALL">Tous</option>
                    <option value="RAPPROCHE">Rapproché</option>
                    <option value="NON_RAPPROCHE">Non rapproché</option>
                    <option value="ANOMALIE">Anomalie</option>
                  </select>
                </div>
                <button onClick={handleRapprochSearch} style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#1B2E5E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Search size={14} />
                  Rechercher
                </button>
                <button onClick={handleRapprochReset} style={{ height: 34, padding: '0 14px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <RotateCcw size={13} /> Réinitialiser
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#DCFCE7', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#16A34A' }}>{rapproches}</div>
                <div style={{ fontSize: 11, color: '#15803D' }}>Rapprochés</div>
              </div>
              <div style={{ background: '#FEF3C7', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#D97706' }}>{nonRapproches}</div>
                <div style={{ fontSize: 11, color: '#B45309' }}>Non rapprochés</div>
              </div>
              <div style={{ background: '#FEE2E2', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#DC2626' }}>{anomalies}</div>
                <div style={{ fontSize: 11, color: '#B91C1C' }}>Anomalies</div>
              </div>
              <div style={{ background: '#F1F5F9', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#64748B' }}>0</div>
                <div style={{ fontSize: 11, color: '#475569' }}>En attente</div>
              </div>
              <div style={{ background: '#EEF3FC', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#3B6FD4' }}>{tauxRapprochement}%</div>
                <div style={{ fontSize: 11, color: '#1E40AF' }}>Taux rapprochement</div>
              </div>
            </div>
            
            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              {/* Left - ERP Operations */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 16,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>
                  Opérations e-banking / ERP
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredFlux.slice(0, 5).map(f => (
                    <div key={f.id} style={{
                      padding: 12,
                      border: '1px solid #DDE3EF',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{f.reference}</span>
                        <StatusBadge type="source" value={f.source} />
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{f.contrepartie}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{f.montant.toLocaleString('fr-FR')} {f.devise}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right - CBS Movements */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 16,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>
                  Mouvements CBS (Relevé officiel)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rapprochementMouvements.slice(0, 5).map(m => (
                    <div key={m.id} style={{
                      padding: 12,
                      border: `2px solid ${m.statut_rapprochement === 'RAPPROCHE' ? '#16A34A' : m.statut_rapprochement === 'ANOMALIE' ? '#DC2626' : '#DDE3EF'}`,
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{m.libelle}</span>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          background: m.statut_rapprochement === 'RAPPROCHE' ? '#DCFCE7' : m.statut_rapprochement === 'ANOMALIE' ? '#FEE2E2' : '#FEF3C7',
                          color: m.statut_rapprochement === 'RAPPROCHE' ? '#16A34A' : m.statut_rapprochement === 'ANOMALIE' ? '#DC2626' : '#D97706'
                        }}>
                          {m.statut_rapprochement}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{m.contrepartie}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: m.sens === 'DEBIT' ? '#DC2626' : '#16A34A' }}>
                        {m.sens === 'DEBIT' ? '-' : '+'}{m.montant.toLocaleString('fr-FR')} MAD
                      </div>
                      {m.anomalie && (
                        <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4, background: '#FEE2E2', padding: '4px 8px', borderRadius: 4 }}>
                          {m.anomalie}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Anomalies section */}
            {anomalies > 0 && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626', marginBottom: 12 }}>
                  Anomalies détectées
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FEE2E2' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#B91C1C' }}>Référence</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#B91C1C' }}>Type anomalie</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#B91C1C' }}>Montant ERP</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#B91C1C' }}>Montant CBS</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#B91C1C' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rapprochementMouvements.filter(m => m.statut_rapprochement === 'ANOMALIE').map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #FEE2E2' }}>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>{m.reference}</td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#DC2626' }}>{m.anomalie}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right' }}>—</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right' }}>{m.montant.toLocaleString('fr-FR')} MAD</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => setJustifierModal({ open: true, anomalie: m })}
                            style={{ height: 28, padding: '0 10px', background: '#FFFFFF', border: '1px solid #3B6FD4', color: '#3B6FD4', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                          >
                            ✓ Justifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      
      // ============== MULTI-DEVISES ==============
      case 'multidevises':
        if (!isModuleActive('multidevises')) {
          return (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 60,
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <Lock size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 16, color: '#1B2E5E', fontWeight: 600, marginBottom: 8 }}>Module non activé</div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Le module Multi-devises n&apos;est pas activé pour votre entreprise.</div>
              <button onClick={() => navigate('dashboard', ['Trésorerie', 'Tableau de bord'])} style={{ padding: '8px 16px', background: 'none', border: 'none', color: '#3B6FD4', fontSize: 13, cursor: 'pointer' }}>
                Retour au tableau de bord
              </button>
            </div>
          )
        }
        
        // Calculate MAD equivalent for each account
        const comptesMAD = userComptes.map(c => {
          const taux = c.devise === 'MAD' ? 1 : (MOCK_TAUX.find(t => t.devise === c.devise)?.taux_achat || 1)
          return { ...c, solde_mad: c.solde * taux }
        })
        
        return (
          <div>
            {/* FX Rate Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {MOCK_TAUX.map(t => (
                <div key={t.devise} style={{
                  background: '#FFFFFF',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1B2E5E' }}>{t.devise}/MAD</span>
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      color: t.variation_24h >= 0 ? '#16A34A' : '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {t.variation_24h >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {t.variation_24h >= 0 ? '+' : ''}{t.variation_24h.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
                    {t.taux_achat.toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748B' }}>
                    <span>Achat: {t.taux_achat.toFixed(2)}</span>
                    <span>Vente: {t.taux_vente.toFixed(2)}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={t.historique_7j.map((v, i) => ({ day: i, value: v }))}>
                      <Line type="monotone" dataKey="value" stroke={t.variation_24h >= 0 ? '#16A34A' : '#DC2626'} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
            
            {/* Exposure Chart */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                  Exposition du portefeuille par compte (équivalent MAD)
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Chaque barre représente le solde converti en MAD au taux achat
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={comptesMAD} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={120} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString('fr-FR') + ' MAD', 'Équivalent MAD']} />
                  <Legend />
                  <Bar dataKey="solde_mad" name="Équivalent MAD" fill="#3B6FD4" />
                  <ReferenceLine x={300000} stroke="#DC2626" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Payment Simulator */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>
                Simulateur de paiement
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Type</label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                      <input type="radio" name="paymentType" checked={mdSimulateur.typeOp === 'PAIEMENT'} onChange={() => setMdSimulateur(p => ({ ...p, typeOp: 'PAIEMENT' }))} />
                      Paiement (décaissement)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                      <input type="radio" name="paymentType" checked={mdSimulateur.typeOp === 'ENCAISSEMENT'} onChange={() => setMdSimulateur(p => ({ ...p, typeOp: 'ENCAISSEMENT' }))} />
                      Encaissement
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Montant</label>
                  <input type="number" value={mdSimulateur.montant} onChange={e => setMdSimulateur(p => ({ ...p, montant: Number(e.target.value || 0) }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, width: 120 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Devise</label>
                  <select value={mdSimulateur.devise} onChange={e => setMdSimulateur(p => ({ ...p, devise: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <button onClick={handleMdAnalyse} disabled={mdAnalyseLoading} style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#1B2E5E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: mdAnalyseLoading ? 0.8 : 1
                }}>
                  {mdAnalyseLoading ? <><Loader2 size={13} className="spin" /> Analyse...</> : <><Play size={13} /> Analyser</>}
                </button>
              </div>
              
              {/* Simulation results */}
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
                {!mdAnalyseDone ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, color: '#94A3B8' }}>
                    <TrendingUp size={30} style={{ marginBottom: 8, opacity: 0.35 }} />
                    <div style={{ fontSize: 13 }}>Lancez une analyse pour obtenir les recommandations</div>
                  </div>
                ) : (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Compte</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Devise</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748B' }}>Coût spread</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748B' }}>Solde après</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#64748B' }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mdResultats.map((r, i) => (
                          <tr key={r.compte.id} style={{ background: i === 0 ? '#DCFCE7' : 'transparent', transition: 'all .25s ease' }}>
                            <td style={{ padding: '10px 12px', fontSize: 13 }}>{r.compte.account_number.slice(-8)}</td>
                            <td style={{ padding: '10px 12px', fontSize: 13 }}>{r.compte.devise}</td>
                            <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right' }}>{r.coutSpread.toLocaleString('fr-FR')}</td>
                            <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right' }}>{r.soldeApres.toLocaleString('fr-FR')}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span style={{ color: r.impactSeuil === 'OK' ? '#16A34A' : r.impactSeuil === 'SOUS_SEUIL' ? '#D97706' : '#DC2626', fontWeight: 600 }}>
                                {i === 0 ? 'Recommandé' : r.impactSeuil}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {mdSimulationHistory.length > 0 && (
                      <div style={{ marginTop: 12, fontSize: 11, color: '#64748B' }}>
                        Dernière simulation: {mdSimulationHistory[0].date} — Compte recommandé: {mdSimulationHistory[0].recommande?.slice(-8)}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      
      // ============== INTERFACE ERP/EBICS ==============
      case 'erp':
        return (
          <div>
            {/* Architecture diagram */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                Architecture de communication EBICS
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>
                Flux de données sécurisé entre votre ERP et le Core Banking System
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0' }}>
                {[
                  { name: 'ERP', sub: 'Sage X3 / SAP', status: 'ok' },
                  { name: 'EBICS Gateway', sub: 'Sécurisé', status: 'ok' },
                  { name: 'Adria Middleware', sub: 'Trésorerie', status: 'ok' },
                  { name: 'CBS Banque', sub: 'CoreBank', status: 'ok' }
                ].map((box, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      background: '#F8FAFC',
                      border: '2px solid #DDE3EF',
                      borderRadius: 8,
                      padding: 16,
                      textAlign: 'center',
                      minWidth: 120
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2E5E' }}>{box.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{box.sub}</div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
                        <span style={{ fontSize: 10, color: '#16A34A' }}>Opérationnel</span>
                      </div>
                    </div>
                    {i < 3 && (
                      <div style={{ color: '#3B6FD4' }}>
                        <ArrowUpRight size={24} style={{ transform: 'rotate(45deg)' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ background: '#EEF3FC', padding: '8px 12px', borderRadius: 6, fontSize: 11, color: '#1B2E5E' }}>
                  <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  EBICS H004/H005 — Protocole bancaire sécurisé
                </div>
                <div style={{ background: '#EEF3FC', padding: '8px 12px', borderRadius: 6, fontSize: 11, color: '#1B2E5E' }}>
                  <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />
                  MT940/CAMT053 — Standards ISO relevés bancaires
                </div>
                <div style={{ background: '#EEF3FC', padding: '8px 12px', borderRadius: 6, fontSize: 11, color: '#1B2E5E' }}>
                  <RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Adria Middleware — Transformation et validation
                </div>
              </div>
            </div>
            
            {/* Connection status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>Configuration</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Host CBS</span>
                    <span style={{ fontSize: 13, color: '#1E293B' }}>cbs.creditagricole.ma</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Port</span>
                    <span style={{ fontSize: 13, color: '#1E293B' }}>443</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Protocole</span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#1B2E5E', color: '#FFFFFF' }}>EBICS H004</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Format</span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>MT940</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Certificat client</span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#DCFCE7', color: '#16A34A' }}>Valide (15/01/2026)</span>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>Santé temps réel</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Statut</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
                      <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 500 }}>Connecté</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Dernière synchro</span>
                    <span style={{ fontSize: 13, color: '#1E293B' }}>Aujourd&apos;hui à 08:14</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Uptime 30j</span>
                    <span style={{ fontSize: 13, color: '#1E293B' }}>99.8%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Temps réponse</span>
                    <span style={{ fontSize: 13, color: '#1E293B' }}>342ms</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button
                    onClick={() => addToast('Connexion EBICS active — Ping: 32ms — Certificat valide')}
                    style={{
                      flex: 1,
                      height: 34,
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Tester la connexion
                  </button>
                  <button
                    onClick={() => addToast('24 enregistrements importés')}
                    style={{
                      flex: 1,
                      height: 34,
                      background: '#FFFFFF',
                      color: '#1B2E5E',
                      border: '1px solid #1B2E5E',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Resynchroniser
                  </button>
                </div>
              </div>
            </div>
            
            {/* Import zone */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>Import manuel</div>
              <div style={{
                border: '2px dashed #DDE3EF',
                borderRadius: 8,
                padding: 32,
                textAlign: 'center',
                background: '#FAFBFF'
              }}>
                <Upload size={32} color="#94A3B8" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>
                  Glissez votre fichier MT940 ou CAMT053 ici
                </div>
                <button style={{
                  padding: '8px 16px',
                  background: '#FFFFFF',
                  color: '#1B2E5E',
                  border: '1px solid #1B2E5E',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: 'pointer'
                }}>
                  Parcourir les fichiers
                </button>
              </div>
            </div>
            
            {/* Sync history */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>Historique des synchronisations</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Date</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Heure</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Source CBS</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Format</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748B' }}>Enregistrements</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748B' }}>Durée (ms)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {cbsSyncs.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #DDE3EF' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13 }}>{s.date}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13 }}>{s.heure}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13 }}>{s.source}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>
                          {s.format}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right' }}>{s.nb_enregistrements}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, textAlign: 'right' }}>{s.duree_ms}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: s.statut === 'SUCCES' ? '#DCFCE7' : s.statut === 'ERREUR' ? '#FEE2E2' : '#FEF3C7',
                          color: s.statut === 'SUCCES' ? '#16A34A' : s.statut === 'ERREUR' ? '#DC2626' : '#D97706'
                        }}>
                          {s.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      
      // ============== REPORTING ==============
      case 'reporting':
        // CORRECTION 3 - Reporting with client and bank views
        const reportingView = currentUser?.role === 'BACKOFFICE_BANQUE' || currentUser?.role === 'ADMIN_BANQUE' ? 'banque' : 'client'
        
        if (reportingView === 'client') {
          return (
            <div>
              {/* Account selector */}
              <div style={{ marginBottom: 20 }}>
                <select
                  value={selectedReportAccount}
                  onChange={e => setSelectedReportAccount(e.target.value)}
                  style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, minWidth: 300 }}
                >
                  <option value="ALL">Tous les comptes</option>
                  {userComptes.map(c => (
                    <option key={c.id} value={c.account_number}>{c.account_number} | {c.banque} | {c.devise}</option>
                  ))}
                </select>
              </div>
              
              {/* Report cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {REPORT_DEFINITIONS.map(report => {
                  const Icon = report.icon
                  return (
                    <div key={report.key} style={{
                      background: '#FFFFFF',
                      borderRadius: 10,
                      padding: 20,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: '#EEF3FC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={20} color="#3B6FD4" />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{report.titre}</div>
                          <div style={{ fontSize: 12, color: '#64748B' }}>{report.description}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          disabled={!!loadingExports[`${report.key}_excel`]}
                          onClick={() => {
                            const csv = report.generator(selectedReportAccount)
                            handleExport(`${report.key}_excel`, `${report.key}_${selectedReportAccount}_${new Date().toISOString().slice(0,10)}.csv`, csv)
                          }}
                          style={{
                            flex: 1,
                            height: 32,
                            background: '#FFFFFF',
                            color: '#1B2E5E',
                            border: '1px solid #1B2E5E',
                            borderRadius: 6,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            opacity: loadingExports[`${report.key}_excel`] ? 0.7 : 1
                          }}
                        >
                          {loadingExports[`${report.key}_excel`] ? '⟳ Génération...' : <><Download size={12} /> Excel</>}
                        </button>
                        <button
                          disabled={!!loadingExports[`${report.key}_pdf`]}
                          onClick={() => {
                            const csv = report.generator(selectedReportAccount)
                            handleExport(`${report.key}_pdf`, `${report.key}_${selectedReportAccount}_${new Date().toISOString().slice(0,10)}.pdf`, csv)
                          }}
                          style={{
                            flex: 1,
                            height: 32,
                            background: '#FFFFFF',
                            color: '#1B2E5E',
                            border: '1px solid #1B2E5E',
                            borderRadius: 6,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            opacity: loadingExports[`${report.key}_pdf`] ? 0.7 : 1
                          }}
                        >
                          {loadingExports[`${report.key}_pdf`] ? '⟳ Génération...' : <><FileText size={12} /> PDF</>}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Custom report generator */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 10,
                padding: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>
                  Générateur de rapport personnalisé
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Type de rapport</label>
                      <select 
                        value={customReport.type}
                        onChange={e => setCustomReport(p => ({...p, type: e.target.value}))}
                        style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}
                      >
                        {REPORT_DEFINITIONS.map(r => (
                          <option key={r.key} value={r.key}>{r.titre}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Comptes inclus</label>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                          <input type="checkbox" checked={customReport.accounts.includes('ALL')} onChange={e => setCustomReport(p => ({...p, accounts: e.target.checked ? ['ALL'] : []}))} />
                          Tous
                        </label>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Format</label>
                      <select
                        value={customReport.format}
                        onChange={e => setCustomReport(p => ({...p, format: e.target.value}))}
                        style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}
                      >
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCustomReportLoading(true)
                      setTimeout(() => {
                        const def = REPORT_DEFINITIONS.find(r => r.key === customReport.type)
                        const csv = def?.generator(customReport.accounts.includes('ALL') ? 'ALL' : customReport.accounts[0])
                        if (csv) {
                          downloadFile(`rapport_${customReport.type}_${new Date().toISOString().slice(0,10)}.csv`, csv)
                          addToast(`✓ Rapport "${def?.titre}" généré et téléchargé`, 'success')
                        }
                        setCustomReportLoading(false)
                      }, 2000)
                    }}
                    style={{
                      height: 34,
                      padding: '0 16px',
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: 'pointer',
                      width: 'fit-content'
                    }}
                  >
                    {customReportLoading ? '⟳ Génération en cours...' : '▶ Générer le rapport'}
                  </button>
                </div>
              </div>
            </div>
          )
        } else {
          // Bank view
          return (
            <div>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Rapports générés ce mois', value: '47' },
                  { label: 'Exports Excel', value: '31' },
                  { label: 'Exports PDF', value: '16' },
                  { label: 'Données couvertes', value: '3 clients, 5 comptes' },
                ].map((kpi, i) => (
                  <div key={i} style={{
                    background: '#FFFFFF',
                    borderRadius: 10,
                    padding: 20,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                  }}>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{kpi.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#1B2E5E' }}>{kpi.value}</div>
                  </div>
                ))}
              </div>
              
              {/* Tabs: Par client / Consolidé */}
              <div style={{ borderBottom: '2px solid #DDE3EF', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 0 }}>
                  {[
                    { key: 'par_client', label: 'Par client' },
                    { key: 'consolide', label: 'Rapport consolidé' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setBankReportTab(tab.key as any)}
                      style={{
                        padding: '10px 16px',
                        background: 'none',
                        border: 'none',
                        borderBottom: bankReportTab === tab.key ? '2px solid #1B2E5E' : '2px solid transparent',
                        marginBottom: -2,
                        color: bankReportTab === tab.key ? '#1B2E5E' : '#64748B',
                        fontWeight: bankReportTab === tab.key ? 600 : 500,
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {bankReportTab === 'par_client' && (
                <div>
                  {/* Client selector */}
                  <div style={{ marginBottom: 20 }}>
                    <select
                      value={selectedReportClient || ''}
                      onChange={e => setSelectedReportClient(e.target.value)}
                      style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, minWidth: 300 }}
                    >
                      <option value="">-- Sélectionner un client --</option>
                      {entreprises.filter(e => e.statut === 'ACTIF').map(e => (
                        <option key={e.id} value={e.id}>{e.nom} ({e.client_code})</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedReportClient && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                      {REPORT_DEFINITIONS.slice(0, 6).map(report => {
                        const Icon = report.icon
                        return (
                          <div key={report.key} style={{
                            background: '#FFFFFF',
                            borderRadius: 10,
                            padding: 20,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                background: '#EEF3FC',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Icon size={20} color="#3B6FD4" />
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{report.titre}</div>
                                <div style={{ fontSize: 12, color: '#64748B' }}>{report.description}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => {
                                  const clientComptes = MOCK_COMPTES.filter(c => c.entreprise_id === selectedReportClient).map(c => c.account_number)
                                  const csv = report.generator(clientComptes[0] || 'ALL')
                                  handleExport(`${report.key}_client`, `${report.key}_${selectedReportClient}.csv`, csv)
                                }}
                                style={{
                                  flex: 1,
                                  height: 32,
                                  background: '#FFFFFF',
                                  color: '#1B2E5E',
                                  border: '1px solid #1B2E5E',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 4
                                }}
                              >
                                <Download size={12} /> Excel
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {bankReportTab === 'consolide' && (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 10,
                  padding: 20,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>
                    📊 Rapport consolidé multi-clients
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 8 }}>Inclure clients:</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {entreprises.filter(e => e.statut === 'ACTIF').map(e => (
                          <label key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                            <input type="checkbox" defaultChecked />
                            {e.nom}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        const csv = generateCSV_consolide()
                        handleExport('consolide_excel', `rapport_consolide_${new Date().toISOString().slice(0,10)}.csv`, csv)
                      }}
                      style={{
                        height: 34,
                        padding: '0 16px',
                        background: '#1B2E5E',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <Download size={14} /> Générer rapport consolidé Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        }
      
      // ============== PARAMETRAGE (ADMIN_CLIENT) ==============
      case 'parametrage':
        const PARAMETRAGE_TABS = [
          { key: 'utilisateurs', label: 'Utilisateurs' },
          { key: 'groupes', label: 'Groupes & Permissions' },
          { key: 'modules', label: 'Modules & Fonctionnalités' },
          { key: 'alertes_seuils', label: 'Alertes & Seuils' },
          { key: 'categories', label: 'Catégories' },
        ] as const
        
        return (
          <div>
            {/* Tabs */}
            <div style={{ borderBottom: '2px solid #DDE3EF', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {PARAMETRAGE_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setParametrageTab(tab.key)}
                    style={{
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      borderBottom: parametrageTab === tab.key ? '2px solid #1B2E5E' : '2px solid transparent',
                      marginBottom: -2,
                      color: parametrageTab === tab.key ? '#1B2E5E' : '#64748B',
                      fontWeight: parametrageTab === tab.key ? 600 : 500,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab: Utilisateurs */}
            {parametrageTab === 'utilisateurs' && (
              <div>
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #DDE3EF',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Rechercher</label>
                      <input type="text" value={userFilters.search} onChange={e => setUserFilters(p => ({ ...p, search: e.target.value }))} placeholder="Nom ou email..." style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Rôle</label>
                      <select value={userFilters.role} onChange={e => setUserFilters(p => ({ ...p, role: e.target.value }))} style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                        <option value="ALL">Tous</option>
                        <option value="TRESORIER">TRESORIER</option>
                        <option value="ADMIN_CLIENT">ADMIN_CLIENT</option>
                      </select>
                    </div>
                    <button onClick={() => setUserFiltersApplied({ ...userFilters })} style={{ height: 34, padding: '0 12px', background: '#1B2E5E', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Search size={14} /> Rechercher
                    </button>
                    <button onClick={() => { const e = { search: '', role: 'ALL', statut: 'ALL' }; setUserFilters(e); setUserFiltersApplied(e) }} style={{ height: 34, padding: '0 14px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      <RotateCcw size={13} /> Réinitialiser
                    </button>
                    <button
                      onClick={() => {
                        setUserFormData({ prenom: '', nom: '', email: '', role: 'TRESORIER', comptes: [] })
                        setUserDrawer({ open: true, mode: 'create', data: null })
                      }}
                      style={{
                      height: 34,
                      padding: '0 14px',
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <Plus size={13} />
                      Ajouter un utilisateur
                    </button>
                  </div>
                </div>
                
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9', height: 40 }}>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Nom</th>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Email</th>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Rôle</th>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Statut</th>
                        <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', width: 80 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersFiltres.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #DDE3EF', height: 44 }}>
                          <td style={{ padding: '0 12px', fontSize: 13, fontWeight: 500 }}>{u.nom}</td>
                          <td style={{ padding: '0 12px', fontSize: 13, color: '#64748B' }}>{u.email}</td>
                          <td style={{ padding: '0 12px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background: ROLE_COLORS[u.role],
                              color: '#FFFFFF'
                            }}>
                              {u.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '0 12px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              background: '#DCFCE7',
                              color: '#16A34A'
                            }}>
                              Actif
                            </span>
                          </td>
                          <td style={{ padding: '0 12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                              <button onClick={() => {
                                const parts = String(u.nom || '').split(' ')
                                const prenom = parts[0] || ''
                                const nom = parts.slice(1).join(' ') || ''
                                setUserFormData({ prenom, nom, email: u.email || '', role: u.role || 'TRESORIER', comptes: (u as any).comptes_accessibles || [] })
                                setUserDrawer({ open: true, mode: 'edit', data: u })
                              }} style={{ width: 28, height: 28, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                                <Edit size={16} color="#64748B" />
                              </button>
                              <button
                                onClick={() => openConfirmModal('Supprimer cet utilisateur ?', 'Cette action est irréversible. L\'utilisateur n\'aura plus accès à la plateforme.', () => {
                                  setUsersLocal(prev => prev.filter(x => x.id !== u.id))
                                  addToast('✓ Utilisateur supprimé', 'success')
                                  setModal(p => ({ ...p, open: false }))
                                }, true)}
                                style={{ width: 28, height: 28, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} color="#DC2626" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Tab: Groupes & Permissions */}
            {parametrageTab === 'groupes' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
                  {/* Groups list */}
                  <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>Groupes</div>
                      <button onClick={() => { setNewGroupeNom(''); setAddGroupeModal(true) }} style={{ height: 34, padding: '0 14px', background: '#1B2E5E', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Plus size={13} /> Ajouter un groupe
                      </button>
                    </div>
                    {groupes.map((groupe) => (
                      <div key={groupe.id} onClick={() => setSelectedGroupe(groupe.id)} style={{
                        padding: '10px 12px',
                        border: `1px solid ${selectedGroupe === groupe.id ? '#3B6FD4' : '#DDE3EF'}`,
                        borderLeft: `4px solid ${selectedGroupe === groupe.id ? groupe.couleur : 'transparent'}`,
                        borderRadius: 8,
                        marginBottom: 8,
                        cursor: 'pointer',
                        background: selectedGroupe === groupe.id ? '#EEF3FC' : '#FFFFFF'
                      }}>
                        <div style={{ fontSize: 13, fontWeight: selectedGroupe === groupe.id ? 600 : 500, color: selectedGroupe === groupe.id ? '#1B2E5E' : '#1E293B' }}>{groupe.label}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{groupe.id.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Permissions */}
                  <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>Permissions du groupe {groupes.find(g => g.id === selectedGroupe)?.label || 'Trésorier'}</div>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        background: groupeModified ? '#FEF3C7' : '#DCFCE7',
                        color: groupeModified ? '#92400E' : '#166534'
                      }}>
                        {groupeModified ? 'Modifié' : 'À jour'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { label: 'Déclarer des flux', key: 'canDeclareFlux', checked: true },
                        { label: 'Valider des flux', key: 'canValidateFlux', checked: false },
                        { label: 'Supprimer des flux', key: 'canDeleteFlux', checked: false },
                        { label: 'Importer ERP', key: 'canImportERP', checked: true },
                        { label: 'Importer Excel', key: 'canImportExcel', checked: true },
                        { label: 'Exporter des données', key: 'canExport', checked: true },
                        { label: 'Accès reporting', key: 'canAccessReporting', checked: true },
                        { label: 'Configurer les alertes', key: 'canConfigureAlertes', checked: true },
                        { label: 'Accès multi-devises', key: 'canAccessMultiDevises', checked: true },
                        { label: 'Accès rapprochement', key: 'canAccessRapprochement', checked: true },
                      ].map(perm => (
                        <label key={perm.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!groupePermissions[selectedGroupe ?? '']?.[perm.key]} onChange={() => handlePermissionToggle(selectedGroupe ?? '', perm.key)} style={{ width: 16, height: 16 }} />
                          <span style={{ fontSize: 13, color: '#1E293B' }}>{perm.label}</span>
                        </label>
                      ))}
                    </div>
                    <button onClick={handleSaveGroupePerms} disabled={!groupeModified} style={{
                      marginTop: 20,
                      height: 34,
                      padding: '0 16px',
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: groupeModified ? 'pointer' : 'not-allowed',
                      opacity: groupeModified ? 1 : 0.65
                    }}>
                      {groupeModified ? 'Enregistrer les permissions' : 'Permissions à jour'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab: Modules & Fonctionnalités */}
            {parametrageTab === 'modules' && (
              <div>
                <div style={{ background: '#EEF3FC', border: '1px solid #3B6FD4', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Info size={20} color="#3B6FD4" />
                  <span style={{ fontSize: 13, color: '#1B2E5E' }}>
                    Les modules actifs sont configurés par votre banque. Contactez votre conseiller pour modifier votre abonnement.
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[
                    { key: 'dashboard', label: 'Tableau de bord', desc: 'Vue consolidée de la trésorerie' },
                    { key: 'flux', label: 'Flux déclarés', desc: 'Gestion des flux prévisionnels' },
                    { key: 'prevision', label: 'Prévision', desc: 'Scénarios et projections' },
                    { key: 'rapprochement', label: 'Rapprochement', desc: 'Rapprochement ERP/CBS' },
                    { key: 'multidevises', label: 'Multi-devises', desc: 'Gestion des positions de change' },
                    { key: 'erp', label: 'Interface ERP/EBICS', desc: 'Intégration système bancaire' },
                    { key: 'alertes', label: 'Alertes', desc: 'Notifications et seuils' },
                    { key: 'reporting', label: 'Reporting', desc: 'Génération de rapports' },
                  ].map(mod => {
                    const isActive = isModuleActive(mod.key)
                    return (
                      <div key={mod.key} style={{
                        background: '#FFFFFF',
                        borderRadius: 10,
                        padding: 16,
                        border: isActive ? '2px solid #16A34A' : '1px solid #DDE3EF',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{mod.label}</div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            background: isActive ? '#DCFCE7' : '#F1F5F9',
                            color: isActive ? '#16A34A' : '#64748B'
                          }}>
                            {isActive ? 'ACTIF' : 'INACTIF'}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>{mod.desc}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Tab: Alertes & Seuils */}
            {parametrageTab === 'alertes_seuils' && (
              <div>
                <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>Configuration des seuils par compte</div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 700,
                      background: seuilModified ? '#FEF3C7' : '#DCFCE7',
                      color: seuilModified ? '#92400E' : '#166534'
                    }}>
                      {seuilModified ? 'Modifié' : 'À jour'}
                    </span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Compte</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Devise</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748B' }}>Seuil minimum</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748B' }}>Seuil critique</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#64748B' }}>Alerte email</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#64748B', width: 80 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seuils.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #DDE3EF' }}>
                          <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.account_number.slice(-8)} - {c.type}</td>
                          <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.devise}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <input
                              type="number"
                              value={c.seuil_min}
                              disabled={editingSeuil !== c.account_number}
                              onChange={e => handleSeuilChange(c.account_number, 'seuil_min', Number(e.target.value || 0))}
                              style={{ width: 100, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12, textAlign: 'right', background: editingSeuil === c.account_number ? '#FFFFFF' : '#F8FAFC' }}
                            />
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <input
                              type="number"
                              value={c.seuil_critique}
                              disabled={editingSeuil !== c.account_number}
                              onChange={e => handleSeuilChange(c.account_number, 'seuil_critique', Number(e.target.value || 0))}
                              style={{ width: 100, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12, textAlign: 'right', background: editingSeuil === c.account_number ? '#FFFFFF' : '#F8FAFC' }}
                            />
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={!!c.alerte_solde}
                              onChange={e => handleSeuilChange(c.account_number, 'alerte_solde', e.target.checked)}
                              style={{ width: 16, height: 16 }}
                            />
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => setEditingSeuil(editingSeuil === c.account_number ? null : c.account_number)}
                              style={{ background: 'none', border: 'none', color: '#3B6FD4', fontSize: 12, cursor: 'pointer' }}
                            >
                              {editingSeuil === c.account_number ? 'Terminer' : 'Modifier'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={handleSaveSeuils}
                    style={{
                      marginTop: 16,
                      height: 34,
                      padding: '0 16px',
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: seuilModified ? 'pointer' : 'not-allowed',
                      opacity: seuilModified ? 1 : 0.65
                    }}
                    disabled={!seuilModified}
                  >
                    {seuilModified ? 'Enregistrer les seuils' : 'Seuils à jour'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Tab: Catégories */}
            {parametrageTab === 'categories' && (
              <div>
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #DDE3EF',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Nouvelle catégorie</label>
                      <input value={newCatNom} onChange={e => setNewCatNom(e.target.value)} type="text" placeholder="Nom de la catégorie..." style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                    </div>
                    <div style={{ width: 190 }}>
                      <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Sens</label>
                      <select value={newCatSens} onChange={e => setNewCatSens(e.target.value as 'DECAISSEMENT' | 'ENCAISSEMENT')} style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                        <option value="ENCAISSEMENT">Encaissement</option>
                        <option value="DECAISSEMENT">Décaissement</option>
                      </select>
                    </div>
                    <button onClick={handleAddCategory} disabled={!newCatNom.trim()} style={{
                      height: 34,
                      padding: '0 16px',
                      background: '#1B2E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: newCatNom.trim() ? 'pointer' : 'not-allowed',
                      opacity: newCatNom.trim() ? 1 : 0.65,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <Plus size={14} />
                      Ajouter
                    </button>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: editingCat ? '#D97706' : '#64748B' }}>
                    {editingCat ? 'Édition en cours — validez ou annulez la modification.' : 'Les ajouts/suppressions sont appliqués immédiatement.'}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#16A34A', marginBottom: 12 }}>Catégories Encaissement</div>
                    {categories.filter(cat => cat.sens === 'ENCAISSEMENT').map(cat => (
                      <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9', gap: 8 }}>
                        {editingCat === cat.id ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                            <input value={editCatNom} onChange={e => setEditCatNom(e.target.value)} style={{ flex: 1, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12 }} />
                            <select value={editCatSens} onChange={e => setEditCatSens(e.target.value as 'DECAISSEMENT' | 'ENCAISSEMENT')} style={{ height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12 }}>
                              <option value="ENCAISSEMENT">Enc.</option>
                              <option value="DECAISSEMENT">Déc.</option>
                            </select>
                            <button onClick={handleSaveCategory} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><Check size={14} color="#16A34A" /></button>
                            <button onClick={() => setEditingCat(null)} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><X size={14} color="#64748B" /></button>
                          </div>
                        ) : (
                          <>
                            <span style={{ fontSize: 13 }}>{cat.nom}</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleStartEditCategory(cat)} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><Edit size={14} color="#64748B" /></button>
                              <button onClick={() => handleDeleteCategory(cat)} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><Trash2 size={14} color="#DC2626" /></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626', marginBottom: 12 }}>Catégories Décaissement</div>
                    {categories.filter(cat => cat.sens === 'DECAISSEMENT').map(cat => (
                      <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9', gap: 8 }}>
                        {editingCat === cat.id ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                            <input value={editCatNom} onChange={e => setEditCatNom(e.target.value)} style={{ flex: 1, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12 }} />
                            <select value={editCatSens} onChange={e => setEditCatSens(e.target.value)} style={{ height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12 }}>
                              <option value="ENCAISSEMENT">Enc.</option>
                              <option value="DECAISSEMENT">Déc.</option>
                            </select>
                            <button onClick={handleSaveCategory} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><Check size={14} color="#16A34A" /></button>
                            <button onClick={() => setEditingCat(null)} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><X size={14} color="#64748B" /></button>
                          </div>
                        ) : (
                          <>
                            <span style={{ fontSize: 13 }}>{cat.nom}</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => handleStartEditCategory(cat)} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><Edit size={14} color="#64748B" /></button>
                              <button onClick={() => handleDeleteCategory(cat)} style={{ width: 24, height: 24, border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}><Trash2 size={14} color="#DC2626" /></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      // ============== PARAMETRAGE CBS (ADMIN_BANQUE) ==============
      case 'parametrage_cbs':
        const CBS_TABS = [
          { key: 'connexion_ebics', label: 'Connexion EBICS' },
          { key: 'flux_donnees', label: 'Flux de données' },
          { key: 'acces_entreprises', label: 'Accès entreprises' },
          { key: 'params_globaux', label: 'Paramètres globaux' },
        ] as const
        
        const FREQ_OPTIONS = [
          { value: 'tempsReel', label: 'Temps réel', color: '#16A34A' },
          { value: 'heures', label: 'Toutes les heures', color: '#3B6FD4' },
          { value: 'quotidien', label: 'Quotidien', color: '#1B2E5E' },
          { value: 'hebdomadaire', label: 'Hebdomadaire', color: '#64748B' },
        ]
        
        const handleManualSync = (fluxId: string, fluxNom: string) => {
          setSyncoLoading(p => ({ ...p, [fluxId]: true }))
          setTimeout(() => {
            const nb = Math.floor(Math.random() * 30) + 5
            setCbsFlux(prev => prev.map(f =>
              f.id === fluxId
                ? { ...f, derniere_synchro: `2025-03-29 ${new Date().toTimeString().slice(0, 5)}`, statut: 'ACTIF' }
                : f
            ))
            setSyncoLoading(p => ({ ...p, [fluxId]: false }))
            addToast(`${nb} enregistrements importés depuis "${fluxNom}"`)
          }, 1500)
        }
        
        return (
          <div>
            {/* Tabs */}
            <div style={{ borderBottom: '2px solid #DDE3EF', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {CBS_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setParametrageCbsTab(tab.key)}
                    style={{
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      borderBottom: parametrageCbsTab === tab.key ? '2px solid #1B2E5E' : '2px solid transparent',
                      marginBottom: -2,
                      color: parametrageCbsTab === tab.key ? '#1B2E5E' : '#64748B',
                      fontWeight: parametrageCbsTab === tab.key ? 600 : 500,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab: Connexion EBICS */}
            {parametrageCbsTab === 'connexion_ebics' && (
              <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 20 }}>Configuration EBICS</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Host CBS</label>
                    <input type="text" value={cbsFormConfig.host} onChange={e => handleCbsFieldChange('host', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Port</label>
                    <input type="number" value={cbsFormConfig.port} onChange={e => handleCbsFieldChange('port', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Timeout session (min)</label>
                    <input type="number" value={cbsFormConfig.timeout} onChange={e => handleCbsFieldChange('timeout', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Partenaire ID</label>
                    <input type="text" value={cbsFormConfig.partenaire_id} onChange={e => handleCbsFieldChange('partenaire_id', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>User ID EBICS</label>
                    <input type="text" value={cbsFormConfig.user_id} onChange={e => handleCbsFieldChange('user_id', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Devises autorisées</label>
                    <input type="text" value={cbsFormConfig.devises} onChange={e => handleCbsFieldChange('devises', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Protocole EBICS</label>
                    <select value={cbsFormConfig.protocole} onChange={e => handleCbsFieldChange('protocole', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                      <option value="H004">H004</option>
                      <option value="H005">H005</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Format relevés CBS</label>
                    <select value={cbsFormConfig.format} onChange={e => handleCbsFieldChange('format', e.target.value)} style={{ width: '100%', height: 34, border: `1px solid ${cbsFormModified ? '#3B6FD4' : '#DDE3EF'}`, borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                      <option value="MT940">MT940</option>
                      <option value="CAMT053">CAMT053</option>
                    </select>
                  </div>
                </div>

                {cbsFormModified && (
                  <div style={{ marginTop: 12, marginBottom: 4, fontSize: 12, color: '#D97706' }}>⚠ Modifications non enregistrées</div>
                )}
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    disabled={cbsTestLoading}
                    onClick={handleCbsTest}
                    style={{ height: 34, padding: '0 16px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, cursor: 'pointer', opacity: cbsTestLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {cbsTestLoading ? <><Loader2 size={13} /> Test en cours...</> : <><Wifi size={13} /> Tester la connexion</>}
                  </button>
                  <button
                    disabled={cbsSaveLoading || !cbsFormModified}
                    onClick={handleCbsSave}
                    style={{ height: 34, padding: '0 16px', background: cbsFormModified ? '#1B2E5E' : '#94A3B8', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13, cursor: cbsFormModified ? 'pointer' : 'not-allowed', opacity: cbsSaveLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {cbsSaveLoading ? <><Loader2 size={13} /> Enregistrement...</> : <><Save size={13} /> Enregistrer la configuration</>}
                  </button>
                  {cbsFormModified && (
                    <button
                      onClick={() => {
                        setCbsFormConfig(DEFAULT_CBS_FORM_CONFIG)
                        setCbsFormModified(false)
                      }}
                      style={{ height: 34, padding: '0 14px', background: '#FFFFFF', color: '#DC2626', border: '1px solid #DC2626', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
                    >
                      Annuler les modifications
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Tab: Flux de données */}
            {parametrageCbsTab === 'flux_donnees' && (
              <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 16 }}>Flux de données CBS</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Flux de données</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Format</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Fréquence</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#64748B' }}>Actif</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Dernière synchro</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Prochain sync</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748B' }}>Statut</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#64748B' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cbsFlux.map(f => {
                      const freqOpt = FREQ_OPTIONS.find(o => o.value === f.frequence)
                      return (
                        <tr key={f.id} style={{ borderBottom: '1px solid #DDE3EF' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{f.nom}</div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>{f.description}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>{f.format}</span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <select
                              value={f.frequence}
                              onChange={e => setCbsFlux(prev => prev.map(fl => fl.id === f.id ? { ...fl, frequence: e.target.value } : fl))}
                              style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 12, background: freqOpt?.color || '#64748B', color: '#FFFFFF' }}
                            >
                              {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => setCbsFlux(prev => prev.map(fl => fl.id === f.id ? { ...fl, actif: !fl.actif, statut: !fl.actif ? 'ACTIF' : 'INACTIF' } : fl))}
                              style={{
                                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                                background: f.actif ? '#1B2E5E' : '#E2E8F0',
                                position: 'relative'
                              }}
                            >
                              <div style={{
                                width: 18, height: 18, borderRadius: '50%', background: '#FFFFFF',
                                position: 'absolute', top: 3, left: f.actif ? 23 : 3, transition: 'left 0.2s'
                              }} />
                            </button>
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748B' }}>{f.derniere_synchro}</td>
                          <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748B' }}>{f.prochain_sync}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                              background: f.statut === 'ACTIF' ? '#DCFCE7' : '#F1F5F9',
                              color: f.statut === 'ACTIF' ? '#16A34A' : '#64748B'
                            }}>
                              {f.statut}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              disabled={syncoLoading[f.id]}
                              onClick={() => handleManualSync(f.id, f.nom)}
                              style={{ height: 34, padding: '0 12px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 12, cursor: 'pointer', opacity: syncoLoading[f.id] ? 0.7 : 1 }}
                            >
                              {syncoLoading[f.id] ? 'Sync...' : 'Synchro manuelle'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Tab: Accès entreprises */}
            {parametrageCbsTab === 'acces_entreprises' && (
              <div>
                <div style={{ background: '#EEF3FC', border: '1px solid #3B6FD4', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Info size={20} color="#3B6FD4" />
                  <span style={{ fontSize: 13, color: '#1B2E5E' }}>
                    L&apos;admin banque configure la connexion CBS/EBICS, les flux CBS et les accès/modules des entreprises. Le mode ERP côté client reste géré dans les accès entreprise.
                  </span>
                </div>
                
                <div style={{ background: '#FFFFFF', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9', height: 40 }}>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Entreprise</th>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Code client</th>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Mode échange</th>
                        <th style={{ padding: '0 12px', textAlign: 'left', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Statut connexion</th>
                        <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Score auto</th>
                        <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>Actif</th>
                        <th style={{ padding: '0 12px', textAlign: 'center', fontSize: 11.5, color: '#64748B', fontWeight: 600, width: 120 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entreprises.map(e => {
                        const config = erpConfigs.find(c => c.entreprise_id === e.id)
                        const modeStatut = config ? (
                          config.mode_echange === 'EBICS' ? config.ebics.statut :
                          config.mode_echange === 'API' ? config.api.statut :
                          config.fichier.statut
                        ) : 'NON_CONFIGURE'
                        
                        return (
                          <tr key={e.id} style={{ borderBottom: '1px solid #DDE3EF', height: 50 }}>
                            <td style={{ padding: '0 12px', fontSize: 13, fontWeight: 500 }}>{e.nom}</td>
                            <td style={{ padding: '0 12px', fontSize: 12, color: '#64748B' }}>{e.client_code}</td>
                            <td style={{ padding: '0 12px' }}>
                              <span style={{
                                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                                background: config?.mode_echange === 'EBICS' ? '#1B2E5E' : config?.mode_echange === 'API' ? '#3B6FD4' : '#64748B',
                                color: '#FFFFFF'
                              }}>
                                {config?.mode_echange || 'NON CONFIGURE'}
                              </span>
                            </td>
                            <td style={{ padding: '0 12px' }}>
                              <span style={{
                                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                                background: modeStatut === 'CONNECTE' ? '#DCFCE7' : modeStatut === 'CONFIGURE' ? '#FEF3C7' : '#F1F5F9',
                                color: modeStatut === 'CONNECTE' ? '#16A34A' : modeStatut === 'CONFIGURE' ? '#D97706' : '#64748B'
                              }}>
                                {modeStatut}
                              </span>
                            </td>
                            <td style={{ padding: '0 12px', textAlign: 'center', fontSize: 13 }}>{config?.score_minimum_auto || '-'}%</td>
                            <td style={{ padding: '0 12px', textAlign: 'center' }}>
                              <div style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: config?.actif ? '#16A34A' : '#DC2626',
                                margin: '0 auto'
                              }} />
                            </td>
                            <td style={{ padding: '0 12px', textAlign: 'center' }}>
                              <button
                                onClick={() => {
                                  setErpConfigDrawer({ open: true, entreprise: e })
                                  setErpConfigTab('mode_echange')
                                }}
                                style={{ height: 28, padding: '0 12px', background: '#1B2E5E', color: '#FFFFFF', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                              >
                                Configurer
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Tab: Paramètres globaux */}
            {parametrageCbsTab === 'params_globaux' && (
              <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Paramètre</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Valeur actuelle</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unité</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dernière modification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalParams.map(p => (
                      <tr key={p.key} style={{ borderBottom: '1px solid #DDE3EF', height: 48 }}>
                        <td style={{ padding: '0 12px', fontWeight: 500, color: '#1E293B' }}>{p.label}</td>
                        <td style={{ padding: '10px 12px' }}>
                          {editingParam === p.key ? (
                            <input
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              onBlur={e => {
                                if (editingValue !== p.valeur) {
                                  setGlobalParams(prev => prev.map(row => row.key === p.key ? { ...row, valeur: editingValue } : row))
                                  setGlobalParamsModified(true)
                                }
                                setEditingParam(null)
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  setGlobalParams(prev => prev.map(row => row.key === p.key ? { ...row, valeur: editingValue } : row))
                                  setGlobalParamsModified(true)
                                  setEditingParam(null)
                                }
                                if (e.key === 'Escape') setEditingParam(null)
                              }}
                              autoFocus
                              style={{ width: 140, height: 34, border: '1px solid #3B6FD4', borderRadius: 6, padding: '0 10px', fontSize: 13 }}
                            />
                          ) : (
                            <span
                              onClick={() => { setEditingParam(p.key); setEditingValue(p.valeur) }}
                              style={{
                                cursor: 'text',
                                padding: '3px 8px',
                                borderRadius: 4,
                                border: '1px dashed #DDE3EF',
                                background: '#F8FAFC',
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#1B2E5E'
                              }}
                              title="Cliquez pour modifier"
                            >
                              {p.valeur}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0 12px', color: '#94A3B8', fontSize: 12 }}>{p.unit || '—'}</td>
                        <td style={{ padding: '0 12px', color: '#64748B', fontSize: 12 }}>{p.description}</td>
                        <td style={{ padding: '0 12px', color: '#94A3B8', fontSize: 12 }}>{p.modifie_le}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid #DDE3EF' }}>
                  {globalParamsModified && (
                    <span style={{ fontSize: 12, color: '#D97706' }}>⚠ Modifications non enregistrées — cliquez sur les valeurs pour les éditer, puis sauvegardez</span>
                  )}
                  <button
                    onClick={() => {
                      setGlobalSaveLoading(true)
                      setTimeout(() => {
                        setGlobalSaveLoading(false)
                        setGlobalParamsModified(false)
                        setGlobalParams(prev => prev.map(row => ({ ...row, modifie_le: new Date().toLocaleDateString('fr-FR') })))
                        addToast('✓ Paramètres globaux enregistrés', 'success')
                      }, 1200)
                    }}
                    disabled={globalSaveLoading || !globalParamsModified}
                    style={{
                      height: 34, padding: '0 20px', marginLeft: 'auto',
                      background: globalParamsModified ? '#1B2E5E' : '#94A3B8',
                      color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13,
                      cursor: globalParamsModified ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {globalSaveLoading ? <><Loader2 size={13} /> Enregistrement...</> : <><Save size={13} /> Sauvegarder tous les changements</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      
      // ============== REPORTING BANQUE ==============
      case 'reporting_banque':
        return (
          <div>
            <div style={{ marginBottom: 20 }}>
              <select
                value={selectedReportClient || ''}
                onChange={e => setSelectedReportClient(e.target.value || null)}
                style={{ height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, minWidth: 320 }}
              >
                <option value="">Sélectionner une entreprise</option>
                {entreprises.filter(e => e.statut === 'ACTIF').map(e => (
                  <option key={e.id} value={e.id}>{e.nom} ({e.client_code})</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { key: 'position', titre: 'Position de trésorerie', description: 'Soldes et seuils par compte', type: 'position' as const },
                { key: 'flux', titre: 'Flux déclarés client', description: 'Liste complète des flux', type: 'flux' as const },
                { key: 'consolide', titre: 'Rapport consolidé', description: 'Tous les clients agrégés', type: 'consolide' as const },
              ].map(report => {
                return (
                  <div key={report.key} style={{
                    background: '#FFFFFF',
                    borderRadius: 10,
                    border: '1px solid #DDE3EF',
                    padding: 16
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1B2E5E', marginBottom: 4 }}>{report.titre}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>{report.description}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        disabled={!!loadingExports[`${report.key}_excel`]}
                        onClick={() => {
                          const content = report.type === 'consolide'
                            ? generateCSV_consolide()
                            : generateCSV_clientReport(selectedReportClient, report.type)
                          handleExport(
                            `${report.key}_excel`,
                            `${report.type}_${report.key}_${new Date().toISOString().slice(0, 10)}.csv`,
                            content
                          )
                        }}
                        style={{
                          flex: 1,
                          height: 34,
                          background: '#FFFFFF',
                          color: '#1B2E5E',
                          border: '1px solid #1B2E5E',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4
                        }}
                      >
                        {loadingExports[`${report.key}_excel`] ? <><Loader2 size={11} /> En cours...</> : <><Download size={11} /> Excel</>}
                      </button>
                      <button
                        disabled={!!loadingExports[`${report.key}_pdf`]}
                        onClick={() => {
                          const content = report.type === 'consolide'
                            ? generateCSV_consolide()
                            : generateCSV_clientReport(selectedReportClient, report.type)
                          handleExport(
                            `${report.key}_pdf`,
                            `${report.type}_${report.key}_${new Date().toISOString().slice(0, 10)}.csv`,
                            content
                          )
                        }}
                        style={{
                          flex: 1,
                          height: 34,
                          background: '#FFFFFF',
                          color: '#1B2E5E',
                          border: '1px solid #1B2E5E',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4
                        }}
                      >
                        {loadingExports[`${report.key}_pdf`] ? <><Loader2 size={11} /> En cours...</> : <><FileText size={11} /> PDF</>}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      
      // ============== DEFAULT ==============
      default:
        return (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 10,
            padding: 60,
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
          }}>
            <Lock size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 16, color: '#1B2E5E', fontWeight: 600, marginBottom: 8 }}>
              Page en cours de développement
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
              Cette fonctionnalité sera bientôt disponible.
            </div>
            <button
              onClick={() => navigate(isClientRole ? 'dashboard' : 'dashboard_banque', isClientRole ? ['Trésorerie', 'Tableau de bord'] : ['Banque', 'Tableau de bord'])}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                color: '#3B6FD4',
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Retour au tableau de bord
            </button>
          </div>
        )
    }
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F6FB',
      display: 'flex',
      fontFamily: '"DM Sans", system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? 56 : 230,
        background: '#111E3F',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '16px 8px' : '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {!sidebarCollapsed && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>ADRIA</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Trésorerie</div>
            </>
          )}
        </div>
        
        {/* Menu items */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {menuItems.map((item: any) => {
            if (item.condition && !item.condition()) return null
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isRapprochement = item.label === 'Rapprochement'
            const isActive = isRapprochement 
              ? pathname.startsWith('/rapprochement-module')
              : activePage === item.page
            
            return (
              <div key={item.page}>
                <button
                  onClick={() => {
                    if (isRapprochement) {
                      setIsRapprochementOpen(!isRapprochementOpen)
                    } else {
                      navigate(item.page, item.crumbs)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: sidebarCollapsed ? '10px' : '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: isActive ? '#3B6FD4' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #7EB3FF' : '3px solid transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontSize: 13,
                    textAlign: 'left',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                  }}
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {hasSubItems && (
                        isRapprochementOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </>
                  )}
                </button>

                {hasSubItems && isRapprochementOpen && !sidebarCollapsed && (
                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '4px 0' }}>
                    {item.subItems.map((sub: any) => {
                      const isSubActive = pathname === sub.page
                      return (
                        <Link 
                          key={sub.page} 
                          href={sub.page}
                          style={{
                            display: 'flex',
                            padding: '8px 16px 8px 46px',
                            color: isSubActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                            fontSize: 12,
                            textDecoration: 'none',
                            background: isSubActive ? 'rgba(255,255,255,0.05)' : 'transparent'
                          }}
                        >
                          {sub.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        
        {/* Logout */}
        <button
          onClick={() => {
            setCurrentUser(null)
            setActivePage('dashboard')
          }}
          style={{
            padding: sidebarCollapsed ? '16px' : '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'none',
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontSize: 13,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
          }}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && 'Se déconnecter'}
        </button>
      </aside>
      
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          height: 52,
          background: '#FFFFFF',
          borderBottom: '1px solid #DDE3EF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 16
        }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ fontSize: 12, color: '#64748B' }}>
            {breadcrumb.join(' › ')}
          </div>
          
          <div style={{ flex: 1 }} />
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setBellOpen(p => !p); setUnreadCount(0) }}
              style={{ position:'relative', background:'none', border:'none', cursor:'pointer', padding:6, color:'#64748B' }}
            >
              <Bell size={20} color="#64748B" />
              {unreadCount > 0 && (
                <span style={{
                  position:'absolute', top:2, right:2,
                  background:'#DC2626', color:'white',
                  borderRadius:'50%', width:16, height:16,
                  fontSize:10, fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center'
                }}>{unreadCount}</span>
              )}
            </button>

            {bellOpen && (
              <>
                <div onClick={() => setBellOpen(false)} style={{ position:'fixed', inset:0, zIndex:999 }} />
                <div style={{
                  position:'absolute', top:'calc(100% + 8px)', right:0,
                  width:380, maxHeight:480,
                  background:'white', borderRadius:10,
                  boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
                  border:'1px solid #DDE3EF',
                  zIndex:1000, overflow:'hidden',
                  display:'flex', flexDirection:'column'
                }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #DDE3EF', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:600, fontSize:14, color:'#1B2E5E' }}>Notifications</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <select
                        value={bellAccountFilter}
                        onChange={e => setBellAccountFilter(e.target.value)}
                        style={{ fontSize:11, border:'1px solid #DDE3EF', borderRadius:4, padding:'2px 6px', color:'#64748B' }}
                      >
                        <option value="ALL">Tous les comptes</option>
                        {MOCK_COMPTES.filter(c => c.entreprise_id === currentUser.entreprise_id).map(c => (
                          <option key={c.account_number} value={c.account_number}>
                            {c.account_number.slice(-6)} | {c.devise}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => setBellOpen(false)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                        <X size={14} color="#94A3B8" />
                      </button>
                    </div>
                  </div>

                  <div style={{ overflowY:'auto', flex:1 }}>
                    {(() => {
                      const filtered = alertes.filter(a => !a.dismissed && (bellAccountFilter === 'ALL' || a.account_number === bellAccountFilter))
                      if (filtered.length === 0) {
                        return (
                          <div style={{ padding:24, textAlign:'center', color:'#94A3B8', fontSize:13 }}>
                            <CheckCircle size={24} style={{ marginBottom:8, color:'#16A34A' }} />
                            <div>Aucune alerte active</div>
                          </div>
                        )
                      }
                      return filtered.map(a => {
                        const colors: Record<string, { bg: string, border: string }> = {
                          SOLDE_BAS: { bg:'#FEE2E2', border:'#FCA5A5' },
                          TENSION_PREVISIONNELLE: { bg:'#FEF3C7', border:'#FCD34D' },
                          FLUX_NON_RAPPROCHE: { bg:'#FEF3C7', border:'#FCD34D' },
                          ECART_CHANGE: { bg:'#DBEAFE', border:'#BFDBFE' },
                          ECHEANCE_FLUX: { bg:'#F1F5F9', border:'#DDE3EF' },
                        }
                        const c = colors[a.type] || colors.ECHEANCE_FLUX
                        return (
                          <div key={a.id} style={{ padding:'10px 16px', borderBottom:'1px solid #DDE3EF', borderLeft:`3px solid ${c.border}`, background: c.bg + '33' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                              <div style={{ fontSize:12, fontWeight:600, color:'#1B2E5E' }}>{a.titre}</div>
                              <button
                                onClick={() => setAlertes(prev => prev.map(x => x.id === a.id ? { ...x, dismissed: true } : x))}
                                style={{ background:'none', border:'none', cursor:'pointer', padding:0, marginLeft:8 }}
                              >
                                <X size={12} color="#94A3B8" />
                              </button>
                            </div>
                            <div style={{ fontSize:11, color:'#64748B', marginTop:2 }}>{a.message}</div>
                            <div style={{ fontSize:10, color:'#94A3B8', marginTop:4 }}>Compte : {a.account_number?.slice(-8)} | {a.date}</div>
                          </div>
                        )
                      })
                    })()}
                  </div>

                  <div style={{ padding:'8px 16px', borderTop:'1px solid #DDE3EF', textAlign:'center' }}>
                    <button
                      onClick={() => { setBellOpen(false); setActivePage('alertes') }}
                      style={{ fontSize:12, color:'#3B6FD4', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}
                    >
                      Voir toutes les alertes →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#1B2E5E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600
            }}>
              {currentUser.nom.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#1E293B' }}>{currentUser.nom}</div>
              <span style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 3,
                background: ROLE_COLORS[currentUser.role],
                color: '#FFFFFF'
              }}>
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          {/* Page title */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1B2E5E', margin: 0 }}>
              {breadcrumb[breadcrumb.length - 1]}
            </h1>
          </div>
          
          {renderPageContent()}
        </main>
      </div>
      
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 1000
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: toast.type === 'success' ? '#DCFCE7' : toast.type === 'error' ? '#FEE2E2' : '#EEF3FC',
              color: toast.type === 'success' ? '#16A34A' : toast.type === 'error' ? '#DC2626' : '#3B6FD4',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              animation: 'slideIn 0.3s ease'
            }}
          >
            {toast.type === 'success' && <CheckCircle size={16} />}
            {toast.type === 'error' && <AlertTriangle size={16} />}
            {toast.msg}
          </div>
        ))}
      </div>
      
      {/* Confirm Modal */}
      {modal.open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setModal(p => ({ ...p, open: false }))}
        >
          <div
            style={{
              width: 400,
              background: '#FFFFFF',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>
              {modal.title}
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24 }}>
              {modal.message}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModal(p => ({ ...p, open: false }))}
                style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#FFFFFF',
                  color: '#1B2E5E',
                  border: '1px solid #1B2E5E',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={modal.onConfirm}
                style={{
                  height: 34,
                  padding: '0 16px',
                  background: modal.danger ? '#DC2626' : '#1B2E5E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {justifierModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ width: 480, background: '#FFFFFF', borderRadius: 12, padding: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#1E293B' }}>Justifier l&apos;anomalie</h3>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              Référence : <strong>{justifierModal.anomalie?.reference}</strong><br />
              Anomalie : {justifierModal.anomalie?.anomalie}
            </div>
            <label style={{ fontSize: 12, color: '#94A3B8' }}>Motif de justification *</label>
            <textarea
              value={justifierTexte}
              onChange={e => setJustifierTexte(e.target.value)}
              placeholder="Expliquez la raison de l'écart ou de l'anomalie..."
              style={{ width: '100%', height: 100, borderRadius: 6, border: '1px solid #DDE3EF', padding: 10, fontSize: 13, marginTop: 4, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setJustifierModal({ open: false, anomalie: null }); setJustifierTexte('') }}
                style={{ height: 34, padding: '0 16px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                disabled={!justifierTexte.trim()}
                onClick={() => {
                  setMouvements(prev => prev.map(m =>
                    m.id === justifierModal.anomalie?.id
                      ? { ...m, statut_rapprochement: 'RAPPROCHE', anomalie: null, justification: justifierTexte }
                      : m
                  ))
                  addToast('✓ Anomalie justifiée et rapprochement mis à jour', 'success')
                  setJustifierModal({ open: false, anomalie: null })
                  setJustifierTexte('')
                }}
                style={{ height: 34, padding: '0 16px', background: '#1B2E5E', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', opacity: !justifierTexte.trim() ? 0.6 : 1 }}
              >
                ✓ Enregistrer la justification
              </button>
            </div>
          </div>
        </div>
      )}

      {addGroupeModal && (
        <>
          <div onClick={() => setAddGroupeModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, background: '#FFFFFF', borderRadius: 12, padding: 24, zIndex: 1001, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1B2E5E', marginBottom: 16 }}>Créer un nouveau groupe</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Nom du groupe *</label>
              <input type="text" placeholder="Ex: Contrôleur financier" value={newGroupeNom} onChange={e => setNewGroupeNom(e.target.value)} autoFocus style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Couleur du groupe</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['#1B2E5E','#3B6FD4','#16A34A','#D97706','#DC2626','#7C3AED','#0891B2','#6B7280'].map(col => (
                  <div key={col} onClick={() => setNewGroupeCouleur(col)} style={{ width: 28, height: 28, borderRadius: 6, background: col, cursor: 'pointer', border: newGroupeCouleur === col ? '3px solid #1E293B' : '2px solid transparent', boxSizing: 'border-box' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setAddGroupeModal(false)} style={{ height: 34, padding: '0 16px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
              <button
                disabled={!newGroupeNom.trim()}
                onClick={() => {
                  if (!newGroupeNom.trim()) return
                  const key = newGroupeNom.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
                  const newGroupe = { id: key, label: newGroupeNom, couleur: newGroupeCouleur }
                  setGroupes(prev => [...prev, newGroupe])
                  setGroupePermissions((prev: any) => ({ ...prev, [key]: { canDeclareFlux:false, canValidateFlux:false, canDeleteFlux:false, canImportERP:false, canImportExcel:false, canExport:false, canAccessReporting:true, canConfigureAlertes:false, canAccessMultiDevises:false, canAccessRapprochement:false } }))
                  setSelectedGroupe(key)
                  setAddGroupeModal(false)
                  setNewGroupeNom('')
                  addToast(`✓ Groupe "${newGroupe.label}" créé — configurez ses permissions ci-dessous`, 'success')
                }}
                style={{ height: 34, padding: '0 16px', background: newGroupeNom.trim() ? '#1B2E5E' : '#94A3B8', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13, cursor: newGroupeNom.trim() ? 'pointer' : 'not-allowed' }}
              >
                ✓ Créer le groupe
              </button>
            </div>
          </div>
        </>
      )}

      {userDrawer.open && (
        <>
          <div onClick={() => setUserDrawer({ open: false, mode: 'create', data: null })} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1000 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: 420, background: '#FFFFFF', zIndex: 1001, boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #DDE3EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#1B2E5E' }}>{userDrawer.mode === 'create' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}</span>
              <button onClick={() => setUserDrawer({ open: false, mode: 'create', data: null })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="#64748B" /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {[{ key: 'prenom', label: 'Prénom *', type: 'text', placeholder: 'Prénom' }, { key: 'nom', label: 'Nom *', type: 'text', placeholder: 'Nom de famille' }, { key: 'email', label: 'Email *', type: 'email', placeholder: 'email@exemple.com' }].map(field => (
                <div key={field.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} value={(userFormData as any)[field.key]} onChange={e => setUserFormData(prev => ({ ...prev, [field.key]: e.target.value }))} style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Rôle *</label>
                <select value={userFormData.role} onChange={e => setUserFormData(prev => ({ ...prev, role: e.target.value }))} style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13 }}>
                  <option value="TRESORIER">Trésorier</option>
                  <option value="ADMIN_CLIENT">Admin Client</option>
                  <option value="VALIDATEUR">Validateur</option>
                  <option value="LECTEUR">Lecteur seul</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 8 }}>Accès aux comptes</label>
                {MOCK_COMPTES.filter(c => c.entreprise_id === currentUser?.entreprise_id).map(c => (
                  <label key={c.account_number} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={userFormData.comptes.includes(c.account_number)} onChange={e => setUserFormData(prev => ({ ...prev, comptes: e.target.checked ? [...prev.comptes, c.account_number] : prev.comptes.filter(x => x !== c.account_number) }))} style={{ accentColor: '#1B2E5E' }} />
                    <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{c.account_number} | {c.banque} | {c.devise}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #DDE3EF', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setUserDrawer({ open: false, mode: 'create', data: null })} style={{ height: 34, padding: '0 16px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Annuler</button>
              <button
                disabled={!userFormData.prenom || !userFormData.nom || !userFormData.email}
                onClick={() => {
                  if (!userFormData.prenom || !userFormData.nom || !userFormData.email) return
                  if (userDrawer.mode === 'create') {
                    const newUser = { id: `u${Date.now()}`, nom: `${userFormData.prenom} ${userFormData.nom}`.trim(), email: userFormData.email, role: userFormData.role, entreprise_id: currentUser?.entreprise_id, statut: 'ACTIF', derniere_connexion: '—', comptes_accessibles: userFormData.comptes, permissions: {}, password: 'demo123' }
                    setUsersLocal(prev => [...prev, newUser])
                    addToast(`✓ Utilisateur ${newUser.nom} ajouté avec succès`, 'success')
                  } else {
                    setUsersLocal(prev => prev.map(u => u.id === userDrawer.data?.id ? { ...u, nom: `${userFormData.prenom} ${userFormData.nom}`.trim(), email: userFormData.email, role: userFormData.role, comptes_accessibles: userFormData.comptes } : u))
                    addToast('✓ Utilisateur mis à jour', 'success')
                  }
                  setUserDrawer({ open: false, mode: 'create', data: null })
                }}
                style={{ height: 34, padding: '0 16px', background: !userFormData.prenom || !userFormData.nom || !userFormData.email ? '#94A3B8' : '#1B2E5E', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 13, cursor: !userFormData.prenom || !userFormData.nom || !userFormData.email ? 'not-allowed' : 'pointer' }}
              >
                {userDrawer.mode === 'create' ? '✓ Ajouter' : '✓ Enregistrer'}
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Drawer */}
      {drawer.open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000
        }}
        onClick={() => setDrawer(p => ({ ...p, open: false }))}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 420,
              background: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #DDE3EF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', margin: 0 }}>
                {drawer.mode === 'view' ? 'Détails du flux' : drawer.mode === 'create' ? 'Ajouter un flux' : 'Modifier le flux'}
              </h3>
              <button
                onClick={() => setDrawer(p => ({ ...p, open: false }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Drawer body */}
            <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
              {drawer.mode === 'view' && drawer.data && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Référence</div>
                    <div style={{ fontSize: 14, color: '#1E293B' }}>{drawer.data.reference}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Compte</div>
                    <div style={{ fontSize: 14, color: '#1E293B' }}>{drawer.data.account_number}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Source</div>
                    <StatusBadge type="source" value={drawer.data.source} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Certitude</div>
                    <StatusBadge type="certitude" value={drawer.data.certitude} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Sens</div>
                    <StatusBadge type="sens" value={drawer.data.sens} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Contrepartie</div>
                    <div style={{ fontSize: 14, color: '#1E293B' }}>{drawer.data.contrepartie}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Montant</div>
                    <div style={{ fontSize: 14, color: '#1E293B', fontWeight: 600 }}>{drawer.data.montant.toLocaleString('fr-FR')} {drawer.data.devise}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Date prévisionnelle</div>
                    <div style={{ fontSize: 14, color: '#1E293B' }}>{new Date(drawer.data.date_previsionnelle).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Statut</div>
                    <StatusBadge type="statut" value={drawer.data.statut} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Catégorie</div>
                    <div style={{ fontSize: 14, color: '#1E293B' }}>{drawer.data.categorie}</div>
                  </div>
                </div>
              )}
              
              {drawer.mode === 'create' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Compte *</label>
                    <select style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                      {userComptes.map(c => (
                        <option key={c.id} value={c.account_number}>{c.account_number} | {c.banque} | {c.devise}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Devise</label>
                      <input type="text" value="MAD" disabled style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, background: '#F8FAFC' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Source</label>
                      <input type="text" value="MANUEL" disabled style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13, background: '#F8FAFC' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Sens *</label>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="sens" value="ENCAISSEMENT" defaultChecked />
                        Encaissement
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="radio" name="sens" value="DECAISSEMENT" />
                        Décaissement
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Contrepartie *</label>
                    <input type="text" placeholder="Nom du bénéficiaire ou émetteur" style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Montant *</label>
                    <input type="number" placeholder="0.00" style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Date prévisionnelle *</label>
                    <input type="date" style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Certitude *</label>
                    <select style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                      <option value="CONFIRME">Confirmé (Probabilité &gt; 90%)</option>
                      <option value="PROBABLE">Probable (Probabilité 60-90%)</option>
                      <option value="INCERTAIN">Incertain (Probabilité &lt; 60%)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Catégorie (suggestion)</label>
                    <select style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 12px', fontSize: 13 }}>
                      <option>Ventes clients</option>
                      <option>Fournisseurs</option>
                      <option>RH - Salaires</option>
                      <option>Charges sociales</option>
                      <option>Fiscalité</option>
                      <option>Immobilier</option>
                      <option>Charges fixes</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748B', marginBottom: 6 }}>Notes</label>
                    <textarea rows={3} placeholder="Informations complémentaires..." style={{ width: '100%', border: '1px solid #DDE3EF', borderRadius: 6, padding: '8px 12px', fontSize: 13, resize: 'none' }} />
                  </div>
                </div>
              )}
            </div>
            
            {/* Drawer footer */}
            {drawer.mode === 'create' && (
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #DDE3EF',
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    addToast('Brouillon enregistré')
                    setDrawer(p => ({ ...p, open: false }))
                  }}
                  style={{
                    height: 34,
                    padding: '0 16px',
                    background: '#FFFFFF',
                    color: '#1B2E5E',
                    border: '1px solid #1B2E5E',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Enregistrer brouillon
                </button>
                <button
                  onClick={() => {
                    addToast('Flux soumis pour validation')
                    setDrawer(p => ({ ...p, open: false }))
                  }}
                  style={{
                    height: 34,
                    padding: '0 16px',
                    background: '#1B2E5E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Soumettre pour validation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Drawer: ERP Config */}
      {erpConfigDrawer.open && erpConfigDrawer.entreprise && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000
        }}
        onClick={() => setErpConfigDrawer({ open: false, entreprise: null })}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 600,
              background: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #DDE3EF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', margin: 0 }}>
                Configuration ERP — {erpConfigDrawer.entreprise.nom}
              </h3>
              <button
                onClick={() => setErpConfigDrawer({ open: false, entreprise: null })}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: '#94A3B8'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Sub-tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #DDE3EF',
              paddingLeft: 20
            }}>
              {[
                { key: 'mode_echange', label: 'Mode d\'échange' },
                { key: 'criteres', label: 'Critères rapprochement' },
                { key: 'modules', label: 'Modules' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setErpConfigTab(tab.key as any)}
                  style={{
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: erpConfigTab === tab.key ? '2px solid #1B2E5E' : '2px solid transparent',
                    marginBottom: -1,
                    color: erpConfigTab === tab.key ? '#1B2E5E' : '#64748B',
                    fontWeight: erpConfigTab === tab.key ? 600 : 500,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
              {erpConfigTab === 'mode_echange' && (
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16, background: '#EEF3FC', padding: '10px 14px', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                    Le mode d&apos;échange définit le canal entreprise (EBICS/API/Fichier). L&apos;admin banque configure le CBS et les accès, pas l&apos;ERP interne du client.
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {[
                      { key: 'EBICS', label: 'EBICS', desc: 'Protocole bancaire sécurisé — Recommandé', icon: '🔐' },
                      { key: 'API', label: 'API REST', desc: 'Connexion directe à l\'ERP', icon: '🔗' },
                      { key: 'FICHIER', label: 'Fichier', desc: 'Import périodique SFTP/FTP/Manuel', icon: '📄' },
                    ].map(mode => {
                      const isSelected = currentErpConfig?.mode_echange === mode.key
                      return (
                        <div
                          key={mode.key}
                          onClick={() => {
                            if (!erpConfigDrawer.entreprise) return
                            updateErpConfig(erpConfigDrawer.entreprise.id, { mode_echange: mode.key })
                            setErpConfigModified(true)
                          }}
                          style={{
                            flex: 1,
                            border: `2px solid ${isSelected ? '#3B6FD4' : '#DDE3EF'}`,
                            borderRadius: 8,
                            padding: 12,
                            cursor: 'pointer',
                            background: isSelected ? '#EEF3FC' : '#FFFFFF'
                          }}
                        >
                          <div style={{ fontSize: 20, marginBottom: 6 }}>{mode.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#1B2E5E' : '#1E293B' }}>{mode.label}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{mode.desc}</div>
                        </div>
                      )
                    })}
                  </div>

                  {currentErpConfig?.mode_echange === 'EBICS' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        { key: 'host', label: 'Host CBS' },
                        { key: 'port', label: 'Port' },
                        { key: 'partenaire_id', label: 'Partenaire ID' },
                        { key: 'user_id', label: 'User ID' },
                      ].map(field => (
                        <div key={field.key}>
                          <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>{field.label}</label>
                          <input
                            value={String((currentErpConfig.ebics as any)?.[field.key] ?? '')}
                            onChange={e => {
                              if (!erpConfigDrawer.entreprise) return
                              updateErpConfig(erpConfigDrawer.entreprise.id, { ebics: { ...currentErpConfig.ebics, [field.key]: e.target.value } })
                              setErpConfigModified(true)
                            }}
                            style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13, boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Protocole</label>
                        <select value={currentErpConfig.ebics?.protocole || 'H004'} onChange={e => {
                          if (!erpConfigDrawer.entreprise) return
                          updateErpConfig(erpConfigDrawer.entreprise.id, { ebics: { ...currentErpConfig.ebics, protocole: e.target.value } })
                          setErpConfigModified(true)
                        }} style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13 }}>
                          <option value="H004">H004</option>
                          <option value="H005">H005</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Format</label>
                        <select value={currentErpConfig.ebics?.format || 'MT940'} onChange={e => {
                          if (!erpConfigDrawer.entreprise) return
                          updateErpConfig(erpConfigDrawer.entreprise.id, { ebics: { ...currentErpConfig.ebics, format: e.target.value } })
                          setErpConfigModified(true)
                        }} style={{ width: '100%', height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 10px', fontSize: 13 }}>
                          <option value="MT940">MT940</option>
                          <option value="CAMT053">CAMT053</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {erpConfigTab === 'criteres' && (
                <div>
                  <div style={{ marginBottom: 12, fontSize: 12, color: '#64748B', background: '#EEF3FC', padding: '10px 14px', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                    Ces critères définissent comment les flux ERP sont automatiquement rapprochés avec les mouvements CBS. La somme des poids actifs doit être égale à 100%.
                  </div>
                  {(() => {
                    const criteres = currentErpConfig?.criteres_rapprochement || {}
                    const somme = Object.values(criteres as any).filter((c: any) => c.actif).reduce((s: number, c: any) => s + (c.poids || 0), 0)
                    return (
                      <div style={{ marginBottom: 16, padding: '8px 14px', borderRadius: 6, background: somme === 100 ? '#DCFCE7' : somme > 100 ? '#FEE2E2' : '#FEF3C7', border: `1px solid ${somme === 100 ? '#86EFAC' : somme > 100 ? '#FCA5A5' : '#FCD34D'}` }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: somme === 100 ? '#16A34A' : somme > 100 ? '#DC2626' : '#D97706' }}>
                          Somme des poids actifs : {somme}% {somme === 100 ? '✓ Valide' : somme > 100 ? '⚠ Dépasse 100%' : '⚠ Doit être égal à 100%'}
                        </span>
                      </div>
                    )
                  })()}

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9' }}>
                        {['Critère', 'Actif', 'Poids (%)', 'Tolérance', 'Description'].map(col => (
                          <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentErpConfig && Object.entries(currentErpConfig.criteres_rapprochement).map(([key, crit]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #DDE3EF', height: 44 }}>
                          <td style={{ padding: '0 10px', fontWeight: 500 }}>{{ reference: 'Référence', montant: 'Montant', date_facture: 'Date de facture', contrepartie: 'Contrepartie', devise: 'Devise', libelle_cbs: 'Libellé CBS' }[key] || key}</td>
                          <td style={{ padding: '0 10px' }}>
                            <input type="checkbox" checked={(crit as any).actif} onChange={() => {
                              if (!erpConfigDrawer.entreprise) return
                              updateErpConfig(erpConfigDrawer.entreprise.id, {
                                criteres_rapprochement: {
                                  ...currentErpConfig.criteres_rapprochement,
                                  [key]: { ...(crit as any), actif: !(crit as any).actif, poids: !(crit as any).actif ? (crit as any).poids : 0 }
                                }
                              })
                              setErpConfigModified(true)
                            }} style={{ width: 16, height: 16, accentColor: '#1B2E5E', cursor: 'pointer' }} />
                          </td>
                          <td style={{ padding: '0 10px' }}>
                            <input type="number" min="0" max="100" value={(crit as any).poids} disabled={!(crit as any).actif} onChange={e => {
                              if (!erpConfigDrawer.entreprise) return
                              updateErpConfig(erpConfigDrawer.entreprise.id, {
                                criteres_rapprochement: { ...currentErpConfig.criteres_rapprochement, [key]: { ...(crit as any), poids: Number(e.target.value) } }
                              })
                              setErpConfigModified(true)
                            }} style={{ width: 60, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 8px', fontSize: 12, background: (crit as any).actif ? '#FFFFFF' : '#F8FAFC', color: (crit as any).actif ? '#1E293B' : '#94A3B8' }} />
                          </td>
                          <td style={{ padding: '0 10px' }}>
                            {key === 'montant' && (crit as any).actif && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <input type="number" min="0" max="10" step="0.5" value={(crit as any).tolerance_pct || 0} onChange={e => {
                                  if (!erpConfigDrawer.entreprise) return
                                  updateErpConfig(erpConfigDrawer.entreprise.id, {
                                    criteres_rapprochement: { ...currentErpConfig.criteres_rapprochement, [key]: { ...(crit as any), tolerance_pct: Number(e.target.value) } }
                                  })
                                  setErpConfigModified(true)
                                }} style={{ width: 50, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 6px', fontSize: 12 }} />
                                <span style={{ fontSize: 11, color: '#94A3B8' }}>%</span>
                              </div>
                            )}
                            {key === 'date_facture' && (crit as any).actif && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <input type="number" min="0" max="30" value={(crit as any).tolerance_jours || 2} onChange={e => {
                                  if (!erpConfigDrawer.entreprise) return
                                  updateErpConfig(erpConfigDrawer.entreprise.id, {
                                    criteres_rapprochement: { ...currentErpConfig.criteres_rapprochement, [key]: { ...(crit as any), tolerance_jours: Number(e.target.value) } }
                                  })
                                  setErpConfigModified(true)
                                }} style={{ width: 50, height: 28, border: '1px solid #DDE3EF', borderRadius: 4, padding: '0 6px', fontSize: 12 }} />
                                <span style={{ fontSize: 11, color: '#94A3B8' }}>jours</span>
                              </div>
                            )}
                            {!['montant', 'date_facture'].includes(key) && <span style={{ color: '#94A3B8', fontSize: 11 }}>—</span>}
                          </td>
                          <td style={{ padding: '0 10px', color: '#64748B', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11 }}>{(crit as any).description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 16, padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #DDE3EF' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2E5E', marginBottom: 10 }}>Seuils de décision</div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 2, background: '#16A34A' }} />
                        <span style={{ fontSize: 12 }}>Score ≥</span>
                        <input type="number" min="0" max="100" value={currentErpConfig?.score_minimum_auto || 70} onChange={e => {
                          if (!erpConfigDrawer.entreprise) return
                          updateErpConfig(erpConfigDrawer.entreprise.id, { score_minimum_auto: Number(e.target.value) })
                          setErpConfigModified(true)
                        }} style={{ width: 60, height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 8px', fontSize: 12 }} />
                        <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>% → Rapprochement automatique ✓</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 2, background: '#D97706' }} />
                        <span style={{ fontSize: 12 }}>Score ≥</span>
                        <input type="number" min="0" max="100" value={currentErpConfig?.score_minimum_suggestion || 40} onChange={e => {
                          if (!erpConfigDrawer.entreprise) return
                          updateErpConfig(erpConfigDrawer.entreprise.id, { score_minimum_suggestion: Number(e.target.value) })
                          setErpConfigModified(true)
                        }} style={{ width: 60, height: 34, border: '1px solid #DDE3EF', borderRadius: 6, padding: '0 8px', fontSize: 12 }} />
                        <span style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>% → Suggestion manuelle 📋</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {erpConfigTab === 'modules' && (
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12, background: '#EEF3FC', padding: '10px 14px', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                    Les modules activés ici définissent ce que l&apos;Admin Client peut activer côté entreprise. Désactiver un module le rend inaccessible pour l&apos;entreprise.
                  </div>
                  {[
                    { key: 'dashboard', label: 'Tableau de bord', desc: 'Vue KPIs et graphiques' },
                    { key: 'flux', label: 'Flux déclarés', desc: 'Saisie flux prévisionnels' },
                    { key: 'prevision', label: 'Prévision de trésorerie', desc: 'Simulation scénarios' },
                    { key: 'rapprochement', label: 'Rapprochement bancaire', desc: 'Matching ERP/CBS EBICS' },
                    { key: 'multidevises', label: 'Multi-devises', desc: 'Optimisation comptes devises' },
                    { key: 'erp', label: 'Interface ERP/EBICS', desc: 'Connexion et import ERP' },
                    { key: 'alertes', label: 'Alertes de trésorerie', desc: 'Notifications et seuils' },
                    { key: 'reporting', label: 'Reporting', desc: 'Rapports et exports' },
                  ].map(module => {
                    const enterpriseData = entreprises.find(e => e.id === erpConfigDrawer.entreprise?.id)
                    const isActive = !!enterpriseData?.modules_actifs?.includes(module.key)
                    return (
                      <div key={module.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{module.label}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{module.desc}</div>
                        </div>
                        <div
                          onClick={() => {
                            if (!erpConfigDrawer.entreprise) return
                            setEntreprises(prev => prev.map(ent => {
                              if (ent.id !== erpConfigDrawer.entreprise?.id) return ent
                              const newModules = isActive
                                ? ent.modules_actifs.filter(m => m !== module.key)
                                : [...(ent.modules_actifs || []), module.key]
                              return { ...ent, modules_actifs: newModules }
                            }))
                            setErpConfigModified(true)
                          }}
                          style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: isActive ? '#1B2E5E' : '#DDE3EF', position: 'relative', transition: 'background 200ms', flexShrink: 0 }}
                        >
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#FFFFFF', position: 'absolute', top: 3, left: isActive ? 23 : 3, transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #DDE3EF',
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setErpConfigDrawer({ open: false, entreprise: null })}
                style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#FFFFFF',
                  color: '#1B2E5E',
                  border: '1px solid #1B2E5E',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setErpSaveLoading(true)
                  setTimeout(() => {
                    setErpSaveLoading(false)
                    setErpConfigModified(false)
                    addToast(`Configuration ERP de ${erpConfigDrawer.entreprise?.nom} enregistrée`, 'success')
                    setErpConfigDrawer({ open: false, entreprise: null })
                  }, 1000)
                }}
                disabled={erpSaveLoading || !erpConfigModified}
                style={{
                  height: 34,
                  padding: '0 16px',
                  background: erpConfigModified ? '#1B2E5E' : '#94A3B8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: erpConfigModified ? 'pointer' : 'not-allowed',
                  fontWeight: 500
                }}
              >
                {erpSaveLoading ? 'Enregistrement...' : '💾 Enregistrer la configuration ERP'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Drawer: Dossier Entreprise */}
      {dossierOpen && dossierEntreprise && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000
        }}
        onClick={() => { setDossierOpen(false); setDossierEntreprise(null) }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 560,
              background: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #DDE3EF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', margin: 0 }}>
                {dossierEntreprise.nom}
              </h3>
              <button
                onClick={() => { setDossierOpen(false); setDossierEntreprise(null) }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: '#94A3B8'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Sub-tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #DDE3EF',
              paddingLeft: 20
            }}>
              {[
                { key: 'overview', label: 'Vue d\'ensemble' },
                { key: 'flux', label: 'Flux récents' },
                { key: 'alertes', label: 'Alertes' },
                { key: 'prevision', label: 'Prévision' },
                  { key: 'cbs', label: 'Historique CBS' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDossierTab(tab.key as any)}
                  style={{
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: dossierTab === tab.key ? '2px solid #1B2E5E' : '2px solid transparent',
                    marginBottom: -1,
                    color: dossierTab === tab.key ? '#1B2E5E' : '#64748B',
                    fontWeight: dossierTab === tab.key ? 600 : 500,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
              {/* Overview */}
              {dossierTab === 'overview' && (
                <div>
                  {/* KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                    {[
                      { label: 'Solde consolidé', value: dossierEntreprise.solde_consolide_mad.toLocaleString('fr-FR'), color: '#16A34A' },
                      { label: 'Flux en attente', value: dossierEntreprise.flux_en_attente, color: '#D97706' },
                      { label: 'Alertes actives', value: dossierEntreprise.nb_alertes, color: '#DC2626' },
                    ].map(kpi => (
                      <div key={kpi.label} style={{ background: '#F8FAFC', border: `1px solid ${kpi.color}40`, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{kpi.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Accounts table */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>Comptes associés</div>
                    <div style={{ border: '1px solid #DDE3EF', borderRadius: 8, overflow: 'hidden' }}>
                      {MOCK_COMPTES.filter(c => c.entreprise_id === dossierEntreprise.id).map(c => (
                        <div key={c.id} style={{ padding: '12px', borderBottom: '1px solid #DDE3EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>{c.account_number}</div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>{c.banque}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600 }}>{c.solde.toLocaleString('fr-FR')} {c.devise}</div>
                            <div style={{ fontSize: 11, color: c.solde > c.seuil_min ? '#16A34A' : '#DC2626' }}>
                              {c.solde > c.seuil_min ? '✓ OK' : '⚠ Seuil atteint'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Modules actifs */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', marginBottom: 8 }}>Modules actifs</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {dossierEntreprise.modules_actifs.map(m => (
                        <div key={m} style={{ background: '#1B2E5E', color: '#FFFFFF', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Flux récents */}
              {dossierTab === 'flux' && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>10 derniers flux</div>
                  <div style={{ border: '1px solid #DDE3EF', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                    {(() => {
                      const accountNumbers = MOCK_COMPTES.filter(c => c.entreprise_id === dossierEntreprise.id).map(c => c.account_number)
                      return MOCK_FLUX.filter(f => accountNumbers.includes(f.account_number)).slice(0, 10)
                    })().map(f => (
                      <div key={f.id} style={{ padding: '12px', borderBottom: '1px solid #DDE3EF', fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ fontWeight: 600, color: '#1E293B' }}>{f.reference}</div>
                          <div style={{ background: f.sens === 'ENCAISSEMENT' ? '#DCFCE7' : '#FEE2E2', color: f.sens === 'ENCAISSEMENT' ? '#16A34A' : '#DC2626', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                            {f.sens === 'ENCAISSEMENT' ? '↓ Entrée' : '↑ Sortie'}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{f.contrepartie} • {f.montant} {f.devise}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{f.date_previsionnelle}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const accountNumbers = MOCK_COMPTES.filter(c => c.entreprise_id === dossierEntreprise.id).map(c => c.account_number)
                      const fluxEntreprise = flux.filter(f => accountNumbers.includes(f.account_number))
                      const csv = ['Référence;Compte;Source;Sens;Contrepartie;Montant;Devise;Date prév.;Statut', ...fluxEntreprise.map(f => `${f.reference};${f.account_number};${f.source};${f.sens};${f.contrepartie};${f.montant};${f.devise};${f.date_previsionnelle};${f.statut}`)].join('\n')
                      handleDossierExport('flux_dossier', `flux_${dossierEntreprise.client_code}_${new Date().toISOString().slice(0,10)}.csv`, csv)
                    }}
                    style={{
                      width: '100%',
                      height: 34,
                      background: '#FFFFFF',
                      color: '#1B2E5E',
                      border: '1px solid #1B2E5E',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    ⬇ Exporter flux CSV
                  </button>
                </div>
              )}
              
              {/* Alertes */}
              {dossierTab === 'alertes' && (
                <div>
                  {(() => {
                    const accountNumbers = MOCK_COMPTES.filter(c => c.entreprise_id === dossierEntreprise.id).map(c => c.account_number)
                    const alertesEntreprise = alertes.filter(a => accountNumbers.includes(a.account_number) && !a.dismissed)
                    if (alertesEntreprise.length === 0) {
                      return (
                    <div style={{ textAlign: 'center', padding: 20, color: '#16A34A' }}>
                      <CheckCircle size={32} style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 12 }}>✓ Aucune alerte active</div>
                    </div>
                      )
                    }
                    return alertesEntreprise.map(a => (
                      <div key={a.id} style={{
                        background: a.severity === 'CRITICAL' ? '#FEE2E2' : '#FEF3C7',
                        border: `1px solid ${a.severity === 'CRITICAL' ? '#DC2626' : '#D97706'}`,
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 8,
                        fontSize: 12
                      }}>
                        <div style={{ fontWeight: 600, color: a.severity === 'CRITICAL' ? '#DC2626' : '#B45309', marginBottom: 4 }}>{a.titre}</div>
                        <div style={{ color: a.severity === 'CRITICAL' ? '#991B1B' : '#92400E', fontSize: 11 }}>{a.message}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button
                            onClick={() => addToast(`✉ Email de notification envoyé à ${dossierEntreprise.nom}`, 'info')}
                            style={{ height: 28, padding: '0 12px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 5, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Mail size={11} /> Contacter l&apos;entreprise
                          </button>
                          <button
                            onClick={() => {
                              setAlertes(prev => prev.map(x => x.id === a.id ? { ...x, dismissed: true, traite_par: 'Backoffice', traite_le: new Date().toLocaleDateString('fr-FR') } : x))
                              addToast(`✓ Alerte "${a.titre}" marquée comme traitée`, 'success')
                            }}
                            style={{ height: 28, padding: '0 12px', background: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: 5, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <CheckCircle size={11} /> Marquer comme traitée
                          </button>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              )}
              
              {/* Prévision */}
              {dossierTab === 'prevision' && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>Prévision de trésorerie — 30 jours</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {[
                      { label: 'Position J+7', value: (dossierEntreprise.solde_consolide_mad + 180000).toLocaleString('fr-FR'), color: '#3B6FD4' },
                      { label: 'Position J+30', value: (dossierEntreprise.solde_consolide_mad + 420000).toLocaleString('fr-FR'), color: '#3B6FD4' },
                      { label: 'Position J+90', value: (dossierEntreprise.solde_consolide_mad + 890000).toLocaleString('fr-FR'), color: '#3B6FD4' },
                    ].map(kpi => (
                      <div key={kpi.label} style={{ background: '#EEF3FC', border: '1px solid #3B6FD4', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{kpi.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={TIME_SERIES.slice(0, 30)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="solde" stroke="#3B6FD4" dot={false} name="Solde prévisionnel" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {/* Historique CBS */}
              {(dossierTab === 'cbs' || dossierTab === 'historique_cbs') && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', marginBottom: 12 }}>10 dernières synchros</div>
                  <div style={{ border: '1px solid #DDE3EF', borderRadius: 8, overflow: 'hidden' }}>
                    {cbsSyncs.slice(0, 10).map((sync, i) => (
                      <div key={i} style={{ padding: '12px', borderBottom: i < cbsSyncs.length - 1 ? '1px solid #DDE3EF' : 'none', fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ fontWeight: 600, color: '#1E293B' }}>{sync.date} {sync.heure}</div>
                          <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                            {sync.statut}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                          Format: {sync.format} • {sync.nb_enregistrements} enregistrements • {sync.duree_ms}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #DDE3EF',
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  const comptes = MOCK_COMPTES.filter(c => c.entreprise_id === dossierEntreprise.id)
                  const accountNumbers = comptes.map(c => c.account_number)
                  const fluxEntreprise = flux.filter(f => accountNumbers.includes(f.account_number))
                  const alertesEntreprise = alertes.filter(a => accountNumbers.includes(a.account_number) && !a.dismissed)
                  const rapport = [
                    `RAPPORT CLIENT — ${dossierEntreprise.nom}`,
                    `Code: ${dossierEntreprise.client_code} | Segment: ${dossierEntreprise.segment} | Statut: ${dossierEntreprise.statut}`,
                    `Date génération: ${new Date().toLocaleDateString('fr-FR')}`,
                    '',
                    'COMPTES',
                    'Compte;Banque;Devise;Solde;Seuil min;Statut seuil',
                    ...comptes.map(c => `${c.account_number};${c.banque};${c.devise};${c.solde};${c.seuil_min};${c.solde > c.seuil_min ? 'OK' : c.solde > c.seuil_critique ? 'Attention' : 'Critique'}`),
                    '',
                    'FLUX EN ATTENTE',
                    'Référence;Sens;Contrepartie;Montant;Devise;Date prév.',
                    ...fluxEntreprise.filter(f => f.statut === 'EN_ATTENTE').map(f => `${f.reference};${f.sens};${f.contrepartie};${f.montant};${f.devise};${f.date_previsionnelle}`),
                    '',
                    'ALERTES ACTIVES',
                    'Type;Message;Date',
                    ...alertesEntreprise.map(a => `${a.type};${a.message};${a.date}`),
                  ].join('\n')
                  handleDossierExport('rapport_dossier', `rapport_${dossierEntreprise.client_code}_${new Date().toISOString().slice(0,10)}.csv`, rapport)
                }}
                style={{
                  height: 34,
                  padding: '0 16px',
                  background: '#FFFFFF',
                  color: '#1B2E5E',
                  border: '1px solid #1B2E5E',
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                📊 Générer rapport
              </button>
              <button
                onClick={() => {
                  const accountNumbers = MOCK_COMPTES.filter(c => c.entreprise_id === dossierEntreprise.id).map(c => c.account_number)
                  const fluxEntreprise = flux.filter(f => accountNumbers.includes(f.account_number))
                  const csv = ['Référence;Compte;Source;Sens;Contrepartie;Montant;Devise;Date prév.;Statut', ...fluxEntreprise.map(f => `${f.reference};${f.account_number};${f.source};${f.sens};${f.contrepartie};${f.montant};${f.devise};${f.date_previsionnelle};${f.statut}`)].join('\n')
                  handleDossierExport('flux_dossier_footer', `flux_${dossierEntreprise.client_code}_${new Date().toISOString().slice(0,10)}.csv`, csv)
                }}
                style={{ height: 34, padding: '0 16px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}
              >
                ⬇ Exporter flux
              </button>
              <button onClick={() => { setDossierOpen(false); setDossierEntreprise(null) }} style={{ height: 34, padding: '0 16px', background: '#FFFFFF', color: '#1B2E5E', border: '1px solid #1B2E5E', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
} 
