/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncPreferences = /* GraphQL */ `
  query SyncPreferences(
    $filter: ModelPreferencesFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPreferences(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        preferences
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getPreferences = /* GraphQL */ `
  query GetPreferences($id: ID!) {
    getPreferences(id: $id) {
      id
      name
      preferences
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listPreferences = /* GraphQL */ `
  query ListPreferences(
    $filter: ModelPreferencesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPreferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        preferences
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
