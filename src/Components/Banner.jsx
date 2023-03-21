import styles from "./AccountBanner.module.css"
const Banner = ({index, banner, setBanner, banners}) => {
    return ( 
        <div className={styles.bannerContainer} onClick={()=>{
            setBanner(banners[index]);
        }}>
              <img src={banner} alt="" />
        </div>
     );
}
 
export default Banner;