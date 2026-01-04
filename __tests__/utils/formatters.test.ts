import {
  formatDate,
  formatCurrency,
  capitalize,
  truncate,
  formatTime,
} from '../../src/utils/formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
      expect(truncate('Short', 10)).toBe('Short');
    });
  });

  describe('formatTime', () => {
    it('should format milliseconds into a mm:ss string', () => {
      expect(formatTime(90000)).toBe('1:30');
    });

    it('should pad seconds with a leading zero when necessary', () => {
      expect(formatTime(65000)).toBe('1:05');
    });

    it('should handle zero milliseconds', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('should handle times over a minute correctly', () => {
      expect(formatTime(125000)).toBe('2:05');
    });
  });
});
