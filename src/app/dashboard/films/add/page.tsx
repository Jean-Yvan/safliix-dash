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
import Image from "next/image";

function ActorsSelector({
	value,
	onChange,
	options,
}: {
	value: { actorId?: string; name: string }[];
	onChange: (val: { actorId?: string; name: string }[]) => void;
	options: SuggestionOption[];
}) {
	const [input, setInput] = React.useState("");
	const [actors, setActors] = React.useState<{ actorId?: string; name: string }[]>(value ?? []);

	React.useEffect(() => {
		setActors((value ?? []).filter((a) => a && a.name));
	}, [value]);

	const commit = (name: string) => {
		const clean = name.trim();
		if (!clean) return;
		const existing = actors.find((a) => a.name.toLowerCase() === clean.toLowerCase());
		if (existing) {
			setInput("");
			return;
		}
		const matched = options.find((opt) => opt.label.toLowerCase() === clean.toLowerCase());
		const actor = matched ? { name: matched.label, actorId: matched.value !== matched.label ? matched.value : undefined } : { name: clean };
		const next = [...actors, actor];
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
						<span key={actor.actorId ?? actor.name} className="badge badge-outline border-primary/50 text-primary gap-2">
							{actor.name}
							<button
								type="button"
								className="btn btn-ghost btn-xs text-primary"
								onClick={() => {
									const next = actors.filter((a) => (a.actorId ?? a.name) !== (actor.actorId ?? actor.name));
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
	const showList = search.trim().length > 0;
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
			{showList && (
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
			)}
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

function VideoUpload({
	id,
	label,
	fileLabel,
	file,
	onSelect,
	onPreview,
}: {
	id: string;
	label: string;
	fileLabel: string;
	file: File | null;
	onSelect: (file?: File | null) => void;
	onPreview: (url: string) => void;
}) {
	return (
		<label
			htmlFor={id}
			className="flex flex-col justify-center border-2 border-dashed border-base-300 rounded-xl bg-base-100/5 min-h-[140px] cursor-pointer px-4 py-6 text-center text-white/80"
		>
			<span className="text-4xl mb-2">🎬</span>
			<span className="text-sm mb-2">{label}</span>
			<span className="text-xs text-white/60">{file ? file.name : fileLabel}</span>
			<input
				id={id}
				type="file"
				accept="video/*"
				className="hidden"
				onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
			/>
			{file && (
				<div className="mt-2 flex justify-center">
					<button
						type="button"
						className="btn btn-outline btn-primary btn-xs"
						onClick={() => {
							const url = URL.createObjectURL(file);
							onPreview(url);
						}}
					>
						Prévisualiser
					</button>
				</div>
			)}
		</label>
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
		setPendingAction,
		resetForm,
		prefillLoading,
		prefillError,
		progressStep,
		progressDetail,
		uploadErrorDetail,
		options,
		optionsLoading,
		optionsError,
		saveMetadataOnly,
		metaSaving,
	} = useFilmForm();
	const searchParams = useSearchParams();
	const [countries, setCountries] = useState<CountryEntry[]>([]);
	const [uiStep, setUiStep] = useState<"meta" | "files">("meta");
	const typeValue = useWatch({ control, name: "type" });
	const movieFile = useWatch({ control, name: "movieFile" }) as File | null;
	const trailerFile = useWatch({ control, name: "trailerFile" }) as File | null;
	const [videoPreview, setVideoPreview] = useState<string | null>(null);
	const [showVideoModal, setShowVideoModal] = useState(false);

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
						openConfirm(data, "meta");
						return;
					}
					openConfirm(data, "publish");
				})}
				className="bg-neutral px-5 py-6 rounded-2xl shadow border border-base-300 space-y-6"
			>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-4">
						<div className="bg-base-200/40 border border-base-300 rounded-xl p-4 h-full flex items-center justify-center overflow-hidden">
							<Image src="/ICONE_SFLIX.png" alt="SaFlix" width={240} height={240} className="object-contain" />
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
												<select
													{...field}
													onChange={(e) => field.onChange(e.target.value)}
													value={field.value ?? ""}
													className="input bg-base-200 border-base-300"
												>
													<option value={"abonnement"}>Abonnement</option>
													<option value={"location"}>Location</option>
													</select>
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
													return val !== null && val !== undefined  ? true : "Le prix est obligatoire";
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
												<select
													{...field}
													value={field.value ?? ""}
													onChange={(e) => field.onChange(e.target.value)}
													className="input bg-base-200 border-base-300"
												>
													<option value={"COURT-METRAGE"}>COURT-METRAGE</option>
													<option value={"LONG-METRAGE"}>LONG-METRAGE</option>
													
												</select>
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

									<div>
										<label className="label text-sm mb-1">Type du programme</label>
										<Controller
											name="entertainmentMode"
											control={control}
											render={({ field }) => (
												<select
													{...field}
													onChange={(e) => field.onChange(e.target.value)}
													className="input bg-base-200 border-base-300"
												>
													<option>Film</option>
													<option>Divers</option>
												</select>
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
											openConfirm(data, "meta");
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
									<VideoUpload
										id="film-file"
										label={typeValue?.toLowerCase() === "abonnement" ? "Vidéo (optionnel)" : "Vidéo du film"}
										fileLabel="Choisir une vidéo"
										file={movieFile}
										onSelect={(file) => setValue("movieFile", file ?? null, { shouldValidate: false })}
										onPreview={(url) => {
											setVideoPreview(url);
											setShowVideoModal(true);
										}}
									/>
									<VideoUpload
										id="trailer-file"
										label="Bande annonce"
										fileLabel="Choisir une bande annonce"
										file={trailerFile}
										onSelect={(file) => setValue("trailerFile", file ?? null, { shouldValidate: false })}
										onPreview={(url) => {
											setVideoPreview(url);
											setShowVideoModal(true);
										}}
									/>
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
											{metaSaving ? "Traitement..." : "Ajouter les fichiers"}
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</form>

			{showVideoModal && videoPreview && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
					<div className="bg-neutral rounded-2xl border border-base-300 p-4 max-w-4xl w-full shadow-lg space-y-3 max-h-[90vh] flex flex-col">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">Prévisualisation vidéo</h3>
							<button
								className="btn btn-ghost btn-sm text-white"
								onClick={() => {
									if (videoPreview) URL.revokeObjectURL(videoPreview);
									setShowVideoModal(false);
									setVideoPreview(null);
								}}
							>
								Fermer
							</button>
						</div>
						<div className="flex-1 min-h-0">
							<video
								controls
								src={videoPreview}
								className="w-full h-full rounded-lg border border-base-300 object-contain"
							/>
						</div>
					</div>
				</div>
			)}

			<ConfirmationDialog
				open={dialogOpen}
				title={
					pendingAction === "meta"
						? "Enregistrer les métadonnées ?"
						: pendingAction === "update"
							? "Mettre à jour le film ?"
							: "Envoyer les fichiers ?"
				}
				message={
					pendingAction === "meta"
						? "Les métadonnées seront enregistrées. Vous pourrez ensuite ajouter les fichiers."
						: "Seuls les fichiers seront envoyés."
				}
				status={dialogStatus}
				resultMessage={dialogResult}
				confirmLabel={pendingAction === "meta" ? "Ajouter des fichiers" : "Envoyer les fichiers"}
				onCancel={() => {
					closeDialog();
					if (pendingAction === "meta") {
						resetForm();
						setUiStep("meta");
					}
				}}
				onConfirm={() => {
					if (pendingAction === "meta") {
						confirmSend(() => {
							setUiStep("files");
						});
					} else {
						confirmSend();
					}
				}}
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
					<div className="bg-base-100/10 border border-base-300 rounded-xl p-3 text-sm text-white/80 space-y-3">
						{pendingAction === "meta" ? (
							<>
								<div className="flex justify-between">
									<span className="text-white/60">Titre</span>
									<span>{pendingFilm.title}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-white/60">Type</span>
									<span>{pendingFilm.type || "—"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-white/60">Format</span>
									<span>{pendingFilm.format || "—"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-white/60">Genre</span>
									<span>{pendingFilm.genre || "—"}</span>
								</div>
							</>
						) : (
							<>
								<p className="text-white/70">Fichiers à envoyer</p>
								<ul className="list-disc list-inside space-y-1">
									{pendingFilm.mainImage && <li>Image principale : {pendingFilm.mainImage.name}</li>}
									{pendingFilm.secondaryImage && <li>Image secondaire : {pendingFilm.secondaryImage.name}</li>}
									{pendingFilm.movieFile && <li>Vidéo film : {pendingFilm.movieFile.name}</li>}
									{pendingFilm.trailerFile && <li>Bande annonce : {pendingFilm.trailerFile.name}</li>}
									{!pendingFilm.mainImage && !pendingFilm.secondaryImage && !pendingFilm.movieFile && !pendingFilm.trailerFile && (
										<li className="text-white/60">Aucun fichier sélectionné</li>
									)}
								</ul>
							</>
						)}
					</div>
				)}
			</ConfirmationDialog>
		</div>
	);
}
