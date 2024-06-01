# Pangea Test Task

### Mandatory Task:

1. Create a user list with the ability to:
   - Add a user
   - Delete a user
2. Create a user data/prestation page to edit all user fields
   - On the user details page, create a section for managing user files.
3. The user file section should allow:
   - Adding files
   - Deleting files
   - Attaching any previously uploaded file in the system to the user.
   - Deleting an attached file should not result in the file being deleted for other users if it has already been attached to another user.

### Non-Compulsory Tasks:

#### Task 1

Create a section for users to be able to register and implement the following features: - User registration and authentication. - Only authenticated users will have access to the functionalities created in the 1st task.

#### Task 2:

Implement a user action to send messages (emails or SMS). - For this, use any messaging service integration, example: https://www.twilio.com/en-us, with message sending through a queue. - For the queue, you can use an integration service or write your own queue implementation. \* After message sending is processed, use a logging scheme for messages.
