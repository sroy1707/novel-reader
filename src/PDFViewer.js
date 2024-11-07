import React, { useState, useRef } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { selectionModePlugin } from "@react-pdf-viewer/selection-mode";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/selection-mode/lib/styles/index.css";
import { fetchDefinition } from "./fetchDefinition";
import * as pdfjs from "pdfjs-dist/build/pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer() {
  const [selectedWord, setSelectedWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [popupStyle, setPopupStyle] = useState({});

  const selectionPluginInstance = selectionModePlugin();

  const handleWordClick = async () => {
    const selection = window.getSelection();
    const word = selection.toString().trim();

    if (word) {
      setSelectedWord(word);
      const wordDefinition = await fetchDefinition(word);
      setDefinition(wordDefinition);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPopupStyle({
        top: rect.top + window.scrollY + 20,
        left: rect.left + window.scrollX + 10,
        display: "block",
      });

      selection.removeAllRanges();
    } else {
      setPopupStyle({ display: "none" });
    }
  };

  return (
    <div className="pdf-container" onMouseUp={handleWordClick}>
      <Viewer fileUrl="/leadership.pdf" plugins={[selectionPluginInstance]} />

      {selectedWord && (
        <div className="definition-popup" style={popupStyle}>
          <h3>{selectedWord}</h3>
          <p>{definition}</p>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
