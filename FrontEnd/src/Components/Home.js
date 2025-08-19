import Container from "@mui/material/Container";
import { PromoSection } from "./PromoSection";
import { DiscountsQuickLinks } from "./DiscountsQuickLinks";
import { CategoriesQuickLinks } from "./CategoriesQuickLinks";
import { NewProductsQuickLinks } from "./NewProductsQuickLinks";
import { BestSellersQuickLinks } from "./BestSellersQuickLinks";

export function Home() {
  window.scrollTo(0, 0);
  return (
    <div>
      {" "}
      <PromoSection />
      <Container maxWidth="xl">
        <DiscountsQuickLinks />
        <NewProductsQuickLinks />
        <CategoriesQuickLinks />
        <BestSellersQuickLinks />
      </Container>
    </div>
  );
}
