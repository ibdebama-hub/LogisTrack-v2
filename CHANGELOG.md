# LOGISTRACK V2 — CHANGELOG

Toutes les modifications notables apportées au projet LOGISTRACK V2 sont consignées dans ce fichier.

## [2.0.0-SPRINT11] - 2026-08-07

### 💼 CRM Commercial Intégré & Customer Lifecycle Management

#### CRM Commercial Master SaaS & Registre Prospects
- **Registre des Prospects & Qualification (`crmService.ts` / `LeadDetailsDrawerModal.tsx`)** : Fiche complète de prospect, qualification avec score automatique 1-100, canaux d'acquisition, taille estimée d'agents/missions et journal d'interactions.
- **Pipeline Commercial Kanban 10 Étapes (`SalesPipelineKanban.tsx`)** : Pipeline visuel glisser-déposer couvrant tout le cycle (`Nouveau prospect`, `Contact`, `Qualification`, `Démo`, `Proposition`, `Négociation`, `Contrat signé`, `Activation`, `Client actif`, `Perdu`).
- **Raccordement Landing Page (`src/app/page.tsx`)** : Alimentation automatique du pipeline CRM lors de chaque soumission du formulaire "Demander une Démo" de la page d'accueil.

#### Démonstrations, Devis, Contrats & Conversion Automatique Onboarding
- **Gestion des Démonstrations & Calendrier (`DemosCalendarView.tsx`)** : Planning des démos en visio ou présentiel avec comptes-rendus et participants.
- **Propositions & Devis PDF (`proposalService.ts` / `ProposalsContractsManager.tsx`)** : Générateur de devis PDF et offres d'abonnement.
- **Conversion Automatique en Onboarding (`contractService.ts`)** : Lors de la signature d'un contrat, déclenchement automatique du workflow d'onboarding unique (`TenantOnboardingService.executeTenantOnboarding`) pour provisionner le tenant, l'admin principal et générer le mot de passe 18-char sans doublon.

#### Radar des Essais, Automatisations & Suivi Renouvellements
- **Radar des Essais Gratuits/Payants (`trialManagementService.ts` / `TrialManagementRadar.tsx`)** : Suivi de l'engagement, score d'utilisation, jours restants et alertes automatiques (J-7, J-3, J-0).
- **Règles d'Automatisation Commerciale (`salesAutomationEngine.ts`)** : Affectation automatique des commerciaux, relances post-démo et notifications de renouvellement.
- **Migration PostgreSQL Supabase (`20260807030000_sprint11_crm_lifecycle_management.sql`)** : Tables `crm_leads`, `crm_opportunities`, `crm_demos`, `crm_proposals`, `crm_contracts`, `crm_interactions` avec RLS multi-tenant strictes.

---

## [2.0.0-SPRINT10] - 2026-08-07

### 🌐 API Publique, Intégrations Enterprise & Écosystème

#### API REST Versionnée (`/api/v1/`)
- **Endpoints versionnés (`/api/v1/`)** : Endpoints REST complets pour Organisations, Utilisateurs, Agents, Campagnes, Missions, Mission Templates, POD, COD, Analytics et Rapports.
- **Sécurisation du Module COD Optionnel (`/api/v1/cod`)** : Contrôle strict imposant que le module COD ne soit accessible que pour les missions configurées avec encaissement (renvoie un statut HTTP 400 pour les missions sans COD).
- **Spécification OpenAPI 3.0 (`/api/v1/docs`)** : Endpoint de documentation OpenAPI 3.0 en JSON et visualiseur interactif dans l'interface Master Admin ([`OpenApiSpecViewer.tsx`](file:///C:/Users/user/Documents/LogisTrack%20V2/src/components/modules/master-admin/api/OpenApiSpecViewer.tsx)).

#### Authentification API, Scopes, Rate Limiting & Audit
- **Passerelle API (`apiGatewayService.ts`)** : Authentification via Clés API (`x-api-key`) et Bearer Tokens JWT, vérification fine des Scopes (`missions:read`, `pod:write`, `analytics:read`, etc.), Rate Limiting configurable par plan.
- **Journalisation d'Audit API (`apiAuditService.ts`)** : Traçabilité complète de chaque appel (endpoint, méthode, code HTTP, durée ms, IP, user-agent, taille payload).

#### Écosystème Événementiel, Webhooks & Connecteurs Enterprise
- **Moteur de Webhooks Événementiel (`webhookService.ts` / `WebhooksHub.tsx`)** : Gestion des abonnements webhooks, signature cryptographique HMAC-SHA256, réessais automatiques avec backoff exponentiel et journal de livraison.
- **Connecteurs Enterprise ERP / CRM / Mobile Money (`integrationService.ts` / `IntegrationConnectorsHub.tsx`)** : Connecteurs configurables pour SAP S/4HANA, Oracle, Odoo, Salesforce, HubSpot, Shopify, WooCommerce, Orange Money, Wave et MTN MoMo.
- **Moteur d'Automatisation & Exporter Engine (`automationEngine.ts` / `importExportEngine.ts`)** : Moteur de règles d'automatisation (Triggers -> Conditions -> Actions) et export/import multi-formats (CSV, Excel xlsx, JSON, PDF).
- **Générateur de SDKs & Snippets (`sdkGeneratorService.ts`)** : Snippets d'intégration générés à la volée en cURL, TypeScript, Python et PHP.
- **Abstractions Email & SMS (`emailProviderService.ts` / `smsProviderService.ts`)** : Couche d'envoi abstraite pour notifications HTML et SMS OTP.
- **Migration PostgreSQL Supabase (`20260807020000_sprint10_public_api_integrations.sql`)** : Tables `api_keys`, `api_audit_logs`, `webhook_subscriptions`, `webhook_deliveries`, `integration_connectors`, `automation_rules` avec RLS multi-tenant strictes.

---

## [2.0.0-SPRINT9C.1] - 2026-08-07

### 🧹 Consolidation, Fusion & Déduplication du Module Onboarding

#### Unification du Wizard d'Onboarding
- **Composant de référence unique (`OnboardingWizardModal.tsx`)** : Consolidation complète du parcours d'enrôlement multi-tenants 4 étapes avec intégration de la prévisualisation des identifiants et du contrôle de première connexion obligatoire.
- **Suppression des composants redondants** : Élimination de `TenantProvisioningModal.tsx` et `CredentialsModal.tsx` précédemment situés dans `src/components/modules/master-admin/settings/`.

#### Nettoyage des Routes & Navigation
- **Réorganisation des Paramètres Master (`MasterSettingsPage`)** : Suppression de l'onglet doublon "Provisionnement & Enrôlement" dans `/master-admin/settings` et ajout d'un raccourci direct vers le Centre d'Onboarding (`/master-admin/onboarding`).
- **Nettoyage des contrats de types (`masterSettings.ts`)** : Retrait des types obsolètes `TenantProvisioningInput`.

#### Unification des Services Métier
- **Service d'identifiants unique (`credentialService.ts`)** : Délégation officielle de toute génération de mot de passe à `CredentialService.generateStrongTemporaryPassword`.
- **Validation du Workflow à 11 Étapes** : Garantie d'un parcours d'enrôlement unique et sans duplication.

---

## [2.0.0-SPRINT9C] - 2026-08-07

### 🔐 Client Onboarding & Identity Management

#### Assistant d'Onboarding Client (Wizard 4 Étapes)
- **Wizard d'Onboarding Client (`OnboardingWizardModal.tsx`)** : Assistant interactif 4 étapes (Infos organisation, Choix du plan, Administrateur principal, Provisionnement automatique).
- **Service d'Onboarding (`tenantOnboardingService.ts`)** : Orchestration du provisionnement des quotas, du compte admin principal (`Dispatcher Administrator`), des espaces Storage et des paramètres par défaut.

#### Sécurité, Identifiants & Workflow 1ère Connexion
- **Générateur Cryptographique d'Identifiants (`credentialService.ts`)** : Génération de mots de passe temporaires 18 caractères à haute complexité (majuscules, minuscules, chiffres, caractères spéciaux).
- **Workflow de Première Connexion (`FirstLoginPasswordResetModal.tsx` / `/verify/first-login`)** : Force password reset obligatoire à la première connexion avec acceptation des CGU.
- **Gestionnaire d'Invitations & E-mails HTML (`invitationService.ts` / `InvitationsManager.tsx`)** : Suivi des invitations (Renvoyer, Annuler, Régénérer, Prolonger) et modèle d'e-mail HTML prévisualisable.

#### Gestion des Identités & Traçabilité des Accès
- **Identity Management Hub (`identityManagementService.ts` / `IdentityManagementHub.tsx`)** : Recherche, verrouillage/déverrouillage de comptes, réinitialisation forcée d'accès et transfert de rôle admin principal.
- **Journal des Connexions (`securityPolicyService.ts` / `LoginHistoryViewer.tsx`)** : Traçabilité temps réel des accès (IP, navigateur, appareil, géolocalisation, statut, motif d'échec).
- **Migration PostgreSQL (`20260807010000_sprint9c_client_onboarding_identity.sql`)** : Tables `tenant_invitations`, `user_security_profiles`, `user_login_logs`, `security_policies` avec RLS multi-tenant strictes.

---

## [2.0.0-SPRINT9B] - 2026-08-07

### 🛠️ Stabilization Enterprise, Performance & Audit Technique

#### Harmonisation de l'Architecture & Nettoyage
- **Route Consolidation** : Déplacement et unification de toutes les routes sous le groupe App Router `src/app/(dashboard)/` (`analytics`, `finance/reconciliation`, `dispatch/clients`, `dispatch/import`, `dispatch/territories`).
- **Suppression de Dette Technique** : Élimination du fichier de types redondant `clientPortal.ts` fusionné au sein de `b2bClientPortal.ts`.
- **RBAC Middleware** : Extension des règles de protection du middleware Next.js pour englober la route `/analytics`.

#### Qualité du Code & Robustesse
- **Gestion des Erreurs (`src/lib/services/errorService.ts`)** : Mise en place d'un service d'erreur typé avec catégorisation (`AUTHENTICATION`, `AUTHORIZATION`, `GPS_LOCATION`, `PAYMENT_COD`, `VALIDATION`) et suggestions de récupération actionnables.
- **Audit Logging System (`src/lib/services/auditLogService.ts`)** : Service de journalisation centralisé enregistrant les événements critiques (Connexions, Statuts de mission, Captures POD, Réconciliations COD, Actions SaaS Master Admin).

#### Base de Données & Performance PostgreSQL
- **Migration `20260807000000_sprint9b_enterprise_stabilization.sql`** :
  - Création de la table `audit_logs` avec politiques RLS multi-tenant strictes.
  - Ajout d'index multi-colonnes B-tree sur `items`, `campaigns`, `batches`, `pod_verifications`, `cod_transactions`.
  - RPC PostgreSQL `get_enterprise_kpi_summary` pour une agrégation instantanée des indicateurs clés.

#### Fondations des Futurs Sprints
- Ajout des contrats d'interfaces typées :
  - `src/types/publicApi.ts` (API Keys, Scopes, Public ApiResponse).
  - `src/types/webhooks.ts` (Webhook Subscriptions, Payloads, Event Types).
  - `src/types/integrations.ts` (Connecteurs SAP, Oracle, Odoo, Salesforce, Shopify).

---

## [2.0.0-SPRINT9] - 2026-08-06
- Master Admin SaaS Portal & Billing Management.
- Multi-Tenant RLS isolation policies & SaaS Quota Engine.
- Mission Templates & Batch Distribution Engine.
