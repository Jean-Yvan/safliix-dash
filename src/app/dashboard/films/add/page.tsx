'use client';

import Header from "@/ui/components/header";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import InputField, { MultipleInputField } from "@/ui/components/inputField";
import { useFilmForm } from "./useFilmForm";
import { Controller } from "react-hook-form";
import SuggestionsInput from "@/ui/components/suggestionField";

export default function Page() {

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useFilmForm();
	return (
		<div>
			<Header title="Edition de Film"/>
			<div className="flex items-center justify-between mt-4">
				<div className="flex items-center gap-1.5">
					<h4>Products:</h4>
					<span>All (1234)</span>
					<div className="w-[1px] h-[10px] bg-white"/>
					<span>Drafts (120)</span>
					<div className="w-[1px] h-[10px] bg-white"/>
					<span>Trash (30)</span>
					<div className="w-[1px] h-[10px] bg-white"/>
				</div>
				<span>view Products:12/28</span>
			</div>
			<div className="flex gap-10 mt-4 bg-neutral px-3 py-5 rounded-md shadow">
				<div>
					<div className="grid grid-cols-3 grid-rows-2 gap-4">
						<UploadBox id="main" label="Image principale" className="row-span-2" />
						<UploadBox id="sec" label="Image secondaire" />
						<UploadBox id="tert" label="Image tertiaire" className="row-start-2 col-start-2" />
						<UploadBox id="qua" label="Film" className="row-start-1 col-start-3" />
					</div>
					<div className="mt-5">
						<label className="label text-sm mb-2" htmlFor="image">Image des acteurs</label>
						<div className="flex gap-2 items-center">
							{Array.from({ length: 5 }).map((_, index) => (
							<UploadBox
								key={index}
								id={`image-${index}`}
								label={`Acteur ${index + 1}`}
								className="w-24 h-24"/>
						))}
						</div>
						<p className="mt-2 text-sm">Veillez à ce que la photo corresponde à la sélection du nom de l’acteur dans le formulaire .</p>
						<div className="mt-4">
							<label className="label text-sm mb-2" htmlFor="image">Description du film (synopsis)</label>
							<MultipleInputField value={""} onChange={function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
								throw new Error("Function not implemented.");
							} } name={""} className="bg-transparent"/>
						</div>

						<div className="mt-4 flex items-center justify-between">
							<label className="label">
    						<input type="checkbox" defaultChecked className="checkbox" />
    							Production SaFlix
  						</label>
							<label className="label">
    						<input type="checkbox" defaultChecked className="checkbox" />
    							Sous-titre
  						</label>
						</div>

						<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Statut</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]}  {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-full">
							<label className="label text-sm mb-2">Langue</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'La langue est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<UploadBox id="trailer" label="Bande annonce" className="w-full" />
					</div>

					</div>

				</div>
				
				
				<div className="flex flex-col gap-1 w-full flex-2">
					<div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Nom du Film</label>
						<Controller
							name="title"
							control={control}
							rules={{
								required: 'Titre du film',
								minLength: {
									value: 1,
									message: 'Le film doit comporter au moins 1 caractères',
								},
							}}
							render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-transparent" />}
						/>
						{errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
					</div>
					<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Maison de Production</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'La maison de production est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-full">
							<label className="label text-sm mb-2">Pays de Production</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le pays de production est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
					</div>
					<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Type</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le type est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-full">
							<label className="label text-sm mb-2">Prix</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le prix est obligatoire',
								}}
								render={({ field }) => <InputField type="number" {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
					</div>
					<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Date de sorti</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le type est obligatoire',
								}}
								render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-full">
							<label className="label text-sm mb-2">Date de publication sur SaFliix</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
					</div>
					<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Format</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-full">
							<label className="label text-sm mb-2">Catégorie</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
					</div>
					<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Genre</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-full">
							<label className="label text-sm mb-2">Nom des acteurs principaux</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
					</div>
					<div className="w-full flex-1 flex items-center gap-4">
						<div className="w-full">
							<label className="label text-sm mb-2">Directeur de productin</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <InputField  {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div className="w-1/2">
							<label className="label text-sm mb-2">Durée</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-transparent" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
					</div>

					<div className="w-full flex items-center gap-4">
						<button className="btn bg-white rounded-full text-black">Enregistrer brouillon</button>
						<button className="btn btn-primary rounded-full">Publier Film</button>		
					</div>
				</div>
			</div>
		</div>
	)
}