import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const GetImage = (url, imagewidth = 350) => {
  const transform = `w_${imagewidth},c_fill,q_auto,f_auto`;
  return url.length > 0
    ? url.replace("/upload/", `/upload/${transform}/`)
    : "assets/pc-gamer1.png";
};

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
// list of images [{imageUrl,isMain},....]
export function GetMainImageURL(images) {
  if (!images || images.length === 0) return "";
  return images.find((image) => image.isMain)?.imageUrl || images[0].imageUrl;
}
