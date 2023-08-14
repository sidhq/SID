import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'src/index.tsx',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
            strict: false
        },
        {
            file: 'dist/index.esm.js',
            format: 'es',
            exports: 'named',
            sourcemap: true,
            strict: false
        }
    ],
    plugins: [
        typescript()
    ],
    external: ['react', 'react-dom']
}