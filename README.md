### Work in progress...

This project is a boilerplate for building authentication systems using Hono (a fast, lightweight web framework) and React. It uses JWT (JSON Web Tokens) for authentication and session management. Integration of refresh tokens is planned but not yet fully implemented.

A key feature is the example on the home page: users can test an API call to an authentication-protected endpoint. The call succeeds while the JWT is valid, but after a few seconds (when the token expires), the endpoint becomes inaccessible, demonstrating token expiration in real time.

**Features:**

- Hono backend with JWT-based authentication
- React frontend with example API calls
- Demonstrates token expiration and protected routes
- Refresh token integration coming soon
