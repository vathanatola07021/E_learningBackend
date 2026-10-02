/**
 * Standard ApiResponse wrapper matching EduLearn Flutter app ApiResponse<T>
 */
class ApiResponse {
  static success(data = null, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message = 'An error occurred', data = null, statusCode = 400) {
    return {
      success: false,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = ApiResponse;
