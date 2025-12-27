import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isStrongPassword,
} from '../../src/utils/validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      expect(isStrongPassword('StrongP@ss1')).toBe(true);
      expect(isStrongPassword('Complex123!')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('NoNumbers!')).toBe(false);
      expect(isStrongPassword('nouppercases1!')).toBe(false);
    });
  });
});
