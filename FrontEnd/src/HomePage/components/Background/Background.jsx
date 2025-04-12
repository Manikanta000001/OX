import { useRef ,useEffect} from 'react'
import image1 from '../../assets/goku2.jpg'
import image2 from '../../assets/goku3.jpg'
import image3 from '../../assets/goku1.png'
import './Background.css'

import video5 from '../../assets/power.mp4'

const Background = ({playerstauts,herocount}) => {

    const videoRef = useRef(null);

    useEffect(() => {
        if (playerstauts && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [playerstauts]);
    
    let imageSrc;
    if (herocount === 0) imageSrc = image1;
    else if (herocount === 1) imageSrc = image2;
    else if (herocount === 2) imageSrc = image3;
    
    return (
        <div className="background-container">
            {imageSrc && (
                <img
                    src={imageSrc}
                    className={`background ${!playerstauts ? 'show' : ''}`}
                    alt="Background"
                />
            )}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                preload="auto"
                className={`background ${playerstauts ? 'show' : ''}`}
            >
                <source src={video5} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default Background
