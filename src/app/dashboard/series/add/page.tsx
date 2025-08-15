'use client';

import Header from "@/ui/components/header";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import InputField, { MultipleInputField } from "@/ui/components/inputField";
import { useFilmForm } from "./useFilmForm";
import { Controller } from "react-hook-form";
import SuggestionsInput from "@/ui/components/suggestionField";

export default function Page() {
  const { control, formState: { errors } } = useFilmForm();

  return (
    <div className="pl-2">
      <Header title="Edition de Série" />

      {/* Header infos */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-1.5">
          <h4>Products:</h4>
          <span>All (1234)</span>
          <div className="w-[1px] h-[10px] bg-white" />
          <span>Drafts (120)</span>
          <div className="w-[1px] h-[10px] bg-white" />
          <span>Trash (30)</span>
          <div className="w-[1px] h-[10px] bg-white" />
        </div>
        <span>view Products:12/28</span>
      </div>

      {/* Form content */}
      <div className="flex gap-6 mt-3 bg-neutral px-3 py-3 rounded-md shadow text-sm">
        {/* Left column */}
        <div>
          {/* Upload images grid */}
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <UploadBox id="main" label="Image principale" className="row-span-2 w-32 h-32" />
            <UploadBox id="sec" label="Image secondaire" className="w-32 h-32" />
            <UploadBox id="tert" label="Image tertiaire" className="row-start-2 col-start-2 w-32 h-32" />
            <UploadBox id="qua" label="Film" className="row-start-1 col-start-3 w-32 h-32" />
          </div>

          {/* Actors images */}
          <div className="mt-3">
            <label className="label text-xs mb-1">Image des acteurs</label>
            <div className="flex gap-1.5 items-center flex-wrap">
              {Array.from({ length: 5 }).map((_, index) => (
                <UploadBox key={index} id={`image-${index}`} label={`Acteur ${index + 1}`} className="w-20 h-20" />
              ))}
            </div>
            <p className="mt-1 text-xs opacity-70">
              Veillez à ce que la photo corresponde à la sélection du nom de l’acteur.
            </p>
          </div>

          {/* Synopsis */}
          <div className="mt-3">
            <label className="label text-xs mb-1">Description du film (synopsis)</label>
            <MultipleInputField
              value={""}
              onChange={(e) => console.log(e.target.value)}
              name={""}
              className="bg-transparent h-20"
            />
          </div>

          {/* Checkboxes */}
          <div className="mt-3 flex items-center justify-between">
            <label className="label">
              <input type="checkbox" defaultChecked className="checkbox" /> Production SaFlix
            </label>
            <label className="label">
              <input type="checkbox" defaultChecked className="checkbox" /> Sous-titre
            </label>
          </div>

          {/* Status + Langue + Trailer */}
          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="label text-xs mb-1">Statut</label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Le statut est obligatoire' }}
                render={({ field }) => (
                  <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />
                )}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs mb-1">Langue</label>
              <Controller
                name="langue"
                control={control}
                rules={{ required: 'La langue est obligatoire' }}
                render={({ field }) => (
                  <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />
                )}
              />
            </div>
            <UploadBox id="trailer" label="Bande annonce" className="w-24 h-24" />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2 w-full">
          {/* Nom du Film */}
          <div>
            <label className="label text-xs mb-1">Nom du Film</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Titre du film', minLength: { value: 1, message: 'Au moins 1 caractère' } }}
              render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-transparent" />}
            />
          </div>

          {/* Maison de production + Pays */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label text-xs mb-1">Maison de Production</label>
              <Controller
                name="productionHouse"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs mb-1">Pays de Production</label>
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
          </div>

          {/* Type + Prix */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label text-xs mb-1">Type</label>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs mb-1">Prix</label>
              <Controller
                name="price"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <InputField type="number" {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label text-xs mb-1">Date de sortie</label>
              <Controller
                name="releaseDate"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs mb-1">Publication SaFlix</label>
              <Controller
                name="publishDate"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
          </div>

          {/* Format + Catégorie */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label text-xs mb-1">Format</label>
              <Controller
                name="format"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs mb-1">Catégorie</label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
          </div>

          {/* Genre + Acteurs */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label text-xs mb-1">Genre</label>
              <Controller
                name="genre"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs mb-1">Acteurs principaux</label>
              <Controller
                name="actors"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
          </div>

          {/* Directeur + Durée */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="label text-xs mb-1">Directeur de production</label>
              <Controller
                name="director"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
            <div className="w-1/3">
              <label className="label text-xs mb-1">Durée</label>
              <Controller
                name="duration"
                control={control}
                rules={{ required: 'Obligatoire' }}
                render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-2 flex items-center gap-2">
            <button className="btn bg-white rounded-full text-black text-xs px-3">Enregistrer brouillon</button>
            <button className="btn btn-primary rounded-full text-xs px-3">Publier Film</button>
          </div>
        </div>
      </div>
    </div>
  );
}
