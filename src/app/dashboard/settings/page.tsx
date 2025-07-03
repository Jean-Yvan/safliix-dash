'use client';
import React from "react";
import { Bell, CameraIcon, LocateIcon, Mail, Phone, PhoneCall } from "lucide-react";
import { title } from 'process';
import { Controller } from "react-hook-form";
import InputField from "@/ui/components/inputField";
import { useAdminForm } from "./useAdminForm";


export default function Page(){

  const {
      control,
      handleSubmit,
      formState: { errors },
    } = useAdminForm();
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="bg-neutral shadow-md shadow-white flex flex-col justify-center items-center rounded-md p-4 text-white">
          <div className="bg-slate-100 relative rounded-full w-20 h-20">
            <div className="absolute bottom-0 -right-7 rounded-full bg-primary w-10 h-10 border-2 border-neutral flex items-center justify-center cursor-pointer">
              <CameraIcon className="w-5 h-5 text-black"/>
            </div>
          </div>
          <h1 className="font-bold text-lg mt-4">Gildas DOSSOU</h1>
          <div className="badge bg-white badge-sm text-black">Super Admin</div>
          <p className="mt-5 font-bold text-sm">Dernère visite 02/03/2023</p>
          <button className="btn bg-slate-200 text-black rounded-full button-sm w-full mt-2">Déconnexion</button>
        </div>
        <div className="bg-neutral shadow-md shadow-white p-4 mt-4">
          <div className="flex items-center gap-2 text-slate-200">
            <Bell className="w-4 h-4"/>
            <span>Notifications (2)</span>
          </div>
        </div>
        <div className="bg-neutral shadow-md shadow-white p-4 mt-4">
          <TextWithIcon title={"gildas@sachrist.com"} icon={Mail} />
          <TextWithIcon title={"312 3rd St, Albany,"} icon={LocateIcon} subTitle="New York 12206, USA"/>
          <TextWithIcon title={"+1 123-123-123"} icon={Phone} />
          <TextWithIcon title={"+1 123-123-123"} icon={PhoneCall} />
          
        </div>
      </div>
      <div className="flex-3 bg-neutral shadow-md shadow-white p-4">
        <h2 className="text-white font-bold mb-4">Profil détail</h2>
        <div className="flex items-center gap-2">
          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Prénom</label>
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

          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Pays</label>
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
        </div>
         <div className="flex items-center gap-2">
          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Prénom</label>
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

          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Pays</label>
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
        </div>
         <div className="flex items-center gap-2">
          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Prénom</label>
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

          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Pays</label>
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
        </div>
         <div className="flex items-center gap-2">
          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Prénom</label>
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

          <div className="w-full">
						<label className="label text-sm mb-2" htmlFor="fullName">Pays</label>
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
        </div>
         <div className="flex items-end gap-4">
          <div className="w-full flex-1">
						<label className="label text-sm mb-2" htmlFor="fullName">Prénom</label>
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

          <button className="btn bg-[#00BA9D] btn-sm rounded-full flex-1 ">Enregistrer Info</button>
        </div>
        <button className="btn btn-primary btn-xl p-10 text-white mt-5">AJOUTER <br/> UN ADMIN</button>
      </div>
    </div>
  )
}

const TextWithIcon = ({title,subTitle,icon:Icon} : {title:string; subTitle?:string; icon:React.ElementType}) => (
  <div className="mb-4 flex items-center gap-2 text-white">
    <Icon className="w-4 h-4"/>
    <div>
      <h2 className="text-sm">{title}</h2>
      {subTitle && <p className="text-md">{subTitle}</p>}
    </div>
  </div>
)