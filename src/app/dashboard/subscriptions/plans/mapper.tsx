import type { ColumnConfig } from "@/ui/components/dataTable";
import { PlanPayload } from "@/types/api/subscriptions";
import Link from "next/link";

export const columns: ColumnConfig <PlanPayload>[] = [
  {
    key: "name",
    header: "Plan",
    render: (plan) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white">{plan.name}</span>
        <span
          className={`badge ${
            plan.status === "Actif" ? "badge-success" : "badge-ghost"
          }`}
        >
          {plan.status || "—"}
        </span>
      </div>
    ),
  },
  {
    key: "price",
    header: "Tarif",
    render: (plan) => `${plan.price} ${plan.currency || "XOF"}`,
  },
  {
    header: "Rabais (%)",
    render: (plan) => `${plan.yearlyDiscount}`
  },
  {
    header: "Tarif Annuel",
    render: (plan) => `${plan.price * 12 - ( 1 - plan.yearlyDiscount/ 100)}`
  },
  {
    key: "devices",
    header: "Appareils",
  },
  {
    key: "quality",
    header: "Qualité",
  },
  {
    header: "Actions",
    render: (plan) => (
      <Link
        href={`/dashboard/subscriptions/plans/${plan.id}`}
        className="btn btn-ghost btn-xs text-primary border-primary/50 rounded-full"
      >
        Voir les détails
      </Link>
    ),
  },
];
