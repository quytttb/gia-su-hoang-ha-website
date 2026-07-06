// Markdown parser extracted from Chatbot for reuse
// Usage: parseMarkdown(text: string): React.ReactNode[]
import React from 'react';

export function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const parts = [];
    let currentIndex = 0;
    const isBulletPoint = line.trim().startsWith('•') || line.trim().startsWith('-');
    const bulletContent = isBulletPoint ? line.trim().substring(1).trim() : line;
    const textToProcess = isBulletPoint ? bulletContent : line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(textToProcess)) !== null) {
      if (match.index > currentIndex) {
        parts.push(
          <span key={`text-${lineIndex}-${currentIndex}`}>
            {textToProcess.slice(currentIndex, match.index)}
          </span>
        );
      }
      parts.push(
        <strong key={`bold-${lineIndex}-${match.index}`} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      );
      currentIndex = match.index + match[0].length;
    }
    if (currentIndex < textToProcess.length) {
      parts.push(
        <span key={`text-${lineIndex}-${currentIndex}`}>{textToProcess.slice(currentIndex)}</span>
      );
    }
    if (parts.length === 0) {
      parts.push(<span key={`line-${lineIndex}`}>{textToProcess}</span>);
    }
    const content = isBulletPoint ? (
      <div key={`line-${lineIndex}`} className="flex items-start space-x-2 ml-2">
        <span className="text-blue-600 font-bold mt-0.5">•</span>
        <div>{parts}</div>
      </div>
    ) : (
      <div key={`line-${lineIndex}`}>{parts}</div>
    );
    return (
      <React.Fragment key={`fragment-${lineIndex}`}>
        {content}
        {lineIndex < lines.length - 1 && !isBulletPoint && <br />}
      </React.Fragment>
    );
  });
}
