import { ReactNode } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  features: string[];
  color: 'indigo' | 'teal' | 'amber';
}

export interface APIStatus {
  online: boolean;
  message: string;
}