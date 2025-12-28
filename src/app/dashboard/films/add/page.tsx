'use client';

import React, { useEffect, useMemo, useState } from "react";
import Header from "@/ui/components/header";
import UploadBox from "@/ui/specific/films/components/uploadBox";
import InputField, { MultipleInputField } from "@/ui/components/inputField";
import ConfirmationDialog from "@/ui/components/confirmationDialog";
import { type SuggestionOption, useFilmForm } from "./useFilmForm";
import { Controller, useWatch } from "react-hook-form";
import SuggestionsInput from "@/ui/components/suggestionField";
import { useSearchParams } from "next/navigation";
import { type CountryEntry, getCountries } from "@/lib/countries";

function ActorsSelector({
	value,
	onChange,
	options,
}: {
	value: string[];
	onChange: (val: string[]) => void;
	options: SuggestionOption[];
}) {
	const [input, setInput] = React.useState("");
	const [actors, setActors] = React.useState<string[]>(value ?? []);

	// Synchronise avec la valeur du formulaire (préremplissage / reset)
	React.useEffect(() => {
		setActors((value ?? []).filter(Boolean));
	}, [value]);

	const commit = (name: string) => {
		const clean = name.trim();
		if (!clean) return;
		if (actors.includes(clean)) {
			setInput("");
			return;
		}
		const next = [...actors, clean];
		setActors(next);
		onChange(next);
		setInput("");
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<input
					list="actor-suggestions"
					className="input input-bordered w-full bg-base-200 border-base-300"
					placeholder="Saisir ou sélectionner un acteur"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							commit(input);
						}
					}}
				/>
				<button type="button" className="btn btn-primary btn-sm" onClick={() => commit(input)}>
					Ajouter
				</button>
				<datalist id="actor-suggestions">
					{options.map((opt) => (
						<option key={opt.value} value={opt.label} />
					))}
				</datalist>
			</div>
			{actors.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{actors.map((actor) => (
						<span key={actor} className="badge badge-outline border-primary/50 text-primary gap-2">
							{actor}
							<button
								type="button"
								className="btn btn-ghost btn-xs text-primary"
								onClick={() => {
									const next = actors.filter((a) => a !== actor);
									setActors(next);
									onChange(next);
								}}
							>
								✕
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);
}

function CountryMultiSelect({
	availableCountries,
	value,
	onChange,
}: {
	availableCountries: { code: string; name: string; flag: string }[];
	value: string[];
	onChange: (codes: string[]) => void;
}) {
	const [search, setSearch] = React.useState("");
	const toggle = (code: string) => {
		if (value.includes(code)) {
			onChange(value.filter((c) => c !== code));
		} else {
			onChange([...value, code]);
		}
	};
	const filtered = useMemo(
		() =>
			availableCountries.filter(
				(c) =>
					c.code.toLowerCase().includes(search.toLowerCase()) ||
					c.name.toLowerCase().includes(search.toLowerCase()),
			),
		[availableCountries, search],
	);

	return (
		<div className="space-y-2">
			<input
				className="input input-bordered w-full bg-base-200 border-base-300"
				placeholder="Rechercher un pays"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<div className="max-h-48 overflow-y-auto space-y-1 border border-base-300 rounded-lg p-2 bg-base-200/60">
				{filtered.map((country) => {
					const selected = value.includes(country.code);
					return (
						<label key={country.code} className="flex items-center gap-2 text-sm cursor-pointer">
							<input
								type="checkbox"
								className="checkbox checkbox-sm checkbox-primary"
								checked={selected}
								onChange={() => toggle(country.code)}
							/>
							<span className="text-lg">{country.flag}</span>
							<span className="text-white/80">{country.name}</span>
						</label>
					);
				})}
				{filtered.length === 0 && <div className="text-xs text-white/60">Aucun pays trouvé</div>}
			</div>
			{value.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{value.map((code) => {
						const country = availableCountries.find((c) => c.code === code);
						return (
							<span
								key={code}
								className="badge badge-outline border-primary/40 text-primary gap-2"
								title={country?.name || code}
							>
								{country?.flag} {code}
								<button
									type="button"
									className="btn btn-ghost btn-xs text-primary"
									onClick={() => toggle(code)}
								>
									✕
								</button>
							</span>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default function Page() {

	const {
		control,
		handleSubmit,
		setValue,
		actorsValue,
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
		options,
		optionsLoading,
		optionsError,
		previewUrl,
		saveMetadataOnly,
		metaSaving,
	} = useFilmForm();
	const searchParams = useSearchParams();
	const [countries, setCountries] = useState<CountryEntry[]>([]);
	const [uiStep, setUiStep] = useState<"meta" | "files">("meta");
	const typeValue = useWatch({ control, name: "type" });
	const actorNames = useMemo(() => (actorsValue || []).filter(Boolean), [actorsValue]);

	useEffect(() => {
		const id = searchParams.get("id");
		if (id) {
			setFilmId(id);
		}
	}, [searchParams, setFilmId]);

	useEffect(() => {
		setCountries(getCountries("fr"));
	}, []);

	useEffect(() => {
		if ((typeValue || "").toLowerCase() === "abonnement") {
			setValue("price", null, { shouldValidate: true });
		}
	}, [setValue, typeValue]);

	return (
		<div className="space-y-4">
			<Header
				title="Edition de film"
				className="rounded-2xl border border-base-300 shadow-sm px-5"
			>
				<div className="text-sm text-white/80 flex items-center gap-3">
					<span className="px-3 py-1 rounded-lg bg-base-200/60 border border-base-300">
						Étape {uiStep === "meta" ? "1/2 • Métadonnées" : "2/2 • Fichiers"}
					</span>
				</div>
			</Header>

			<form
				onSubmit={handleSubmit(async (data) => {
					if (uiStep === "meta") {
						try {
							await saveMetadataOnly(data);
							setUiStep("files");
						} catch {
							/* toast déjà géré */
						}
						return;
					}
					openConfirm(data, "publish");
				})}
				className="bg-neutral px-5 py-6 rounded-2xl shadow border border-base-300 space-y-6"
			>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-4">
						<div className="bg-base-200/40 border border-base-300 rounded-xl p-4 h-full flex items-center justify-center overflow-hidden">
							{previewUrl ? (
								<img src={previewUrl} alt="Aperçu visuel" className="rounded-lg max-h-full object-cover" />
							) : (
								<span className="text-white/70 text-sm text-center">Ajoutez une image principale pour l’aperçu.</span>
							)}
						</div>
					</div>

					<div className="lg:col-span-8 space-y-6">
						{prefillLoading && (
							<div className="alert alert-info bg-base-200/60 border border-base-300 text-sm text-white">
								Chargement des informations du film...
							</div>
						)}
						{optionsLoading && (
							<div className="alert alert-info bg-base-200/60 border border-base-300 text-sm text-white">
								Chargement des options depuis le serveur...
							</div>
						)}
						{prefillError && (
							<div className="alert alert-error bg-red-900/40 border border-red-700 text-sm text-red-100">
								{prefillError}
							</div>
						)}
						{optionsError && (
							<div className="alert alert-error bg-red-900/40 border border-red-700 text-sm text-red-100">
								{optionsError}
							</div>
						)}

						{uiStep === "meta" && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="label text-sm mb-1" htmlFor="fullName">Nom du Film</label>
										<Controller
											name="title"
											control={control}
											rules={{
												required: "Titre du film",
												minLength: {
													value: 1,
													message: "Le film doit comporter au moins 1 caractères",
												},
											}}
											render={({ field }) => <InputField {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
										/>
										{errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Maison de Production</label>
										<Controller
											name="productionHouse"
											control={control}
											rules={{
												required: "La maison de production est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.productionHouses}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.productionHouse && <p className="text-red-600 text-sm">{errors.productionHouse.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Pays de Production</label>
										<Controller
											name="country"
											control={control}
											rules={{
												required: "Le pays de production est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.countries}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Type</label>
										<Controller
											name="type"
											control={control}
											rules={{
												required: "Le type est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.types}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Prix de location</label>
										<Controller
											name="price"
											control={control}
											rules={{
												validate: (val) => {
													if ((typeValue || "").toLowerCase() === "abonnement") return true;
													return val !== null && val !== undefined && val !== "" ? true : "Le prix est obligatoire";
												},
											}}
											render={({ field }) => (
												<InputField
													type="number"
													{...field}
													value={field.value ?? ""}
													onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
													disabled={(typeValue || "").toLowerCase() === "abonnement"}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Date de sortie du film</label>
										<Controller
											name="releaseDate"
											control={control}
											rules={{
												required: "La date de sortie est obligatoire",
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
												required: "La date de publication sur SaFliix est obligatoire",
											}}
											render={({ field }) => <InputField type="date" {...field} value={field.value ?? ""} className="input bg-base-200 border-base-300" />}
										/>
										{errors.publishDate && <p className="text-red-600 text-sm">{errors.publishDate.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Format</label>
										<Controller
											name="format"
											control={control}
											rules={{
												required: "Le format est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.formats}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.format && <p className="text-red-600 text-sm">{errors.format.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Catégorie</label>
										<Controller
											name="category"
											control={control}
											rules={{
												required: "La catégorie est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.categories}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Genre</label>
										<Controller
											name="genre"
											control={control}
											rules={{
												required: "Le genre est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.genres}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.genre && <p className="text-red-600 text-sm">{errors.genre.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Nom des acteurs principaux</label>
										<Controller
											name="actors"
											control={control}
											rules={{
												required: "Les acteurs sont obligatoires",
											}}
											render={({ field }) => (
												<ActorsSelector
													value={field.value ?? []}
													onChange={(val) => field.onChange(val)}
													options={options.actors}
												/>
											)}
										/>
										{errors.actors && <p className="text-red-600 text-sm">{errors.actors.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Directeur de production</label>
										<Controller
											name="director"
											control={control}
											rules={{
												required: "Le directeur est obligatoire",
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
												required: "La durée est obligatoire",
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
										{errors.duration && <p className="text-red-600 text-sm">{errors.duration.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Pays bloqués</label>
										<Controller
											name="blockCountries"
											control={control}
											render={({ field }) => (
												<CountryMultiSelect
													availableCountries={countries}
													value={field.value ?? []}
													onChange={field.onChange}
												/>
											)}
										/>
									</div>
									<div>
										<label className="label text-sm mb-1">Ayant droit</label>
										<Controller
											name="rightHolderId"
											control={control}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.rightHolders}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
									</div>
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
									<Controller
										name="isSafliixProd"
										control={control}
										render={({ field }) => (
											<label className="flex items-center gap-2 text-sm">
												<input
													type="checkbox"
													className="checkbox checkbox-sm"
													checked={field.value}
													onChange={(e) => field.onChange(e.target.checked)}
												/>
												Production SaFlix
											</label>
										)}
									/>
									<Controller
										name="haveSubtitles"
										control={control}
										render={({ field }) => (
											<label className="flex items-center gap-2 text-sm">
												<input
													type="checkbox"
													className="checkbox checkbox-sm"
													checked={field.value}
													onChange={(e) => field.onChange(e.target.checked)}
												/>
												Sous-titre
											</label>
										)}
									/>
								</div>

								<div className="grid grid-cols-3 gap-3 items-end">
									<div>
										<label className="label text-sm mb-1">Langue</label>
										<Controller
											name="language"
											control={control}
											rules={{
												required: "La langue est obligatoire",
											}}
											render={({ field }) => (
												<SuggestionsInput
													optionList={options.languages ?? []}
													{...field}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
										{errors.language && <p className="text-red-600 text-sm">{errors.language.message}</p>}
									</div>
									<div>
										<label className="label text-sm mb-1">Classification (age)</label>
										<Controller
											name="ageRating"
											control={control}
											render={({ field }) => (
												<InputField
													{...field}
													value={field.value ?? ""}
													placeholder="Ex: R, PG-13"
													className="input bg-base-200 border-base-300"
												/>
											)}
										/>
									</div>
									<UploadBox id="trailer" label="Sous titre" className="w-full min-h-[80px]" />
								</div>

								<div className="flex justify-end">
									<button
										type="button"
										className="btn btn-primary"
										onClick={handleSubmit(async (data) => {
											try {
												await saveMetadataOnly(data);
												setUiStep("files");
											} catch {
												/* erreurs déjà notifiées */
											}
										})}
										disabled={prefillLoading || metaSaving}
									>
										{metaSaving ? "Sauvegarde..." : "Continuer vers les fichiers"}
									</button>
								</div>
							</>
						)}

						{uiStep === "files" && (
							<>
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
									{actorNames.length === 0 ? (
										<div className="text-xs text-white/60 bg-base-200/60 border border-base-300 rounded-lg px-3 py-2">
											Ajoutez des acteurs dans le champ dédié pour les afficher ici.
										</div>
									) : (
										<div className="flex gap-2 items-center flex-wrap">
											{actorNames.map((name, index) => (
												<div key={name + index} className="flex flex-col items-center gap-1">
													<UploadBox
														id={`image-${index}`}
														label={name}
														className="w-20 h-20"
													/>
													<span className="text-xs text-white/60 max-w-[5rem] text-center">{name}</span>
												</div>
											))}
										</div>
									)}
									<p className="text-xs text-white/60">Veillez à ce que la photo corresponde à la sélection du nom de l’acteur dans le formulaire.</p>
								</div>

									<div className="flex items-center gap-3 pt-2 justify-between">
										<button
											type="button"
											className="btn btn-ghost text-white"
											onClick={() => setUiStep("meta")}
									>
										Retour métadonnées
									</button>
									<div className="flex gap-3">
										<button
											type="button"
											className="btn btn-outline btn-ghost text-white"
											onClick={handleSubmit((data) => openConfirm(data, "draft"))}
											disabled={prefillLoading || metaSaving}
										>
											Enregistrer en brouillon
										</button>
										<button
											type="submit"
											className="btn btn-primary rounded-full px-8"
											disabled={prefillLoading || metaSaving}
										>
											{metaSaving ? "Sauvegarde..." : "Publier film"}
										</button>
									</div>
								</div>
							</>
						)}
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
	);
}
