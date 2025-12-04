'use client';

import Header from "@/ui/components/header";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import InputField, { MultipleInputField } from "@/ui/components/inputField";
import ConfirmationDialog from "@/ui/components/confirmationDialog";
import { useFilmForm } from "./useFilmForm";
import { Controller } from "react-hook-form";
import SuggestionsInput from "@/ui/components/suggestionField";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		openConfirm,
		closeDialog,
		confirmSend,
		dialogOpen,
		dialogStatus,
		dialogResult,
		pendingFilm,
		setFilmId,
		pendingAction,
		prefillLoading,
		prefillError,
		progressStep,
		progressDetail,
		uploadErrorDetail,
	} = useFilmForm();
	const searchParams = useSearchParams();

	useEffect(() => {
		const id = searchParams.get("id");
		if (id) {
			setFilmId(id);
		}
	}, [searchParams, setFilmId]);

	return (
		<div className="space-y-4">
			<Header title="Edition de film" className="rounded-2xl border border-base-300 shadow-sm px-5">
				<div className="flex items-center gap-3 text-sm text-white/80">
					<div className="bg-base-200 px-3 py-2 rounded-lg border border-base-300">Data Refreshed</div>
					<div className="bg-base-200 px-3 py-2 rounded-lg border border-base-300">September 28, 2023 12:35 PM</div>
				</div>
			</Header>
			<div className="flex items-center justify-between text-sm text-white/80 px-1">
				<div className="flex items-center gap-2">
					<span>Products:</span>
					<button className="btn btn-link px-1 text-white">All (1.234)</button>
					<span className="w-[1px] h-4 bg-base-300"/>
					<button className="btn btn-link px-1 text-white">Drafts (120)</button>
					<span className="w-[1px] h-4 bg-base-300"/>
					<button className="btn btn-link px-1 text-white">Trash (30)</button>
				</div>
				<span>View Products: 12/28</span>
			</div>

			<form
				onSubmit={handleSubmit((data) => openConfirm(data, "publish"))}
				className="grid grid-cols-12 gap-6 bg-neutral px-5 py-6 rounded-2xl shadow border border-base-300"
			>
				<div className="col-span-12 lg:col-span-5 space-y-6">
					{prefillLoading && (
						<div className="alert alert-info bg-base-200/60 border border-base-300 text-sm text-white">
							Chargement des informations du film...
						</div>
					)}
					{prefillError && (
						<div className="alert alert-error bg-red-900/40 border border-red-700 text-sm text-red-100">
							{prefillError}
						</div>
					)}
					<div className="grid grid-cols-6 grid-rows-2 gap-4">
						<UploadBox
							id="main"
							label="Image principale"
							className="row-span-2 col-span-3 min-h-[220px]"
							onFileSelect={(file) => setValue("mainImage", file ?? null, { shouldValidate: true })}
						/>
						<UploadBox
							id="sec"
							label="Image secondaire"
							className="col-span-3 min-h-[100px]"
							onFileSelect={(file) => setValue("secondaryImage", file ?? null, { shouldValidate: false })}
						/>
						<UploadBox
							id="qua"
							label="Film upload"
							className="col-span-3 min-h-[100px]"
							onFileSelect={(file) => setValue("movieFile", file ?? null, { shouldValidate: false })}
						/>
						<UploadBox
							id="tert"
							label="Bande annonce"
							className="col-span-3 row-span-1 min-h-[100px]"
							onFileSelect={(file) => setValue("trailerFile", file ?? null, { shouldValidate: false })}
						/>
					</div>
					<div className="space-y-2">
						<label className="label text-sm mb-1" htmlFor="image">Acteurs à afficher</label>
						<div className="flex gap-2 items-center flex-wrap">
							{Array.from({ length: 5 }).map((_, index) => (
							<UploadBox
								key={index}
								id={`image-${index}`}
								label={`Acteur ${index + 1}`}
								className="w-20 h-20"/>
						))}
						</div>
						<p className="text-xs text-white/60">Veillez à ce que la photo corresponde à la sélection du nom de l’acteur dans le formulaire.</p>
					</div>
					<div className="space-y-2">
						<label className="label text-sm mb-1" htmlFor="image">Description du film (synopsis)</label>
						<Controller
							name="description"
							control={control}
							rules={{ required: "La description est obligatoire" }}
							render={({ field }) => (
								<MultipleInputField
									{...field}
									value={field.value ?? ""}
									onChange={(e) => field.onChange(e.target.value)}
									name="description"
									className="bg-base-200 border-base-300"
								/>
							)}
						/>
						{errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
					</div>

					<div className="flex items-center gap-6">
						<label className="flex items-center gap-2 text-sm">
    						<input type="checkbox" defaultChecked className="checkbox checkbox-sm" />
    						Production SaFlix
  					</label>
						<label className="flex items-center gap-2 text-sm">
    						<input type="checkbox" defaultChecked className="checkbox checkbox-sm" />
    						Sous-titre
  					</label>
					</div>

					<div className="grid grid-cols-3 gap-3 items-end">
						<div>
							<label className="label text-sm mb-1">Statut</label>
							<Controller
								name="status"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]}  {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Langue</label>
							<Controller
								name="language"
								control={control}
								rules={{
									required: 'La langue est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.language && <p className="text-red-600 text-sm">{errors.language.message}</p>}
						</div>
						<UploadBox id="trailer" label="Sous titre" className="w-full min-h-[80px]" />
					</div>
				</div>

				<div className="col-span-12 lg:col-span-7 flex flex-col gap-3">
					<div className="w-full">
						<label className="label text-sm mb-1" htmlFor="fullName">Nom du Film</label>
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
							render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
						/>
						{errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="label text-sm mb-1">Maison de Production</label>
							<Controller
								name="productionHouse"
								control={control}
								rules={{
									required: 'La maison de production est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.productionHouse && <p className="text-red-600 text-sm">{errors.productionHouse.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Pays de Production</label>
							<Controller
								name="country"
								control={control}
								rules={{
									required: 'Le pays de production est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="label text-sm mb-1">Type</label>
							<Controller
								name="type"
								control={control}
								rules={{
									required: 'Le type est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Prix de location</label>
							<Controller
								name="price"
								control={control}
								rules={{
									required: 'Le prix est obligatoire',
								}}
								render={({ field }) => (
									<InputField
										type="number"
										{...field}
										value={field.value ?? ""}
										onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
										className="input bg-base-200 border-base-300"
									/>
								)}
							/>
							{errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="label text-sm mb-1">Date de sorti du film</label>
							<Controller
								name="releaseDate"
								control={control}
								rules={{
									required: 'Le type est obligatoire',
								}}
								render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.releaseDate && <p className="text-red-600 text-sm">{errors.releaseDate.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Date de publication sur SaFLIX</label>
							<Controller
								name="publishDate"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.publishDate && <p className="text-red-600 text-sm">{errors.publishDate.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="label text-sm mb-1">Format</label>
							<Controller
								name="format"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.format && <p className="text-red-600 text-sm">{errors.format.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Catégorie</label>
							<Controller
								name="category"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="label text-sm mb-1">Genre</label>
							<Controller
								name="genre"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.genre && <p className="text-red-600 text-sm">{errors.genre.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Nom des acteurs principaux</label>
							<Controller
								name="actors"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.actors && <p className="text-red-600 text-sm">{errors.actors.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="label text-sm mb-1">Directeur de production</label>
							<Controller
								name="director"
								control={control}
								rules={{
									required: 'Le format est obligatoire',
								}}
								render={({ field }) => <InputField  {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.director && <p className="text-red-600 text-sm">{errors.director.message}</p>}
						</div>
						<div>
							<label className="label text-sm mb-1">Durée du film</label>
							<Controller
								name="duration"
								control={control}
								rules={{
									required: 'La date de publication sur SaFliix est obligatoire',
								}}
								render={({ field }) => <SuggestionsInput optionList={[]} {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
							/>
							{errors.duration && <p className="text-red-600 text-sm">{errors.duration.message}</p>}
						</div>
					</div>

					<div className="w-full flex items-center gap-4 pt-2">
						<button
							type="button"
							className="btn bg-white text-black rounded-full px-6"
							onClick={handleSubmit((data) => openConfirm(data, "draft"))}
							disabled={prefillLoading}
						>
							Enregistrer en brouillon
						</button>
						<button type="submit" className="btn btn-primary rounded-full px-8" disabled={prefillLoading}>
							Publier film
						</button>		
					</div>
				</div>
			</form>

			<ConfirmationDialog
				open={dialogOpen}
				title="Confirmer l'envoi du film"
				message="Vérifiez les informations avant de les envoyer au back."
				status={dialogStatus}
				resultMessage={dialogResult}
				confirmLabel={pendingAction === "update" ? "Mettre à jour" : "Envoyer"}
				onCancel={closeDialog}
				onConfirm={confirmSend}
			>
				{dialogStatus === "loading" && (
					<div className="text-sm text-white/80 space-y-1">
						<div className="flex items-center gap-2">
							<span className="loading loading-spinner loading-xs" />
							<span>
								{progressStep === "metadata" && "Envoi des métadonnées..."}
								{progressStep === "presign" && "Récupération des URLs de téléchargement..."}
								{progressStep === "upload" && (progressDetail ?? "Upload des fichiers...")}
								{progressStep === "finalize" && "Finalisation des URLs..."}
								{progressStep === "idle" && "Préparation..."}
							</span>
						</div>
					</div>
				)}
				{uploadErrorDetail && dialogStatus === "error" && (
					<div className="text-sm rounded-lg border border-red-600/60 bg-red-900/40 text-red-200 px-3 py-2">
						{uploadErrorDetail}
					</div>
				)}
				{pendingFilm && dialogStatus !== "loading" && (
					<div className="bg-base-100/10 border border-base-300 rounded-xl p-3 text-sm text-white/80 space-y-2">
						<div className="flex justify-between">
							<span className="text-white/60">Titre</span>
							<span>{pendingFilm.title}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-white/60">Type</span>
							<span>{pendingFilm.type || "—"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-white/60">Statut</span>
							<span>{pendingFilm.status || "—"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-white/60">Prix</span>
							<span>{pendingFilm.price ?? "—"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-white/60">Sortie</span>
							<span>{pendingFilm.releaseDate || "—"}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-white/60">Publication</span>
							<span>{pendingFilm.publishDate || "—"}</span>
						</div>
					</div>
				)}
			</ConfirmationDialog>
		</div>
	)
}
