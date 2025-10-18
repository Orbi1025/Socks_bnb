import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";
/**
 * @framerDisableUnlink
 *
 * @framerIntrinsicWidth 24
 * @framerIntrinsicHeight 24
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */ function SVG(props) {
  const [customSvgElement, setCustomSvgElement] = useState(null);
  useEffect(() => {
    const svgContent = props.customSvgCode;
    processCustomSVGContent(svgContent);
  });
  const processCustomSVGContent = (svgContent) => {
    const replacements = [
      [/width="[^"]*"/, 'width="100%"'],
      [/height="[^"]*"/, 'height="100%"'],
    ];
    const hasCustomStroke = svgContent.includes('stroke="');
    const hasCustomStrokeWidth = svgContent.includes('stroke-width="');
    const hasLineCap = svgContent.includes('stroke-linecap="');
    const hasLineJoin = svgContent.includes('stroke-linejoin="');
    if (svgContent.includes("<circle")) {
      // Find the circle element and update its fill attribute
      const circleFillRegex = /<circle[^>]*fill="([^"]*)"/;
      const match = svgContent.match(circleFillRegex);
      if (match) {
        // Update the fill attribute with the custom color
        const updatedCircle = match[0].replace(match[1], props.customColor);
        svgContent = svgContent.replace(circleFillRegex, updatedCircle);
      } else {
        // If there is no fill attribute, add it with the custom color
        replacements.push([/<circle/g, `<circle fill="${props.customColor}"`]);
      }
    }
    if (hasCustomStroke) {
      if (!hasLineCap) {
        replacements.push([/<path/g, `<path stroke="${props.customColor}"`]);
      } else {
        replacements.push([
          /<path/g,
          `<path stroke="${props.customColor}" stroke-linecap="${props.lineCap}"`,
        ]);
      }
      if (hasCustomStrokeWidth) {
        replacements.push([
          /stroke-width="(?!0\b)\d+(\.\d+)?"/g,
          `stroke-width="${props.customStrokeWidth}"`,
        ]);
      }
    } else {
      replacements.push([/<path/g, `<path fill="${props.customColor}"`]);
    }
    if (svgContent.includes('overflow="')) {
      replacements.push([/overflow="[^"]*"/, `overflow="visible"`]);
    } else {
      replacements.push([/<svg/, `<svg overflow="visible"`]);
    }
    if (!hasLineJoin) {
      replacements.push([
        /<path/g,
        `<path stroke-linejoin="${props.lineJoin}"`,
      ]);
    } else {
      replacements.push([
        /stroke-linejoin="[^"]*"/,
        `stroke-linejoin="${props.lineJoin}"`,
      ]);
    }
    replacements.forEach(([regex, replacement]) => {
      svgContent = svgContent.replace(regex, replacement);
    });
    setCustomSvgElement(svgContent);
  };
  const customContainerStyle = {
    padding: `${props.customPadding}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  };
  return /*#__PURE__*/ _jsx("div", {
    dangerouslySetInnerHTML: { __html: customSvgElement },
    style: customContainerStyle,
  });
}
SVG.defaultProps = {
  customSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.9996 4.58607L19.414 12.0001L22.9139 8.50015L15.4997 1.08594L11.9996 4.58607Z" fill="black"/> <path d="M18.403 13.8175L10.1822 5.59708L5.63438 7.25082L3.08203 19.5021L8.15387 14.4302C8.0427 14.1472 7.98166 13.839 7.98166 13.5166C7.98166 12.1359 9.10095 11.0166 10.4817 11.0166C11.8624 11.0166 12.9817 12.1359 12.9817 13.5166C12.9817 14.8973 11.8624 16.0166 10.4817 16.0166C10.1592 16.0166 9.85109 15.9556 9.56811 15.8444L4.49378 20.9188L16.7491 18.3656L18.403 13.8175Z" fill="black"/> </svg>`,
  customColor: "#ffffff",
  customPadding: 0,
  customStrokeWidth: 2,
  lineCap: "butt",
  lineJoin: "miter",
};
addPropertyControls(SVG, {
  customSvgCode: {
    type: ControlType.String,
    title: "SVG Code",
    displayTextArea: false,
  },
  customColor: {
    type: ControlType.Color,
    title: "Color",
    defaultValue: "#ffffff",
  },
  customStrokeWidth: {
    type: ControlType.Number,
    title: "Stroke",
    defaultValue: 2,
    min: 0,
    step: 0.1,
    displayStepper: true,
    hidden: (props) => !props.customSvgCode.includes('stroke="'),
  },
  customPadding: {
    type: ControlType.Number,
    title: "Padding",
    defaultValue: 0,
    min: 0,
    step: 1,
    displayStepper: true,
  },
  lineCap: {
    type: ControlType.Enum,
    title: "Line Cap",
    options: ["butt", "round", "square"],
    optionTitles: ["Butt", "Round", "Square"],
    defaultValue: "butt",
    hidden: (props) => !props.customSvgCode.includes('stroke="'),
  },
  lineJoin: {
    type: ControlType.Enum,
    title: "Line Join",
    options: ["round", "miter", "bevel"],
    optionTitles: ["Round", "Miter", "Bevel"],
    defaultValue: "miter",
    hidden: (props) => !props.customSvgCode.includes('stroke="'),
  },
});
export default SVG;
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "SVG",
      slots: [],
      annotations: {
        framerSupportedLayoutHeight: "fixed",
        framerSupportedLayoutWidth: "fixed",
        framerContractVersion: "1",
        framerDisableUnlink: "*",
        framerIntrinsicWidth: "24",
        framerIntrinsicHeight: "24",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./SVG.map
