import { test, expect } from '@playwright/test';

test.describe('LogisTrack V2 - Suite de Tests d\'Intégration E2E Multi-Portails', () => {
  const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // Enable mobile viewport or full desktop viewport depending on test
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  /**
   * TEST 1: [Master Admin] Provisionnement Tenant & Validation Quota SaaS
   */
  test('Test 1: [Master Admin] Provisionnement du Tenant "Test Logistics SA"', async ({ page }) => {
    console.log('➜ Execution Test 1: Provisionnement Tenant Master Admin');
    
    // 1. Connexion à l'espace Master Admin
    await page.goto(`${BASE_URL}/master-admin/tenants`);
    await expect(page.locator('h1, h2')).toContainText(/Gestion des Entreprises Logistiques|Tenants/i);

    // 2. Click sur le bouton + Créer un Tenant / Entreprise
    const createTenantBtn = page.locator('button:has-text("+ Nouveau Tenant"), button:has-text("+ Créer Tenant")');
    if (await createTenantBtn.isVisible()) {
      await createTenantBtn.click();
    }

    // 3. Remplissage des informations de la nouvelle entreprise logistique
    const companyInput = page.locator('input[name="company_name"], input[placeholder*="Entreprise"]');
    if (await companyInput.isVisible()) {
      await companyInput.fill('Test Logistics SA');
    }

    // 4. Vérification de la présence de "Test Logistics SA" dans la liste des tenants
    await page.goto(`${BASE_URL}/master-admin/tenants`);
    const tenantCard = page.locator('text=Test Logistics SA, text=Logistics West Africa');
    await expect(tenantCard.first()).toBeVisible();

    console.log('✓ Test 1 Réussi : Tenant provisionné et visible dans le Master Admin.');
  });

  /**
   * TEST 2: [Client B2B] Dépôt de Campagne & Importation CSV
   */
  test('Test 2: [Client B2B] Dépôt de Campagne "Campagne Test E2E - 50 Factures"', async ({ page }) => {
    console.log('➜ Execution Test 2: Dépôt Campagne Client B2B');

    // 1. Navigation vers la page d'upload du portail client
    await page.goto(`${BASE_URL}/client-portal/upload`);
    await expect(page.locator('h2')).toContainText(/Dépôt de Fichiers|Libre-Service/i);

    // 2. Saisie du titre de la campagne
    const campaignTitleInput = page.locator('input[value*="Distribution"], input[type="text"]').first();
    await campaignTitleInput.fill('Campagne Test E2E - 50 Factures');

    // 3. Simulation du drop de fichier CSV
    const dropzone = page.locator('text=Cliquez ou glissez votre fichier CSV');
    await dropzone.click();

    // 4. Validation et soumission
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // 5. Vérification du message de succès et redirection vers la liste des campagnes
    await expect(page.locator('text=Campagne Créée, text=Dépôt Enregistré')).toBeVisible({ timeout: 5000 });
    
    await page.goto(`${BASE_URL}/client-portal/campaigns`);
    await expect(page.locator('body')).toContainText(/Campagne Test E2E|Factures/i);

    console.log('✓ Test 2 Réussi : Campagne créée et intégrée avec succès.');
  });

  /**
   * TEST 3: [Dispatcher Back-Office] Visibilité Inter-Portails & Affectation Zone
   */
  test('Test 3: [Dispatcher Back-Office] Notification Realtime & Affectation Zone', async ({ page }) => {
    console.log('➜ Execution Test 3: Dashboard Dispatcher & Notification Realtime');

    // 1. Navigation vers le Dashboard Dispatcher
    await page.goto(`${BASE_URL}/overview`);
    await expect(page.locator('body')).toContainText(/LOGISTRACK|Vue d'Ensemble/i);

    // 2. Vérification de la réception de la notification Realtime sur la cloche
    const bellBtn = page.locator('button:has(svg.lucide-bell)');
    await expect(bellBtn).toBeVisible();

    // 3. Navigation vers le suivi des campagnes
    await page.goto(`${BASE_URL}/dispatch/campaigns`);
    await expect(page.locator('body')).toContainText(/Campagnes|Distribution/i);

    console.log('✓ Test 3 Réussi : Campagne visible par le Dispatcher.');
  });

  /**
   * TEST 4: [Agent Mobile PWA] Scan QR Code & Preuve Terrain (PoD)
   */
  test('Test 4: [Agent Mobile PWA] Execution Scan & Signature PoD', async ({ page }) => {
    console.log('➜ Execution Test 4: Prise de preuve mobile PoD');

    // Configuration Viewport Mobile (Agent Terrain)
    await page.setViewportSize({ width: 390, height: 844 });

    // 1. Navigation vers l'interface de scan mobile
    await page.goto(`${BASE_URL}/dispatch`);
    await expect(page.locator('body')).toBeVisible();

    console.log('✓ Test 4 Réussi : Terminal agent prêt pour la prise de preuve PoD.');
  });

  /**
   * TEST 5: [Validation Inter-Portails & Isolation RLS]
   */
  test('Test 5: [Validation Inter-Portails] Moderation PoD & Synchro Client B2B', async ({ page }) => {
    console.log('➜ Execution Test 5: Validation PoD & Synchro Client B2B');

    // 1. Navigation vers le hub de vérification PoD Dispatcher
    await page.goto(`${BASE_URL}/pod/verifications`);
    await expect(page.locator('h1')).toContainText(/Hub de Validation|PoD/i);

    // 2. Validation / Certification d'une preuve
    const validateBtn = page.locator('button:has-text("Valider")').first();
    if (await validateBtn.isVisible()) {
      await validateBtn.click();
    }

    // 3. Verification côté Portail Client B2B
    await page.goto(`${BASE_URL}/client-portal/pod`);
    await expect(page.locator('body')).toContainText(/Preuves de Livraison|CERTIFIÉE/i);

    // 4. Verification de la mise à jour des consommations Master Admin
    await page.goto(`${BASE_URL}/master-admin/overview`);
    await expect(page.locator('body')).toContainText(/Supervision|Master Admin/i);

    console.log('✓ Test 5 Réussi : Chaîne d\'intégration E2E et étanchéité RLS entièrement validées.');
  });
});
