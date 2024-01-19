import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import DefaultImage from "../assets/default_image.png";


const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState(DefaultImage);
  const [isLoading, setIsLoading] = useState(false);
  const [imageVariations, setImageVariations] = useState([]);
  const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
  const inputRef = useRef(null);
  const apiUrl = 'https://ai-image-generator3.p.rapidapi.com/generate';
  const apiKey = process.env.REACT_APP_APIKEY;

  const handleGenerateClick = async () => {
    const inputValue = inputRef.current.value.trim();

    if (inputValue === "") {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'ai-image-generator3.p.rapidapi.com'
        },
        body: JSON.stringify({
          prompt: inputValue,
          page: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const variations = data.results.images;
        setImageVariations(variations);
        setCurrentVariationIndex(0);
        setImageUrl(variations[0]);
      } else {
        console.error('Failed to fetch images:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during API request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextVariationClick = () => {
    const nextIndex = (currentVariationIndex + 1) % imageVariations.length;
    setCurrentVariationIndex(nextIndex);
    setImageUrl(imageVariations[nextIndex]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleGenerateClick();
    }
  };

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated_image.jpg';
    link.click();
  };

  return (
    <div className="ai-image-generator">
      <div className="header">Ai Image <span>generator</span></div>
      <div className="img-loading">
        <div className="image">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <img src={imageUrl || DefaultImage} alt="Generated" loading="lazy" />
          )}
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see..."
          onKeyPress={handleKeyPress}
        />
        <div className="generate-btn" onClick={handleGenerateClick}>
          Generate
        </div>
        <div className="download-btn" onClick={handleDownloadClick}>
          Download
        </div>
        {imageVariations.length > 1 && (
          <div className="next-variation-btn" onClick={handleNextVariationClick}>
            Next Variation
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
