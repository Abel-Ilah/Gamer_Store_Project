import { HorizontalScroll } from "./HorizontalScroll";
import { Category } from "./Category";
import Title from "./Title";

import { useCategories } from "../contexts/CategoriesProvider";

export function CategoriesQuickLinks() {
  const categories = useCategories();

  return (
    <>
      <Title title="All Categories" />
      <HorizontalScroll>
        {categories.map((c) => {
          return <Category category={c} key={c.id} />;
        })}
      </HorizontalScroll>
    </>
  );
}
