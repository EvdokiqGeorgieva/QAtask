# QAtask
1. The login page works with the hardcoded emails/passwords and denies any other users.
Note: There is no warning or validation message for not allowed users - they are simply redirected to login again. It is better if we have validations.

2. The upload page can be shown only to logged in users. All others are redirected to the login page.
Note: On login, not allowed users are redirected to login page but have in mind that we do not have logout option and the session for allowed users is saved and even if we try to login with not allowed user, the previous session is there and upload page is still accessible.

3. The upload page shows a message when a non-jpeg image is uploaded from an enterprise user.
Note: Actually the validation is for non-enterprise users - the enterprise does not get the validation for the file type.

# To run the tests:
* npx playwright test loginPage_uiTests.spec.js
* npx playwright test uploadPage_uiTests.spec.js

# To open last HTML report run:
* npx playwright show-report
