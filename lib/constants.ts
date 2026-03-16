export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mcu', label: 'MCU' },
  { id: 'display', label: 'Display' },
  { id: 'sensor', label: 'Sensor' },
  { id: 'rf', label: 'RF' },
  { id: 'power', label: 'Power' },
  { id: 'io', label: 'I/O' },
  { id: 'active', label: 'Active' },
  { id: 'passive', label: 'Passive' },
  { id: 'proto', label: 'Proto' },
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'material', label: 'Material' },
  { id: 'tools', label: 'Tools' }
] as const;

export const TIERS = [
  { value: 1, label: 'Tier 1 — Essential' },
  { value: 2, label: 'Tier 2 — Intermediate' },
  { value: 3, label: 'Tier 3 — Advanced' }
] as const;

export const INTERFACES = [
  { value: 'I2C', label: 'I2C' },
  { value: 'SPI', label: 'SPI' },
  { value: 'UART', label: 'UART' },
  { value: 'PWM', label: 'PWM' },
  { value: 'analog', label: 'Analog' }
] as const;

export const GOALS = [
  { id: 'iot', label: 'IoT Projects' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'rf', label: 'RF & Wireless' },
  { id: 'display', label: 'Display Projects' },
  { id: 'general', label: 'General Electronics' }
] as const;
