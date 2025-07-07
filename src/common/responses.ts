export const successResponse = <T>(
  data: T,
  statusCode = 200,
  message = 'Operation successful',
) => {
  return {
    statusCode,
    message,
    data,
  };
};


export const errorResponse = (
  statusCode = 400,
  message = 'An internal error occurred',
  errors: any = null,
) => {
  return {
    statusCode,
    message,
    errors,
  };
};
