"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./IngredientsModal.module.scss";
import { MyIcon } from "@/components/icons/MyIcon";

type Ingredient = {
  id: number;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  selectedIngredients: Ingredient[];
  onSelect: (ingredients: Ingredient[]) => void;
};

export default function IngredientsModal({
  isOpen,
  onClose,
  ingredients,
  selectedIngredients,
  onSelect,
}: Props) {
  const [tempSelected, setTempSelected] = useState<Ingredient[]>(selectedIngredients);
  const [searchQuery, setSearchQuery] = useState("");

  const handleIngredientToggle = (ingredient: Ingredient) => {
    const isSelected = tempSelected.some((ing) => ing.id === ingredient.id);

    if (isSelected) {
      setTempSelected((prev) => prev.filter((ing) => ing.id !== ingredient.id));
    } else {
      setTempSelected((prev) => [...prev, ingredient]);
    }
  };

  const handleSave = () => {
    onSelect(tempSelected);
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className={styles.root} onClick={onClose}>
      <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} type="button" onClick={onClose}>
          <MyIcon name="close" size={40} color="gray" />
        </button>

        <h2 className={styles.title}>Select Ingredients</h2>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.selectedCount}>Selected: {tempSelected.length} ingredients</div>

        <div className={styles.ingredientsGrid}>
          {filteredIngredients.map((ingredient) => {
            const isSelected = tempSelected.some((ing) => ing.id === ingredient.id);

            return (
              <button
                key={ingredient.id}
                type="button"
                className={clsx(styles.ingredientCard, isSelected && styles.ingredientSelected)}
                onClick={() => handleIngredientToggle(ingredient)}
              >
                <div className={styles.ingredientContent}>
                  <span className={styles.ingredientName}>{ingredient.name}</span>
                  <span className={styles.ingredientPrice}>+${ingredient.price}</span>
                </div>
                {isSelected && (
                  <div className={styles.checkmark}>
                    <MyIcon name="complete" size={16} color="#4caf50" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredIngredients.length === 0 && (
          <div className={styles.noResults}>No ingredients found</div>
        )}

        <div className={styles.buttons}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Save Selection ({tempSelected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
