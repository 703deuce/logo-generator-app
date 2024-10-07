import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Video } from "lucide-react";
import { Logo } from "@/types/logo";

interface LogoDetailProps {
  logo: Logo;
  onBack: () => void;
  onUpdate: (updatedLogo: Logo) => void;
}

const LogoDetail: React.FC<LogoDetailProps> = ({ logo, onBack, onUpdate }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const convertToVideo = async () => {
    setIsConverting(true);
    setVideoError(null);

    try {
      console.log('Starting video conversion...');
      const response = await fetch('http://localhost:8000/api/convert-to-video/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          imageUrl: logo.url,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.status === 'processing') {
        setJobId(data.jobId);
      } else if (data.status === 'completed') {
        if (data.videoUrl) {
          console.log('Setting video URL:', data.videoUrl);
          setVideoUrl(data.videoUrl);
        }
        if (data.gifUrl) {
          console.log('Setting GIF URL:', data.gifUrl);
          setGifUrl(data.gifUrl);
        }
        setIsConverting(false);
      } else {
        throw new Error(data.error || 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Error converting logo to video:', error);
      setVideoError('Failed to convert logo to video. Please try again.');
      setIsConverting(false);
    }
  };

  const checkVideoStatus = async () => {
    if (!jobId) return;

    try {
      const response = await fetch(`http://localhost:8000/api/check-video-status/?jobId=${jobId}`);
      const data = await response.json();

      console.log('Status check response:', data);

      if (data.status === 'completed') {
        if (data.videoUrl) {
          console.log('Setting video URL from status check:', data.videoUrl);
          setVideoUrl(data.videoUrl);
        }
        if (data.gifUrl) {
          console.log('Setting GIF URL from status check:', data.gifUrl);
          setGifUrl(data.gifUrl);
        }
        setIsConverting(false);
        setJobId(null);
      } else if (data.status === 'failed') {
        console.error('Video conversion failed:', data.error);
        alert(`Video conversion failed: ${data.error}`);
        setIsConverting(false);
        setJobId(null);
      }
    } catch (error) {
      console.error('Error checking video status:', error);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 20; // 10 minutes (20 * 30 seconds)

    if (jobId) {
      intervalId = setInterval(() => {
        if (attempts < maxAttempts) {
          checkVideoStatus();
          attempts++;
        } else {
          clearInterval(intervalId);
          setIsConverting(false);
          setJobId(null);
          alert('Video conversion timed out. Please try again.');
        }
      }, 30000); // Check every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId]);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  return (
    <div className="container mx-auto p-4">
      <Button onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
      </Button>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={logo.url}
                  alt={`Logo ${logo.id}`}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              {videoUrl && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Generated Video</h3>
                  <video
                    ref={videoRef}
                    controls
                    className="w-full h-auto rounded-lg"
                    onError={() => setVideoError("Error loading video. Please try downloading it.")}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {videoError && <p className="text-red-500 mt-2">{videoError}</p>}
                </div>
              )}
              {gifUrl && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Generated GIF</h3>
                  <div className="relative w-full h-64">
                    <Image
                      src={gifUrl}
                      alt="Animated Logo"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" onClick={() => window.open(logo.url, '_blank')}>
                  <Download className="mr-2 h-4 w-4" /> Download Logo
                </Button>
                {!videoUrl && !gifUrl && (
                  <Button onClick={convertToVideo} disabled={isConverting}>
                    <Video className="mr-2 h-4 w-4" />
                    {isConverting ? 'Converting...' : 'Convert to Video'}
                  </Button>
                )}
                {videoUrl && (
                  <Button variant="outline" onClick={() => window.open(videoUrl, '_blank')}>
                    <Download className="mr-2 h-4 w-4" /> Download Video
                  </Button>
                )}
                {gifUrl && (
                  <Button variant="outline" onClick={() => window.open(gifUrl, '_blank')}>
                    <Download className="mr-2 h-4 w-4" /> Download GIF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoDetail;