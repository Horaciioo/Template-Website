/**
 * Form submission status
 * @type {Object}
 */

const FormStatuses = {
  Idle: 0,
  Submitting: 1,
  Succeeded: 2,
  Failed: 3,
  0: 'Idle',
  1: 'Submitting',
  2: 'Succeeded',
  3: 'Failed',
} as const

/**
 * HTTP response status
 * @type {Object}
 */

const HttpStatuses = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  Unprocessable: 422,
  TooManyRequests: 429,
  ServerError: 500,
  200: 'Ok',
  201: 'Created',
  204: 'NoContent',
  400: 'BadRequest',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'NotFound',
  409: 'Conflict',
  422: 'Unprocessable',
  429: 'TooManyRequests',
  500: 'ServerError',
} as const

export { FormStatuses, HttpStatuses }
