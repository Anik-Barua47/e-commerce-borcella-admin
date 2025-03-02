import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    url: "/collections",
    icon: Shapes,
    title: "Collections",
  },
  {
    url: "/products",
    icon: Tag,
    title: "Products",
  },
  {
    url: "/orders",
    icon: ShoppingBag,
    title: "Orders",
  },
  {
    url: "/customers",
    icon: UsersRound,
    title: "Customers",
  },
];
