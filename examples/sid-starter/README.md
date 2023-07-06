# SID Starter App - Documentation

The SID Starter App is a starter project for integrating SID into your AI application. This application uses the OAuth 2.0 Authorization Code Flow to authenticate users, obtain access tokens, and make authenticated requests to the SID API endpoint for personalized data.

## Important Components

- `ConnectSIDButton.tsx`: This component renders a button that either directs the user to log in with SID or, if already connected, directs them to SID's Privacy Dashboard.

- `SidContainer.tsx`: This component provides an input field for user queries and a submit button. It also displays two text areas that show both the raw and processed API responses.

## API Routes

- `api/callback.ts`: This is the callback endpoint for the SID API. Upon successful user login, SID sends an authorization code to this endpoint. The code is then exchanged for an access token and a refresh token. For a production environment, the refresh token should be stored securely in a database within this callback.

- `api/query.ts`: This endpoint is used for making authenticated requests to the SID API. The access token retrieved from `api/callback.ts` is used here to authenticate each request.

## Environment Variables

The application uses several environment variables, stored in `.env.local`, to securely manage sensitive data:

- `SID_CALLBACK_URL`: The URL where SID redirects users after successful authentication along with the authorization code.
- `SID_CLIENT_ID` & `SID_CLIENT_SECRET`: These are your application's client ID and secret, obtained from SID.
- `SID_REDIRECT_URL`: The URL where the application will redirect users after they have been authenticated and the access token has been obtained.
- `SID_AUTH_ENDPOINT`: The endpoint where the application sends a POST request to obtain the access token.
- `SID_API_ENDPOINT`: The endpoint where the authenticated request is sent to obtain personalized data based on user queries.

## Technical Details

### Authentication Mechanism

The application uses the OAuth 2.0 Authorization Code Flow. After successful user authentication and authorization, SID sends an Authorization Code to the Callback URL, as defined in the `SID_CALLBACK_URL` environment variable. The backend exchanges this Authorization Code for a Refresh Token and an Access Token, which is used for querying the SID API.

### Refresh Token

The Refresh Token is a long-lived token used to retrieve a new Access Token when the previous one expires. It's crucial to avoid exposing the Refresh Token to the client-side due to its potential misuse for unauthorized access to the user's data.

**Important:** In the provided example, the Refresh Token is set in a cookie and sent to the client for demonstration purposes only. This is not a secure practice and should be avoided in a production environment. Instead, securely store the Refresh Token in a server-side database. When a new Access Token is needed, the server should retrieve the Refresh Token from the database.

### Access Token

This short-lived token authenticates each request made to the SID API. It is obtained by making a POST request to the endpoint defined in `SID_AUTH_ENDPOINT` with the Refresh Token and other required information. The Access Token is then added in the Authorization header of each SID API request.

### SID API Endpoint

The SID API endpoint is used to make authenticated requests for personalized data based on user-specific queries. This endpoint is defined in the `SID_API_ENDPOINT` environment variable. The current value is: `https://api.sid.ai/api/v1/users/me/data/query`.

#### Making a Request

To make a request to this endpoint, you need to send a POST request with a JSON body and an Authorization header.

- **Authorization Header**: The Authorization header should include the access token obtained from the authentication process. This token is used to authenticate the request. The Authorization header should be in the following format: `Authorization: Bearer {access_token}`.

- **JSON Body**: The JSON body of the request should include the `query` and the `limit`. The `query` should be a string that represents the user's question or the information the user is seeking. The `limit` should be an integer that sets the maximum number of responses that the API should return. Here is a sample JSON body:

```json
{
    "query": "Who is John Doe?",
    "limit": 10
}
```

This JSON body asks the question "Who is John Doe?" and sets a limit of 10 responses.

#### Response

The API will return a JSON response with an array of results. The number of results will not exceed the `limit` set in the request. Each result in the array represents a specific piece of personalized data relevant to the user's query.

Here is a sample response:

```json
{
  "results": ["Retrieved Result 1", "Retrieved Result 2", "Retrieved Result 3"]
}
```
This response indicates that three results were found for the query. The actual content of the results will depend on the specific user query.

If no results are found for the query, the results array will be empty:

```json
{
  "results": []
}
```

Please note that the results are specific and personalized to the authenticated user, making each response unique according to the user's data.

## Further Development

This application is a basic starter project and is not intended for use as-is in a production environment. Additional security measures are needed, including securely storing the Refresh Token, implementing secure API endpoints, and handling errors in a more comprehensive manner.