import { isNonEmptyString, slugify } from './validation';

describe('isNonEmptyString', () => {
  it('returns true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
  });
  it('returns false for empty string', () => {
    expect(isNonEmptyString('')).toBe(false);
  });
  it('returns false for whitespace only', () => {
    expect(isNonEmptyString('   ')).toBe(false);
  });
  it('returns false for non-strings', () => {
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(42)).toBe(false);
  });
});

describe('slugify', () => {
  it('converts spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  it('removes special characters', () => {
    expect(slugify('SOC 2 Type II!')).toBe('soc-2-type-ii');
  });
  it('handles multiple spaces', () => {
    expect(slugify('  foo   bar  ')).toBe('foo-bar');
  });
});
