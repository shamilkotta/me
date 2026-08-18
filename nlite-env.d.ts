/// <reference types="nlite/client" />

interface ImportMetaEnv {
  readonly VITE_MARKS_IMAGE_ORIGIN?: string;
}

declare module "*?base64" {
  const value: string;
  export default value;
}
