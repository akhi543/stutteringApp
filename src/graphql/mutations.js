/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createExercise = /* GraphQL */ `
  mutation CreateExercise(
    $input: CreateExerciseInput!
    $condition: ModelExerciseConditionInput
  ) {
    createExercise(input: $input, condition: $condition) {
      id
      userName
      userEmail
      exerciseName
      date
      data
    }
  }
`;
export const updateExercise = /* GraphQL */ `
  mutation UpdateExercise(
    $input: UpdateExerciseInput!
    $condition: ModelExerciseConditionInput
  ) {
    updateExercise(input: $input, condition: $condition) {
      id
      userName
      userEmail
      exerciseName
      date
      data
    }
  }
`;
export const deleteExercise = /* GraphQL */ `
  mutation DeleteExercise(
    $input: DeleteExerciseInput!
    $condition: ModelExerciseConditionInput
  ) {
    deleteExercise(input: $input, condition: $condition) {
      id
      userName
      userEmail
      exerciseName
      date
      data
    }
  }
`;
export const createAccessCode = /* GraphQL */ `
  mutation CreateAccessCode(
    $input: CreateAccessCodeInput!
    $condition: ModelAccessCodeConditionInput
  ) {
    createAccessCode(input: $input, condition: $condition) {
      userEmail
      accessCode
    }
  }
`;
export const updateAccessCode = /* GraphQL */ `
  mutation UpdateAccessCode(
    $input: UpdateAccessCodeInput!
    $condition: ModelAccessCodeConditionInput
  ) {
    updateAccessCode(input: $input, condition: $condition) {
      userEmail
      accessCode
    }
  }
`;
export const deleteAccessCode = /* GraphQL */ `
  mutation DeleteAccessCode(
    $input: DeleteAccessCodeInput!
    $condition: ModelAccessCodeConditionInput
  ) {
    deleteAccessCode(input: $input, condition: $condition) {
      userEmail
      accessCode
    }
  }
`;
