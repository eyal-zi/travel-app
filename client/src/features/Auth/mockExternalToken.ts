// MOCK: the token an external identity provider would return via the SSO popup's
// postMessage. It is an HS256 JWT signed with the server's IDP_SECRET
// (dev-idp-secret-change-me) carrying the profile claims (uniqueId, username,
// groups, names, email). The server verifies it and exchanges it for our own
// app JWT.
//
// TODO: replace this with the real `event.data.user.token` from the popup once
// the live IdP is wired up.

/*
Admin User JSON:
{
  "uniqueId": "idp-0001",
  "username": "jdoe",
  "groups": ["travel-app-users", "travel-app-admins"],
  "firstName": "Jane",
  "lastName": "Doe",
  "fullName": "Jane Doe",
  "displayName": "Jane D.",
  "email": "jane.doe@example.com",
  "iat": 1782744164
}

Non-Admin User JSON:
{
  "uniqueId": "idp-0002",
  "username": "jsmith",
  "groups": ["travel-app-users"],
  "firstName": "John",
  "lastName": "Smith",
  "fullName": "John Smith",
  "displayName": "John S.",
  "email": "john.smith@example.com",
  "iat": 1782744164
}
*/

// Admin token (with travel-app-admins group)
export const MOCK_EXTERNAL_ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVJZCI6ImlkcC0wMDAxIiwidXNlcm5hbWUiOiJqZG9lIiwiZ3JvdXBzIjpbInRyYXZlbC1hcHAtdXNlcnMiLCJ0cmF2ZWwtYXBwLWFkbWlucyJdLCJmaXJzdE5hbWUiOiJKYW5lIiwibGFzdE5hbWUiOiJEb2UiLCJmdWxsTmFtZSI6IkphbmUgRG9lIiwiZGlzcGxheU5hbWUiOiJKYW5lIEQuIiwiZW1haWwiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc4Mjc0NDE2NH0.EPXafrtODjUmAF2eYjG4nPxehGJv_jqVyQ-syu-ie-8';

// Non-admin user token (only travel-app-users group, no admin permissions)
export const MOCK_EXTERNAL_USER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVJZCI6ImlkcC0wMDAyIiwidXNlcm5hbWUiOiJqc21pdGgiLCJncm91cHMiOlsidHJhdmVsLWFwcC11c2VycyJdLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJTbWl0aCIsImZ1bGxOYW1lIjoiSm9obiBTbWl0aCIsImRpc3BsYXlOYW1lIjoiSm9obiBTLiIsImVtYWlsIjoiam9obi5zbWl0aEBleGFtcGxlLmNvbSIsImlhdCI6MTc4Mjc0NDE2NH0.HY5wSBQF_6GrSzuT1tJQj7KEUrPsSVqwRpHyG5EAE7A';

// Default mock token used in development (currently Admin)
export const MOCK_EXTERNAL_TOKEN = MOCK_EXTERNAL_USER_TOKEN;

