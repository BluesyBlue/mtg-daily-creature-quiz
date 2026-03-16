/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SUPABASE_PROJECT_ID?: string;
	readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare const __COMMIT_HASH__: string;
