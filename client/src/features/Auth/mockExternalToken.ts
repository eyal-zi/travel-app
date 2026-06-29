// MOCK: the token an external identity provider would return via the SSO popup's
// postMessage. It is an HS256 JWT signed with the server's IDP_SECRET
// (dev-idp-secret-change-me) carrying the profile claims (uniqueId, username,
// groups, names, email). The server verifies it and exchanges it for our own
// app JWT.
//
// TODO: replace this with the real `event.data.user.token` from the popup once
// the live IdP is wired up.
export const MOCK_EXTERNAL_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVJZCI6ImlkcC0wMDAxIiwidXNlcm5hbWUiOiJqZG9lIiwiZ3JvdXBzIjpbInRyYXZlbC1hcHAtdXNlcnMiLCJ0cmF2ZWwtYXBwLWFkbWlucyJdLCJmaXJzdE5hbWUiOiJKYW5lIiwibGFzdE5hbWUiOiJEb2UiLCJmdWxsTmFtZSI6IkphbmUgRG9lIiwiZGlzcGxheU5hbWUiOiJKYW5lIEQuIiwiZW1haWwiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc4Mjc0NDE2NH0.EPXafrtODjUmAF2eYjG4nPxehGJv_jqVyQ-syu-ie-8'
