/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          bgTask: "#fff",
          bgList: "#EEEEEE",
          bg: "#F7F7F7",
        },
      },
      dark: {
        colors: {
          bgTask: "#2f3136",
          bgList: "#202225",
          bg: "#36393f",
        },
      },
    },
  },
});
