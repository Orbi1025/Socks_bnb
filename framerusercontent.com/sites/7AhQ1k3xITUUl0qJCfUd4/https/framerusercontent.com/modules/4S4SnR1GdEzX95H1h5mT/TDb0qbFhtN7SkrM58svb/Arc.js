import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children } from "react";
import {
  addPropertyControls,
  ControlType,
  RenderTarget,
  withCSS,
} from "framer";
import { motion } from "framer-motion";
import hash from "@emotion/hash";
import { renderToString } from "react-dom/server";
/**
 * ARC TEXT
 * By Adam and Benjamin
 *
 * @framerIntrinsicWidth 150
 * @framerIntrinsicHeight 150
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */ const Arc = withCSS(
  function Arc(props) {
    // Checks
    const hasChildren = Children.count(props.slots) > 0;
    const isCanvas = RenderTarget.current() === RenderTarget.canvas;
    const showCustomPath = hasChildren && props.type === "graphic"; // For Ellipse
    const isCircle = props.type === "circle";
    const isEllipse = props.type === "ellipse";
    const cylinder = isEllipse ? props.cylinderHeight / 2 : 0; // Base arc path
    let path = createPath(props.flip, cylinder);
    let childPath;
    let viewBox; // If graphic is connected
    if (showCustomPath) {
      const firstChild = getFirstChild(props.slots);
      const svgChild = getFirstChild(firstChild.props.svg);
      const svgChildCanvas = getFirstChild(firstChild.props.children); // Show placeholder on canvas if connected layer isn’t a graphic
      if (isCanvas && !svgChildCanvas.props.frame) {
        return /*#__PURE__*/ _jsxs("div", {
          style: placeholderStyles,
          children: [
            /*#__PURE__*/ _jsx("div", { style: emojiStyles, children: "💎" }),
            /*#__PURE__*/ _jsx("p", {
              style: titleStyles,
              children: "Please connect to Graphic",
            }),
            /*#__PURE__*/ _jsx("p", {
              style: subtitleStyles,
              children:
                "You can only connect the Arc to a Graphic with a single path.",
            }),
          ],
        });
      } // Grab the react element from the canvas and turn it into SVG
      if (isCanvas && svgChildCanvas) {
        const svgString = renderToString(svgChildCanvas); // Canvas does not give us viewBox within the string
        const canvasFrame = svgChildCanvas.props.frame;
        viewBox = `0 0 ${canvasFrame.width} ${canvasFrame.height}`;
        let attributes = svgString.match(/[\w-]+="[^"]*"/g);
        for (const element of attributes) {
          if (element.includes("d=")) {
            childPath = splitAndReplace(element);
          }
        }
      } // On the preview/deploy we already get the SVG string
      if (!isCanvas && svgChild) {
        let attributes1 = svgChild.match(/[\w-]+="[^"]*"/g);
        viewBox = svgChild.split("viewBox=")[1];
        viewBox = viewBox.split(">")[0];
        viewBox = viewBox.replace(/^"(.+(?="$))"$/, "$1");
        for (const element1 of attributes1) {
          if (element1.includes("d=")) {
            childPath = splitAndReplace(element1);
          }
        }
      }
    } // Unique IDs to avoid multiple instances on the canvas sharing a single path
    const id = `curve-${hash(childPath || path)}`; // Alignment icon conversion
    let alignmentValue;
    if (props.alignmentBaseline === "top") alignmentValue = "Text Top";
    if (props.alignmentBaseline === "center") alignmentValue = "Central";
    if (props.alignmentBaseline === "bottom") alignmentValue = "Hanging";
    return /*#__PURE__*/ _jsx(motion.div, {
      style: {
        width: "100%",
        height: "100%", // userSelect: "none",
        // pointerEvents: "none",
        position: "relative",
      },
      draggable: "false",
      children: /*#__PURE__*/ _jsxs(motion.svg, {
        className: "transform-origin-center-center",
        style: {
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          transformOrigin: "center",
          willChange: props.rotate && "transform",
        },
        viewBox: showCustomPath ? viewBox : `0 0 100 100`,
        overflow: "visible",
        animate: isCircle && props.rotate && { rotate: 360 },
        transition: isCircle &&
          props.rotate && {
            duration: 100 / props.rotateSpeed,
            repeat: Infinity,
            ease: "linear",
          },
        children: [
          /*#__PURE__*/ _jsx("path", {
            id: id,
            d: showCustomPath ? childPath : path,
            strokeWidth: "none",
            fill: "transparent",
          }),
          /*#__PURE__*/ _jsx("text", {
            children: /*#__PURE__*/ _jsxs("textPath", {
              href: `#${id}`,
              startOffset: props.startOffset,
              dominantBaseline: alignmentValue,
              style: {
                fontSize: props.font.fontSize,
                fontFamily: props.font.font,
                fontWeight: props.font.fontWeight,
                wordSpacing: props.font.wordSpacing,
                letterSpacing: props.font.letterSpacing,
                fill: props.color,
              },
              children: [
                props.text,
                !isCanvas &&
                  props.animate &&
                  /*#__PURE__*/ _jsx("animate", {
                    attributeName: "startOffset",
                    from: `${props.animateStart}%`,
                    to: `${props.animateEnd}%`,
                    begin: "0s",
                    dur: `${props.animateDuration}s`,
                    repeatCount: "indefinite",
                  }),
              ],
            }),
          }),
        ],
      }),
    });
  }, // Work around a bug with framer-motion that calculates a px origin when animating SVG elements.
  [
    ".transform-origin-center-center { transform-origin: center center !important; }",
  ]
);
export default Arc;
Arc.defaultProps = { height: 50, width: 50 };
addPropertyControls(Arc, {
  text: {
    title: "Content",
    type: ControlType.String,
    defaultValue: "✦ THANK YOU ✦ FOR VISITING",
    displayTextArea: true,
  },
  type: {
    title: "Type",
    type: ControlType.Enum,
    options: ["circle", "ellipse", "graphic"],
    optionTitles: ["Circle", "Ellipse", "Graphic"],
    defaultValue: true,
  },
  cylinderHeight: {
    title: "Height",
    type: ControlType.Number,
    unit: "px",
    min: 0,
    max: 1e3,
    hidden: ({ type }) => type !== "ellipse",
  },
  rotate: {
    type: ControlType.Boolean,
    title: "Rotate",
    defaultValue: false,
    hidden: ({ type }) => type !== "circle",
  },
  rotateSpeed: {
    type: ControlType.Number,
    title: "Speed",
    min: 0,
    max: 50,
    defaultValue: 5,
    displayStepper: true,
    step: 1,
    hidden: ({ type, rotate }) => type !== "circle" || !rotate,
  },
  slots: {
    type: ControlType.ComponentInstance,
    title: "Graphic",
    hidden: ({ type }) => type !== "graphic",
  },
  alignmentBaseline: {
    title: "Align",
    type: ControlType.Enum,
    options: ["top", "center", "bottom"],
    optionIcons: ["align-top", "align-middle", "align-bottom"],
    defaultValue: "bottom",
    displaySegmentedControl: true,
  },
  flip: {
    type: ControlType.Boolean,
    defaultValue: false,
    title: "Direction",
    enabledTitle: "CW",
    disabledTitle: "CCW",
    hidden: ({ type }) => type === "graphic",
  },
  startOffset: {
    title: "Offset",
    type: ControlType.Number,
    defaultValue: 0,
    max: 360,
    unit: "\xb0",
    step: 0.5,
  },
  color: { title: "Color", type: ControlType.Color, defaultValue: "#999" },
  font: {
    type: ControlType.Object,
    controls: {
      font: {
        type: ControlType.String,
        placeholder: "Inter",
        defaultValue: "Inter",
      },
      fontSize: {
        title: "Size",
        type: ControlType.Number,
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 12,
      },
      fontWeight: {
        type: ControlType.Enum,
        options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        defaultValue: 600,
        title: "Weight",
      },
      wordSpacing: {
        title: "Word",
        type: ControlType.Number,
        defaultValue: 4,
        step: 0.1,
        displayStepper: true,
      },
      letterSpacing: {
        title: "Letter",
        type: ControlType.Number,
        defaultValue: 4,
        step: 0.1,
        displayStepper: true,
      },
    },
  },
  animate: { type: ControlType.Boolean, defaultValue: false, title: "Animate" },
  animateStart: {
    type: ControlType.Number,
    min: -200,
    max: 200,
    step: 0.1,
    defaultValue: -50,
    title: "From",
    unit: "%",
    hidden: (props) => !props.animate,
  },
  animateEnd: {
    type: ControlType.Number,
    min: -200,
    max: 200,
    step: 0.1,
    defaultValue: 150,
    title: "To",
    unit: "%",
    hidden: (props) => !props.animate,
  },
  animateDuration: {
    type: ControlType.Number,
    min: 0,
    max: 50,
    defaultValue: 5,
    title: "Time",
    unit: "s",
    displayStepper: true,
    hidden: (props) => !props.animate,
  },
});
/* Method to get the first child */ function getFirstChild(slots) {
  let firstChild;
  Children.map(slots, (child) => {
    if (firstChild === undefined) {
      firstChild = child;
    }
  });
  return firstChild;
}
/* Method to get stringless attributes */ const splitAndReplace = (string) => {
  return string.split("=")[1].replace(/['"]+/g, "");
};
/* Path creation method */ const createPath = (flip, cylinder) => {
  const cylinderTop = 50 - cylinder;
  const cylinderBottom = 50 + cylinder;
  return !flip
    ? `M 0 50 L 0 ${cylinderTop} A 1 1 0 0 1 100 ${cylinderTop} L 100 50 L 100 ${cylinderBottom} A 1 1 0 0 1 0 ${cylinderBottom} L 0 ${cylinderTop}`
    : `M 0 50 L 0 ${cylinderBottom} A 1 1 0 1 0 100 ${cylinderBottom} L 100 ${cylinderTop} A 1 1 0 1 0 0 ${cylinderTop} L 0 50`;
};
/* Styles */ const placeholderStyles = {
  display: "flex",
  width: "100%",
  height: "100%",
  placeContent: "center",
  placeItems: "center",
  flexDirection: "column",
  color: "#96F",
  background: "rgba(136, 85, 255, 0.1)",
  fontSize: 11,
  overflow: "hidden",
};
const emojiStyles = { fontSize: 32, marginBottom: 10 };
const titleStyles = {
  margin: 0,
  marginBottom: 10,
  fontWeight: 600,
  textAlign: "center",
};
const subtitleStyles = {
  margin: 0,
  opacity: 0.7,
  maxWidth: 160,
  lineHeight: 1.5,
  textAlign: "center",
};
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Arc",
      slots: [],
      annotations: {
        framerSupportedLayoutHeight: "fixed",
        framerIntrinsicHeight: "150",
        framerIntrinsicWidth: "150",
        framerSupportedLayoutWidth: "fixed",
        framerContractVersion: "1",
        framerDisableUnlink: "*",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Arc.map
