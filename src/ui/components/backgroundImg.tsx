
interface BackgroundImgProps {
  src: string;
  className?: string;
  repeat?: string;
  size?: string;
  position?: string;
  children?: React.ReactNode;
}    

export default function BackgroundImg({ src,className,repeat,size,position,children }: BackgroundImgProps) {
  return (
    <div
      className={`${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: repeat || "no-repeat",
        backgroundSize: size || "cover",
        backgroundPosition: position || "center",
      }}
    >
      {children}
    </div>
  );
}