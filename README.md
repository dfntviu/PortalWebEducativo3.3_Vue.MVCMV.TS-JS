# portalwebeducativo_v33.final

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



### Dependences Corrected
   # Instalar Vue y dependencias core con versiones exactas
    npm install vue@3.5.22 vue-router@4.4.5 pinia@3.0.3 firebase@12.4.0
  # Instalar Vite y plugins de Vue
    npm install -D vite@6.4.1 @vitejs/plugin-vue@5.2.4 @vue/compiler-sfc@3.5.22 typescript@5.7.3

   # Instalar Version Preprocesador compatibles con Vue 3.5.x
   npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20

  ## Aditionals Instructions:
    - Aniadir las sigientes lineas en el package.json:
    "name": "portal-educativo",
    "version": "1.0.0",
    "type": "module",  // ← AGREGAR ESTA LÍNEA
