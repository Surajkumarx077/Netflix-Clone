import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const navigate = useNavigate();

  return (
    <div className="video-player-container">
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={32} />
        </button>
      </div>
      
      <video 
        className="html-video-player"
        controls
        autoPlay
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
