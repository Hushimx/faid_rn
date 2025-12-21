// Provide basic typings for react-native-vector-icons submodules
// This prevents TypeScript errors like:
// "Could not find a declaration file for module 'react-native-vector-icons/Feather'"

declare module 'react-native-textarea';
declare module '*.png';
declare module 'react-native-vector-icons/*' {
  import * as React from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name?: string;
    size?: number;
    color?: string;
    style?: any;
  }

  const Icon: React.ComponentType<IconProps>;
  export default Icon;
}
