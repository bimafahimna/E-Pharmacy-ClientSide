/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "vite" {
  const content: any;
  export default content;
}

declare module "@vitejs/plugin-react" {
  const content: any;
  export default content;
}

declare module "vite" {
  export function defineConfig(config: any): any;
}
