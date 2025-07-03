'use client';

import Header from "@/ui/components/header";
import DataTable from "@/ui/components/dataTable";
import { Person,columns } from "./mapper";




const personnes: Person[] = [
  {
    nom: 'Jean Dupont',
    numero: 1,
    tel: '+22961234567',
    mail: 'jean.dupont@example.com',
    status: 'actif',
    genre: 'H',
    date: '2025-06-01',
    imgProfileUrl: 'https://example.com/profiles/jean.jpg',
  },
  {
    nom: 'Amina Sow',
    numero: 2,
    tel: '+22967239876',
    mail: 'amina.sow@example.com',
    status: 'inactif',
    genre: 'F',
    date: '2025-05-20',
    imgProfileUrl: 'https://example.com/profiles/amina.jpg',
  },
  {
    nom: 'Alex Tounkara',
    numero: 3,
    tel: '+22965987654',
    mail: 'alex.tounkara@example.com',
    status: 'actif',
    genre: '-',
    date: '2025-06-15',
    imgProfileUrl: 'https://example.com/profiles/alex.jpg',
  },
  {
    nom: 'Fatoumata Diallo',
    numero: 4,
    tel: '+22969112233',
    mail: 'fatou.diallo@example.com',
    status: 'actif',
    genre: 'F',
    date: '2025-04-18',
    imgProfileUrl: 'https://example.com/profiles/fatoumata.jpg',
  },
  {
    nom: 'Mohamed Keita',
    numero: 5,
    tel: '+22968223344',
    mail: 'mohamed.keita@example.com',
    status: 'inactif',
    genre: 'H',
    date: '2025-03-12',
    imgProfileUrl: 'https://example.com/profiles/mohamed.jpg',
  },
  {
    nom: 'Chloe Zinsou',
    numero: 6,
    tel: '+22969445566',
    mail: 'chloe.zinsou@example.com',
    status: 'actif',
    genre: 'F',
    date: '2025-05-30',
    imgProfileUrl: 'https://example.com/profiles/chloe.jpg',
  },
  {
    nom: 'Kevin Hounkpati',
    numero: 7,
    tel: '+22969998877',
    mail: 'kevin.hounkpati@example.com',
    status: 'actif',
    genre: 'H',
    date: '2025-06-20',
    imgProfileUrl: 'https://example.com/profiles/kevin.jpg',
  },
  {
    nom: 'Brigitte Akakpo',
    numero: 8,
    tel: '+22964556677',
    mail: 'brigitte.akakpo@example.com',
    status: 'inactif',
    genre: 'F',
    date: '2025-01-22',
    imgProfileUrl: 'https://example.com/profiles/brigitte.jpg',
  },
  {
    nom: 'Nina Yovo',
    numero: 9,
    tel: '+22962334455',
    mail: 'nina.yovo@example.com',
    status: 'actif',
    genre: 'F',
    date: '2025-06-11',
    imgProfileUrl: 'https://example.com/profiles/nina.jpg',
  },
  {
    nom: 'Emile Dossou',
    numero: 10,
    tel: '+22961225544',
    mail: 'emile.dossou@example.com',
    status: 'inactif',
    genre: 'H',
    date: '2025-02-10',
    imgProfileUrl: 'https://example.com/profiles/emile.jpg',
  },
  {
    nom: 'Sophie Gandonou',
    numero: 11,
    tel: '+22965557799',
    mail: 'sophie.gandonou@example.com',
    status: 'actif',
    genre: 'F',
    date: '2025-06-05',
    imgProfileUrl: 'https://example.com/profiles/sophie.jpg',
  },
  {
    nom: 'Mike Agossou',
    numero: 12,
    tel: '+22966889900',
    mail: 'mike.agossou@example.com',
    status: 'inactif',
    genre: 'H',
    date: '2025-03-25',
    imgProfileUrl: 'https://example.com/profiles/mike.jpg',
  },
  {
    nom: 'Laura Toko',
    numero: 13,
    tel: '+22967112244',
    mail: 'laura.toko@example.com',
    status: 'actif',
    genre: 'F',
    date: '2025-04-01',
    imgProfileUrl: 'https://example.com/profiles/laura.jpg',
  },
  {
    nom: 'Pascal Boko',
    numero: 14,
    tel: '+22967990011',
    mail: 'pascal.boko@example.com',
    status: 'actif',
    genre: 'H',
    date: '2025-06-10',
    imgProfileUrl: 'https://example.com/profiles/pascal.jpg',
  },
  {
    nom: 'Cynthia Mensah',
    numero: 15,
    tel: '+22968110022',
    mail: 'cynthia.mensah@example.com',
    status: 'inactif',
    genre: '-',
    date: '2025-02-28',
    imgProfileUrl: 'https://example.com/profiles/cynthia.jpg',
  },
];


export default function Page() {
  return (
    <div className="">
      <Header title="Utilisateurs"/>
      <div className="mt-4">
       <DataTable data={personnes} columns={columns} />
      </div>
  </div>
);
} 