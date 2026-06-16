import next from "eslint-config-next/core-web-vitals";

// Configuración de ESLint para Next.js 16 (flat config nativo).
// Reemplaza al viejo "next lint", que Next 16 eliminó.
const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "coverage/**"],
  },
  {
    rules: {
      // Cargar los mensajes una vez al montar (fetch-on-mount) es un patrón
      // válido en esta app: lo dejamos como aviso, no como error que corte el CI.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
