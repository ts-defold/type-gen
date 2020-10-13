import commonjs from '@rollup/plugin-commonjs';
 
export default {
  input: 'dist/index.js',
  output: {
    file: 'bin/type-gen.js',
    format: 'cjs',
    banner: "#!/usr/bin/env node"
  },
  plugins: [commonjs()]
};