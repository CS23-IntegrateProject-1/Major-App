//just example have to edit later
export const FONT_WEIGHT = {
  BOLD: 700,
  NORMAL: 400,
};

const textStyles = {
  h1: {
    fontSize: "20px",
    fontWeight: FONT_WEIGHT.BOLD,
  },
  h2: {
    fontSize: "16px",
    fontWeight: FONT_WEIGHT.BOLD,
  },
  h3: {
    fontSize: "14px",
    fontWeight: FONT_WEIGHT.BOLD,
  },
  h4: {
    fontSize: "12px",
    fontWeight: FONT_WEIGHT.BOLD,
  },
  h5: {
    fontSize: "10px",
    fontWeight: FONT_WEIGHT.BOLD,
  },
  h6: {
    fontSize: "6px",
    fontWeight: FONT_WEIGHT.BOLD,
  },
  body1: {
    fontSize: "16px",
    fontWeight: FONT_WEIGHT.NORMAL,
  },
  body2: {
    fontSize: "12px",
    fontWeight: FONT_WEIGHT.NORMAL,
  },
  body3: {
    fontSize: "10px",
    fontWeight: FONT_WEIGHT.NORMAL,
  },
};

export type TextStyles = typeof textStyles;

export default textStyles;
