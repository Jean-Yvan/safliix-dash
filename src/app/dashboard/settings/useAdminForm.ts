import { useState, useEffect,useTransition,useActionState } from "react";
import { useForm } from "react-hook-form";


export type adminFormData = {
  title: string;
  description: string;
  imagePath?: File;
  link: string;
  type: string;
  sectionKey: string;
};

export type FormStep = "initial" | "confirm" | "loading" | "result"


export function useAdminForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<adminFormData>({
    
  });

  
  const imagePath = watch("imagePath");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<FormStep>("initial");
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFilmId,setSelectedFilmId] = useState<string>("");
  const [isPending,startTransition] = useTransition();
  //const [formState,formAction] = useActionState(addFilm,{success:false,message:""});

  useEffect(() => {
    if (imagePath) {
      const url = URL.createObjectURL(imagePath);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imagePath]);


  /* useEffect(() => {
    if(formState.message != ""){
      setStep("result");
      setSuccess(formState.success);
      if(!formState.success){
        setMessage(formState.message);
      }
    }
  }, [formState]);
 */

  

  const onSubmitForProd = async (data: adminFormData) => {
    console.dir(data,{ depth: null });
    const { imagePath, ...rest } = data;
    if (!selectedFilmId && !imagePath){
      setMessage("Veuillez choisir une image de couverture pour le film");
      setStep("result");
      setSuccess(false);
    return;
    } else{
      setStep("loading");
        const file = imagePath;
        const formData = new FormData();
        const sectionKey = data.type ? "film-catalog" : "projets"
        formData.append("title",data.title);
        formData.append("description",data.description);
        formData.append("image",file!);
        formData.append("type",data.type);
        formData.append("link",data.link);
        formData.append("sectionKey",sectionKey);
        formData.append('pageSlug',"production");
        if(selectedFilmId) formData.append('id',selectedFilmId);
        //startTransition(() => formAction(formData));
      
      
    } 
  };

  const onSubmitForDist = async (data: adminFormData) => {
    const { imagePath, ...rest } = data;
    if (imagePath) {
      setStep("loading");
        const file = imagePath;
        const formData = new FormData();
        formData.append("title",data.title);
        formData.append("description",data.description);
        formData.append("image",file);
        formData.append("type",data.type);
        formData.append("link",data.link);
        formData.append("sectionKey","film-dist");
        formData.append('pageSlug',"distribution");
        if(selectedFilmId) formData.append('id',selectedFilmId);
        //startTransition(() => formAction(formData));
      
      
    }
    /* const { imagePath, ...rest } = data;
    if (imagePath ) {
      try{
        setStep("loading");
        const file = imagePath;
        console.log("file:"+data.type);
        await addFilm(
          data.title,
          data.description,
          file,
          data.type ?? null,
          "film-dist",
          "distribution"
        );
        setStep("result");
        setSuccess(true);
      }catch(e){
        setStep("result");
        setSuccess(false);
        setError(e as string);

      }
      
    } */
  };

  return {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    previewUrl,
    setValue,
    setPreviewUrl,
    onSubmitForDist,
    onSubmitForProd,
    step,
    setStep,
    success,
    message,
    selectedFilmId,
    setSelectedFilmId
  };
}









