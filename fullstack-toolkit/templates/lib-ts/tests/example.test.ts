import { describe, it, expect, beforeEach } from 'vitest';
import { add, subtract, Calculator } from '../src';

describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('should add negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should add zero', () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe('subtract', () => {
  it('should subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  it('should handle negative result', () => {
    expect(subtract(3, 5)).toBe(-2);
  });
});

describe('Calculator', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  it('should add numbers and track history', () => {
    expect(calc.add(1, 2)).toBe(3);
    expect(calc.add(3, 4)).toBe(7);
    expect(calc.getHistory()).toEqual([3, 7]);
  });

  it('should subtract numbers and track history', () => {
    expect(calc.subtract(5, 3)).toBe(2);
    expect(calc.getHistory()).toEqual([2]);
  });

  it('should clear history', () => {
    calc.add(1, 2);
    calc.clear();
    expect(calc.getHistory()).toEqual([]);
  });
});
