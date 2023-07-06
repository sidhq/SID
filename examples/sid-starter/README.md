# SID Starter App - Documentation

Deploy it now on Vercel: 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsidhq%2FSID%2Ftree%2Fmain%2Fexamples%2Fsid-starter&env=SID_CALLBACK_URL,SID_CLIENT_ID,SID_CLIENT_SECRET,SID_REDIRECT_URL,SID_AUTH_ENDPOINT,SID_API_ENDPOINT,OPENAI_API_KEY&envDescription=We%20walk%20you%20through%20integrating%20SID%20in%20your%20LLM%20app%2C%20apply%20on%20our%20waitlist%20here%3A%20https%3A%2F%2Fjoin.sid.ai%2F&envLink=https%3A%2F%2Fgithub.com%2Fsidhq%2FSID%2Fblob%2Fmain%2Fexamples%2Fsid-starter%2FREADME.md&project-name=sid-starter&repository-name=sid-starter&demo-title=SID%20Starter%20App&demo-description=A%20simple%20app%20to%20showcase%20how%20SID%20works.&demo-url=https%3A%2F%2Fsid-starter.demo.sid.ai%2F)

The SID Starter App is a starter project that illustrates how to integrate SID into your AI application. This application uses the OAuth 2.0 Authorization Code Flow to authenticate users, obtain access tokens, and make authenticated requests to the SID API endpoint which lets you retrieve personalized context for your LLM app.

## Important Components

- `ConnectSIDButton.tsx`: This component renders a button that either directs the user to log in with SID or, if already connected, directs them to SID's Privacy Dashboard. You may reuse this button in your own application.

- `SidContainer.tsx`: This component provides an input field for user queries and a submit button. It also displays two text areas that show both the raw and processed API responses. You will not need this component in your own application.

## API Routes

- `api/callback.ts`: This is the callback endpoint for the authentication flow. Upon successful user login, SID sends an authorization code to this endpoint. This code is then exchanged for an access token and a refresh token. For a production environment, the refresh token should be securely stored in a database. The refresh token can be exchanged for an access token which in turn is needed to authenticate with the `https://api.sid.ai/api/v1/users/me/data/query` endpoint.

- `api/query.ts`: This endpoint is used for making authenticated requests to the SID API. In this example app, the refresh token is sent to this endpoint from the client, in a production environment, the refresh token would be directly retrieved from the database.

## Environment Variables

The application uses several environment variables, found in `.env.local.template`, rename this file to .env.local and fill in your values accordingly :

- `SID_CLIENT_ID` & `SID_CLIENT_SECRET`: These are your application's client credentials. Please join our waitlist at https://join.sid.ai/ to obtain them.
- `SID_CALLBACK_URL`: Your "Connect SID" button will link to this URL. This is the entrypoint for your users to go through SID's authentication flow. This URL will be provided to you by us.
- `SID_REDIRECT_URL`: The URL where the application will redirect users after they have been authenticated and where the authorization code to refresh token & access token exchange will take place. 
- `SID_AUTH_ENDPOINT`: The endpoint where the application sends a POST request to obtain the access token. Default value is `https://auth.sid.ai/oauth/token`
- `SID_API_ENDPOINT`: The endpoint where the authenticated API request is sent to obtain personalized context for you LLM app. Default value is `https://api.sid.ai/api/v1/users/me/data/query`
- `OPENAI_API_KEY`: This environment variable is optional. If provided, the starter app will also process the retrieved context with GPT-4.

## Technical Details

### Authentication Mechanism

The application uses the OAuth 2.0 Authorization Code Flow. After successful user authentication and authorization, SID sends an authorization code to the callback URL, as defined in the `SID_CALLBACK_URL` environment variable. The backend exchanges this authorization code for a refresh token and an access token, which is used for querying the SID API.

### Refresh Token

The refresh token is a long-lived token used to retrieve a new access token when the previous one expires. It's crucial to avoid exposing the refresh token to the client-side due to its potential misuse for unauthorized access to the user's data.

**Important:** In the provided example, the refresh token is set in a cookie and sent to the client for demonstration purposes only. This is not a secure practice and should be avoided in a production environment. Instead, securely store the refresh token in a server-side database. When a new access token is needed, the server should retrieve the refresh token from the database.

### Access Token

This short-lived token authenticates each request made to the SID API. It is obtained by making a POST request to the  `https://auth.sid.ai/oauth/token` endpoint with the refresh token, client ID and client secret. The Access Token is then added in the Authorization header of each SID API request.

### SID API Endpoint

The SID API endpoint is used to make authenticated requests to the SID API. It allows you to retrieve personalized context based on the ingested user-specific data for each user. This endpoint is defined in the `SID_API_ENDPOINT` environment variable. You should use `https://api.sid.ai/api/v1/users/me/data/query` here.

#### Making a Request

To make a request to this endpoint, you need to send a POST request with a JSON body and an Authorization header.

- **Authorization Header**: The Authorization header should include the access token obtained from the authentication process. This token is used to authenticate the request. The Authorization header should be in the following format: `Authorization: Bearer {access_token}`.

- **JSON Body**: The JSON body of the request should include the `query` and the `limit`. The `query` should be a string that represents a question or the information the user is seeking. The `limit` should be an integer that sets the number of responses that the API should return. Here is a sample JSON body:

```json
{
    "query": "Who is John Doe?",
    "limit": 3
}
```

This JSON body asks the question "Who is John Doe?" and sets a limit of 3 responses.

#### Response

The API will return a JSON response with an array of results. The number of results will roughly correspond to the `limit` set in the request. Each result in the array represents a specific piece of personalized data relevant to the user's query.

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

This application is a basic starter project and is not intended for use as-is in a production environment. Additional security measures are needed, including but not limited to securely storing the refresh token and handling errors in a more comprehensive manner.
