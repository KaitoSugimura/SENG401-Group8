import { useEffect, useRef, useState } from "react";
import styles from "./AccountBanner.module.css";
const Banner = ({ index, banner, setBanner, banners, centerIndex, width, widthStep }) => {
    const [ImageName, setImageName] = useState("");
    useEffect(()=>{
    const lastSlashIndex = banner.lastIndexOf("/");
    const name = banner.substring(lastSlashIndex + 1);
    const lastPeriodIndex = banner.substring(lastSlashIndex + 1).lastIndexOf(".");
    setImageName(name.slice(0, lastPeriodIndex));
    }, [])

  const distanceFromCenter = Math.abs(index - centerIndex);
  const thisBannerWidth = distanceFromCenter<4?(width - widthStep * distanceFromCenter):NaN;

  const scrollRef = useRef(null);

  return (
    <div
      className={`${styles.bannerRow} ${thisBannerWidth?styles.closeInRange:""}`}
      style={{
        width: thisBannerWidth ? thisBannerWidth : 0,
        marginTop: index === 0 ? "15vh" : "",
        marginBottom: index === banners.length - 1 ? "25vh" : "",
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
