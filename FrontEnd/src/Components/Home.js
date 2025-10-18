import Container from "@mui/material/Container";
import { HeroSection } from "./HeroSection";
import { CategoriesQuickLinks } from "./CategoriesQuickLinks";
import { NewProductsQuickLinks } from "./NewProductsQuickLinks";
import { BestSellersQuickLinks } from "./BestSellersQuickLinks";
import { DiscountedProductsQuickLinks } from "./DiscountedProductsQuickLinks";
import { MixedProductsQuickLinks } from "./MixedProducts";
import { ProductsOfXCategory } from "./ProductsOfXCategory";
import { DiscountBanner } from "./DiscountBanner";
import { TopReviews } from "./TopReviews";
import { Incentives } from "./Incentives";
export function Home() {
  return (
    <div id="home-page" style={{ minHeight: "100vh" }}>
      <HeroSection />
      <Container maxWidth="xl">
        <DiscountedProductsQuickLinks />
        <ProductsOfXCategory />
        <MixedProductsQuickLinks />
        <NewProductsQuickLinks />
        <CategoriesQuickLinks />
        <BestSellersQuickLinks />
        <DiscountBanner />
        <TopReviews />
        <Incentives />
      </Container>
    </div>
  );
}
