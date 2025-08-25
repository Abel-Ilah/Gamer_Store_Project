import Container from "@mui/material/Container";
import { PromoSection } from "./PromoSection";
import { CategoriesQuickLinks } from "./CategoriesQuickLinks";
import { NewProductsQuickLinks } from "./NewProductsQuickLinks";
import { BestSellersQuickLinks } from "./BestSellersQuickLinks";
import { DiscountedProductsQuickLinks } from "./DiscountedProductsQuickLinks";
import { MixedProductsQuickLinks } from "./MixedProducts";
export function Home() {
  return (
    <div>
      {" "}
      <PromoSection />
      <Container maxWidth="xl">
        <DiscountedProductsQuickLinks />
        <MixedProductsQuickLinks />
        <NewProductsQuickLinks />
        <CategoriesQuickLinks />
        <BestSellersQuickLinks />
      </Container>
    </div>
  );
}
