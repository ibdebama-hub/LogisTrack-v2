# LOGISTRACK V2 🚀
> **Plateforme SaaS Enterprise Multi-Tenants de Gestion Logistique, Distribution de Plis, Factures & Livraisons B2B**

LOGISTRACK V2 est une solution SaaS de gestion logistique hybride conçue pour le marché Ouest & Centre-Africain. Elle permet de gérer le cycle de vie complet des livraisons, des tournées de distribution de factures/documents administratifs (EDG, Orange, Banques...), le suivi des colis e-commerce avec encaissement COD (*Cash On Delivery*), la preuve de livraison certifiée (POD), le portail donneur d'ordre B2B, l'administration SaaS Master Owner, les API publiques Enterprise et le CRM commercial intégré.

---

## 🌟 Fonctionnalités Principales

### 🎯 1. Mission Control & Dispatcher Center
- **Gestion des Campagnes & Plis** : Importation de listes de distribution Excel/CSV, création automatique de campagnes de distribution de factures.
- **Optimisation des Tournées** : Attribut de tournées par zone géographique, gestion des agents terrain et affectation intelligente.
- **Cartographie Temps Réel** : Suivi des agents sur carte interactive, géolocalisation et jalons de livraison.

### 📲 2. Application Agent Terrain (PWA Offline-First)
- **Scan de QR Code / Code-Barres** : Confirmation instantanée des plis et colis.
- **Preuve de Livraison Certifiée (POD)** : Capture de signature numérique, géolocalisation GPS et photo de preuve.
- **Encaissement COD (Cash On Delivery)** : Gestion sécurisée des paiements en espèces/Mobile Money avec réconciliation financière.

### 🏢 3. Portail Client Donneur d'Ordre B2B
- **Supervision des Envois** : Tableau de bord dédié pour les grandes entreprises donneuses d'ordres (Orange, Banque Atlantique, EDG...).
- **Téléchargement des POD** : Accès direct aux preuves de livraison et rapports de distribution en temps réel.
- **Gestion des Utilisateurs & Filiales** : Accès cloisonné par entreprise donneuse d'ordre.

### 👑 4. Espace Master Admin SaaS (Platform Owner)
- **Gestion Multi-Tenants** : Provisionnement des entreprises clientes, gestion des quotas d'utilisateurs et des sous-domaines.
- **Gestion des Abonnements & Licences** : Suivi du MRR/ARR, facturation et plans tarifaires.
- **Identity & Access Management (IAM)** : Gestion des rôles, invitations, journaux de connexion et audit de sécurité.

### 💼 5. CRM Commercial & Lifecycle Management
- **Pipeline de Vente (10 Stages)** : Suivi des prospects depuis le formulaire de landing page jusqu'à la signature de contrat.
- **Gestion des Démonstrations & Devis PDF** : Génération automatique de propositions commerciales et devis.
- **Auto-Onboarding** : La signature de contrat déclenche automatiquement le provisionnement de l'organisation et du premier compte Dispatcher Admin.

### 🌐 6. API Publique & Intégrations Enterprise
- **API REST v1** : Endpoint sécurisé avec clés API (`/api/v1/missions`, `/api/v1/pod`, `/api/v1/cod`, `/api/v1/organisations`).
- **Webhooks & Documentation Interactive** : Notifications d'évènements en temps réel et documentation OpenAPI Swagger/ReDoc.

---

## 🏗️ Architecture Technique

- **Framework Frontend/Backend** : Next.js 14 (App Router) + React + TypeScript
- **Styling UI** : Vanilla CSS + TailwindCSS (Design système sombre glassmorphism, responsive)
- **Base de Données & Authentification** : Supabase (PostgreSQL RLS, Supabase Auth)
- **Icônes & Visualisation** : Lucide React
- **Gestion des Rôles (RBAC)** : `super_admin`, `client_admin`, `dispatcher`, `field_agent`

---

## ⚡ Préréquis & Installation

### 1. Cloner le Dépôt
```bash
git clone https://github.com/votre-compte/logistrack-v2.git
cd logistrack-v2
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Configurer les Variables d'Environnement
Copiez le fichier exemple `.env.example` en `.env.local` et remplissez vos identifiants Supabase :
```bash
cp .env.example .env.local
```

Contenu recommandé de `.env.local` :
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
```

---

## 🚀 Lancement de l'Application

### En Mode Développement (HMR Live)
```bash
npm run dev
```
Accédez à l'application sur [http://localhost:3000](http://localhost:3000).

### En Mode Production (Build & Start)
```bash
npm run build
npm run start
```

---

## 🔑 Identifiants d'Accès par Défaut (Environnement de Démo)

La page de connexion unifiée est disponible sur [http://localhost:3000/login](http://localhost:3000/login) :

| Profil / Rôle | Identifiant E-mail | Mot de Passe par Défaut | Espace Dédié |
|---|---|---|---|
| **Super Admin (Platform Owner)** | `master.admin@logistrack.online` | `LogisTrack2026!MasterOwner#Admin` | `/master-admin/overview` |
| **Dispatcher / Admin Exploitation** | `dispatcher@logistics-wa.gn` | Démo libre (`••••••••••••`) | `/overview` |
| **Donneur d'Ordre Client B2B** | `contact@orange-guinee.gn` | Démo libre (`••••••••••••`) | `/client-portal/overview` |
| **Agent Terrain PWA** | `m.diallo@logistics-wa.gn` | Démo libre (`••••••••••••`) | `/dispatch` |

---

## 🗄️ Migrations Base de Données (Supabase PostgreSQL)

Les scripts d'initialisation et de sécurité sont situés dans le dossier `supabase/` :

- `supabase/migrations/01_security_rls_policies.sql` : Politiques RLS PostgreSQL Multi-Tenants.
- `supabase/migrations/20260807030000_sprint11_crm_lifecycle_management.sql` : Schémas des tables du module CRM Commercial.
- `supabase/seed_super_admin.sql` : Script d'initialisation du premier compte Super Admin `Ibrahima Kassambara`.

---

## 📄 Licence & Droits d'Auteur

© 2026 LOGISTRACK V2 Enterprise. Tous droits réservés.
