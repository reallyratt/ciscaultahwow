/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView = 'home' | 'camera' | 'search' | 'search-results';

export interface PhotoCapture {
  id: string;
  url: string;
  timestamp: string;
  frameId: string;
}

export interface RomanticFrame {
  id: string;
  name: string;
  color: string;
  className: string;
  emoji: string;
}
