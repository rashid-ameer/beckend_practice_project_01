import ERROR_CODES from "../constants/errorCodes";
import HTTP_CODES from "../constants/httpCodes";

class ApiError extends Error {
  constructor(
    public statusCode: HTTP_CODES,
    public message: string,
    public errorCode?: ERROR_CODES
  ) {
    super(message);
  }
}

export default ApiError;
