declare module 'swagger-ui-react' {
  import { ComponentType } from 'react';

  export interface SwaggerUIProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spec?: Record<string, any>;
    url?: string;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelExpandDepth?: number;
    defaultModelsExpandDepth?: number;
    filter?: boolean;
    maxDisplayedTags?: number;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}