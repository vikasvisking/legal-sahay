declare module 'isomorphic-dompurify' {
    const DOMPurify: {
        sanitize: (source: string | Node, config?: any) => string;
        // Add other methods if needed
    };
    export default DOMPurify;
}
