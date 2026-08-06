import Container from "@mui/material/Container";
import { HeroSection } from "../components/HeroSection";
import { FeaturedCategories } from "../features/category/components/FeaturedCategories";
import { NewProductsQuickLinks } from "../features/product/components/NewProductsQuickLinks";
import { BestSellersQuickLinks } from "../features/product/components/BestSellersQuickLinks";
import { DiscountedProductsQuickLinks } from "../features/product/components/DiscountedProductsQuickLinks";
import { ProductsOfXCategory } from "../features/product/components/ProductsOfXCategory";
import { DiscountBanner } from "../features/product/components/DiscountBanner";
import { TopReviews } from "../features/review/components/TopReviews";
import { Incentives } from "../components/Incentives";

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
