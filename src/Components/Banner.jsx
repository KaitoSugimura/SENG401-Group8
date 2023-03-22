import { useEffect, useRef, useState } from "react";
import styles from "./AccountBanner.module.css";
const Banner = ({ index, banner, setBanner, banners, centerIndex, width, widthStep, setTempBannerIndex }) => {
    const [ImageName, setImageName] = useState("");
    useEffect(()=>{
    const lastSlashIndex = banner.lastIndexOf("/");
    const name = banner.substring(lastSlashIndex + 1);
    const lastPeriodIndex = banner.substring(lastSlashIndex + 1).lastIndexOf(".");
    setImageName(name.slice(0, lastPeriodIndex));
    }, [])

  const distanceFromCenter = Math.abs(index - centerIndex);
  if(distanceFromCenter === 0){
    setTempBannerIndex(index);
  }
  const thisBannerWidth = distanceFromCenter<4?(width - widthStep * distanceFromCenter):NaN;

  const scrollRef = useRef(null);

  return (
    <div
      className={`${styles.bannerRow} ${thisBannerWidth?styles.closeInRange:""}`}
      style={{
        width: thisBannerWidth ? thisBannerWidth : 0,
      }}
      ref={scrollRef}
      onClick={() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        setBanner(banners[index]);
        setTempBannerIndex(index);
      }}
    >
      <div className={styles.bannerContainer} onClick={() => {}}>
        <img src={banner} alt="" />
        <p className={styles.bannerName}>{ImageName}</p>
      </div>
    </div>
  );
};

export default Banner;
