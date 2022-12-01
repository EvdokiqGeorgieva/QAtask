// @ts-check
const { test, expect } = require('@playwright/test');

test('login page is displayed correctly', async ({ page }) => {
  await page.goto('http://localhost:8080/login');

  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByRole('heading', {name: 'Login'})).toBeVisible();
  await expect(page.locator('//input[@type=\'email\']')).toBeVisible();
  await expect(page.locator('//input[@type=\'password\']')).toBeVisible();
  await expect(page.getByRole('button', {name: 'Submit'})).toBeVisible();
});

test('login successfully with normal user - redirected to upload page', async ({ page }) => {
  await page.goto('http://localhost:8080/login');

  await expect(page).toHaveURL(/.*login/);

  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('normal@example.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('normpass');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/.*upload/);
  await expect(page.getByText('Upload')).toBeVisible();
  await expect(page.getByPlaceholder('Twin name')).toBeVisible();

});

test('login successfully with enterprise user - redirected to upload page', async ({ page }) => {
  await page.goto('http://localhost:8080/login');

  await expect(page).toHaveURL(/.*login/);

  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('enterprise@example.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('entrpass');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/.*upload/);
  await expect(page.getByText('Upload')).toBeVisible();
  await expect(page.getByPlaceholder('Twin name')).toBeVisible();

});

test('login successfully with array of allowed users - redirected to upload page', async ({ page }) => {
  const users = [
    {
      email: 'normal@example.com',
      password: 'normpass'
    },
    {
      email: 'enterprise@example.com',
      password: 'entrpass'
    }
  ]

  for (let i = 0; i < users.length; i++) {
    const userEmail = users[i].email;
    const userPassword = users[i].password;
    await page.goto('http://localhost:8080/login');
    await expect(page).toHaveURL(/.*login/);
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(userEmail);
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill(userPassword);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL(/.*upload/);
    await expect(page.getByText('Upload')).toBeVisible();
    await expect(page.getByPlaceholder('Twin name')).toBeVisible();
  }
});

test('login not possible with array of wrong users - redirected to login page', async ({ page }) => {
  const wrongUsers = [
    {
      email: 'test1@example.com',
      password: 'test1'
    },
    {
      email: 'test2@example.com',
      password: 'test2'
    },
    {
      email: '',
      password: 'test1'
    },
    {
      email: 'test1@example.com',
      password: ''
    }
  ]

  for (let i = 0; i < wrongUsers.length; i++) {
    const userEmail = wrongUsers[i].email;
    const userPassword = wrongUsers[i].password;
    await page.goto('http://localhost:8080/login');
    await expect(page).toHaveURL(/.*login/);
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(userEmail);
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill(userPassword);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Submit'})).toBeVisible();
  }
});
