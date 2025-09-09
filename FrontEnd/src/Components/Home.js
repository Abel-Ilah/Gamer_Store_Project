import Container from "@mui/material/Container";
import { PromoSection } from "./PromoSection";
import { CategoriesQuickLinks } from "./CategoriesQuickLinks";
import { NewProductsQuickLinks } from "./NewProductsQuickLinks";
import { BestSellersQuickLinks } from "./BestSellersQuickLinks";
import { DiscountedProductsQuickLinks } from "./DiscountedProductsQuickLinks";
import { MixedProductsQuickLinks } from "./MixedProducts";
import { ProductsOfXCategory } from "./ProductsOfXCategory";
import { TopReviews } from "./TopReviews";
export function Home() {
  return (
    <div>
      {" "}
      {/* <PromoSection /> */}
      <Container maxWidth="xl">
        <DiscountedProductsQuickLinks />
        <ProductsOfXCategory />
        <MixedProductsQuickLinks />
        <NewProductsQuickLinks />
        <CategoriesQuickLinks />
        <BestSellersQuickLinks />
        <TopReviews />
      </Container>
    </div>
  );
}
