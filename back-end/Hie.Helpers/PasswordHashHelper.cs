using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Text;

namespace Hie.Helpers {
  public static class PasswordHashHelper {
    public static string HashPassword(string salt, string password, int iterationCount = 10000, KeyDerivationPrf keyDerivation = KeyDerivationPrf.HMACSHA256) {
      if (string.IsNullOrEmpty(password)) {
        throw new ArgumentNullException(nameof(password), "Password must be not empty");
      }
      if (string.IsNullOrEmpty(salt)) {
        throw new ArgumentNullException(nameof(salt), "Salt must be not empty");
      }
      var saltArr = Encoding.UTF8.GetBytes(salt);
      string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
          password: password,
          salt: saltArr,
          prf: keyDerivation,
          iterationCount: iterationCount,
          numBytesRequested: 256 / 8));
      return hashed;
    }
  }
}