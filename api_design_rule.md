# API Detailed Design Context for AI Onboarding

<api_design_rules>
    <rule id="global-route-prefix">
        <title>Global Route Prefix</title>
        <description>All API endpoints must fall under a unified versioned base path.</description>
        <requirement>Prefix all routes with `/api/v1/`</requirement>
    </rule>

    <rule id="path-url-convention">
        <title>Path URL Convention</title>
        <description>URL paths must be clean, readable, and standardized.</description>
        <requirement>Use strictly `kebab-case` for all resource names and path segments (e.g., `/api/v1/appointment-schedules`).</requirement>
    </rule>

    <rule id="response-format">
        <title>Standardized Response Format</title>
        <description>All API responses (success and error) must be consistently wrapped in a standard JSON envelope.</description>
        <requirement>
            The response object must contain exactly the following properties:
            - `code` (integer): The HTTP status code or a specific business logic code.
            - `message` (string): A human-readable description of the result.
            - `data` (object/array/null): The actual payload or empty object/array on failure.
        </requirement>
    </rule>

    <rule id="authentication">
        <title>Endpoint Authentication</title>
        <description>System endpoints are secured and require authorization.</description>
        <requirement>Apply JWT Bearer Authentication to all secured endpoints. Always append the security scheme in the endpoint specification.</requirement>
    </rule>

    <rule id="sensitive-data-protection">
        <title>Sensitive Data Protection</title>
        <description>Data privacy must be strictly enforced at the API boundary.</description>
        <requirement>Never return sensitive fields like `password`, credentials, or confidential internal flags in response schemas.</requirement>
    </rule>
</api_design_rules>

<visual_format_example>
The following is an example of how the API endpoints should be documented according to the rules above using OpenAPI YAML format:

```yaml
  /api/v1/auth/login:
    post:
      summary: "User Login"
      description: "Authenticates a user and returns a token along with basic user details."
      security:
        - bearerAuth: [] # AI will learn to append this to all locked routes
      responses:
        '200':
          description: "Successful authentication"
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: 
                    type: integer
                    example: 200
                  message: 
                    type: string
                    example: "Login successful"
                  data:
                    type: object
                    properties:
                      email:
                        type: string
                        example: "johndoe@example.com"
                      fullName:
                        type: string
                        example: "John Doe"
                      roles:
                        type: array
                        items:
                          type: string
                        example: ["ROLE_USER", "ROLE_DOCTOR"]
```
</visual_format_example>
