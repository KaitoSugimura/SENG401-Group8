import { useEffect } from 'react'
import HomeMusic from "../public/Sound/Home.mp3";

export default function Music() {
    useEffect(() => {
        var audio = new Audio(HomeMusic);
        audio.volume = 0.5;
        audio.play();
      }, []);
      
  return (
    <>
      
    </>
  )
}
