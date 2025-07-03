/* import clsx from "clsx";
export default function ProgressBar({value,maxValue,title,color}:{value:number;maxValue:number;title:string;color:string}){
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
          <p className="text-sm">{title}</p>
          <p className="text-sm">{value} f</p>
      </div>
      <progress className="progress w-full" style={{ accentColor: color }} value={value} max={maxValue}></progress>
            
    </div>
  );
} */

  export default function ProgressBar({
  value,
  maxValue,
  title,
  color,
}: {
  value: number;
  maxValue: number;
  title: string;
  color: string;
}) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm">{title}</p>
        <p className="text-sm">{value.toLocaleString()} f</p>
      </div>
      <div className="w-full h-3 bg-slate-200 rounded-full">
        <div
          className="h-full rounded transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}
