# Task Manager API

This is a Node.js and Express project called "Task Manager API" that provides a set of routes for managing tasks, task lists, and user authentication. The API is designed to allow users to create, update, delete, and retrieve tasks, task lists, and user information. The routes are protected with authentication middleware to ensure secure access.
Routes

### It uses Typescript nstead of plain JavaScript

1. Run npm install to install the required dependencies

2. Create a sentive.js file with the following metrics as exports:

   1. EmailApiKey: The Elastic email api key
   2. databaseUrl: The mongoDb Database URL
   3. jwtSecret: A secret Key for JSON web token(Choose any but keep it long and secret)

3. Task Routes
   1. POST /task/create
      1. Creates a new task.
      2. Requires authentication.
      3. Endpoint tested and functional.
   2. POST /task/update
      1. Updates an existing task.
      2. Requires authentication.
      3. Endpoint tested and functional.
   3. POST /task/delete
      1. Deletes a task.
      2. Requires authentication.
      3. Endpoint tested and functional.
   4. POST /task/get
      1. Retrieves a task.
      2. Requires authentication.
      3. Endpoint tested and functional.
   5. POST /task/get-all
      1. Retrieves all tasks.
      2. Requires authentication.
      3. Endpoint tested and functional.
   6. POST /task/add-priority
      1. Adds priority to a task.
      2. Requires authentication.
      3. Endpoint tested and functional.
   7. POST /task/remove-priority
      1. Removes priority from a task.
      2. Requires authentication.
      3. Endpoint tested and functional.
   8. POST /task/get-priority
      1. Retrieves priority tasks.
      2. Requires authentication.
      3. Endpoint tested and functional.
   9. POST /task/complete
      1. Marks a task as completed.
      2. Requires authentication.
      3. Endpoint tested and functional.
   10. POST /task/uncomplete
       1. Marks a task as uncompleted.
       2. Requires authentication.
       3. Endpoint tested and functional.
   11. POST /task/get-uncompleted
       1. Retrieves uncompleted tasks.
       2. Requires authentication.
       3. Endpoint tested and functional.
   12. POST /task/get-completed
       1. Retrieves completed tasks.
       2. Requires authentication.
       3. Endpoint tested and functional.
4. Task List Routes
   1. POST /task-list/create
      1. Creates a new task list.
      2. Endpoint tested and functional.
   2. POST /task-list/update
      1. Updates an existing task list.
      2. Endpoint tested and functional.
   3. POST /task-list/delete
      1. Deletes a task list.
      2. Endpoint tested and functional.
   4. POST /task-list/add-collaborator
      1. Adds a collaborator to a task list.
      2. Endpoint tested and functional.
   5. POST /task-list/remove-collaborator
      1. Removes a collaborator from a task list.
      2. Endpoint tested and functional.
   6. POST /task-list/add-task
      1. Adds a task to a task list.
      2. Endpoint tested and functional.
   7. POST /task-list/remove-task
      1. Removes a task from a task list.
      2. Endpoint tested and functional.
5. User Routes
   1. POST /user/create
      1. Creates a new user.
      2. Endpoint tested and functional.
   2. POST /user/update
      1. Updates user information.
      2. Endpoint tested and functional.
   3. POST /user/delete
      1. Deletes a user.
      2. Endpoint tested and functional.
   4. POST /user/login
      1. Authenticates a user and generates a session token.
      2. Endpoint tested and functional.
   5. POST /user/logout
      1. Logs out a user by invalidating the session token.
      2. Endpoint tested and functional.
   6. POST /user/get-user
      1. Retrieves user information.
      2. Endpoint tested and functional.
