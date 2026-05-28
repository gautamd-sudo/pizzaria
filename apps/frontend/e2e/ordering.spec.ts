import { test, expect } from '@playwright/test';

test.describe('PizzaRally End-to-End Ordering Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    // Go to homepage
    await page.goto('/');
  });

  test('should allow a user to search, add to cart, sign in, and place an order', async ({ page }) => {
    // 1. Verify Homepage layout and hero headline
    await expect(page.locator('h1')).toContainText('Authentic Flavors');
    
    // 2. Perform search
    const searchInput = page.locator('input[placeholder="Search menu..."]');
    await searchInput.fill('Margherita');
    await page.locator('button:has-text("Order now")').click();

    // 3. Shop Page - Select item and add to cart
    await expect(page).toHaveURL(/\/shop.*/);
    
    // Click Add to Cart for the first visible item
    const addToCartBtn = page.locator('button:has-text("Cart")');
    await expect(addToCartBtn).toBeVisible();

    // Select variant (e.g. Medium or Large if options exist)
    const pizzaCard = page.locator('div:has-text("Margherita")').first();
    const selectVariantBtn = pizzaCard.locator('button').first();
    if (await selectVariantBtn.isVisible()) {
      await selectVariantBtn.click();
    } else {
      // Just click the main add-to-cart or cart trigger
      await addToCartBtn.click();
    }

    // 4. Verify Persistent Cart Sidebar updates
    const checkoutBtn = page.locator('button:has-text("Proceed to Checkout")');
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // 5. Protected redirect to Login/Registration page
    await expect(page).toHaveURL(/\/login.*/);

    // Populate login details
    await page.locator('input[type="email"]').fill('customer@pizzarally.de');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // 6. Complete Checkout Steps
    await expect(page).toHaveURL(/\/checkout.*/);

    // Step 1: Address Details
    await page.locator('input[placeholder="Street and Number"]').fill('Kaiserstraße 12');
    await page.locator('input[placeholder="ZIP Code"]').fill('10119');
    await page.locator('input[placeholder="City"]').fill('Berlin');
    await page.locator('button:has-text("Continue")').first().click();

    // Step 2: Contact Info
    await page.locator('input[placeholder="First Name"]').fill('Max');
    await page.locator('input[placeholder="Last Name"]').fill('Mustermann');
    await page.locator('input[placeholder="Phone Number"]').fill('+49 170 9876543');
    await page.locator('button:has-text("Continue")').click();

    // Step 3: Choose Payment & Place Order
    await page.locator('label:has-text("Cash on Delivery")').click();
    await page.locator('button:has-text("Place Order")').click();

    // 7. Verify live order tracking stepper activation
    await expect(page.locator('h2')).toContainText('Order Tracking');
    await expect(page.locator('text=Live Tracking Enabled')).toBeVisible();
    await expect(page.locator('text=Received')).toBeVisible();
  });
});
