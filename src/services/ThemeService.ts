import { Image } from 'react-native';

export interface DynamicTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
}

class ThemeService {
  private defaultTheme: DynamicTheme = {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    accent: '#FF9500',
  };

  async extractColorsFromImage(imageUrl: string): Promise<DynamicTheme> {
    try {
      // For web/Expo, we'd use a library like 'color-thief-react'
      // For now, we'll use a simple approach with dominant color extraction
      
      const colors = await this.getDominantColors(imageUrl);
      
      if (colors && colors.length > 0) {
        return this.generateThemeFromColors(colors);
      }

      return this.defaultTheme;
    } catch (error) {
      console.error('Error extracting colors:', error);
      return this.defaultTheme;
    }
  }

  private async getDominantColors(imageUrl: string): Promise<string[]> {
    // This is a simplified version
    // In production, you'd use a library like 'react-native-palette' or 'color-thief'
    
    return new Promise((resolve) => {
      // For now, return default colors
      // You would integrate with a proper color extraction library here
      resolve(['#007AFF', '#5856D6', '#FF9500']);
    });
  }

  private generateThemeFromColors(colors: string[]): DynamicTheme {
    // Generate a theme based on extracted colors
    const [primary, secondary, accent] = colors;

    // Determine if colors are light or dark
    const isDark = this.isColorDark(primary);

    return {
      primary: primary || this.defaultTheme.primary,
      secondary: secondary || this.defaultTheme.secondary,
      accent: accent || this.defaultTheme.accent,
      background: isDark ? '#000000' : '#FFFFFF',
      surface: isDark ? '#1C1C1E' : '#F2F2F7',
      text: isDark ? '#FFFFFF' : '#000000',
      textSecondary: isDark ? '#8E8E93' : '#6E6E73',
    };
  }

  private isColorDark(hexColor: string): boolean {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
  }

  getContrastColor(hexColor: string): string {
    return this.isColorDark(hexColor) ? '#FFFFFF' : '#000000';
  }

  lightenColor(hexColor: string, percent: number): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

    return `#${this.componentToHex(newR)}${this.componentToHex(newG)}${this.componentToHex(newB)}`;
  }

  darkenColor(hexColor: string, percent: number): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));

    return `#${this.componentToHex(newR)}${this.componentToHex(newG)}${this.componentToHex(newB)}`;
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  rgbToHex(r: number, g: number, b: number): string {
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  getGradient(color: string): string[] {
    const lighter = this.lightenColor(color, 20);
    const darker = this.darkenColor(color, 20);
    return [darker, color, lighter];
  }
}

export default new ThemeService();
