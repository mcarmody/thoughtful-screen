import { sort, sortWithReason } from './packageSorter';

describe('Package Sorter', () => {
  describe('STANDARD packages', () => {
    test('small package with low mass', () => {
      expect(sort(10, 10, 10, 5)).toBe('STANDARD');
    });

    test('package just under volume threshold', () => {
      expect(sort(99, 99, 100, 10)).toBe('STANDARD');
    });

    test('package just under dimension threshold', () => {
      expect(sort(149, 10, 10, 10)).toBe('STANDARD');
    });

    test('package just under mass threshold', () => {
      expect(sort(50, 50, 50, 19.99)).toBe('STANDARD');
    });
  });

  describe('SPECIAL packages', () => {
    test('bulky by volume only', () => {
      expect(sort(100, 100, 100, 10)).toBe('SPECIAL');
    });

    test('bulky by width dimension', () => {
      expect(sort(150, 10, 10, 10)).toBe('SPECIAL');
    });

    test('bulky by height dimension', () => {
      expect(sort(10, 150, 10, 10)).toBe('SPECIAL');
    });

    test('bulky by length dimension', () => {
      expect(sort(10, 10, 150, 10)).toBe('SPECIAL');
    });

    test('heavy only', () => {
      expect(sort(50, 50, 50, 20)).toBe('SPECIAL');
    });

    test('very heavy but not bulky', () => {
      expect(sort(10, 10, 10, 100)).toBe('SPECIAL');
    });
  });

  describe('REJECTED packages', () => {
    test('both heavy and bulky by volume', () => {
      expect(sort(100, 100, 100, 25)).toBe('REJECTED');
    });

    test('both heavy and bulky by dimension', () => {
      expect(sort(150, 10, 10, 25)).toBe('REJECTED');
    });

    test('extremely bulky and heavy', () => {
      expect(sort(200, 200, 200, 50)).toBe('REJECTED');
    });
  });

  describe('Edge cases', () => {
    test('exactly at bulky volume threshold', () => {
      expect(sort(100, 100, 100, 10)).toBe('SPECIAL');
    });

    test('exactly at dimension threshold', () => {
      expect(sort(150, 10, 10, 10)).toBe('SPECIAL');
    });

    test('exactly at mass threshold', () => {
      expect(sort(50, 50, 50, 20)).toBe('SPECIAL');
    });

    test('at both thresholds', () => {
      expect(sort(150, 10, 10, 20)).toBe('REJECTED');
    });

    test('decimal values', () => {
      expect(sort(99.9, 99.9, 100.1, 19.9)).toBe('STANDARD');
      expect(sort(100.0, 100.0, 100.0, 19.9)).toBe('SPECIAL');
    });
  });

  describe('Input validation', () => {
    test('throws error for zero width', () => {
      expect(() => sort(0, 10, 10, 10)).toThrow('All dimensions and mass must be positive numbers');
    });

    test('throws error for negative height', () => {
      expect(() => sort(10, -5, 10, 10)).toThrow('All dimensions and mass must be positive numbers');
    });

    test('throws error for zero length', () => {
      expect(() => sort(10, 10, 0, 10)).toThrow('All dimensions and mass must be positive numbers');
    });

    test('throws error for negative mass', () => {
      expect(() => sort(10, 10, 10, -1)).toThrow('All dimensions and mass must be positive numbers');
    });
  });

  describe('Real-world scenarios', () => {
    test('small envelope', () => {
      expect(sort(23, 16, 0.5, 0.1)).toBe('STANDARD');
    });

    test('standard shipping box', () => {
      expect(sort(30, 20, 15, 2)).toBe('STANDARD');
    });

    test('large furniture box', () => {
      expect(sort(120, 80, 60, 15)).toBe('STANDARD');
    });

    test('long pipe', () => {
      expect(sort(5, 5, 200, 10)).toBe('SPECIAL');
    });

    test('dense small package', () => {
      expect(sort(20, 20, 20, 25)).toBe('SPECIAL');
    });

    test('large appliance', () => {
      expect(sort(180, 120, 80, 30)).toBe('REJECTED');
    });
  });

  describe('Sort with Reason', () => {
    test('standard package shows empty reason', () => {
      const result = sortWithReason(50, 50, 50, 10);
      expect(result.classification).toBe('STANDARD');
      expect(result.reason).toBe('');
    });

    test('overweight package shows mass reason', () => {
      const result = sortWithReason(50, 50, 50, 25);
      expect(result.classification).toBe('SPECIAL');
      expect(result.reason).toBe('overweight (25 kg)');
    });

    test('oversized by volume shows volume reason', () => {
      const result = sortWithReason(100, 100, 100, 10);
      expect(result.classification).toBe('SPECIAL');
      expect(result.reason).toContain('oversized (volume: 1,000,000 cm³)');
    });

    test('oversized by dimension shows dimension reason', () => {
      const result = sortWithReason(200, 10, 10, 10);
      expect(result.classification).toBe('SPECIAL');
      expect(result.reason).toBe('oversized (max dimension: 200 cm)');
    });

    test('oversized by both volume and dimension shows both', () => {
      const result = sortWithReason(200, 200, 200, 10);
      expect(result.classification).toBe('SPECIAL');
      expect(result.reason).toContain('oversized (volume: 8,000,000 cm³, max dimension: 200 cm)');
    });

    test('rejected package shows both reasons', () => {
      const result = sortWithReason(200, 10, 10, 25);
      expect(result.classification).toBe('REJECTED');
      expect(result.reason).toBe('overweight (25 kg) and oversized (max dimension: 200 cm)');
    });

    test('rejected package with volume and weight shows both', () => {
      const result = sortWithReason(100, 100, 100, 25);
      expect(result.classification).toBe('REJECTED');
      expect(result.reason).toContain('overweight (25 kg) and oversized (volume: 1,000,000 cm³)');
    });
  });
});