import Container from "@mui/material/Container";
import { HeroSection } from "./HeroSection";
import { FeaturedCategories } from "./FeaturedCategories";
import { NewProductsQuickLinks } from "./NewProductsQuickLinks";
import { BestSellersQuickLinks } from "./BestSellersQuickLinks";
import { DiscountedProductsQuickLinks } from "./DiscountedProductsQuickLinks";
import { ProductsOfXCategory } from "./ProductsOfXCategory";
import { DiscountBanner } from "./DiscountBanner";
import { TopReviews } from "./TopReviews";
import { Incentives } from "./Incentives";
export function Home() {
  return (
    <div id="home-page" style={{ minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <HeroSection />
        <div className="mb-5">
          <DiscountedProductsQuickLinks />
        </div>
        <div className="my-5">
          <ProductsOfXCategory category_name="monitors" />
        </div>
        <div className="my-5">
          <ProductsOfXCategory category_name="playstations" />
        </div>
        <div className="my-5">
          <FeaturedCategories />
        </div>
        {/* <div className="my-5">
          <ProductsOfXCategory category_name="keyboards" />
        </div> */}
        <div className="my-5">
          <NewProductsQuickLinks />
        </div>
        <div className="my-5">
          <BestSellersQuickLinks />
        </div>
        {/* <div className="my-5">
          <ProductCard />
        </div> */}

        <div className="my-5">
          <DiscountBanner />
        </div>

        <div className="my-5">
          <TopReviews />
        </div>
      </Container>
      {/* <MixedProductsQuickLinks /> */}

      <Incentives />
    </div>
  );
}
