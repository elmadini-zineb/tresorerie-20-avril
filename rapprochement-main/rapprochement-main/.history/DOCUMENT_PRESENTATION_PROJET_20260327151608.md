# Guide de présentation — Adria Treasury (Rapprochement Bancaire)

## 1) Objectif de l’application
Cette application sert à **contrôler la trésorerie** en reliant :
- les **factures** (clients et fournisseurs),
- les **mouvements bancaires**,
- et les **rapports comptables/fiscaux** (CPC, TVA).

But principal : réduire les écarts, accélérer la justification et fiabiliser les reportings.

---

## 2) Profils et accès

## Rôles
- **Trésorier** : travaille sur les opérations (factures, rapprochement, rapports).
- **Admin Client** : administration de la plateforme côté client.
- **Admin Banque** : administration de la plateforme côté banque.

## Restriction importante
- **Paramètres** est maintenant réservé à :
  - **Admin Client**
  - **Admin Banque**
- Le **Trésorier** n’y a pas accès.

## Comptes de démonstration
- Trésorier : `tresorier@adria.ma` / `password`
- Admin Client : `admin@adria.ma` / `password`
- Admin Banque : `admin.banque@adria.ma` / `password`

---

## 3) Navigation globale

## Côté Trésorier
- `Tableau de bord`
- `Référentiels` → `Fournisseurs`, `Clients`
- `Factures` → `Reçues`, `Émises`
- `Rapprochement Bancaire`
- `Rapports` → `État de rapprochement`, `CPC`, `TVA`

## Côté Admin (Client/Banque)
- `Administration` (dashboard admin)
- `File de validation`
- `Configuration règles`
- `Gestion utilisateurs`
- `Paramètres`

---

## 4) Comprendre chaque page (version simple)

## 4.1 Tableau de bord (Trésorier)
### KPI (cartes du haut)
- **Factures en attente** : volume de travail restant.
- **Rapprochées ce mois** : productivité de rapprochement.
- **Écarts détectés** : anomalies à traiter.
- **TVA nette estimée** : tendance fiscale (indication rapide).

### Blocs graphiques
Il y a 2 blocs :
1. **Factures Clients**
2. **Factures Fournisseurs**

Dans chaque bloc :
- Colonne de stats :
  - **À valider** : factures en attente de validation.
  - **Non payé** : factures ouvertes non réglées.
  - **En retard** : retard de paiement (priorité). 
- Histogramme 3 barres :
  - **Dû** : déjà exigible.
  - **Cette semaine** : échéances immédiates.
  - **À venir** : futur proche.

### Alertes
- Messages d’action rapide (bloquées, écarts, validations).
- Chaque alerte pointe vers une page de traitement.

---

## 4.2 Référentiels (Fournisseurs / Clients)
- Ce sont les **fiches maîtres** de tiers.
- Champs utiles : ICE, ville, mode de paiement, délai, statut.
- Actions : **créer**, **modifier**, **archiver**.
- Barre de recherche + pagination pour filtrer rapidement.

Pourquoi c’est important :
- Un référentiel propre améliore la qualité du rapprochement.

---

## 4.3 Factures
- Deux onglets :
  - **Factures Reçues (Débit)**
  - **Factures Émises (Crédit)**
- Colonnes clés : numéro, tiers, dates, HT/TVA/TTC, statut, source (ERP/OCR/Manuelle).
- Filtres : recherche + statut.
- Actions : voir/éditer + créer ou importer OCR.

Rôle métier :
- C’est la base de calcul pour le rapprochement, le CPC et la TVA.

---

## 4.4 Rapprochement Bancaire (page la plus importante)
### Logique de rapprochement
1. **Si le numéro de facture existe des deux côtés** (facture et mouvement), on fait un **match direct par numéro**.
2. Sinon, on utilise les **3 autres filtres** :
   - **Tiers** (fournisseur/client),
   - **Montant**,
   - **Date**.

### Score de rapprochement
Le score total est sur 100, composé de :
- **Montant** (max 40)
- **Date** (max 25)
- **Référence facture** (max 25)
- **Contrepartie** (max 10)

### Statuts visibles
- **RAPPROCHÉE** : correspondance validée.
- **ÉCART DÉTECTÉ** : écart trouvé, justification demandée.
- **NON RAPPROCHÉE** : pas de mouvement correspondant.

### Zone de justification
Pour les écarts :
- le trésorier saisit une justification,
- la justification part ensuite dans la **file de validation admin**.

---

## 4.5 Rapports

### A) État de Rapprochement
- Vue consolidée banque vs factures.
- Sections :
  - synthèse (solde banque, total factures, rapprochées, écart global),
  - tableau des mouvements,
  - tableau de correspondance facture/paiement,
  - tableau des écarts.
- Sert au contrôle interne et audit de cohérence.

### B) CPC (Compte de Produits et Charges)
- Structure légale marocaine complète :
  - **Section E (Exploitation)**
  - **Section F (Financier)**
  - **Section N.C. (Non courant)**
- Calcule automatiquement les totaux et résultats (I à XVI).
- **IS (Impôt sur les résultats)** modifiable manuellement.
- Export PDF/Excel.

Utilité :
- Suivre le résultat d’exploitation, financier, non courant et net.

### C) TVA
- 2 blocs :
  - **TVA collectée** (ventes)
  - **TVA déductible** (achats)
- La TVA nette = collectée − déductible.
- Affiche soit **TVA due**, soit **crédit TVA**.
- Détail par facture (tiers, taux, base HT, TVA, statut).

Règle métier affichée :
- les calculs se basent sur factures **RAPPROCHÉES** ou **JUSTIFIÉES**.

---

## 4.6 Administration

### A) Dashboard Admin
- Gestion des clients entreprise de la plateforme.
- KPI : nombre clients, revenus mensuels, utilisateurs, etc.
- Table de gestion avec création, édition, suppression.

### B) File de validation
- Reçoit les factures justifiées à valider/rejeter.
- L’admin peut consulter la justification puis **approuver** ou **rejeter**.

### C) Configuration règles
- Paramètres de l’algorithme :
  - seuil d’auto-rapprochement,
  - seuil d’écart,
  - tolérance montant,
  - tolérance date.

### D) Gestion utilisateurs
- Gestion des trésoriers actifs (ajout, modification, activation/désactivation, suppression).

### E) Paramètres (Admin only)
- Entreprise, profil, notifications, sécurité, apparence/langue.
- Non accessible au trésorier.

---

## 5) Flux métier complet (résumé)
1. Créer/mettre à jour tiers (clients/fournisseurs).
2. Saisir/importer factures.
3. Lancer rapprochement bancaire.
4. Traiter les écarts (justifier).
5. Validation admin des cas justifiés.
6. Générer rapports : État de rapprochement, CPC, TVA.
7. Export PDF/Excel pour partage/contrôle.

---

## 6) Script court pour ta démo de demain (5–8 min)
1. Connexion **Trésorier**.
2. Montrer Dashboard (KPI + 2 graphes + alertes).
3. Ouvrir Factures (filtres + statuts + source).
4. Ouvrir Rapprochement et expliquer la règle :
   - numéro facture d’abord,
   - sinon tiers + montant + date,
   - puis score et justification.
5. Montrer Rapports (État, CPC, TVA) + exports.
6. Se connecter en **Admin Client** ou **Admin Banque**.
7. Montrer file de validation + configuration règles + gestion utilisateurs + paramètres.
8. Conclure : contrôle, traçabilité, conformité.

---

## 7) Messages clés à retenir pendant la présentation
- L’application combine **opérationnel** (factures/rapprochement) et **pilotage** (rapports).
- Le rapprochement est **prioritairement par numéro de facture**, puis par **tiers + montant + date**.
- Les rôles sont séparés :
  - Trésorier = exécution métier,
  - Admins = gouvernance/validation/configuration.
- Les rapports CPC/TVA s’appuient sur des données fiabilisées par le rapprochement.
