import { OrderStatus, PaymentStatus, PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function resetSequences() {
  console.log("Сбрасываем последовательности...");

  const tables = [
    "users",
    "accounts",
    "sessions",
    "verification_tokens",
    "clients",
    "categories",
    "products",
    "product_variants",
    "ingredients",
    "product_ingredients",
    "carts",
    "cart_items",
    "orders",
    "order_items",
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), 1, false);`,
      );
      console.log(`✅ Последовательность для ${table} сброшена`);
    } catch (error) {
      console.log(`ℹ️ Пропускаем ${table} (возможно, таблица пустая или нет последовательности)`);
    }
  }
}

async function main() {
  console.log("🚀 Начинаем seeding базы данных...");

  // 1. Очищаем базу (в правильном порядке из-за зависимостей)
  console.log("🧹 Очищаем базу данных...");

  await prisma.verificationToken.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.productIngredient.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ База очищена");

  // 2. Сбрасываем последовательности
  await resetSequences();

  // 3. Создаем пользователей для NextAuth
  console.log("👤 Создаем пользователей...");

  const hashedPassword = await hash("admin123", 10);
  const currentDate = new Date();

  // Администратор
  const admin = await prisma.user.create({
    data: {
      email: "admin@pizza.com",
      name: "Главный Админ",
      passwordHash: hashedPassword,
      emailVerified: currentDate,
      role: Role.ADMIN,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  });

  // Менеджер
  const manager = await prisma.user.create({
    data: {
      email: "manager@pizza.com",
      name: "Менеджер Ресторана",
      passwordHash: hashedPassword,
      emailVerified: currentDate,
      role: Role.MANAGER,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  });

  console.log("✅ Пользователи созданы");

  // 4. Создаем тестовые аккаунты для Google OAuth
  console.log("🔐 Создаем тестовые OAuth аккаунты...");

  // Аккаунт для админа (Google)
  await prisma.account.create({
    data: {
      userId: admin.id,
      type: "oauth",
      provider: "google",
      providerAccountId: `google_${admin.id}_${Date.now()}`,
      access_token: "test_access_token_admin",
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, // 7 дней
      token_type: "Bearer",
      scope: "email profile openid",
      id_token: "test_id_token_admin",
      session_state: "active",
    },
  });

  // Аккаунт для менеджера (Google)
  await prisma.account.create({
    data: {
      userId: manager.id,
      type: "oauth",
      provider: "google",
      providerAccountId: `google_${manager.id}_${Date.now()}`,
      access_token: "test_access_token_manager",
      expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
      token_type: "Bearer",
      scope: "email profile openid",
      id_token: "test_id_token_manager",
      session_state: "active",
    },
  });

  console.log("✅ OAuth аккаунты созданы");

  // 5. Создаем тестовые сессии
  console.log("🔑 Создаем тестовые сессии...");

  await prisma.session.create({
    data: {
      userId: admin.id,
      sessionToken: `admin_session_${Date.now()}_1`,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    },
  });

  await prisma.session.create({
    data: {
      userId: manager.id,
      sessionToken: `manager_session_${Date.now()}_1`,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Сессии созданы");

  // 6. Создаем категории
  console.log("📂 Создаем категории...");

  const categories = await prisma.category.createMany({
    data: [
      { name: "Пиццы", slug: "pizzas", order: 1, createdAt: currentDate },
      { name: "Напитки", slug: "drinks", order: 2, createdAt: currentDate },
      { name: "Завтраки", slug: "breakfasts", order: 3, createdAt: currentDate },
      { name: "Десерты", slug: "desserts", order: 4, createdAt: currentDate },
    ],
  });

  const pizzaCategory = await prisma.category.findFirst({ where: { slug: "pizzas" } });
  const drinksCategory = await prisma.category.findFirst({ where: { slug: "drinks" } });
  const breakfastCategory = await prisma.category.findFirst({ where: { slug: "breakfasts" } });
  const dessertsCategory = await prisma.category.findFirst({ where: { slug: "desserts" } });

  console.log("✅ Категории созданы");

  // 7. Создаем ингредиенты
  console.log("🧀 Создаем ингредиенты...");

  await prisma.ingredient.createMany({
    data: [
      // Для пицц
      {
        name: "Моцарелла",
        slug: "mozzarella",
        price: 25.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Пармезан",
        slug: "parmesan",
        price: 30.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Чеддер",
        slug: "cheddar",
        price: 28.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Голубой сыр",
        slug: "blue-cheese",
        price: 35.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Салями",
        slug: "salami",
        price: 40.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Ветчина",
        slug: "ham",
        price: 35.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Пепперони",
        slug: "pepperoni",
        price: 45.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Курица",
        slug: "chicken",
        price: 38.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Бекон",
        slug: "bacon",
        price: 42.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Говядина",
        slug: "beef",
        price: 50.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Креветки",
        slug: "shrimp",
        price: 65.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Тунец",
        slug: "tuna",
        price: 55.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Грибы",
        slug: "mushrooms",
        price: 20.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Маслины",
        slug: "olives",
        price: 25.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Помидоры",
        slug: "tomatoes",
        price: 18.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Лук",
        slug: "onion",
        price: 15.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Перец болгарский",
        slug: "bell-pepper",
        price: 22.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Ананас",
        slug: "pineapple",
        price: 28.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Шпинат",
        slug: "spinach",
        price: 20.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Базилик",
        slug: "basil",
        price: 15.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Чеснок",
        slug: "garlic",
        price: 10.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Орегано",
        slug: "oregano",
        price: 12.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },

      // Для десертов и завтраков
      {
        name: "Клубника",
        slug: "strawberry",
        price: 35.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Банан",
        slug: "banana",
        price: 20.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Шоколад",
        slug: "chocolate",
        price: 30.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Карамель",
        slug: "caramel",
        price: 25.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Мёд",
        slug: "honey",
        price: 20.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Сахарная пудра",
        slug: "powdered-sugar",
        price: 15.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Ваниль",
        slug: "vanilla",
        price: 18.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        name: "Корица",
        slug: "cinnamon",
        price: 12.0,
        isActive: true,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ],
  });

  // Получаем ID созданных ингредиентов
  const allIngredients = await prisma.ingredient.findMany();
  const ingredientMap = allIngredients.reduce(
    (acc, ing) => {
      acc[ing.slug] = ing.id;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("✅ Ингредиенты созданы");

  // 8. Создаем пиццы
  console.log("🍕 Создаем пиццы...");

  const pizzas = [
    {
      title: "Маргарита",
      slug: "margherita",
      description: "Классическая итальянская пицца с моцареллой и томатами",
      imageUrl: "/images/productsImages/pizzas/mixpizza.png",
      categoryId: pizzaCategory!.id,
      baseIngredients: ["mozzarella", "tomatoes", "basil"],
      extraIngredients: ["parmesan", "oregano", "garlic"],
      variants: [
        { size: "25см", price: 199 },
        { size: "30см", price: 249 },
        { size: "35см", price: 299 },
      ],
    },
    {
      title: "Пепперони",
      slug: "pepperoni",
      description: "Острая пицца с пепперони и сыром",
      imageUrl: "/images/productsImages/pizzas/pepperoni.png",
      categoryId: pizzaCategory!.id,
      baseIngredients: ["mozzarella", "pepperoni", "tomatoes"],
      extraIngredients: ["cheddar", "onion", "bell-pepper", "olives"],
      variants: [
        { size: "25см", price: 229 },
        { size: "30см", price: 279 },
        { size: "35см", price: 329 },
      ],
    },
    {
      title: "Четыре сыра",
      slug: "four-cheese",
      description: "Пицца с моцареллой, пармезаном, чеддером и голубым сыром",
      imageUrl: "/images/productsImages/pizzas/becon-cheese.png",
      categoryId: pizzaCategory!.id,
      baseIngredients: ["mozzarella", "parmesan", "cheddar", "blue-cheese"],
      extraIngredients: ["oregano", "basil"],
      variants: [
        { size: "25см", price: 249 },
        { size: "30см", price: 299 },
        { size: "35см", price: 349 },
      ],
    },
    {
      title: "Гавайская",
      slug: "hawaiian",
      description: "Пицца с ветчиной и ананасом",
      imageUrl: "/images/productsImages/pizzas/havai.png",
      categoryId: pizzaCategory!.id,
      baseIngredients: ["mozzarella", "ham", "pineapple"],
      extraIngredients: ["chicken", "bacon", "bell-pepper"],
      variants: [
        { size: "25см", price: 219 },
        { size: "30см", price: 269 },
        { size: "35см", price: 319 },
      ],
    },
    {
      title: "Мясная",
      slug: "meat-lovers",
      description: "Для настоящих мясоедов: салями, ветчина, бекон и курица",
      imageUrl: "/images/productsImages/pizzas/meat.png",
      categoryId: pizzaCategory!.id,
      baseIngredients: ["mozzarella", "salami", "ham", "bacon", "chicken"],
      extraIngredients: ["beef", "pepperoni", "onion", "mushrooms"],
      variants: [
        { size: "25см", price: 279 },
        { size: "30см", price: 329 },
        { size: "35см", price: 379 },
      ],
    },
  ];

  for (const pizza of pizzas) {
    const createdPizza = await prisma.product.create({
      data: {
        title: pizza.title,
        slug: pizza.slug,
        description: pizza.description,
        imageUrl: pizza.imageUrl,
        categoryId: pizza.categoryId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    // Создаем варианты пиццы
    for (const variant of pizza.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdPizza.id,
          size: variant.size,
          price: variant.price,
        },
      });
    }

    // Добавляем базовые ингредиенты
    for (const ingredientSlug of pizza.baseIngredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdPizza.id,
          ingredientId: ingredientMap[ingredientSlug],
          isDefault: true,
          isRemovable: true,
          isExtra: false,
        },
      });
    }

    // Добавляем дополнительные ингредиенты
    for (const ingredientSlug of pizza.extraIngredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdPizza.id,
          ingredientId: ingredientMap[ingredientSlug],
          isDefault: false,
          isRemovable: false,
          isExtra: true,
        },
      });
    }
  }

  console.log("✅ Пиццы созданы");

  // 9. Создаем напитки
  console.log("🥤 Создаем напитки...");

  const drinks = [
    {
      title: "Кола",
      slug: "cola",
      description: "Освежающий газированный напиток",
      imageUrl: "/images/productsImages/drinks/cola.jpg",
      categoryId: drinksCategory!.id,
      variants: [
        { size: "0.33л", price: 49 },
        { size: "0.5л", price: 69 },
        { size: "1л", price: 99 },
      ],
    },
    {
      title: "Фанта",
      slug: "fanta",
      description: "Апельсиновый газированный напиток",
      imageUrl: "/images/productsImages/drinks/fanta.jpg",
      categoryId: drinksCategory!.id,
      variants: [
        { size: "0.33л", price: 49 },
        { size: "0.5л", price: 69 },
      ],
    },
    {
      title: "Спрайт",
      slug: "sprite",
      description: "Лимонно-лаймовый газированный напиток",
      imageUrl: "/images/productsImages/drinks/sprite.jpg",
      categoryId: drinksCategory!.id,
      variants: [
        { size: "0.33л", price: 49 },
        { size: "0.5л", price: 69 },
      ],
    },
    {
      title: "Сок апельсиновый",
      slug: "orange-juice",
      description: "Натуральный апельсиновый сок",
      imageUrl: "/images/productsImages/drinks/juice.jpg",
      categoryId: drinksCategory!.id,
      variants: [
        { size: "0.2л", price: 59 },
        { size: "0.5л", price: 99 },
      ],
    },
    {
      title: "Вода негазированная",
      slug: "still-water",
      description: "Чистая питьевая вода",
      imageUrl: "/images/productsImages/drinks/water.jpg",
      categoryId: drinksCategory!.id,
      variants: [
        { size: "0.5л", price: 29 },
        { size: "1л", price: 49 },
      ],
    },
  ];

  for (const drink of drinks) {
    const createdDrink = await prisma.product.create({
      data: {
        title: drink.title,
        slug: drink.slug,
        description: drink.description,
        imageUrl: drink.imageUrl,
        categoryId: drink.categoryId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    for (const variant of drink.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdDrink.id,
          size: variant.size,
          price: variant.price,
        },
      });
    }
  }

  console.log("✅ Напитки созданы");

  // 10. Создаем завтраки
  console.log("🍳 Создаем завтраки...");

  const breakfasts = [
    {
      title: "Омлет с ветчиной",
      slug: "ham-omelette",
      description: "Пышный омлет с ветчиной и сыром",
      imageUrl: "/images/productsImages/breakfast/omlet-classic.png",
      categoryId: breakfastCategory!.id,
      baseIngredients: ["ham", "mozzarella", "tomatoes"],
      extraIngredients: ["bacon", "mushrooms", "onion"],
      variants: [
        { size: "Стандартный", price: 149 },
        { size: "Большой", price: 199 },
      ],
    },
    {
      title: "Блинчики с ягодами",
      slug: "pancakes-berries",
      description: "Нежные блинчики с клубникой и мёдом",
      imageUrl: "/images/productsImages/breakfast/omlet-classic.png",
      categoryId: breakfastCategory!.id,
      baseIngredients: ["strawberry", "honey"],
      extraIngredients: ["banana", "chocolate", "caramel"],
      variants: [
        { size: "3 шт", price: 129 },
        { size: "5 шт", price: 179 },
      ],
    },
    {
      title: "Тост с авокадо",
      slug: "avocado-toast",
      description: "Хрустящий тост с авокадо и яйцом пашот",
      imageUrl: "/images/productsImages/breakfast/omlet-classic.png",
      categoryId: breakfastCategory!.id,
      baseIngredients: ["tomatoes", "basil"],
      extraIngredients: ["bacon", "cheddar"],
      variants: [
        { size: "1 порция", price: 159 },
        { size: "2 порции", price: 279 },
      ],
    },
    {
      title: "Каша овсяная",
      slug: "oatmeal",
      description: "Овсяная каша с фруктами и орехами",
      imageUrl: "/images/productsImages/breakfast/omlet-classic.png",
      categoryId: breakfastCategory!.id,
      baseIngredients: ["honey", "cinnamon"],
      extraIngredients: ["banana", "strawberry", "chocolate"],
      variants: [
        { size: "Стандартная", price: 99 },
        { size: "Большая", price: 149 },
      ],
    },
    {
      title: "Сырники",
      slug: "cheese-pancakes",
      description: "Творожные сырники со сметаной",
      imageUrl: "/images/productsImages/breakfast/omlet-classic.png",
      categoryId: breakfastCategory!.id,
      baseIngredients: ["powdered-sugar", "vanilla"],
      extraIngredients: ["honey", "caramel", "strawberry"],
      variants: [
        { size: "3 шт", price: 139 },
        { size: "5 шт", price: 199 },
      ],
    },
  ];

  for (const breakfast of breakfasts) {
    const createdBreakfast = await prisma.product.create({
      data: {
        title: breakfast.title,
        slug: breakfast.slug,
        description: breakfast.description,
        imageUrl: breakfast.imageUrl,
        categoryId: breakfast.categoryId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    for (const variant of breakfast.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdBreakfast.id,
          size: variant.size,
          price: variant.price,
        },
      });
    }

    for (const ingredientSlug of breakfast.baseIngredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdBreakfast.id,
          ingredientId: ingredientMap[ingredientSlug],
          isDefault: true,
          isRemovable: true,
          isExtra: false,
        },
      });
    }

    for (const ingredientSlug of breakfast.extraIngredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdBreakfast.id,
          ingredientId: ingredientMap[ingredientSlug],
          isDefault: false,
          isRemovable: false,
          isExtra: true,
        },
      });
    }
  }

  console.log("✅ Завтраки созданы");

  // 11. Создаем десерты
  console.log("🍰 Создаем десерты...");

  const desserts = [
    {
      title: "Чизкейк Нью-Йорк",
      slug: "new-york-cheesecake",
      description: "Классический чизкейк с ягодным соусом",
      imageUrl: "/images/productsImages/desserts/cheese.jpg",
      categoryId: dessertsCategory!.id,
      baseIngredients: ["vanilla"],
      extraIngredients: ["strawberry", "caramel", "chocolate"],
      variants: [
        { size: "Кусок", price: 169 },
        { size: "Целый", price: 1299 },
      ],
    },
    {
      title: "Тирамису",
      slug: "tiramisu",
      description: "Итальянский десерт с кофе и маскарпоне",
      imageUrl: "/images/productsImages/desserts/tiramisu.jpg",
      categoryId: dessertsCategory!.id,
      baseIngredients: ["vanilla", "powdered-sugar"],
      extraIngredients: ["chocolate", "caramel"],
      variants: [
        { size: "Порция", price: 189 },
        { size: "На двоих", price: 329 },
      ],
    },
    {
      title: "Брауни",
      slug: "brownie",
      description: "Шоколадный брауни с орехами",
      imageUrl: "/images/productsImages/desserts/brauni.jpg",
      categoryId: dessertsCategory!.id,
      baseIngredients: ["chocolate"],
      extraIngredients: ["caramel", "vanilla", "powdered-sugar"],
      variants: [
        { size: "Кусок", price: 149 },
        { size: "4 куска", price: 499 },
      ],
    },
    {
      title: "Мороженое ванильное",
      slug: "vanilla-ice-cream",
      description: "Домашнее ванильное мороженое",
      imageUrl: "/images/productsImages/desserts/vanilla.jpg",
      categoryId: dessertsCategory!.id,
      baseIngredients: ["vanilla"],
      extraIngredients: ["chocolate", "caramel", "strawberry", "banana"],
      variants: [
        { size: "1 шарик", price: 79 },
        { size: "3 шарика", price: 199 },
      ],
    },
    {
      title: "Панна котта",
      slug: "panna-cotta",
      description: "Нежный итальянский десерт с ягодным соусом",
      imageUrl: "/images/productsImages/desserts/panna-cotta.jpg",
      categoryId: dessertsCategory!.id,
      baseIngredients: ["vanilla"],
      extraIngredients: ["strawberry", "caramel", "chocolate"],
      variants: [{ size: "Порция", price: 159 }],
    },
  ];

  for (const dessert of desserts) {
    const createdDessert = await prisma.product.create({
      data: {
        title: dessert.title,
        slug: dessert.slug,
        description: dessert.description,
        imageUrl: dessert.imageUrl,
        categoryId: dessert.categoryId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    for (const variant of dessert.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdDessert.id,
          size: variant.size,
          price: variant.price,
        },
      });
    }

    for (const ingredientSlug of dessert.baseIngredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdDessert.id,
          ingredientId: ingredientMap[ingredientSlug],
          isDefault: true,
          isRemovable: true,
          isExtra: false,
        },
      });
    }

    for (const ingredientSlug of dessert.extraIngredients) {
      await prisma.productIngredient.create({
        data: {
          productId: createdDessert.id,
          ingredientId: ingredientMap[ingredientSlug],
          isDefault: false,
          isRemovable: false,
          isExtra: true,
        },
      });
    }
  }

  console.log("✅ Десерты созданы");

  // 12. Создаем клиентов
  console.log("👥 Создаем клиентов...");

  const clients = [
    {
      token: "client-token-001",
      name: "Иван Петров",
      phone: "+380991234567",
      email: "ivan@example.com",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      token: "client-token-002",
      name: "Мария Сидорова",
      phone: "+380992345678",
      email: "maria@example.com",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      token: "client-token-003",
      name: "Алексей Коваленко",
      phone: "+380993456789",
      email: "alex@example.com",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      token: "client-token-004",
      name: "Елена Иванова",
      phone: "+380994567890",
      email: "elena@example.com",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];

  const createdClients = [];
  for (const clientData of clients) {
    const client = await prisma.client.create({
      data: clientData,
    });
    createdClients.push(client);
  }

  console.log("✅ Клиенты созданы");

  // 13. Создаем корзины для клиентов
  console.log("🛒 Создаем корзины...");

  for (const client of createdClients) {
    await prisma.cart.create({
      data: {
        clientId: client.id,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  }

  console.log("✅ Корзины созданы");

  // 14. Получаем все продукты и варианты
  const allProducts = await prisma.product.findMany({
    include: { variants: true },
  });

  const getProduct = (slug: string) => {
    return allProducts.find((p) => p.slug === slug)!;
  };

  const getVariant = (productSlug: string, variantIndex: number = 0) => {
    return getProduct(productSlug).variants[variantIndex];
  };

  // 15. Создаем заказы
  console.log("📦 Создаем заказы...");

  const timestamp = Date.now();
  const orders = [
    // Заказ 1: Новый заказ (Иван)
    {
      orderNumber: `ORD-${timestamp}-001`,
      clientId: createdClients[0].id,
      customerName: "Иван Петров",
      customerPhone: "+380991234567",
      customerEmail: "ivan@example.com",
      deliveryAddress: "ул. Главная, 10, кв. 5",
      deliveryNotes: "Позвонить за 15 минут",
      status: OrderStatus.NEW,
      subtotal: 548,
      total: 548,
      paymentStatus: PaymentStatus.PENDING,
      notes: "Новый заказ",
      items: [
        {
          productId: getProduct("pepperoni").id,
          variantId: getVariant("pepperoni", 1).id,
          title: "Пепперони",
          description: "Острая пицца с пепперони и сыром",
          imageUrl: "/images/productsImages/pizzas/pepperoni.png",
          price: 279,
          quantity: 1,
        },
        {
          productId: getProduct("cola").id,
          variantId: getVariant("cola", 1).id,
          title: "Кола",
          description: "Освежающий газированный напиток",
          imageUrl: "/images/productsImages/drinks/cola.jpg",
          price: 69,
          quantity: 1,
        },
        {
          productId: getProduct("new-york-cheesecake").id,
          variantId: getVariant("new-york-cheesecake", 0).id,
          title: "Чизкейк Нью-Йорк",
          description: "Классический чизкейк с ягодным соусом",
          imageUrl: "/images/productsImages/desserts/cheese.jpg",
          price: 169,
          quantity: 1,
        },
      ],
    },

    // Заказ 2: В обработке (Мария)
    {
      orderNumber: `ORD-${timestamp}-002`,
      clientId: createdClients[1].id,
      customerName: "Мария Сидорова",
      customerPhone: "+380992345678",
      customerEmail: "maria@example.com",
      deliveryAddress: "ул. Центральная, 25, кв. 12",
      deliveryNotes: "Без лука и оливок",
      status: OrderStatus.PENDING,
      subtotal: 747,
      total: 747,
      paymentStatus: PaymentStatus.PAID,
      notes: "Оплачено картой",
      items: [
        {
          productId: getProduct("margherita").id,
          variantId: getVariant("margherita", 2).id,
          title: "Маргарита",
          description: "Классическая итальянская пицца с моцареллой и томатами",
          imageUrl: "/images/productsImages/pizzas/mixpizza.png",
          price: 299,
          quantity: 2,
        },
        {
          productId: getProduct("orange-juice").id,
          variantId: getVariant("orange-juice", 1).id,
          title: "Сок апельсиновый",
          description: "Натуральный апельсиновый сок",
          imageUrl: "/images/productsImages/drinks/juice.jpg",
          price: 99,
          quantity: 1,
        },
      ],
    },

    // Заказ 3: Готовится (Алексей)
    {
      orderNumber: `ORD-${timestamp}-003`,
      clientId: createdClients[2].id,
      customerName: "Алексей Коваленко",
      customerPhone: "+380993456789",
      customerEmail: "alex@example.com",
      deliveryAddress: "ул. Школьная, 45",
      deliveryNotes: "Добавить острый соус",
      status: OrderStatus.IN_PROGRESS,
      subtotal: 677,
      total: 677,
      paymentStatus: PaymentStatus.PAID,
      notes: "В процессе приготовления",
      items: [
        {
          productId: getProduct("meat-lovers").id,
          variantId: getVariant("meat-lovers", 2).id,
          title: "Мясная",
          description: "Для настоящих мясоедов: салями, ветчина, бекон и курица",
          imageUrl: "/images/productsImages/pizzas/meat.png",
          price: 379,
          quantity: 1,
        },
        {
          productId: getProduct("hawaiian").id,
          variantId: getVariant("hawaiian", 1).id,
          title: "Гавайская",
          description: "Пицца с ветчиной и ананасом",
          imageUrl: "/images/productsImages/pizzas/havai.png",
          price: 269,
          quantity: 1,
        },
        {
          productId: getProduct("sprite").id,
          variantId: getVariant("sprite", 1).id,
          title: "Спрайт",
          description: "Лимонно-лаймовый газированный напиток",
          imageUrl: "/images/productsImages/drinks/sprite.jpg",
          price: 69,
          quantity: 1,
        },
      ],
    },

    // Заказ 4: Завершен (Елена)
    {
      orderNumber: `ORD-${timestamp}-004`,
      clientId: createdClients[3].id,
      customerName: "Елена Иванова",
      customerPhone: "+380994567890",
      customerEmail: "elena@example.com",
      deliveryAddress: "ул. Садовая, 15, кв. 3",
      deliveryNotes: "Вегетарианская пицца, добавить овощей",
      status: OrderStatus.COMPLETED,
      subtotal: 418,
      total: 418,
      paymentStatus: PaymentStatus.PAID,
      notes: "Успешно доставлен",
      items: [
        {
          productId: getProduct("margherita").id,
          variantId: getVariant("margherita", 0).id,
          title: "Маргарита",
          description: "Классическая итальянская пицца с моцареллой и томатами",
          imageUrl: "/images/productsImages/pizzas/mixpizza.png",
          price: 199,
          quantity: 2,
        },
        {
          productId: getProduct("still-water").id,
          variantId: getVariant("still-water", 1).id,
          title: "Вода негазированная",
          description: "Чистая питьевая вода",
          imageUrl: "/images/productsImages/drinks/water.jpg",
          price: 49,
          quantity: 1,
        },
      ],
    },
  ];

  for (const orderData of orders) {
    await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        clientId: orderData.clientId,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        deliveryAddress: orderData.deliveryAddress,
        deliveryNotes: orderData.deliveryNotes,
        status: orderData.status,
        subtotal: orderData.subtotal,
        total: orderData.total,
        paymentStatus: orderData.paymentStatus,
        notes: orderData.notes,
        createdAt: currentDate,
        updatedAt: currentDate,
        items: {
          create: orderData.items,
        },
      },
    });
  }

  console.log("✅ Заказы созданы");

  // 16. Обновляем статистику клиентов
  console.log("📊 Обновляем статистику клиентов...");

  for (let i = 0; i < createdClients.length; i++) {
    const client = createdClients[i];
    const clientOrders = orders.filter((order) => order.clientId === client.id);
    const totalSpent = clientOrders.reduce((sum, order) => sum + Number(order.total), 0);

    await prisma.client.update({
      where: { id: client.id },
      data: {
        totalOrders: clientOrders.length,
        totalSpent: totalSpent,
        lastOrderAt: clientOrders.length > 0 ? currentDate : null,
      },
    });
  }

  console.log("✅ Статистика клиентов обновлена");

  console.log("\n🎉 SEEDING УСПЕШНО ЗАВЕРШЕН!");
  console.log("📊 Создано:");
  console.log(`   👤 ${await prisma.user.count()} пользователей`);
  console.log(`   🔐 ${await prisma.account.count()} OAuth аккаунтов`);
  console.log(`   🔑 ${await prisma.session.count()} сессий`);
  console.log(`   📂 ${await prisma.category.count()} категорий`);
  console.log(`   🧀 ${await prisma.ingredient.count()} ингредиентов`);
  console.log(`   🍕 ${await prisma.product.count()} продуктов`);
  console.log(`   📦 ${await prisma.order.count()} заказов`);
  console.log(`   👥 ${await prisma.client.count()} клиентов`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
