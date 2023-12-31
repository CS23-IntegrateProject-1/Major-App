// Plese refer the color according to the figma design, the comment of each color will match with the color style used in figma.
// If you found any color in figma you need but doesn't exist here, please contact Mink

const colors = {
  white: "#F6F6F6", // white or nearly white -> ex. color={"white"}
  brand: {
    100: "#DEBEF6", // dark accent -> ex. color={"brand.100"}
    200: "#A533C8", // dark second -> ex. color={"brand.200"}
    300: "#5F0DBB", // dark primary
    400: "#200944", // dark background
    500: "#763FAF", // another purple, this one can be use for ex.Progress bar color, use colorScheme="brand" and it will put this color automatically
  },
  black: "#191919", // black -> ex. color={"black"}
  grey: {
    100: "#D9D9D9", // white grey -> ex. color={"grey.100"}
    200: "#C5C4C7", // grey
    300: "#A0AEC0", // grey input
    400: "#242325", // dark grey
  },
  major: {
    100: "linear-gradient(24deg, rgba(112,0,37,1) 0%, rgba(19,19,60,1) 33%, rgba(0,0,0,1) 68%)", // dark accent -> ex. color={"brand.100"}
    200: "linear-gradient(164deg, rgba(122,12,49,1) 0%, rgba(30,9,35,1) 37%, rgba(11,11,35,1) 53%, rgba(0,0,0,1) 76%)",
  },
  red: "#C83333", // red -> ex. color={"red"}
  gold: "#d2aa5a",
} as const;

export type Colors = typeof colors;
export default colors;
