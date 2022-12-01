// @ts-check
const { test, expect } = require('@playwright/test');

test('upload page is displayed correctly for array of logged in allowed users', async ({ page }) => {
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

    // go back to login and upload pages - you are not logged out and upload page is still visible
    await page.goto('http://localhost:8080/login');
    await expect(page).toHaveURL(/.*login/);
    await page.goto('http://localhost:8080/upload');
    await expect(page).toHaveURL(/.*upload/);
    await expect(page.getByText('Upload')).toBeVisible();
    await expect(page.getByPlaceholder('Twin name')).toBeVisible();
  }
});

test('upload page is not displayed for array of not logged in wrong users', async ({ page }) => {
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

    // you are redirected to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Submit'})).toBeVisible();

    // try to go to upload page - you see error page
    await page.goto('http://localhost:8080/upload');
    await expect(page.getByText('TypeError')).toBeVisible();
  }
});

test('upload page - non-jpeg can not be uploaded by normal user', async ({ page }) => {
  const users = [
    {
      email: 'normal@example.com',
      password: 'normpass'
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

    // upload png file
    await page.getByPlaceholder('Twin name').click();
    await page.getByPlaceholder('Twin name').fill('Test 2');
    await page.locator('#file-upload').setInputFiles('./tests/fixtures/JS.png');
    await expect(page.locator('#warnings')).toHaveText(/File JS.png is of type image\/png, but we want jpegs/);
  }
});

test('upload page - jpeg successfully uploaded by both users', async ({ page }) => {
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

    // upload jpeg file
    await page.getByPlaceholder('Twin name').click();
    await page.getByPlaceholder('Twin name').fill('Test 1');
    await page.locator('#file-upload').setInputFiles('./tests/fixtures/IT.jpg');
    await expect(page.locator('#warnings')).toBeHidden();
  }
});

test('upload page - non-jpeg can be uploaded by enterprise user', async ({ page }) => {
  const users = [
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

    // upload png file
    await page.getByPlaceholder('Twin name').click();
    await page.getByPlaceholder('Twin name').fill('Test 2');
    await page.locator('#file-upload').setInputFiles('./tests/fixtures/JS.png');
    await expect(page.locator('#warnings')).toBeHidden();
  }
});
