/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Re-adding the custom palette from index.css logic just in case, though usually unnecessary if using CSS vars
            }
        },
    },
    plugins: [],
}
