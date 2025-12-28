'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart2,
  Clapperboard,
  CreditCard,
  Film,
  LayoutDashboard,
  Megaphone,
  Monitor,
  UserCheck,
  Settings,
  Shield,
  Users
} from "lucide-react";

type MenuItem = {
  href: string;
  label: string;
  icon?: React.ElementType;
  imageSrc?: string;
  submenus?: { href: string; label: string; icon: React.ElementType }[];
};

const items: MenuItem[] = [
  { href: "/dashboard", label: "Sflixboard", imageSrc: "/ICONE_SFLIX.png" },
  { href: "/dashboard/films", label: "Film", icon: Film },
  { href: "/dashboard/series", label: "Série", icon: Clapperboard },
  { href: "/dashboard/users", label: "Utilisateur", icon: Users },
  { href: "/dashboard/rights-holders", label: "Ayants droit", icon: UserCheck },
  { href: "/dashboard/subscriptions", label: "Abonnement", icon: CreditCard },
  {
    href: "/dashboard/stats",
    label: "Statistique",
    submenus: [
      { href: "/dashboard/stats/films", label: "Films", icon: Film },
      { href: "/dashboard/stats/revenu", label: "Revenu", icon: Clapperboard },
      { href: "/dashboard/stats/users", label: "Utilisateurs", icon: Users },
      { href: "/dashboard/stats/pub", label: "Pub", icon: Monitor }
    ],
    icon: BarChart2
  },
  { href: "/dashboard/pub", label: "Pub", icon: Megaphone },
  { href: "/dashboard/security", label: "Sécurité", icon: Shield },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings }
];



const SidebarItem = ({
  href,
  children,
  icon: Icon,
  imageSrc,
  pathname,
  submenus = []
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType;
  imageSrc?: string;
  pathname: string;
  submenus?: { href: string; label: string; icon: React.ElementType }[];
}) => {
  const hasSubmenus = submenus.length > 0;
  /* const isActive = hasSubmenus
    ? submenus.some(sub => pathname === sub.href || pathname.startsWith(sub.href))
    : pathname === href || pathname.startsWith(href);
 */

  const isActive = () => {
    if(hasSubmenus){
      return submenus.some(sub => pathname === sub.href || pathname.startsWith(sub.href));
    }else {
      if(href == "/dashboard"){
        return href == pathname;
      }else{
        return pathname.startsWith(href);
      }
    }
  }

  const Wrapper = hasSubmenus ? "div" : Link;
  const active = isActive();

  const IconSlot = () =>
    imageSrc ? (
      <Image src={imageSrc} alt={children?.toString() || "icon"} width={20} height={20} className="w-5 h-5" />
    ) : (
      Icon && <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-white/60"}`} />
    );

  return (
    <li className="relative">
      <Wrapper
        {...(!hasSubmenus ? { href } : {})}
        className={`group relative flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
          active ? "bg-primary/10 text-primary" : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
      >
        <span
          className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary transition-opacity duration-200 ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          }`}
        />
        <IconSlot />
        <span className="truncate">{children}</span>
      </Wrapper>

      {hasSubmenus && (
        <ul className="ml-7 mt-1 space-y-1 border-l border-white/5 pl-3">
          {submenus.map((submenu, idx) => {
            const SubIcon = submenu.icon;
            const subActive = pathname === submenu.href || pathname.startsWith(submenu.href);
            return (
              <li key={idx}>
                <Link
                  href={submenu.href}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    subActive ? "text-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  <SubIcon className="w-4 h-4" />
                  <span className="truncate">{submenu.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};




export default function Sidebar() {
	const pathname = usePathname();
  return (
    <aside className="w-64 h-full bg-black text-white/80 border-r border-base-300/30">
      <div className="px-5 pt-6 pb-4">
        <Link href="/dashboard" className="inline-flex items-center">
          <Image src="/LOGO-SAFLIIX.svg" alt="SAFLIIX" width={140} height={36} priority />
        </Link>
      </div>

      <div className="px-5 pb-3 text-xs uppercase tracking-[0.08em] text-white/40">
        Menu
      </div>

      <nav className="px-2">
        <ul className="flex flex-col gap-1">
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              href={item.href}
              pathname={pathname}
              submenus={item.submenus || []}
              icon={item.icon || LayoutDashboard}
              imageSrc={item.imageSrc}
            >
              {item.label}
            </SidebarItem>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
