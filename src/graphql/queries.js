/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getExercise = /* GraphQL */ `
  query GetExercise($id: ID!) {
    getExercise(id: $id) {
      id
      userName
      userEmail
      exerciseName
      date
      data
    }
  }
`;
export const listExercises = /* GraphQL */ `
  query ListExercises(
    $filter: ModelExerciseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExercises(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userName
        userEmail
        exerciseName
        date
        data
      }
      nextToken
    }
  }
`;
export const getAccessCode = /* GraphQL */ `
  query GetAccessCode($userEmail: String!) {
    getAccessCode(userEmail: $userEmail) {
      userEmail
      accessCode
    }
  }
`;
export const listAccessCodes = /* GraphQL */ `
  query ListAccessCodes(
    $userEmail: String
    $filter: ModelAccessCodeFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAccessCodes(
      userEmail: $userEmail
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        userEmail
        accessCode
      }
      nextToken
    }
  }
`;
