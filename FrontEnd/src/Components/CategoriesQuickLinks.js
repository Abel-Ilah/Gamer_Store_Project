import { HorizontalScroll } from "./HorizontalScroll";
import { Category } from "./Category";
import Title from "./Title";

import { useCategories } from "../contexts/CategoriesProvider";

export function CategoriesQuickLinks() {
  const categories = useCategories();

  return categories && categories.length > 0 ? (
    <div className="py-4">
      <Title title="All Categories" />
      <div className="pt-3">
        <HorizontalScroll>
          {categories.map((c) => {
            return <Category category={c} key={c.id} />;
          })}
        </HorizontalScroll>
      </div>
    </div>
  ) : null;
}
