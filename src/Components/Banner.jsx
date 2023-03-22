
import { useRef } from "react";
import styles from "./AccountBanner.module.css"
const Banner = ({index, banner, setBanner, banners, centerIndex}) => {

    const lastSlashIndex = banner.lastIndexOf('/');
    const name = banner.substring(lastSlashIndex + 1);
    const lastPeriodIndex = banner.substring(lastSlashIndex + 1).lastIndexOf('.');
    const ImageName = name.slice(0, lastPeriodIndex);

    const width = window.innerWidth * 0.4;
    const widthStep = window.innerWidth * 0.02;

    const distanceFromCenter = Math.abs(index - centerIndex);
    const thisBannerWidth = width - widthStep * distanceFromCenter;

    const scrollRef = useRef(null);

    return ( 
        <div className={styles.bannerRow} style={{
            width: thisBannerWidth?thisBannerWidth:0,
            marginTop: index===0?"15vh":"",
            marginBottom: index===banners.length-1?"25vh":""
        }}
        ref={scrollRef}
        onClick={() => {
            console.log("AUGHHH");
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center'  });
              }
          }}
        >
            <div className={styles.bannerContainer} onClick={()=>{
                setBanner(banners[index]);
            }}>
                <img src={banner} alt="" />
                <p className={styles.bannerName}>{ImageName}</p>
            </div>            
        </div>
        
     );
}
 
export default Banner;