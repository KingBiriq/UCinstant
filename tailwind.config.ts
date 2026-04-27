import type { Config } from "tailwindcss";
export default {
 content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"],
 theme:{extend:{colors:{biriq:{dark:"#07111f",card:"#0e1b31",gold:"#ffd447",blue:"#2b7cff"}}}},
 plugins:[]
} satisfies Config;
