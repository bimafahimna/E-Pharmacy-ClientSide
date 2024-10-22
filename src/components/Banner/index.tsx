import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Banner(): JSX.Element {
  const banner = [
    {
      url: "https://images.newscientist.com/wp-content/uploads/2019/06/18153152/medicineshutterstock_1421041688.jpg",
      alt: "banner",
    },
    {
      url: "https://assets.weforum.org/article/image/xho4dHMhp3SOSDIXzgtaTPQjnKG96tY_zEwdcrB7elE.jpg",
      alt: "banner",
    },
    {
      url: "https://static1.squarespace.com/static/5f64c5c0089e7a2b75f39878/6017b94b45eb9438ae60f0d2/60e595a8be1a8f5a7f8b82a0/1720204255570/shutterstock_1898898127.jpg?format=1500w",
      alt: "banner",
    },
  ];
  const [bannerIndex, setBannerIndex] = useState(0);
  const [nextAfter, setNextAfter] = useState(style.after);
  const [nextBefore, setNextBefore] = useState(style.before);
  const [disabled, setDisabled] = useState(false);

  const handleNextClick = () => {
    setDisabled(true);
    setBannerIndex((bannerIndex + 1) % banner.length);
    setNextAfter(style[`after_next`]);
    setNextBefore(style[`before`]);
    setTimeout(() => {
      setDisabled(false);
    }, 500);
  };

  const handlePreviousClick = () => {
    setDisabled(true);
    setBannerIndex((bannerIndex - 1 + banner.length) % banner.length);
    setNextAfter(style[`after`]);
    setNextBefore(style[`before_next`]);
    setTimeout(() => {
      setDisabled(false);
    }, 500);
  };

  useEffect(() => {
    const timeID = setTimeout(() => {
      setNextAfter(style[`after_next`]);
      setNextBefore(style[`before`]);
      setBannerIndex((index) => (index + 1) % banner.length);
    }, 4000);

    return () => {
      clearTimeout(timeID);
    };
  }, [bannerIndex]);

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--gray-color)",
        padding: "1rem 0",
      }}
    >
      <div className={style.banner_wrapper} style={{ margin: "1rem auto" }}>
        {banner.map((image, index) => (
          <img
            sizes="(max-width: 300px) 100vw, (max-width: 400px) 50vw, 33vw"
            src={image.url}
            alt={image.alt}
            key={index}
            className={clsx(style.banner, {
              [style.active]: index === bannerIndex,
              [nextBefore]:
                index === (bannerIndex - 1 + banner.length) % banner.length,
              [nextAfter]: index === (bannerIndex + 1) % banner.length,
              [style.inactive]:
                !(index === bannerIndex) &&
                !(
                  index ===
                  (bannerIndex - 1 + banner.length) % banner.length
                ) &&
                !(index === (bannerIndex + 1) % banner.length),
            })}
          />
        ))}

        <button
          aria-label="next image on promotion"
          onClick={handleNextClick}
          className={style.carousel_right_button}
          disabled={disabled}
          name="next image on promotion"
        >
          <MdArrowForwardIos />
        </button>
        <button
          aria-label="previous image on promotion"
          onClick={handlePreviousClick}
          className={style.carousel_left_button}
          disabled={disabled}
          name="previous image on promotion"
        >
          <MdArrowBackIos />
        </button>
      </div>
    </section>
  );
}
