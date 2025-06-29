import React from "react";

/**
 * Wraps exportable content in a div with only safe colors for html2canvas.
 */
const PdfExportWrapper = React.forwardRef(({ children }, ref) => (
  <div
    ref={ref}
    className="pdf-export-area"
    style={{
      background: "#fff",
      color: "#222",
      borderColor: "#ccc",
      boxShadow: "none",
      backgroundImage: "none",
      filter: "none",
      mixBlendMode: "normal",
    }}
  >
    {children}
  </div>
));

export default PdfExportWrapper;