import type { FormRules, FormItemRule } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils'

export interface FormConfig {
  model?: Record<string, any>;
  rules?: FormRules;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string;
  labelSuffix?: string;
  requireAsteriskPosition?: 'left' | 'right';
  showMessage?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  size?: '' | 'large' | 'default' | 'small';
  disabled?: boolean;
  scrollToError?: boolean;
}

export interface FormItemConfig {
  prop?: string;
  label?: string;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string;
  required?: boolean;
  rules?: Arrayable<FormItemRule>;
  error?: string;
  showMessage?: boolean;
  inlineMessage?: boolean;
  size?: 'small' | 'medium' | 'large';
  for?: string;
  validateStatus?: '' | 'error' | 'validating' | 'success';

  // 扩展属性
  span?: number;
  type?: 'input' | 'textarea' | 'padding' | 'select' | 'mention' | 'segmented' | 'autocomplete' | 'input-tag' | 'date-picker' | 'input-number' | string;
  config?: Record<string, any>;
}
