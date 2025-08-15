import Header from "@/ui/components/header";

export default function Page(){
  return (
    <div>
      <Header title="intro video" className="bg-base-100 shadow-lg shadow-white px-3"/>

      <div className="mt-4">
        <div className="flex items-center justify-center">
          <video
            src="/intro.mp4"
            controls
            className="w-full max-w-4xl h-[300px] rounded-lg shadow-lg"
          />
        </div>
        <div className="mt-4 flex items-center justify-evenly">
          <button className="btn btn-primary rounded-full btn-sm">
            Appliquer intro
          </button>
          <select
            className="select select-bordered w-48"
            defaultValue="default"
          >
            <option value="default" disabled>
              Sélectionner une intro
            </option>
            <option value="intro1">Intro 1</option>
            <option value="intro2">Intro 2</option>     
          </select>    
          <button className="btn btn-primary rounded-full btn-sm">
            Ajouter intro
          </button>
        </div>

      </div>
    </div>
  )

}