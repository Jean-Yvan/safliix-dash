import Header from "@/ui/components/header";

type Transaction = {
  profile: string;
  method: 'Carte' | 'Mobile Money' | 'Paypal' | 'Crypto';
  type: 'Abonnement' | 'Film à l’unité' | 'Pack Série';
  pays: string;
  monnaie: 'XOF' | 'EUR' | 'GNF' | 'USD';
  cout: number;
  tax: number;
  total: number;
};

const transactions: Transaction[] = [
  {
    profile: 'Jean Dupont',
    method: 'Carte',
    type: 'Abonnement',
    pays: 'France',
    monnaie: 'EUR',
    cout: 10.00,
    tax: 2.00,
    total: 12.00,
  },
  {
    profile: 'Amina Sow',
    method: 'Mobile Money',
    type: 'Film à l’unité',
    pays: 'Sénégal',
    monnaie: 'XOF',
    cout: 1500,
    tax: 300,
    total: 1800,
  },
  {
    profile: 'Alex Tounkara',
    method: 'Paypal',
    type: 'Abonnement',
    pays: 'Mali',
    monnaie: 'XOF',
    cout: 2000,
    tax: 400,
    total: 2400,
  },
  {
    profile: 'Fatoumata Diallo',
    method: 'Carte',
    type: 'Pack Série',
    pays: 'Guinée',
    monnaie: 'GNF',
    cout: 250000,
    tax: 50000,
    total: 300000,
  },
  {
    profile: 'Mohamed Keita',
    method: 'Crypto',
    type: 'Film à l’unité',
    pays: 'Côte d\'Ivoire',
    monnaie: 'XOF',
    cout: 1000,
    tax: 200,
    total: 1200,
  },
  {
    profile: 'Chloe Zinsou',
    method: 'Carte',
    type: 'Abonnement',
    pays: 'Bénin',
    monnaie: 'XOF',
    cout: 3000,
    tax: 600,
    total: 3600,
  },
  {
    profile: 'Kevin Hounkpati',
    method: 'Mobile Money',
    type: 'Pack Série',
    pays: 'Togo',
    monnaie: 'XOF',
    cout: 1800,
    tax: 360,
    total: 2160,
  }
];



export default function Page() {
  return (
    <div>
      <Header title="Abonnements"/>
      <div className="mt-4 bg-neutral shadow-base-200 shadow-xl">
        <table className="table table-zebra text-sm">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th>PROFILE</th>
              <th>METHOD</th>
              <th>TYPE</th>
              <th>PAYS</th>
              <th>MONNAIE</th>
              <th>COUT</th>
              <th>TAX</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={`https://api.adorable.io/avatars/285/${transaction.profile}.png`}
                          alt={transaction.profile}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{transaction.profile}</div>
                    </div>
                  </div>
                </td>
                <td>{transaction.method}</td>
                <td>{transaction.type}</td>
                <td>{transaction.pays}</td>
                <td>{transaction.monnaie}</td>
                <td>{transaction.cout.toLocaleString('fr-FR', { style: 'currency', currency: transaction.monnaie })}</td>
                <td>{transaction.tax.toLocaleString('fr-FR', { style: 'currency', currency: transaction.monnaie })}</td>
                <td>{transaction.total.toLocaleString('fr-FR', { style: 'currency', currency: transaction.monnaie })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
       
  )
}