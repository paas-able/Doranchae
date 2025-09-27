/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                green1: "#8B9744",
                green2: "#CED5B2",
                green3: "#EAEDCC",
                brown1: "#CCA57A",
                brown2: "#F8EDD0",
                brown3: "#FDFAE3",
                background: "#FDFAED",
                alert: "#DE735B",

                gray1: "#4D4D4D",
                gray2: "#666666",
                gray3: "#808080",
                gray4: "#999999",
                gray5: "#B3B3B3",
                gray6: "#CCCCCC",
                gray7: "#E6E6E6",
                gray8: "#E6E6E6"
            },

            fontFamily: {
                sans: ['Pretendard', 'ui-sans-serif', 'system-ui'],
                display: ['Pretendard', 'ui-sans-serif', 'system-ui'],
            }
        },
    },
    plugins: [],
}

