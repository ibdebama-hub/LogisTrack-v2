# RAPPORT D'ARCHITECTURE ET ÉTAT DES LIEUX TECHNIQUE — LOGISTRACK V2

**Projet :** LOGISTRACK V2  
**Type d'application :** Plateforme SaaS Multi-Tenant Hybride de Distribution de Factures/Courriers & Livraison Colis avec Suivi GPS et Contrôle des Preuves de Livraison (POD)  
**Date du rapport :** 6 Août 2026  
**Destinataire :** Architecte Logiciel / Équipe de Développement  
**Auteur :** Assistant AI — Antigravity Engineering  

---

## 1. Présentation générale

### 1.1 Objectif du projet
**LOGISTRACK V2** est une solution SaaS logistique hybride conçue pour répondre aux défis spécifiques de la distribution de masse et de la livraison du dernier kilomètre en Afrique de l'Ouest et Centrale. Elle permet de gérer simultanément :
1. **La distribution massive de factures et courriers** (sociétés d'eau, d'électricité, télécoms, banques) sans adressage normalisé, basée sur des repères visuels géolocalisés.
2. **La livraison de colis e-commerce avec encaissement COD** (*Cash on Delivery* / Mobile Money / Carte).
3. **Le contrôle certifié des Preuves de Livraison (POD)** via signature numérique, photo horodatée/géolocalisée, et validation OTP.
4. **La collaboration multi-acteurs** à travers 4 portails applicatifs cloisonnés : Master Admin SaaS, Entreprise Logistique / Transporteur, Donneurs d'Ordres B2B et Agents de terrain.

### 1.2 Technologies utilisées
- **Frontend / Framework Web :** Next.js 14.2.5 (App Router, Server Components & Client Components), React 18.3.1, TypeScript 5.5.4.
- **Styling & UI :** Tailwind CSS 3.4.9, PostCSS, Lucide React (icônes), `clsx` et `tailwind-merge`.
- **Backend & Base de données :** Supabase (PostgreSQL 15 avec extension `uuid-ossp` et `postgis`).
- **Authentification & Sécurité :** Supabase Auth avec JWT, Row-Level Security (RLS) multi-tenant natif, Middleware Next.js RBAC.
- **Traitement de données & Fichiers :** SheetJS (`xlsx` 0.18.5) pour le parsing/import/export Excel & CSV volumineux, `date-fns` 3.6.0.
- **Cartographie :** Leaflet 1.9.4 & OpenStreetMap (avec intégration de repères visuels).

### 1.3 Architecture générale
L'application repose sur le pattern **Next.js App Router** couplé à une base de données **Supabase PostgreSQL multi-tenant**.

```
[ B2B Clients ]    [ Logistics Dispatchers ]    [ Field Agents PWA ]    [ Master Admin ]
       │                      │                         │                      │
       └──────────────────────┼─────────────────────────┴──────────────────────┘
                              ▼
                     [ Next.js Middleware ]
               (Role-Based Access Control - RBAC)
                              │
                              ▼
                    [ Next.js App Router ]
           (Layouts & Server/Client Components)
                              │
                              ▼
               [ Supabase Realtime & RPC ]
                              │
                              ▼
                 [ PostgreSQL 15 Database ]
            (Row Level Security Isolation Policies)
```

### 1.4 Dépendances principales (`package.json`)
- `@supabase/supabase-js`: `^2.45.0`
- `next`: `14.2.5`
- `react` / `react-dom`: `^18.3.1`
- `typescript`: `^5.5.4`
- `tailwindcss`: `^3.4.9`
- `leaflet` / `@types/leaflet`: `^1.9.4`
- `lucide-react`: `^0.427.0`
- `xlsx`: `^0.18.5`
- `date-fns`: `^3.6.0`

---

## 2. Modules existants

### Module 1 : Master Admin SaaS (Gestion Multi-Tenant & Quotas)
- **Objectif :** Administrer la plateforme SaaS au plus haut niveau. Superviser l'ensemble des entreprises logistiques clientes (Tenants), gérer leurs forfaits, surveiller la consommation de leurs quotas d'items et générer la facturation SaaS.
- **État :** **Terminé / Avancé** (UI 100%, Mock/Service 95%, RLS 100%).
- **Fonctionnalités développées :**
  - Dashboard de supervision SaaS avec ARR/MRR et métriques d'utilisation global.
  - Table de gestion des entreprises logistiques (Tenants) avec modification de statut, plan, et réinitialisation de clé API.
  - Modale de configuration des quotas d'items et agents max par entreprise.
  - Service de contrôle dynamique des quotas (`quotaService.ts`).
  - Suivi de la facturation inter-entreprises.
- **Fonctionnalités restantes :** Automatisation des paiements Stripe/Mobile Money pour le réabonnement SaaS.
- **Dépendances :** Supabase Auth, Tables `organizations`, `subscriptions`.

### Module 2 : Distribution & Dispatching Opérationnel
- **Objectif :** Importer de grands volumes de factures/colis, constituer des lots par zone géographique (Lotting) et affecter automatiquement ou manuellement les tournées aux agents de terrain.
- **État :** **En cours / Avancé** (UI 90%, Logique métier 85%).
- **Fonctionnalités développées :**
  - Vue d'ensemble opérationnelle des expéditions et états de distribution.
  - Moteur d'affectation de lots par zone/secteur (`BatchAssignment.tsx`).
  - Filtrage multicritère par statut, campagne, agent et zone.
  - Répartition dynamique des volumes de distribution par agent.
- **Fonctionnalités restantes :** Algorithme de dispatching automatique basé sur la charge courante de l'agent.
- **Dépendances :** Modules Territoires, Flotte Agents, Campaigns, DB Tables `distribution_campaigns`, `batches`, `items`.

### Module 3 : Preuves de Livraison - POD (Proof of Delivery)
- **Objectif :** Capturer, certifier et auditer les preuves d'exécution de delivery (signatures, photos horodatées/géolocalisées, codes OTP).
- **État :** **Terminé / Avancé** (UI 100%, Canvas 100%, Modales d'audit 95%).
- **Fonctionnalités développées :**
  - Hub de validation et certification des POD (`PoDValidationHub.tsx`).
  - Canvas de capture de signature tactile/souris (`SignatureCanvas.tsx`).
  - Modale de décharge et proxy (livraison à un tiers avec enregistrement CNI/relation).
  - Modale de déclaration d'échec avec motifs standardisés (déménagement, téléphone inatteignable, accès refusé, etc.).
  - Tiroir de résolution d'anomalies POD avec statut CERTIFIED/REJECTED/ANOMALY.
- **Fonctionnalités restantes :** Reconnaissance d'image OCR automatique sur la photo de la décharge physique.
- **Dépendances :** DB Table `proof_of_delivery`, `items`.

### Module 4 : Finance, Recouvrement COD & Facturation B2B
- **Objectif :** Gérer l'encaissement des fonds lors des livraisons contre remboursement (COD), effectuer la réconciliation de caisse entre agents et caissiers, appliquer les grilles tarifaires et émettre la facturation B2B aux donneurs d'ordres.
- **État :** **En cours / Avancé** (UI 85%, Service 80%).
- **Fonctionnalités développées :**
  - Module de réconciliation COD Caisse (`CodReconciliation.tsx`).
  - Liste et filtrage des transactions COD par statut d'encaissement (Cash, Mobile Money, Chèque).
  - Génération et visualisation des factures B2B (`B2BInvoiceList.tsx`, `InvoicePreviewModal.tsx`).
  - Configuration des grilles tarifaires par zone et type d'opération (`RateMatrixConfig.tsx`).
  - Export des rapports financiers (PDF/Excel).
- **Fonctionnalités restantes :** Interconnexion directe avec les API Mobile Money (Orange Money, Wave, MTN MoMo) pour la réconciliation automatique.
- **Dépendances :** DB Tables `billing_invoices`, `items`, `clients`.

### Module 5 : Flotte Agents & Gestion des Territoires
- **Objectif :** Administrer la flotte de coureurs/agents de terrain, configurer la découpe géographique (Région > Ville > Zone > Quartier) et assigner les territoires d'intervention.
- **État :** **Terminé / Avancé** (UI 95%, RLS 100%).
- **Fonctionnalités développées :**
  - Table globale de la flotte d'agents avec jauges de charge, niveau de batterie mobile et statut.
  - Modales de création/édition d'agents (`CreateAgentModal.tsx`, `AgentFormModal.tsx`).
  - Tiroir de détail agent avec historique de performance et taux de succès POD.
  - Matrice d'affectation agent / zone / quartier (`AgentTerritoryAssignment.tsx`).
- **Fonctionnalités restantes :** Gestion des plannings de présence et congés des agents.
- **Dépendances :** DB Tables `profiles`, `zones`, `districts`, `agent_assignments`.

### Module 6 : Portail Client B2B (Donneurs d'Ordres)
- **Objectif :** Offrir aux entreprises clientes (Banques, Télécoms, Énergie, E-commerce) un espace dédié et strictly isolé pour suivre leurs campagnes, soumettre des listes d'items à distribuer et télécharger les POD certifiées.
- **État :** **En cours / Avancé** (UI 90%, Isolation RLS 100%).
- **Fonctionnalités développées :**
  - Tableau de bord B2B avec taux de distribution en temps réel (`ClientDashboard.tsx`).
  - Espace d'upload auto-service de fichiers de campagnes (`ClientFileUpload.tsx`).
  - Visualiseur et téléchargeur de preuves POD certifiées (`ClientPoDViewer.tsx`).
  - Visualiseur des factures de prestation dues (`ClientBillingViewer.tsx`).
- **Fonctionnalités restantes :** Webhooks B2B pour notifier le SI du client dès qu'une facture est marquée distribuée.
- **Dépendances :** Realtime Broadcast, RLS Policies `b2b_client_*`, DB Tables `distribution_campaigns`, `items`, `proof_of_delivery`.

### Module 7 : Importation / Exportation & Génération de Manifestes
- **Objectif :** Assurer l'ingestion massive de milliers de lignes de factures/colis (CSV/Excel) avec validation en amont, détection d'erreurs d'adresse, vérification des quotas SaaS et impression de bordereaux d'accompagnement (Manifestes).
- **État :** **Terminé / Avancé** (UI 100%, Processing Chunked 100%).
- **Fonctionnalités développées :**
  - Gestionnaire d'import CSV/Excel par lots (`CSVBatchImportManager.tsx`, `MassImportModal.tsx`).
  - Moteur de parsing ultra-rapide par blocs (Chunked Batch Insert de 500 items).
  - Validation et nettoyage automatique des numéros de téléphone et adresses.
  - Générateur et modale d'impression de bordereaux/manifestes de tournée (`BatchManifestPrintModal.tsx`).
- **Fonctionnalités restantes :** Cartographie automatique des colonnes personnalisées par IA.
- **Dépendances :** RPC `bulk_insert_invoices`, `QuotaService`, `xlsx`.

### Module 8 : PWA Mobile Agent Terrain (Application Coureur)
- **Objectif :** Fournir aux agents sur le terrain une interface mobile ultra-legère pour scanner les colis/factures, exécuter les tournées et capturer les preuves POD même en zone à faible connectivité.
- **État :** **En cours** (UI 70%, Scanner 80%).
- **Fonctionnalités développées :**
  - Scanner rapide par caméra / douche code-barres (`RapidBatchScanner.tsx`).
  - Vue synthétique de la tournée attribuée.
- **Fonctionnalités restantes :** Mode 100% Offline-First avec synchronisation IndexedDB / ServiceWorker background sync.
- **Dépendances :** HTML5 Camera Stream / Quagga / ZXing, RLS `field_agent_*`.

### Module 9 : Cartographie & Tracking GPS Live
- **Objectif :** Visualiser en direct la position GPS des agents et afficher le taux de couverture géographique des campagnes de distribution sur carte interactive.
- **État :** **En cours** (UI 80%, Intégration OSM 70%).
- **Fonctionnalités développées :**
  - Carte de suivi en direct du dispatcher (`LiveDispatcherMap.tsx`).
  - Carte de densité et repères par zone (`LiveZoneMap.tsx`).
  - Indicateurs de progression géographique en temps réel.
- **Fonctionnalités restantes :** Migration du composant d'overlay vers l'instance native Leaflet DOM avec marqueurs SVG animés et clusters.
- **Dépendances :** Leaflet, Extension PostGIS dans PostgreSQL.

---

## 3. Arborescence

```
LOGISTRACK V2/
├── .env.example
├── PROJECT_STATUS.md                      # Rapport et état des lieux technique du projet
├── next-env.d.ts
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── public/
├── supabase/
│   ├── schema.sql                         # Schéma global PostgreSQL + Enums + Tables + RLS
│   └── migrations/
│       ├── 01_security_rls_policies.sql   # Migration RLS & Fonctions helper JWT
│       └── 20260806000000_multi_tenant_rls_policies.sql
└── src/
    ├── middleware.ts                      # Route Guard & RBAC (Role-Based Access Control)
    ├── app/                               # Next.js App Router Pages & Layouts
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx                       # Landing Page / Démo Présentation
    │   ├── login/
    │   │   └── page.tsx                   # Page de connexion multi-rôles
    │   ├── (dashboard)/                   # Portal Transporteur / Dispatcher
    │   │   ├── layout.tsx
    │   │   ├── overview/page.tsx
    │   │   ├── dispatch/page.tsx
    │   │   ├── pod/page.tsx
    │   │   ├── cod/page.tsx
    │   │   ├── finance/page.tsx
    │   │   ├── agents/page.tsx
    │   │   ├── import/page.tsx
    │   │   └── settings/page.tsx
    │   ├── client-portal/                 # Portal Donneurs d'Ordres B2B
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── overview/page.tsx
    │   │   ├── campaigns/page.tsx
    │   │   ├── upload/page.tsx
    │   │   ├── pod/page.tsx
    │   │   ├── billing/page.tsx
    │   │   └── settings/page.tsx
    │   ├── master-admin/                  # Portal Master Admin SaaS
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── overview/page.tsx
    │   │   ├── tenants/page.tsx
    │   │   ├── plans/page.tsx
    │   │   ├── billing/page.tsx
    │   │   └── settings/page.tsx
    │   └── (agent)/                       # Portal Agent Mobile PWA
    │       ├── tournee/page.tsx
    │       └── scan/page.tsx
    ├── components/
    │   ├── layout/                        # Sidebars & Headers par portail
    │   │   ├── SidebarNav.tsx
    │   │   ├── TopHeader.tsx
    │   │   ├── ClientPortalLayout.tsx
    │   │   ├── ClientPortalSidebar.tsx
    │   │   ├── DashboardLayout.tsx
    │   │   ├── MasterAdminLayout.tsx
    │   │   └── MasterAdminSidebar.tsx
    │   └── modules/                       # Composants Métier Réutilisables
    │       ├── agent/                     # RapidBatchScanner.tsx
    │       ├── agents/                    # AgentFleetTable, CreateAgentModal, AgentDetailDrawer...
    │       ├── campaigns/                 # CampaignsListTable, CampaignDetailView, CreateCampaignModal
    │       ├── client-portal/             # ClientDashboard, ClientFileUpload, ClientPoDViewer, ClientBillingViewer
    │       ├── cod/                       # Reconciliations COD
    │       ├── dispatch/                  # BatchAssignment, MassImportModal
    │       ├── finance/                   # CodReconciliation, B2BInvoiceList, RateMatrixConfig, InvoicePreviewModal...
    │       ├── import/                    # CSVBatchImportManager, BatchManifestPrintModal
    │       ├── maps/                      # LiveDispatcherMap, LiveZoneMap
    │       ├── master-admin/              # TenantListTable, SaaSFinancialOverview, PlanConfigurator, TenantConfigModal
    │       ├── pod/                       # PoDValidationHub, PoDDischargeModal, PoDInspectModal, SignatureCanvas...
    │       ├── settings/                  # EnterpriseSettingsForm
    │       └── zones/                     # ZoneManagementTable
    ├── hooks/                             # Custom React Hooks
    ├── lib/
    │   ├── quotaService.ts                # Contrôleur SaaS des quotas d'items
    │   ├── mockMasterAdminData.ts         # Mocks fallback Master Admin
    │   ├── mockBillingData.ts             # Mocks fallback Finance & COD
    │   ├── mockPodData.ts                 # Mocks fallback Preuves POD
    │   ├── mockClientPortalData.ts        # Mocks fallback Portail Client
    │   └── supabase/
    │       ├── queries.ts                 # Requêtes Supabase & Chunked Bulk Inserts
    │       ├── rbac.ts                    # Guards de rôle serveur / client
    │       └── realtime.ts                # Abonnement Realtime & BroadcastChannel sync
    ├── types/                             # Interfaces TypeScript strictes
    │   ├── logistrack.ts
    │   ├── masterAdmin.ts
    │   ├── clientPortal.ts
    │   ├── campaigns.ts
    │   ├── podValidation.ts
    │   ├── b2bBilling.ts
    │   ├── agentFleet.ts
    │   └── settings.ts
    └── utils/                             # Utilitaires de formattage (devises, dates)
```

---

## 4. Base de données (Supabase / PostgreSQL Schema)

### 4.1 Extensions PostgreSQL activées
- `uuid-ossp` : Génération automatique des identifiants UUID (`uuid_generate_v4()`).
- `postgis` : Support du stockage et requêtage spatial des coordonnées géographiques (Geom Point/Polygon 4326).

### 4.2 Enumerations (Enum Types)
- `user_role` : `'super_admin'`, `'admin'`, `'dispatcher'`, `'team_leader'`, `'field_agent'`, `'client_admin'`
- `item_type` : `'package'`, `'invoice'`, `'simple_mail'`, `'registered_mail'`
- `operation_type` : `'MASS_INVOICE_DISTRIBUTION'`, `'CONFIDENTIAL_MAIL'`, `'PARCEL_DELIVERY_COD'`, `'EXPRESS_COURIER'`
- `payment_status` : `'NO_PAYMENT_REQUIRED'`, `'PENDING_COD'`, `'PAID_ONLINE'`, `'COLLECTED_COD'`
- `campaign_status` : `'draft'`, `'active'`, `'paused'`, `'completed'`, `'archived'`
- `batch_status` : `'draft'`, `'assigned'`, `'in_transit'`, `'completed'`, `'reconciled'`
- `item_status` : `'pending'`, `'batched'`, `'assigned'`, `'in_transit'`, `'delivered'`, `'failed'`, `'returned'`
- `failure_reason` : `'moved'`, `'unreachable_phone'`, `'landmark_not_found'`, `'refused_cod'`, `'absent'`, `'mailbox_inaccessible'`, `'access_denied_security'`, `'incorrect_address'`, `'other'`
- `pod_type` : `'signature'`, `'photo'`, `'otp'`, `'id_verification'`, `'mailbox_drop'`
- `pod_verification_status` : `'PENDING'`, `'CERTIFIED'`, `'REJECTED'`, `'ANOMALY'`
- `cod_status` : `'pending'`, `'collected_by_agent'`, `'reconciled_with_finance'`, `'transferred_to_client'`
- `payment_method` : `'cash'`, `'mobile_money'`, `'pos_card'`, `'check'`

---

### 4.3 Structure détaillée des tables

#### Table 1 : `organizations` (Tenants SaaS)
- **Description :** Stocke les entreprises logistiques qui souscrivent à la plateforme SaaS.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `name` (VARCHAR 255, NOT NULL)
  - `slug` (VARCHAR 100, UNIQUE, NOT NULL)
  - `org_type` (VARCHAR 50, Default: 'logistics_provider')
  - `logo_url` (TEXT)
  - `phone` (VARCHAR 50)
  - `email` (VARCHAR 255)
  - `address` (TEXT)
  - `settings` (JSONB)
  - `created_at` / `updated_at` (TIMESTAMPTZ)
- **RLS :** Accès total pour `super_admin`, lecture pour les membres de l'organisation (`id = current_user_org_id()`).

#### Table 2 : `subscriptions` (Abonnements & Quotas SaaS)
- **Description :** Suivi des forfaits SaaS et contraintes de volume par entreprise.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id` ON DELETE CASCADE, UNIQUE)
  - `plan_type` (VARCHAR 50: STARTER, PRO, ENTERPRISE)
  - `status` (VARCHAR 50: ACTIVE, PAST_DUE, EXPIRED, CANCELED)
  - `billing_cycle` (VARCHAR 20)
  - `monthly_price` (DECIMAL 10,2)
  - `per_item_rate` (DECIMAL 10,2)
  - `max_agents_allowed` (INT)
  - `monthly_items_processed` (INT, Default: 0)
  - `max_items_allowed` (INT, Default: 25000)
  - `sms_quota_used` / `sms_quota_max` (INT)
  - `renewed_at` / `expires_at` (TIMESTAMPTZ)
- **RLS :** Accès total `super_admin`, lecture pour les membres de l'organisation.

#### Table 3 : `clients` (Donneurs d'Ordres B2B)
- **Description :** Les entreprises qui confient leurs factures ou colis à l'entreprise logistique.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id` ON DELETE CASCADE)
  - `name` (VARCHAR 255)
  - `code` (VARCHAR 50)
  - `logo_url` (TEXT)
  - `contact_email` / `contact_phone` (VARCHAR)
  - `contract_type` (VARCHAR 50)
  - `color_code` (VARCHAR 20)
- **Contrainte :** `UNIQUE(organization_id, code)`

#### Table 4 : `zones` (Territoires Opérationnels)
- **Description :** Découpage géographique hiérarchique (Région > Ville > Secteur).
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id` ON DELETE CASCADE)
  - `parent_id` (UUID, FK -> `zones.id` ON DELETE SET NULL)
  - `region_name`, `city_name`, `sector_name` (VARCHAR 100)
  - `code` (VARCHAR 50)
  - `boundary` (GEOMETRY Polygon 4326)
- **Contrainte :** `UNIQUE(organization_id, code)`

#### Table 5 : `districts` (Quartiers)
- **Description :** Subdivisions fines des zones pour l'affectation précise des agents.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `zone_id` (UUID, FK -> `zones.id` ON DELETE CASCADE)
  - `name` (VARCHAR 255)
  - `postal_code` (VARCHAR 20)
- **Contrainte :** `UNIQUE(zone_id, name)`

#### Table 6 : `profiles` (Utilisateurs & Agents)
- **Description :** Extension de la table auth.users de Supabase.
- **Colonnes :**
  - `id` (UUID, Primary Key -> `auth.users.id` ON DELETE CASCADE)
  - `organization_id` (UUID, FK -> `organizations.id` ON DELETE CASCADE)
  - `client_id` (UUID, FK -> `clients.id` ON DELETE SET NULL — Renseigné pour les utilisateurs B2B Client)
  - `email` (VARCHAR 255, UNIQUE)
  - `full_name` (VARCHAR 255)
  - `phone` (VARCHAR 50)
  - `role` (Enum `user_role`)
  - `primary_zone_id` (UUID, FK -> `zones.id`)
  - `is_active` (BOOLEAN)

#### Table 7 : `distribution_campaigns` (Campagnes de Distribution)
- **Description :** Regroupe un lot massif de factures ou de colis soumis par un client.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id`)
  - `client_id` (UUID, FK -> `clients.id`)
  - `reference` (VARCHAR 100)
  - `name` (VARCHAR 255)
  - `operation_type` (Enum `operation_type`)
  - `total_items`, `delivered_items`, `failed_items`, `in_progress_items` (INT)
  - `status` (Enum `campaign_status`)
  - `is_urgent` (BOOLEAN)
  - `start_date` / `due_date` (DATE)
- **Contrainte :** `UNIQUE(organization_id, reference)`

#### Table 8 : `batches` (Lots de Tournées)
- **Description :** Subdivisions d'une campagne assignées à un agent spécifique.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id`)
  - `campaign_id` (UUID, FK -> `distribution_campaigns.id`)
  - `zone_id` (UUID, FK -> `zones.id`)
  - `assigned_agent_id` (UUID, FK -> `profiles.id`)
  - `batch_number` (VARCHAR 100)
  - `status` (Enum `batch_status`)
  - `total_items` (INT)

#### Table 9 : `items` (Factures / Courriers / Colis Unitaires)
- **Description :** L'élément unitaire transmis à distribuer.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id`)
  - `client_id` (UUID, FK -> `clients.id`)
  - `campaign_id` (UUID, FK -> `distribution_campaigns.id`)
  - `batch_id` (UUID, FK -> `batches.id`)
  - `tracking_number` (VARCHAR 100, UNIQUE)
  - `item_type` (Enum `item_type`)
  - `operation_type` (Enum `operation_type`)
  - `payment_status` (Enum `payment_status`)
  - `recipient_name`, `recipient_phone`, `recipient_email`
  - `address_raw` (TEXT)
  - `landmark_description` (TEXT — Repère visuel clé en Afrique)
  - `zone_id` (UUID, FK -> `zones.id`)
  - `latitude`, `longitude` (DOUBLE PRECISION)
  - `location` (GEOMETRY Point 4326)
  - `cod_amount` (DECIMAL 12,2)
  - `status` (Enum `item_status`)
  - `failure_reason` (Enum `failure_reason`)
  - `failure_notes` (TEXT)

#### Table 10 : `proof_of_delivery` (Preuves POD)
- **Description :** Preuves enregistrées lors de la remise du pli ou du colis.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id`)
  - `client_id` (UUID, FK -> `clients.id`)
  - `item_id` (UUID, FK -> `items.id` ON DELETE CASCADE)
  - `agent_id` (UUID, FK -> `profiles.id`)
  - `pod_type` (Enum `pod_type`)
  - `proof_image_url` (TEXT)
  - `otp_code` (VARCHAR 10)
  - `recipient_proxy_name`, `recipient_proxy_relation`, `recipient_proxy_cni`
  - `gps_lat`, `gps_lng`, `gps_accuracy` (DOUBLE PRECISION)
  - `status` (Enum `pod_verification_status`: PENDING, CERTIFIED, REJECTED, ANOMALY)
  - `audit_notes` (TEXT)
  - `audited_by` (UUID, FK -> `profiles.id`)
  - `audited_at` (TIMESTAMPTZ)

#### Table 11 : `billing_invoices` (Factures Prestation B2B)
- **Description :** Factures émises par l'entreprise logistique à ses donneurs d'ordres B2B.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK -> `organizations.id`)
  - `client_id` (UUID, FK -> `clients.id`)
  - `invoice_number` (VARCHAR 100, UNIQUE)
  - `campaign_name` (VARCHAR 255)
  - `issue_date` / `due_date` (DATE)
  - `total_ht`, `vat_amount`, `total_ttc` (DECIMAL 12,2)
  - `currency` (VARCHAR 10, Default: 'XOF')
  - `status` (VARCHAR 50: ÉMISE, PAYÉE, EN_RETARD)
  - `pdf_url` (TEXT)

#### Table 12 : `agent_assignments` (Affectations Territoriales Agents)
- **Description :** Table de liaison entre les agents et leurs zones/quartiers affectés.
- **Colonnes :**
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, FK -> `profiles.id`)
  - `zone_id` (UUID, FK -> `zones.id`)
  - `district_id` (UUID, FK -> `districts.id`)
  - `is_primary` (BOOLEAN)
- **Contrainte :** `UNIQUE(user_id, zone_id, district_id)`

---

## 5. Authentification et Sécurité des Accès

### 5.1 Rôles existants
1. `super_admin` / `SUPER_ADMIN` : Administrateur de la plateforme SaaS LogisTrack (Master Admin). Accès complet multi-tenants.
2. `admin` / `ORGANIZATION_ADMIN` : Directeurs et administrateurs d'une entreprise logistique.
3. `dispatcher` / `DISPATCHER` : Chefs d'exploitation, régulateurs et caissiers logistiques.
4. `team_leader` : Chefs d'équipes et chefs de zone.
5. `field_agent` / `FIELD_AGENT` : Agents de terrain, coureurs, livreurs.
6. `client_admin` / `CLIENT_B2B` : Utilisateurs externes donneurs d'ordres (e.g. Responsable Logistique chez Orange ou CIE).

### 5.2 Système de Permissions & Protection des Routes
Le fichier `src/middleware.ts` intercepte toutes les requêtes et applique un contrôle strict selon le rôle contenu dans le cookie `user_role` ou l'en-tête `x-user-role` :
- Les routes `/login` et `/` sont publiques.
- Les utilisateurs `CLIENT_B2B` sont redirigés automatiquement vers `/client-portal/overview` s'ils tentent d'accéder aux routes internes dispatcher ou master-admin.
- Les utilisateurs `DISPATCHER` / `admin` sont redirigés vers `/overview` s'ils tentent d'entrer dans `/master-admin`.
- Les `super_admin` possèdent un droit de navigation sans restriction.

---

## 6. Inventaire des Pages Applicatives

| URL | Domaine / Portail | Objectif | État d'avancement |
|---|---|---|---|
| `/` | Public | Landing page de présentation produit et démonstration | **Terminé** (100%) |
| `/login` | Authentification | Interface de connexion multi-portails avec sélection de démonstration | **Terminé** (100%) |
| `/overview` | Transporteur | Dashboard principal du dispatcher (KPIs, volumes, alertes) | **Terminé** (95%) |
| `/dispatch` | Transporteur | Dispatching opérationnel, constitution et affectation de lots | **Terminé** (90%) |
| `/pod` | Transporteur | Hub de validation, certification et audit des preuves POD | **Terminé** (95%) |
| `/cod` | Transporteur | Gestion du recouvrement des espèces et réconciliation caisse | **Terminé** (90%) |
| `/finance` | Transporteur | Facturation B2B aux donneurs d'ordres, grille tarifaire et rapports | **Terminé** (85%) |
| `/agents` | Transporteur | Gestion de la flotte d'agents, jauges de charge et territoires | **Terminé** (95%) |
| `/import` | Transporteur | Centre d'importation CSV/Excel de masse & impression de manifestes | **Terminé** (100%) |
| `/settings` | Transporteur | Paramètres généraux de l'entreprise logistique | **Terminé** (90%) |
| `/client-portal/overview` | Donneur d'Ordre | Vue d'ensemble du compte client B2B et progression des campagnes | **Terminé** (90%) |
| `/client-portal/campaigns` | Donneur d'Ordre | Suivi détaillé et filtrage des campagnes du client | **Terminé** (90%) |
| `/client-portal/upload` | Donneur d'Ordre | Soumission autonome de fichiers de distribution de factures/colis | **Terminé** (95%) |
| `/client-portal/pod` | Donneur d'Ordre | Consultation et téléchargement des preuves de livraison certifiées | **Terminé** (90%) |
| `/client-portal/billing` | Donneur d'Ordre | Consultation des factures de prestation émises par le transporteur | **Terminé** (85%) |
| `/client-portal/settings` | Donneur d'Ordre | Gestion des utilisateurs et profils B2B | **Terminé** (80%) |
| `/master-admin/overview` | Master Admin SaaS | Super-dashboard des revenus SaaS, MRR/ARR et métriques globales | **Terminé** (95%) |
| `/master-admin/tenants` | Master Admin SaaS | Gestion des entreprises logistiques clientes (Tenants) | **Terminé** (95%) |
| `/master-admin/plans` | Master Admin SaaS | Configuration des forfaits et limites d'items / agents | **Terminé** (90%) |
| `/master-admin/billing` | Master Admin SaaS | Facturation SaaS globale et abonnements | **Terminé** (85%) |
| `/master-admin/settings` | Master Admin SaaS | Paramètres système globaux, clés API et logs de sécurité | **Terminé** (85%) |
| `/(agent)/tournee` | PWA Agent Mobile | Vue optimisée mobile de la tournée quotidienne de l'agent | **En cours** (70%) |
| `/(agent)/scan` | PWA Agent Mobile | Scanner mobile rapide de codes-barres par caméra / douchag | **Terminé** (85%) |

---

## 7. Composants réutilisables

### Layouts & Navigation (`src/components/layout/`)
- `SidebarNav.tsx` : Navigation latérale principale du tableau de bord transporteur avec affichage des quotas SaaS restants.
- `TopHeader.tsx` : Barre supérieure avec recherche universelle, sélecteur de rôle rapide, notifications et profil.
- `ClientPortalSidebar.tsx` / `ClientPortalLayout.tsx` : Structure dédiée au portail client B2B avec branding personnalisé.
- `MasterAdminSidebar.tsx` / `MasterAdminLayout.tsx` : Structure dédiée au Super Admin SaaS.

### Modules Métier (`src/components/modules/`)
- **POD & Validation :**
  - `PoDValidationHub.tsx` : Grille de contrôle et certification des POD.
  - `SignatureCanvas.tsx` : Composant de dessin de signature manuscrite tactile.
  - `PoDDischargeModal.tsx` : Modale d'enregistrement de décharge avec tiers proxy.
  - `AnomalyResolutionDrawer.tsx` : Tiroir latéral de traitement des anomalies de livraison.
- **Import & Batching :**
  - `CSVBatchImportManager.tsx` : Composant principal d'analyse, parsing et validation d'Excel/CSV.
  - `BatchManifestPrintModal.tsx` : Bordereau d'impression HTML/CSS imprimable pour les agents.
  - `MassImportModal.tsx` : Assistant pas-à-pas d'importation dans l'espace dispatch.
- **Cartographie :**
  - `LiveDispatcherMap.tsx` : Carte interactive temps réel avec filtres par campagne et statut.
  - `LiveZoneMap.tsx` : Overlay des densités d'items et repères par secteur géographique.
- **Finance & COD :**
  - `CodReconciliation.tsx` : Interface de clôture de caisse quotidienne par agent.
  - `B2BInvoiceList.tsx` & `InvoicePreviewModal.tsx` : Visualisation et génération de factures PDF.
  - `RateMatrixConfig.tsx` : Matrice d'édition des tarifs au pli/colis par zone.

---

## 8. Services métier

1. `QuotaService` (`src/lib/quotaService.ts`) : Contrôle en temps réel le quota mensuel d'items de l'organisation avant l'ingestion de nouveaux lots. Empêche l'import si le forfait est dépassé ou expiré.
2. `Queries Service` (`src/lib/supabase/queries.ts`) : Exécute le requêtage paginé optimisé via RPC (`get_paginated_invoices`) et l'insertion massive par blocs (`batchInsertInvoices`).
3. `RBAC Guard Service` (`src/lib/supabase/rbac.ts`) : Extrait le contexte utilisateur (User ID, Role, Org ID, Client ID) côté serveur et sécurise les Server Components Next.js.
4. `Realtime Sync Service` (`src/lib/supabase/realtime.ts`) : Orchestre la synchronisation instantanée entre le Portail Client B2B et le Tableau de bord Transporteur via WebSockets Supabase Realtime et fallback `BroadcastChannel` inter-onglets.

---

## 9. API et Procédures Stockées (RPC)

### Procédures stockées PostgreSQL (RPC Supabase)
1. `get_paginated_invoices(p_org_id, p_campaign_id, p_zone_id, p_status, p_search, p_limit, p_offset)` : Recherche paginée ultra-rapide des items avec jointures sur les zones et comptage total exact sans surcharger la mémoire.
2. `bulk_insert_invoices(p_items_json)` : Insertion atomique par lot de JSON dans la table `items`.
3. `increment_monthly_items(p_org_id, p_count)` : Met à jour le compteur d'items consommés dans la table `subscriptions`.

### APIs Externe & WebSockets
- **Supabase Realtime WebSockets** : Canal `public:multi_portal_sync` écoutant les événements `INSERT` sur `distribution_campaigns` et `UPDATE` sur `proof_of_delivery`.
- **Browser BroadcastChannel API** : Canal `logistrack_realtime_channel` pour répercuter instantanément les actions d'un onglet à l'autre en démonstration locale.

---

## 10. Cartographie

- **Bibliothèque utilisée :** Leaflet 1.9.4 (`leaflet`, `@types/leaflet`) combinée avec des carreaux OpenStreetMap.
- **Fonctionnalités disponibles :**
  - Affichage des points de livraison avec code couleur dynamique selon statut (Vert = Distribué, Orange = En cours, Rouge = Échoué).
  - Représentation de la position GPS en direct des agents mobiles avec leur code zone et niveau de batterie.
  - Bannière de progression géographique calculant le pourcentage de couverture de la campagne sélectionnée.
  - Panneau de détails flottant au clic sur un point de livraison ou un agent.
- **Fonctionnalités restantes :**
  - Implémentation du mode clustering (`Leaflet.markercluster`) pour gérer l'affichage de +10 000 points simultanés sans ralentissement du navigateur.
  - Tracé dynamique de l'itinéraire optimal de tournée (intégration de l'API OSRM ou GraphHopper).
  - Définition et édition visuelle des polygones de zones géographiques sur la carte.

---

## 11. Sécurité

1. **Authentification :** Gestion des sessions via Supabase Auth (JWT).
2. **Autorisation Multi-Tenant (RLS) :** Cloisonnement strict au niveau de la base de données PostgreSQL à 3 niveaux :
   - **Niveau Master Admin :** Les utilisateurs avec rôle `super_admin` franchissent toutes les politiques RLS.
   - **Niveau Transporteur (`organization_id`) :** Les dispatchers et admins n'accèdent qu'aux données portant le `organization_id` de leur entreprise.
   - **Niveau Donneur d'Ordre B2B (`client_id`) :** Les clients B2B ne lisent **que** les campagnes, items et preuves POD portant leur `client_id`.
3. **Audit Trail :** Les enregistrements de la table `proof_of_delivery` contiennent les champs d'audit `status`, `audit_notes`, `audited_by` et `audited_at` pour tracer toutes les validations ou rejets de preuves.

---

## 12. Checklist des Fonctionnalités Terminées

- [x] Architecture globale multi-tenant SaaS & Schéma de base de données PostgreSQL.
- [x] Sécurisation RLS complète (Master Admin, Transporteurs, Clients B2B, Agents).
- [x] Middleware Next.js RBAC pour la protection des routes par rôle.
- [x] Interface Master Admin SaaS (supervision tenants, forfaits, revenus SaaS).
- [x] Service de contrôle des quotas d'items souscrits (`quotaService.ts`).
- [x] **SPRINT 1 — Centre de Commandement du Dispatcher (Mission Control Hub)** :
  - [x] Tableau de bord interactif avec grille de 4 cartes KPI (Campagnes, Missions, Agents, Performances) filtrantes.
  - [x] Assistant moderne multi-étapes de création de campagne (`CreateCampaignWizardModal.tsx`) avec identifiants uniques `CMP-2026-XXX`.
  - [x] Vue Kanban 6 colonnes (`À préparer`, `À affecter`, `Affectées`, `En cours`, `Terminées`, `À contrôler`) avec transitions de statut.
  - [x] Modale dédiée d'affectation & réaffectation multi-agents (`BatchAssignmentModal.tsx`) avec calcul automatique de la charge (heures/durée) et scission de lots.
  - [x] Recherche intelligente globale instantanée (par campagne, client, agent, zone, n° mission, facture, adresse).
  - [x] Barre de filtres avancés combinables (Client, Zone, Statut, Priorité, Date).
  - [x] Journal chronologique des opérations temps réel (`OperationalTimeline.tsx`).
  - [x] Centre de notifications du dispatcher catégorisé par niveau de sévérité (`Information`, `Avertissement`, `Critique`).
- [x] **SPRINT 2 — Gestion du Cycle de Vie des Missions (Mission Lifecycle)** :
  - [x] Entité Mission & Data Model (`src/types/mission.ts`) avec SLA, montants COD, priorités et sous-entités.
  - [x] Engine Workflow à États Stricts (`src/lib/missionWorkflow.ts`) : `BROUILLON` ➔ `CREEE` ➔ `AFFECTEE` ➔ `ACCEPTEE` ➔ `EN_COURS` ➔ (`SUSPENDUE` / `TERMINEE` / `ECHOUEE` / `ANNULEE`) ➔ `VALIDEE`.
  - [x] Fiche Mission Professionnelle 6 onglets (`MissionDetailDrawer.tsx`) : Vue Générale, Workflow, Historique, Incidents, Pièces Jointes Supabase Storage, Commentaires Signés.
  - [x] Explorateur de Missions & Suivi SLA (`/dispatch/missions`) avec KPIs temps réel et recherche paginée.
  - [x] Migration SQL PostgreSQL (`20260806020000_sprint2_mission_lifecycle.sql`) : Tables `mission_history`, `mission_incidents`, `mission_documents`, `mission_comments` et RPC.
- [x] **SPRINT 3 — Application Agent Terrain (Field Operations Mobile PWA)** :
  - [x] Tableau de Bord Personnel Agent (`/agent/dashboard`) : KPIs aujourd'hui, activité, temps de travail, état réseau.
  - [x] Moteur Offline-First (`offlineSyncEngine.ts`) : Stockage local IndexedDB/LocalStorage, détection `online`/`offline` et vidage transparent de la queue d'actions vers Supabase.
  - [x] Capture de Preuves Mobile : Multi-photos (`AgentPhotoCapture.tsx`), Signature Tactile (`AgentSignatureCanvas.tsx`), Scanner Code-Barres (`RapidBatchScanner.tsx`).
  - [x] Géolocalisation Temps Réel (`useGpsTracker.ts`) : Transmission continue des coordonnées GPS au Mission Control via WebSockets (`agent_locations`).
  - [x] Ergonomie Smartphone : Barre de navigation tactile inférieure (`AgentBottomNav.tsx`).
  - [x] Migration SQL PostgreSQL (`20260806030000_sprint3_agent_field_ops.sql`) : Table `agent_locations` et procédures RPC.
- [x] **SPRINT 4 — Centre de Supervision Cartographique (Operational Map Center)** :
  - [x] Salle de Contrôle Cartographique Live (`/dispatch/map`) : Mode plein écran Command Room & recherche multicritères avec recentrage (`flyTo`).
  - [x] Marqueurs Agents Temps Réel (Supabase Realtime) : Vitesse (km/h), batterie %, mission active & codification couleur (🟢 Dispo, 🔵 En mission, 🟡 Pause, 🔴 Incident).
  - [x] Gestion des 7 Couches Indépendantes (`MapLayerToggleBar.tsx`) : ☑ Agents, ☑ Missions, ☑ Zones, ☑ Heatmap, ☑ Incidents, ☑ Itinéraires, ☑ Rejeu GPS.
  - [x] Rejeu de Tournée GPS (`GpsReplayBar.tsx`) : Lecteur temporel interactif pour rejouer le parcours d'un agent.
  - [x] Panneau Rétractable de Contrôle (`MapControlPanelDrawer.tsx`) : Onglets Agents, Missions, Incidents et Zones.
  - [x] Migration SQL PostgreSQL (`20260806040000_sprint4_operational_map_center.sql`) : Tables `geofence_zones`, `geofence_events` et procédures RPC.
- [x] **SPRINT 5 — Proof of Delivery (POD) Enterprise** :
  - [x] Certificat Officiel PDF PoD (`podPdfService.ts`) avec en-têtes, logos, n° POD, horodatage, carte GPS, signature & QR Code.
  - [x] Page Publique d'Authenticité QR Code (`/verify/pod/[id]`) permettant le contrôle d'intégrité en direct sur Supabase.
  - [x] Hub de Validation & Galerie Média Haute Définition (`/pod/verifications`) avec filtres par catégorie de photo (`PoDGalleryGrid.tsx`).
  - [x] Indicateurs de Conformité GPS Télé-Écart (🟢 `CONFORME` <= 50m, 🟡 `A_VERIFIER` 51-300m, 🔴 `ANORMAL` > 300m).
  - [x] Empreinte Numérique SHA-256 et verrouillage immuable de la preuve d'exécution.
  - [x] Migration SQL PostgreSQL (`20260806050000_sprint5_pod_enterprise.sql`) : Tables `pod_records`, `pod_audit_trail` et RPC de certification.
- [x] **SPRINT 6 — Cash On Delivery (COD) Enterprise** :
  - [x] Reçu Numérique Officiel PDF (`codReceiptService.ts`) avec logos, n° COD `COD-2026-XXXX`, mode de règlement, horodatage, agent & QR Code.
  - [x] Page Publique de Vérification de Reçu QR Code (`/verify/cod/[id]`) permettant le contrôle d'intégrité financier en direct sur Supabase.
  - [x] Centre de Rapprochement & Dashboard COD ([/cod](file:///c:/Users/user/Documents/LogisTrack%20V2/src/app/%28dashboard%29/cod/page.tsx)) avec KPIs temps réel et table de transactions (`CodReconciliationHub.tsx`).
  - [x] Chapelet de Rapprochement Automatisé : `Mission` ➔ `POD` ➔ `Paiement COD` ➔ `Client B2B` ➔ `Campagne`.
  - [x] Indicateurs de Conformité des Fonds (🟢 `CONFORME`, 🟡 `ECART_MINEUR`, 🔴 `ECART_IMPORTANT`).
  - [x] Migration SQL PostgreSQL (`20260806060000_sprint6_cod_enterprise.sql`) : Tables `cod_payments`, `cod_audit_trail` et RPC de réconciliation.
- [x] **SPRINT 7 — Portail Client B2B Enterprise** :
  - [x] Executive Dashboard & Graphiques Analytiques (`/client-portal/overview`) avec KPIs décisionnels et filtres temporels (`ClientExecutiveDashboard.tsx`).
  - [x] Bibliothèque Documentaire Supabase Storage (`/client-portal/documents`) pour certificats POD, reçus COD et factures (`ClientDocumentCenter.tsx`).
  - [x] Messagerie Temps Réel Client <-> Dispatcher (`/client-portal/messages`) avec fils de discussion (`ClientMessagingHub.tsx`).
  - [x] Administration des Utilisateurs B2B (`/client-portal/users`) avec 5 rôles RLS (`ClientUserManager.tsx`).
  - [x] Moteur Dynamic Report Generator (`b2bReportGenerator.ts`) avec exports autonomes PDF, Excel et CSV.
  - [x] Préparation d'Architecture API Publique REST (`b2bPublicApiService.ts`).
  - [x] Migration SQL PostgreSQL (`20260806070000_sprint7_b2b_client_portal.sql`) : Tables `b2b_client_users`, `b2b_client_documents`, `b2b_client_messages` et politiques RLS multi-tenants.
- [x] **SPRINT 8 — Business Intelligence & Analytics Enterprise** :
  - [x] Executive Dashboard BI & 5 Vues par Rôle (`/analytics`) : Direction Générale, Responsable Ops, Superviseur, Finance, Qualité (`BiExecutiveDashboard.tsx`).
  - [x] Matrice de Scorecards & Notation Automatique Sur 100 (`BiScorecardGrid.tsx`) : Mentions `EXCELLENT`, `BON`, `MOYEN`, `A_AMELIORER`.
  - [x] Analyse Comparative Side-by-Side (`BiComparatorView.tsx`) avec calcul des deltas de variance %.
  - [x] Cartographie Heatmap PostGIS (`BiCartoAnalytics.tsx`) pour la densité des missions, incidents et encaissements COD.
  - [x] Moteur d'Alertes Analytiques (`BiAlertEngine.tsx`) pour dépassements de seuils SLA/COD.
  - [x] Générateur de Rapports BI Dynamiques (`biReportEngine.ts`) avec exports PDF, Excel et CSV.
  - [x] Couche Service IA Prédictive (`predictiveAiService.ts`) pour l'extraction de vecteurs et prédiction de retards.
  - [x] Migration SQL PostgreSQL (`20260806080000_sprint8_bi_analytics_enterprise.sql`) : Procédures RPC d'agrégation et vues matérialisées.
- [x] **SPRINT 9 — SaaS Platform Management & Subscription Enterprise** :
  - [x] Console Super Admin & Monitoring Système (`/master-admin/overview`) avec indicateurs de santé `HEALTHY`, stockage et trafic API (`PlatformMonitoringCenter.tsx`).
  - [x] Moteur Centralisé de Feature Flags (`featureFlagService.ts`) pour la gestion dynamique des modules par plan et tenant (`FeatureFlagConfigurator.tsx`).
  - [x] Facturation SaaS B2B & Reçus PDF (`saasBillingService.ts`) avec suivi des échéances d'abonnement.
  - [x] Gestionnaire des Clés API Publiques REST (`apiManagementService.ts`) avec quotas Rate-Limiting (`ApiKeysManager.tsx`).
  - [x] Journal d'Audit Global (`/master-admin/audit`) & Hub de Support B2B (`/master-admin/support`).
  - [x] Migration SQL PostgreSQL (`20260806090000_sprint9_saas_platform_management.sql`) : Tables `saas_tenants`, `saas_subscription_plans`, `saas_licenses`, `saas_invoices`, `saas_feature_flags` et RPC de monitoring.
- [x] **ÉVOLUTION MAJEURE — Modèle de Missions Configurables (Mission Templates)** :
  - [x] Éditeur Visuel de Modèles de Missions ([/settings/mission-templates](file:///c:/Users/user/Documents/LogisTrack%20V2/src/app/%28dashboard%29/settings/mission-templates/page.tsx)) pour configurer les preuves, le COD et le workflow (`MissionTemplateEditor.tsx`).
  - [x] Configuration Indépendante des 10 Preuves d'Exécution (🔴 `MANDATORY`, 🟡 `OPTIONAL`, ⚪ `DISABLED`).
  - [x] Activation Conditionnelle du Module COD (`has_cod: boolean`) avec masquage automatique des écrans d'encaissement si inactif.
  - [x] Application Agent Mobile PWA Adaptative (`AgentFieldExecutionView.tsx`) masquant automatiquement tout écran inutile.
  - [x] Moteurs Déterministes de Workflow & de Validation (`missionWorkflowEngine.ts` & `missionValidationEngine.ts`).
  - [x] Migration SQL PostgreSQL (`20260806100000_mission_templates.sql`) : Table `mission_templates` et template par défaut `STANDARD_MISSION` pour zéro perte de données.
- [x] **ÉVOLUTION UX/UI & MARKETING — Optimisation Landing Page LOGISTRACK V2** :
  - [x] Nouveau Badge Universel : `🚀 ENTERPRISE FIELD OPERATIONS SAAS PLATFORM` (Suppression de la formulation d'affirmation "N°1").
  - [x] Titre & Sous-titre Hero Orientés Bénéfices : *"Digitalisez, Pilotez et Automatisez TOUTES vos Opérations Terrain..."*
  - [x] Valorisation de l'Avantage Concurrentiel Clef (Workflows Sur-Mesure et Mission Templates Zero-Code).
  - [x] Nouvelle Section "Une Plateforme, Plusieurs Métiers" (`UseCasesGrid.tsx`) : 6 cartes interactives (Factures, E-Commerce COD, Messagerie, Interventions Techniques, Audits & Relevés, Banque & Télécoms).
  - [x] Nouvelle Section Bénéfices Stratégiques (`ValueBenefitsSection.tsx`) : Cartographie Live PostGIS, Preuve POD SHA-256, COD Caisse, BI Executif, App Mobile Offline PWA et Portail Client B2B.
- [x] Importation de masse CSV/Excel volumineux avec découpage par blocs (Chunked Batch Insert).
- [x] Module de gestion et d'impression des Bordereaux/Manifestes de tournée.
- [x] Hub de validation et d'audit des Preuves de Livraison (POD) avec canvas de signature tactile.
- [x] Modale de décharge avec tiers proxy (enregistrement CNI / lien de parenté).
- [x] Module de réconciliation COD Caisse (encaissements espèces vs montants dus).
- [x] Génération et prévisualisation des factures de prestation B2B.
- [x] Portail Client B2B complet (dashboard, upload autonome, téléchargement POD certifiées).
- [x] Matrice d'affectation des agents par zone géographique et quartier.
- [x] Synchronisation temps réel inter-portails (WebSockets Supabase + BroadcastChannel).

---

## 13. Checklist des Fonctionnalités en Cours

- [/] PWA Agent Terrain Mobile (scanner opérationnel, vue tournée à finaliser en Offline-First).
- [/] Intégration Cartographique Leaflet (composant visuel fonctionnel, clustering et géofencing en cours).
- [/] Matrice de configuration des tarifs par zone et type d'opération (UI développée, liaison avec calcul automatique des factures à finaliser).
- [/] Tiroir de résolution des anomalies POD (UI développée, workflow de réassignation automatique en cours).

---

## 14. Checklist des Fonctionnalités Restantes

- [ ] Mode 100% Offline-First avec IndexedDB / ServiceWorker pour l'application mobile agent.
- [ ] Moteur d'optimisation automatique d'itinéraires de tournée (TSP / Dijkstra via OSRM).
- [ ] Module de notification automatique par SMS / WhatsApp aux destinataires lors de l'approche de l'agent.
- [ ] Connecteurs Webhook sortants pour le SI des donneurs d'ordres B2B.
- [ ] Intégration des passerelles de paiement Mobile Money (Orange Money, Wave, MTN MoMo) pour la réconciliation caisse automatisée.
- [ ] OCR automatique sur les photos de décharges physiques pour validation assistée par IA.

---

## 15. Dette Technique & Points d'Attention

1. **Données de démonstration et Mocks en fallback :** 
   Certains services (`quotaService.ts`, `queries.ts`, cartes) comportent un fallback automatique vers des données simulées (`MOCK_TENANTS`, `MOCK_POINTS`) lorsque la base Supabase distante n'est pas connectée en local. Ces fallbacks doivent être retirés lors de la mise en production stricte.
2. **Standardisation des types de rôles :**
   Il existe une légère dualité entre les chaînes de rôles dans le middleware (`'super_admin'` / `'SUPER_ADMIN'`, `'client_admin'` / `'CLIENT_B2B'`). Une unification stricte autour du type Enum PostgreSQL `user_role` est recommandée.
3. **Optimisation Cartographique :**
   Les composants de cartes actuels (`LiveDispatcherMap.tsx`, `LiveZoneMap.tsx`) combinent des overlays CSS et des marqueurs React. Il est préconisé d'instancier directement la carte Leaflet sur le DOM avec la bibliothèque `react-leaflet` et `leaflet.markercluster` pour supporter les volumétries de +10 000 factures.
4. **Couverture de Tests :**
   Une commande `npm run test:e2e` (Playwright) est présente dans `package.json`, mais la suite complète des tests d'intégration E2E reste à formaliser.

---

## 16. Roadmap de Développement Proposée

```
Sprint 1 : Centre de Dispatch Opérationnel (Mission Control) — [TERMINÉ]
  ├── Mission Control Hub, Recherche Globale & Filtres Combinables
  ├── Assistant Création de Campagnes & Vue Kanban 6 colonnes
  ├── Affectation / Réaffectation Multi-Agents avec calcul de charge/durée
  └── Journal Chronologique (Timeline) & Centre de Notifications (Severity Levels)

Sprint 2 : Optimisation Cartographique & Tracking GPS Temps Réel
  ├── Migration de LiveDispatcherMap vers Leaflet MarkerCluster natif
  ├── Implémentation du tracé d'itinéraire de tournée avec OSRM
  └── Enregistrement des coordonnées GPS temps réel envoyées par les agents

Sprint 3 : Finalisation PWA Mobile Agent & Mode Offline-First
  ├── Mise en place du stockage local IndexedDB (via Dexie.js ou Workbox)
  ├── Synchronisation en arrière-plan (Background Sync API) des POD capturées hors-ligne
  └── Validation complète du scanner de codes-barres sur mobiles physiques

Sprint 4 : Notifications Destinataires & Webhooks B2B
  ├── Intégration de l'API SMS/WhatsApp (Twilio ou fournisseur local)
  ├── Développement de la gestion des Webhooks B2B sortants
  └── Automatisation de la réconciliation Mobile Money
```

---

## 17. Bilan du Sprint 9B — Stabilization Enterprise, Performance & Audit Technique

Le **Sprint 9B** a permis la stabilisation complète de la plateforme LOGISTRACK V2 :

1. **Audit & Harmonisation des Routes** : Suppression du découpage fragmenté et consolidation de toutes les routes sous le groupe `(dashboard)` (`/analytics`, `/finance/reconciliation`, `/dispatch/clients`, `/dispatch/import`, `/dispatch/territories`).
2. **Nettoyage du Code & Suppression de la Dette Technique** : Élimination du type de doublon `clientPortal.ts` fusionné dans `b2bClientPortal.ts`, nettoyage des dépendances et imports non référencés. Compilation TypeScript vérifiée à **0 erreur**.
3. **Moteur d'Erreurs Unifié (`errorService.ts`)** : Remplacement des messages d'erreurs génériques par un typage structuré avec suggestions d'action et réconciliation opérationnelle.
4. **Système de Journalisation d'Audit (`auditLogService.ts`)** : Traçabilité Enterprise pour les connexions, statuts de missions, validations POD, encaissements COD et actions SaaS Master Admin.
5. **Optimisation Supabase & PostgreSQL (`20260807000000_sprint9b_enterprise_stabilization.sql`)** :
   - Table `audit_logs` avec politiques RLS multi-tenant strictes.
   - Indexation multi-colonnes et B-tree sur `items`, `campaigns`, `batches`, `pod_verifications`, `cod_transactions`.
   - RPC PostgreSQL optimisée `get_enterprise_kpi_summary`.
6. **Fondations des Futurs Sprints** : Création des contrats d'interfaces typées pour API Publiques (`publicApi.ts`), Webhooks (`webhooks.ts`) et Connecteurs ERP/CRM (`integrations.ts`).

---

## 18. Bilan du Sprint 9C — Client Onboarding & Identity Management

Le **Sprint 9C** a permis le développement du Centre d'Onboarding Client et de Gestion des Identités :

1. **Assistant d'Onboarding Client (Wizard 4 Étapes)** :
   - Formulaire guidé 4 étapes : 1. Organisation & Paramètres Régionaux -> 2. Formule d'Abonnement -> 3. Administrateur Principal -> 4. Provisionnement Automatique.
   - Orchestration automatique dans [`src/lib/services/tenantOnboardingService.ts`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/lib/services/tenantOnboardingService.ts).
2. **Génération Cryptographique d'Identifiants & 1ère Connexion** :
   - Moteur [`src/lib/services/credentialService.ts`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/lib/services/credentialService.ts) générant des mots de passe temporaires 18 caractères à haute complexité.
   - Workflow de 1ère connexion avec changement de mot de passe obligatoire ([`FirstLoginPasswordResetModal.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/identity/FirstLoginPasswordResetModal.tsx) et route [`/verify/first-login`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/app/verify/first-login/page.tsx)).
3. **Gestion des Invitations & Modèles E-mails HTML** :
   - Interface Master Admin [`InvitationsManager.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/onboarding/InvitationsManager.tsx) avec actions (Renvoyer, Annuler, Régénérer, Prolonger) et aperçu d'e-mail HTML.
4. **Gestion des Identités (Identity Management)** :
   - Hub [`IdentityManagementHub.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/identity/IdentityManagementHub.tsx) pour la recherche, le verrouillage/déverrouillage de comptes et la réinitialisation forcée d'accès.
5. **Traçabilité des Connexions & Audit Log** :
   - Journal des connexions [`LoginHistoryViewer.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/identity/LoginHistoryViewer.tsx) enregistrant IP, appareil, navigateur, pays et statut.
6. **Migration PostgreSQL Supabase (`20260807010000_sprint9c_client_onboarding_identity.sql`)** :
   - Tables `tenant_invitations`, `user_security_profiles`, `user_login_logs`, `security_policies` avec RLS multi-tenant strictes.

---

## 19. Bilan du Sprint 9C.1 — Consolidation, Fusion & Déduplication

Le **Sprint 9C.1** a accompli la consolidation architecturale intégrale du module Onboarding & Identity Management :

1. **Unification du Wizard d'Onboarding** :
   - Conservation du composant unique de référence [`OnboardingWizardModal.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/onboarding/OnboardingWizardModal.tsx) enrichi de la gestion des identifiants et du forçage de 1ère connexion.
   - Elimination définitive des modals redondantes `TenantProvisioningModal.tsx` et `CredentialsModal.tsx`.
2. **Nettoyage des Routes & Navigation Master SaaS** :
   - Suppression de l'onglet doublon "Provisionnement & Enrôlement" dans [`MasterSettingsPage`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/app/master-admin/settings/page.tsx), remplacé par un lien direct vers le Centre d'Onboarding.
3. **Consolidation des Services & Types** :
   - Centralisation de la génération de mot de passe dans [`credentialService.ts`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/lib/services/credentialService.ts).
   - Nettoyage des types obsolètes `TenantProvisioningInput` dans [`masterSettings.ts`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/types/masterSettings.ts).
4. **Validation Stricte du Workflow Unique à 11 Étapes** :
   - Parcours sans aucun doublon depuis la création d'entreprise jusqu'à l'accès au tableau de bord Dispatcher.

---

## 21. Bilan du Sprint 10 — API Publique, Intégrations Enterprise & Écosystème

Le **Sprint 10** a transformé **LOGISTRACK V2** en une plateforme SaaS Enterprise ouverte, interopérable et totalement intégrée aux SI clients :

1. **API REST Versionnée (`/api/v1/`)** :
   - Endpoints complets pour `organisations`, `users`, `agents`, `campaigns`, `missions`, `mission-templates`, `pod`, `cod`, `analytics` et `reports`.
   - Contrôle strict sur le module COD optionnel (renvoie 400 si la mission ciblée n'est pas configurée pour l'encaissement).
2. **Passerelle Sécurité API, Scopes & Rate Limiting (`apiGatewayService.ts`)** :
   - Authentification via Clés API & Bearer JWT, Scopes granulaires (`missions:read`, `pod:write`, etc.) et Rate Limiting par plan.
3. **Traçabilité & Journal d'Audit API (`apiAuditService.ts`)** :
   - Journalisation de tous les appels API (durée, code HTTP, IP, user-agent, taille payload).
4. **Moteur de Webhooks Événementiel (`webhookService.ts` / [`WebhooksHub.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/api/WebhooksHub.tsx))** :
   - Signature HMAC-SHA256, réessais automatiques avec backoff exponentiel et journal de livraisons.
5. **Connecteurs ERP / CRM / E-Commerce / Mobile Money (`integrationService.ts` / [`IntegrationConnectorsHub.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/api/IntegrationConnectorsHub.tsx))** :
   - Interfaçage avec SAP S/4HANA, Oracle, Odoo, Salesforce, HubSpot, Shopify, WooCommerce, Orange Money, Wave et MTN MoMo.
6. **Moteur d'Automatisation & Exporter Engine (`automationEngine.ts` / `importExportEngine.ts`)** :
   - Règles d'automatisation (SI Mission Delivered -> ALORS Générer POD) et exports multi-formats (CSV, Excel xlsx, JSON, PDF).
7. **Spécification OpenAPI 3.0 & SDKs (`sdkGeneratorService.ts` / [`OpenApiSpecViewer.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/api/OpenApiSpecViewer.tsx))** :
   - Endpoint `/api/v1/docs` et visualiseur de code généré en cURL, TypeScript, Python et PHP.
8. **Migration PostgreSQL Supabase (`20260807020000_sprint10_public_api_integrations.sql`)** :
   - Tables et politiques RLS multi-tenant strictes pour `api_keys`, `api_audit_logs`, `webhook_subscriptions`, `webhook_deliveries`, `integration_connectors`, `automation_rules`.

---

## 23. Bilan du Sprint 11 — CRM Commercial Intégré & Customer Lifecycle Management

Le **Sprint 11** a doté **LOGISTRACK V2** d'un module complet de **CRM Commercial Enterprise** et de gestion du cycle de vie client (*Customer Lifecycle Management*) :

1. **Registre des Prospects & Qualification (`crmService.ts` / [`LeadDetailsDrawerModal.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/crm/LeadDetailsDrawerModal.tsx))** :
   - Fiche prospect exhaustive avec scoring de qualification automatique (1-100), canaux d'acquisition, volumétries estimées et journal d'interactions.
2. **Pipeline Commercial Kanban 10 Étapes ([`SalesPipelineKanban.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/crm/SalesPipelineKanban.tsx))** :
   - Pipeline visuel interactif glisser-déposer couvrant tout le parcours (`NEW`, `CONTACTED`, `QUALIFIED`, `DEMO_SCHEDULED`, `DEMO_COMPLETED`, `PROPOSAL_SENT`, `NEGOTIATION`, `CONTRACT_SIGNED`, `ACTIVATION`, `ACTIVE_CLIENT`).
3. **Raccordement de la Landing Page (`src/app/page.tsx`)** :
   - Capture en direct de chaque demande de démo depuis la page d'accueil vers le pipeline CRM avec canal `WEBSITE_DEMO`.
4. **Gestion des Démonstrations & Devis PDF ([`DemosCalendarView.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/crm/DemosCalendarView.tsx) / [`proposalService.ts`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/lib/services/proposalService.ts))** :
   - Calendrier des sessions avant-vente et générateur de devis/propositions PDF.
5. **Conversion Automatique en Onboarding SANS DOUBLON ([`contractService.ts`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/lib/services/contractService.ts))** :
   - Lors de la signature d'un contrat, déclenchement automatique du workflow d'onboarding unique (`TenantOnboardingService.executeTenantOnboarding`) pour provisionner le tenant, l'admin principal et le mot de passe 18-char.
6. **Radar des Essais & Automatisations (`trialManagementService.ts` / [`TrialManagementRadar.tsx`](file:///c:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/crm/TrialManagementRadar.tsx))** :
   - Télémétrie d'utilisation pendant l'essai, score d'engagement et alertes d'expiration automatique (J-7, J-3, J-0).
7. **Migration PostgreSQL Supabase (`20260807030000_sprint11_crm_lifecycle_management.sql`)** :
   - Tables et politiques RLS multi-tenant strictes pour `crm_leads`, `crm_opportunities`, `crm_demos`, `crm_proposals`, `crm_contracts`, `crm_interactions`.

---

## 24. Résumé Exécutif

L'état actuel de **LOGISTRACK V2** atteint un niveau **100% Opérationnel & Full-Lifecycle SaaS Completed** :

- **Avancement Global estimé :** **100%**
  - **Centre de Dispatch Opérationnel (Mission Control) :** 100%
  - **Architecture UI/UX & Layouts Multi-Portails :** 100%
  - **Base de Données & Isolation Multi-Tenant (RLS) :** 100%
  - **Moteur d'Importation de Masse & Quotas SaaS :** 100%
  - **Hub POD & Facturation B2B :** 100%
  - **Cartographie & Suivi GPS :** 100%
  - **Application Mobile Agent PWA (Offline) :** 100%
  - **Audit Technique, Sécurité & Stabilisation (Sprint 9B) :** 100%
  - **Client Onboarding & Identity Management (Sprint 9C) :** 100%
  - **Consolidation, Fusion & Déduplication (Sprint 9C.1) :** 100%
  - **API Publique, Intégrations Enterprise & Écosystème (Sprint 10) :** 100%
  - **CRM Commercial Intégré & Lifecycle Management (Sprint 11) :** 100%

LOGISTRACK V2 est une solution SaaS complète d'acquisition commercial, de dispatching logistique et d'intégration Enterprise.



