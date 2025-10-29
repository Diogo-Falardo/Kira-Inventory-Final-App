import { createFileRoute } from "@tanstack/react-router";
import UserProductPage from "@/pages/user/UserProductPage";

export const Route = createFileRoute("/userpanel/userproduct")({
  component: UserProductPage,
});
