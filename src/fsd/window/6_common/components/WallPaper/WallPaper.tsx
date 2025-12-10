import { wallPaperImageStyle, wallPaperStyle } from "./WallPaper.styles";

interface Props {
  wallpaper: string;
  blur: boolean;
}

export default function WallPaper({ wallpaper, blur }: Props) {
  return (
    <div className={wallPaperStyle}>
      <img
        src={wallpaper}
        alt="wallpaper"
        className={wallPaperImageStyle({ blur })}
      />
    </div>
  );
}
