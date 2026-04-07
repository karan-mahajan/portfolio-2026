'use client'

import React from 'react'

type SelectProps = {
  value?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange?: (value: any) => void
  children?: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => (
  <div data-value={value} data-onchange={onValueChange ? 'true' : undefined}>
    {children}
  </div>
)

export const SelectTrigger: React.FC<{ className?: string; 'aria-label'?: string; children?: React.ReactNode }> = ({
  className,
  children,
}) => <div className={className}>{children}</div>

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <span>{placeholder}</span>
)

export const SelectContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
)

export const SelectItem: React.FC<{ value: string; children?: React.ReactNode }> = ({
  children,
}) => <div>{children}</div>
