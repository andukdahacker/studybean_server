class AuthUtils {
  static validatePassword(value: string) {
    if (value.trim().length === 0) {
      return "Please enter your password";
    }

    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (value.length > 20) {
      return "Password must be less than 20 characters";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase character";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase character";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Password must contain at least one special character";
    }

    return null;
  }
}

export default AuthUtils;
