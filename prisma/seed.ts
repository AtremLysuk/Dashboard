// prisma/seed.ts
import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем сидирование базы данных...");

  // ========== ОЧИСТКА БАЗЫ (ОПЦИОНАЛЬНО) ==========
  console.log("🧹 Очищаем базу данных...");
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      } catch (error) {
        console.log(`Ошибка очистки таблицы ${tablename}:`, error);
      }
    }
  }
  console.log("✅ База очищена");

  // ========== ПОЛЬЗОВАТЕЛИ (Администрация) ==========
  console.log("👥 Создаем пользователей...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@pizzeria.com",
      name: "Главный Администратор",
      role: Role.ADMIN,
      passwordHash: "$2b$10$hashed_password_example_1",
    },
  });

  const manager1 = await prisma.user.create({
    data: {
      email: "manager1@pizzeria.com",
      name: "Иван Менеджер",
      role: Role.MANAGER,
      passwordHash: "$2b$10$hashed_password_example_2",
    },
  });

  const manager2 = await prisma.user.create({
    data: {
      email: "manager2@pizzeria.com",
      name: "Мария Менеджер",
      role: Role.MANAGER,
      passwordHash: "$2b$10$hashed_password_example_3",
    },
  });

  console.log(`✅ Создано пользователей: 3`);

  // ========== КАТЕГОРИИ ==========
  console.log("📂 Создаем категории...");
  const categories = await prisma.category.createMany({
    data: [
      { name: "Пиццы", slug: "pizzas", order: 1 },
      { name: "Напитки", slug: "drinks", order: 2 },
      { name: "Десерты", slug: "desserts", order: 3 },
      { name: "Закуски", slug: "snacks", order: 4 },
      { name: "Соусы", slug: "sauces", order: 5 },
    ],
  });

  const [pizzasCategory, drinksCategory, dessertsCategory, snacksCategory, saucesCategory] =
    await prisma.category.findMany({ orderBy: { order: "asc" } });

  console.log(`✅ Создано категорий: 5`);

  // ========== ИНГРЕДИЕНТЫ ==========
  console.log("🧀 Создаем ингредиенты...");

  // Создаем каждый ингредиент отдельно, чтобы получить его уникальный id
  const mozzarella = await prisma.ingredient.create({
    data: { name: "Моцарелла", slug: "mozzarella", price: 25 },
  });
  const parmesan = await prisma.ingredient.create({
    data: { name: "Пармезан", slug: "parmesan", price: 35 },
  });
  const cheddar = await prisma.ingredient.create({
    data: { name: "Чеддер", slug: "cheddar", price: 30 },
  });
  const dorBlue = await prisma.ingredient.create({
    data: { name: "Дор Блю", slug: "dor-blue", price: 40 },
  });
  const gouda = await prisma.ingredient.create({
    data: { name: "Гауда", slug: "gouda", price: 28 },
  });
  const pepperoni = await prisma.ingredient.create({
    data: { name: "Пепперони", slug: "pepperoni", price: 45 },
  });
  const ham = await prisma.ingredient.create({
    data: { name: "Ветчина", slug: "ham", price: 40 },
  });
  const bacon = await prisma.ingredient.create({
    data: { name: "Бекон", slug: "bacon", price: 50 },
  });
  const chicken = await prisma.ingredient.create({
    data: { name: "Курица", slug: "chicken", price: 35 },
  });
  const salami = await prisma.ingredient.create({
    data: { name: "Салями", slug: "salami", price: 42 },
  });
  const beef = await prisma.ingredient.create({
    data: { name: "Говядина", slug: "beef", price: 55 },
  });
  const mushrooms = await prisma.ingredient.create({
    data: { name: "Грибы", slug: "mushrooms", price: 20 },
  });
  const olives = await prisma.ingredient.create({
    data: { name: "Маслины", slug: "olives", price: 25 },
  });
  const tomatoes = await prisma.ingredient.create({
    data: { name: "Помидоры", slug: "tomatoes", price: 18 },
  });
  const onion = await prisma.ingredient.create({
    data: { name: "Лук", slug: "onion", price: 15 },
  });
  const bellPepper = await prisma.ingredient.create({
    data: { name: "Перец болгарский", slug: "bell-pepper", price: 22 },
  });
  const pineapple = await prisma.ingredient.create({
    data: { name: "Ананас", slug: "pineapple", price: 28 },
  });
  const corn = await prisma.ingredient.create({
    data: { name: "Кукуруза", slug: "corn", price: 18 },
  });
  const spinach = await prisma.ingredient.create({
    data: { name: "Шпинат", slug: "spinach", price: 25 },
  });
  const seafood = await prisma.ingredient.create({
    data: { name: "Морепродукты", slug: "seafood", price: 65 },
  });
  const nuts = await prisma.ingredient.create({
    data: { name: "Орехи", slug: "nuts", price: 30 },
  });

  const allIngredients = await prisma.ingredient.findMany();
  console.log(`✅ Создано ингредиентов: ${allIngredients.length}`);

  // ========== ПРОДУКТЫ: ПИЦЦЫ ==========
  console.log("🍕 Создаем пиццы...");

  // Создаем каждую пиццу отдельно
  const margarita = await prisma.product.create({
    data: {
      title: "Маргарита",
      slug: "margarita",
      description: "Классическая итальянская пицца с томатами и моцареллой",
      imageUrl: "/pizzas/margarita.jpg",
      basePrice: 250,
      categoryId: pizzasCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const pepperoniPizza = await prisma.product.create({
    data: {
      title: "Пепперони",
      slug: "pepperoni",
      description: "Острая пицца с пепперони и сыром",
      imageUrl: "/pizzas/pepperoni.jpg",
      basePrice: 280,
      categoryId: pizzasCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const fourCheese = await prisma.product.create({
    data: {
      title: "4 Сыра",
      slug: "4-cheese",
      description: "Пицца с моцареллой, пармезаном, дор блю и чеддером",
      imageUrl: "/pizzas/4-cheese.jpg",
      basePrice: 320,
      categoryId: pizzasCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const hawaiian = await prisma.product.create({
    data: {
      title: "Гавайская",
      slug: "hawaiian",
      description: "Пицца с ветчиной и ананасом",
      imageUrl: "/pizzas/hawaiian.jpg",
      basePrice: 270,
      categoryId: pizzasCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const meat = await prisma.product.create({
    data: {
      title: "Мясная",
      slug: "meat",
      description: "Пицца с пепперони, ветчиной, беконом и говядиной",
      imageUrl: "/pizzas/meat.jpg",
      basePrice: 350,
      categoryId: pizzasCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const vegetarian = await prisma.product.create({
    data: {
      title: "Вегетарианская",
      slug: "vegetarian",
      description: "Пицца с грибами, перцем, помидорами и маслинами",
      imageUrl: "/pizzas/vegetarian.jpg",
      basePrice: 260,
      categoryId: pizzasCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const seafoodPizza = await prisma.product.create({
    data: {
      title: "Морская",
      slug: "seafood",
      description: "Пицца с морепродуктами и сыром",
      imageUrl: "/pizzas/seafood.jpg",
      basePrice: 380,
      categoryId: pizzasCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const createdPizzas = [
    margarita,
    pepperoniPizza,
    fourCheese,
    hawaiian,
    meat,
    vegetarian,
    seafoodPizza,
  ];
  console.log(`✅ Создано пицц: ${createdPizzas.length}`);

  // ========== ПРОДУКТЫ: НАПИТКИ ==========
  console.log("🥤 Создаем напитки...");

  const cocaCola = await prisma.product.create({
    data: {
      title: "Кока-Кола",
      slug: "coca-cola",
      description: "Газированный напиток 0.5л",
      imageUrl: "/drinks/coca-cola.jpg",
      basePrice: 60,
      categoryId: drinksCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const fanta = await prisma.product.create({
    data: {
      title: "Фанта",
      slug: "fanta",
      description: "Апельсиновый газированный напиток 0.5л",
      imageUrl: "/drinks/fanta.jpg",
      basePrice: 60,
      categoryId: drinksCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const sprite = await prisma.product.create({
    data: {
      title: "Спрайт",
      slug: "sprite",
      description: "Лимонный газированный напиток 0.5л",
      imageUrl: "/drinks/sprite.jpg",
      basePrice: 60,
      categoryId: drinksCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const mineralWater = await prisma.product.create({
    data: {
      title: "Вода минеральная",
      slug: "mineral-water",
      description: "Вода без газа 0.5л",
      imageUrl: "/drinks/water.jpg",
      basePrice: 40,
      categoryId: drinksCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const orangeJuice = await prisma.product.create({
    data: {
      title: "Сок апельсиновый",
      slug: "orange-juice",
      description: "Свежевыжатый апельсиновый сок 0.3л",
      imageUrl: "/drinks/orange-juice.jpg",
      basePrice: 80,
      categoryId: drinksCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const createdDrinks = [cocaCola, fanta, sprite, mineralWater, orangeJuice];
  console.log(`✅ Создано напитков: ${createdDrinks.length}`);

  // ========== ПРОДУКТЫ: ДЕСЕРТЫ ==========
  console.log("🍰 Создаем десерты...");

  const tiramisu = await prisma.product.create({
    data: {
      title: "Тирамису",
      slug: "tiramisu",
      description: "Итальянский десерт с кофе и маскарпоне",
      imageUrl: "/desserts/tiramisu.jpg",
      basePrice: 120,
      categoryId: dessertsCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const cheesecake = await prisma.product.create({
    data: {
      title: "Чизкейк",
      slug: "cheesecake",
      description: "Классический чизкейк Нью-Йорк",
      imageUrl: "/desserts/cheesecake.jpg",
      basePrice: 140,
      categoryId: dessertsCategory.id,
      isFeatured: true,
      isActive: true,
    },
  });

  const vanillaIceCream = await prisma.product.create({
    data: {
      title: "Мороженое ванильное",
      slug: "vanilla-ice-cream",
      description: "Домашнее ванильное мороженое",
      imageUrl: "/desserts/ice-cream.jpg",
      basePrice: 70,
      categoryId: dessertsCategory.id,
      isFeatured: false,
      isActive: true,
    },
  });

  const createdDesserts = [tiramisu, cheesecake, vanillaIceCream];
  console.log(`✅ Создано десертов: ${createdDesserts.length}`);

  // ========== ВАРИАНТЫ ПРОДУКТОВ ==========
  console.log("📏 Создаем варианты продуктов...");

  // Варианты для пицц
  const margaritaSmall = await prisma.productVariant.create({
    data: {
      productId: margarita.id,
      size: "30 см",
      price: 0,
    },
  });

  const margaritaLarge = await prisma.productVariant.create({
    data: {
      productId: margarita.id,
      size: "40 см",
      price: 80,
    },
  });

  const pepperoniSmall = await prisma.productVariant.create({
    data: {
      productId: pepperoniPizza.id,
      size: "30 см",
      price: 0,
    },
  });

  const pepperoniLarge = await prisma.productVariant.create({
    data: {
      productId: pepperoniPizza.id,
      size: "40 см",
      price: 80,
    },
  });

  const fourCheeseSmall = await prisma.productVariant.create({
    data: {
      productId: fourCheese.id,
      size: "30 см",
      price: 0,
    },
  });

  const fourCheeseLarge = await prisma.productVariant.create({
    data: {
      productId: fourCheese.id,
      size: "40 см",
      price: 80,
    },
  });

  const hawaiianSmall = await prisma.productVariant.create({
    data: {
      productId: hawaiian.id,
      size: "30 см",
      price: 0,
    },
  });

  const hawaiianLarge = await prisma.productVariant.create({
    data: {
      productId: hawaiian.id,
      size: "40 см",
      price: 80,
    },
  });

  const meatSmall = await prisma.productVariant.create({
    data: {
      productId: meat.id,
      size: "30 см",
      price: 0,
    },
  });

  const meatLarge = await prisma.productVariant.create({
    data: {
      productId: meat.id,
      size: "40 см",
      price: 80,
    },
  });

  const vegetarianSmall = await prisma.productVariant.create({
    data: {
      productId: vegetarian.id,
      size: "30 см",
      price: 0,
    },
  });

  const vegetarianLarge = await prisma.productVariant.create({
    data: {
      productId: vegetarian.id,
      size: "40 см",
      price: 80,
    },
  });

  const seafoodSmall = await prisma.productVariant.create({
    data: {
      productId: seafoodPizza.id,
      size: "30 см",
      price: 0,
    },
  });

  const seafoodLarge = await prisma.productVariant.create({
    data: {
      productId: seafoodPizza.id,
      size: "40 см",
      price: 80,
    },
  });

  // Варианты для напитков
  const cocaColaVariant = await prisma.productVariant.create({
    data: {
      productId: cocaCola.id,
      size: "0.5 л",
      price: 0,
    },
  });

  const fantaVariant = await prisma.productVariant.create({
    data: {
      productId: fanta.id,
      size: "0.5 л",
      price: 0,
    },
  });

  const spriteVariant = await prisma.productVariant.create({
    data: {
      productId: sprite.id,
      size: "0.5 л",
      price: 0,
    },
  });

  const mineralWaterVariant = await prisma.productVariant.create({
    data: {
      productId: mineralWater.id,
      size: "0.5 л",
      price: 0,
    },
  });

  const orangeJuiceVariant = await prisma.productVariant.create({
    data: {
      productId: orangeJuice.id,
      size: "0.3 л",
      price: 0,
    },
  });

  // Варианты для десертов
  const tiramisuVariant = await prisma.productVariant.create({
    data: {
      productId: tiramisu.id,
      size: "Порция",
      price: 0,
    },
  });

  const cheesecakeVariant = await prisma.productVariant.create({
    data: {
      productId: cheesecake.id,
      size: "Порция",
      price: 0,
    },
  });

  const iceCreamVariant = await prisma.productVariant.create({
    data: {
      productId: vanillaIceCream.id,
      size: "Порция",
      price: 0,
    },
  });

  // Собираем все варианты в массивы для удобства
  const pizzaVariants = [
    margaritaSmall,
    margaritaLarge,
    pepperoniSmall,
    pepperoniLarge,
    fourCheeseSmall,
    fourCheeseLarge,
    hawaiianSmall,
    hawaiianLarge,
    meatSmall,
    meatLarge,
    vegetarianSmall,
    vegetarianLarge,
    seafoodSmall,
    seafoodLarge,
  ];

  const drinkVariants = [
    cocaColaVariant,
    fantaVariant,
    spriteVariant,
    mineralWaterVariant,
    orangeJuiceVariant,
  ];

  const dessertVariants = [tiramisuVariant, cheesecakeVariant, iceCreamVariant];

  const allVariants = [...pizzaVariants, ...drinkVariants, ...dessertVariants];
  console.log(`✅ Создано вариантов продуктов: ${allVariants.length}`);

  // ========== ПРИВЯЗКА ИНГРЕДИЕНТОВ К ПРОДУКТАМ ==========
  console.log("🔗 Привязываем ингредиенты к продуктам...");

  // Ингредиенты для каждой пиццы
  const pizzaIngredients = [
    // Маргарита
    {
      productId: margarita.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: margarita.id,
      ingredientId: tomatoes.id,
      isDefault: true,
      isRemovable: false,
    },

    // Пепперони
    {
      productId: pepperoniPizza.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: pepperoniPizza.id,
      ingredientId: pepperoni.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: pepperoniPizza.id,
      ingredientId: tomatoes.id,
      isDefault: false,
      isExtra: true,
      isRemovable: true,
    },

    // 4 Сыра
    {
      productId: fourCheese.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: fourCheese.id,
      ingredientId: parmesan.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: fourCheese.id,
      ingredientId: cheddar.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: fourCheese.id,
      ingredientId: dorBlue.id,
      isDefault: true,
      isRemovable: false,
    },

    // Гавайская
    {
      productId: hawaiian.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: hawaiian.id,
      ingredientId: ham.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: hawaiian.id,
      ingredientId: pineapple.id,
      isDefault: true,
      isRemovable: true,
    },

    // Мясная
    {
      productId: meat.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: meat.id,
      ingredientId: pepperoni.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: meat.id,
      ingredientId: ham.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: meat.id,
      ingredientId: bacon.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: meat.id,
      ingredientId: beef.id,
      isDefault: false,
      isExtra: true,
      isRemovable: true,
    },

    // Вегетарианская
    {
      productId: vegetarian.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: vegetarian.id,
      ingredientId: mushrooms.id,
      isDefault: true,
      isRemovable: true,
    },
    {
      productId: vegetarian.id,
      ingredientId: bellPepper.id,
      isDefault: true,
      isRemovable: true,
    },
    {
      productId: vegetarian.id,
      ingredientId: tomatoes.id,
      isDefault: true,
      isRemovable: true,
    },
    {
      productId: vegetarian.id,
      ingredientId: olives.id,
      isDefault: true,
      isRemovable: true,
    },

    // Морская
    {
      productId: seafoodPizza.id,
      ingredientId: mozzarella.id,
      isDefault: true,
      isRemovable: false,
    },
    {
      productId: seafoodPizza.id,
      ingredientId: seafood.id,
      isDefault: true,
      isRemovable: false,
    },
  ];

  await prisma.productIngredient.createMany({
    data: pizzaIngredients,
  });

  console.log(`✅ Привязано ингредиентов к продуктам: ${pizzaIngredients.length}`);

  // ========== КЛИЕНТЫ ==========
  console.log("👤 Создаем клиентов...");

  const client1 = await prisma.client.create({
    data: {
      token: "client_token_001",
      name: "Алексей Петров",
      phone: "+380991111111",
      email: "alexey@example.com",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      token: "client_token_002",
      name: "Мария Иванова",
      phone: "+380992222222",
      email: "maria@example.com",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      token: "client_token_003",
      name: "Дмитрий Сидоров",
      phone: "+380993333333",
      email: "dmitry@example.com",
    },
  });

  const client4 = await prisma.client.create({
    data: {
      token: "client_token_004",
      name: "Анна Коваленко",
      phone: "+380994444444",
      email: "anna@example.com",
    },
  });

  const client5 = await prisma.client.create({
    data: {
      token: "client_token_005",
      name: "Владимир Шевченко",
      phone: "+380995555555",
      email: "vladimir@example.com",
    },
  });

  const allClients = [client1, client2, client3, client4, client5];
  console.log(`✅ Создано клиентов: ${allClients.length}`);

  // ========== КОРЗИНЫ ==========
  console.log("🛒 Создаем корзины...");

  const cart1 = await prisma.cart.create({
    data: { clientId: client1.id },
  });

  const cart2 = await prisma.cart.create({
    data: { clientId: client2.id },
  });

  const cart3 = await prisma.cart.create({
    data: { clientId: client3.id },
  });

  const cart4 = await prisma.cart.create({
    data: { clientId: client4.id },
  });

  const cart5 = await prisma.cart.create({
    data: { clientId: client5.id },
  });

  const carts = [cart1, cart2, cart3, cart4, cart5];
  console.log(`✅ Создано корзин: ${carts.length}`);

  // ========== ТОВАРЫ В КОРЗИНАХ ==========
  console.log("📦 Добавляем товары в корзины...");

  // Добавим товары в корзины
  await prisma.cartItem.createMany({
    data: [
      // Корзина 1 - Алексей
      {
        cartId: cart1.id,
        productId: margarita.id,
        variantId: margaritaSmall.id,
        quantity: 2,
        price: 250 * 2,
        addedIngredients: JSON.stringify([{ id: olives.id, name: "Маслины", price: 25 }]),
      },
      {
        cartId: cart1.id,
        productId: cocaCola.id,
        variantId: cocaColaVariant.id,
        quantity: 1,
        price: 60,
      },

      // Корзина 2 - Мария
      {
        cartId: cart2.id,
        productId: pepperoniPizza.id,
        variantId: pepperoniLarge.id,
        quantity: 1,
        price: 280 + 80,
        addedIngredients: JSON.stringify([
          { id: bacon.id, name: "Бекон", price: 50 },
          { id: mushrooms.id, name: "Грибы", price: 20 },
        ]),
      },
      {
        cartId: cart2.id,
        productId: tiramisu.id,
        variantId: tiramisuVariant.id,
        quantity: 1,
        price: 120,
      },

      // Корзина 3 - Дмитрий
      {
        cartId: cart3.id,
        productId: hawaiian.id,
        variantId: hawaiianSmall.id,
        quantity: 3,
        price: 270 * 3,
        removedIngredients: JSON.stringify([{ id: pineapple.id, name: "Ананас" }]),
        addedIngredients: JSON.stringify([{ id: chicken.id, name: "Курица", price: 35 }]),
      },

      // Корзина 4 - Анна
      {
        cartId: cart4.id,
        productId: vegetarian.id,
        variantId: vegetarianLarge.id,
        quantity: 1,
        price: 260 + 80,
        removedIngredients: JSON.stringify([{ id: olives.id, name: "Маслины" }]),
        addedIngredients: JSON.stringify([{ id: spinach.id, name: "Шпинат", price: 25 }]),
      },
      {
        cartId: cart4.id,
        productId: orangeJuice.id,
        variantId: orangeJuiceVariant.id,
        quantity: 2,
        price: 80 * 2,
      },

      // Корзина 5 - Владимир
      {
        cartId: cart5.id,
        productId: meat.id,
        variantId: meatLarge.id,
        quantity: 1,
        price: 350 + 80,
        addedIngredients: JSON.stringify([
          { id: beef.id, name: "Говядина", price: 55 },
          { id: cheddar.id, name: "Чеддер", price: 30 },
        ]),
      },
      {
        cartId: cart5.id,
        productId: sprite.id,
        variantId: spriteVariant.id,
        quantity: 1,
        price: 60,
      },
      {
        cartId: cart5.id,
        productId: cheesecake.id,
        variantId: cheesecakeVariant.id,
        quantity: 1,
        price: 140,
      },
    ],
  });

  console.log("✅ Добавлены товары в корзины");

  // ========== ЗАКАЗЫ ==========
  console.log("📋 Создаем заказы...");

  const orders = [];
  const orderStatuses: OrderStatus[] = ["NEW", "PENDING", "IN_PROGRESS", "COMPLETED"];
  const paymentStatuses: PaymentStatus[] = ["PENDING", "PAID", "FAILED"];

  for (let i = 0; i < 8; i++) {
    const client = allClients[i % allClients.length];
    const product = createdPizzas[i % createdPizzas.length];
    const variant = pizzaVariants[(i * 2) % pizzaVariants.length]; // Берем разные варианты

    const orderNumber = `ORD-${1000 + i}`;
    const subtotal = 300 + i * 50;
    const deliveryFee = i % 2 === 0 ? 50 : 0;
    const total = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientId: client.id,
        customerName: client.name || `Клиент ${i + 1}`,
        customerPhone: client.phone || `+38099000000${i}`,
        customerEmail: client.email || `client${i}@example.com`,
        deliveryAddress: `ул. Примерная, д. ${i + 1}, кв. ${(i % 5) + 1}`,
        deliveryNotes: i % 3 === 0 ? "Позвонить за 15 минут" : null,
        status: orderStatuses[i % orderStatuses.length],
        paymentStatus: paymentStatuses[i % paymentStatuses.length],
        subtotal,
        deliveryFee,
        total,
        estimatedDelivery: new Date(Date.now() + 3600000), // +1 час
        items: {
          create: [
            {
              productId: product.id,
              variantId: variant.id,
              title: product.title + ` (${variant.size})`,
              price: product.basePrice + variant.price,
              quantity: 1 + (i % 3),
              addedIngredients:
                i % 2 === 0 ? JSON.stringify([{ id: bacon.id, name: "Бекон", price: 50 }]) : null,
            },
          ],
        },
      },
    });
    orders.push(order);

    // Обновим статистику клиента
    await prisma.client.update({
      where: { id: client.id },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
        lastOrderAt: new Date(),
      },
    });
  }

  console.log(`✅ Создано заказов: ${orders.length}`);

  // ========== ЗАВЕРШЕНИЕ ==========
  console.log("\n🎉 Сидирование успешно завершено!");
  console.log("📊 Создано всего:");
  console.log(`   👥 Пользователей: 3`);
  console.log(`   📂 Категорий: 5`);
  console.log(`   🧀 Ингредиентов: ${allIngredients.length}`);
  console.log(`   🍕 Пицц: ${createdPizzas.length}`);
  console.log(`   🥤 Напитков: ${createdDrinks.length}`);
  console.log(`   🍰 Десертов: ${createdDesserts.length}`);
  console.log(`   📏 Вариантов: ${allVariants.length}`);
  console.log(`   👤 Клиентов: ${allClients.length}`);
  console.log(`   🛒 Корзин: ${carts.length}`);
  console.log(`   📋 Заказов: ${orders.length}`);
  console.log("\n🚀 База данных готова для разработки!");

  // Выведем некоторые ID для удобства отладки
  console.log("\n🔑 Примеры ID для тестирования:");
  console.log(`   Админ ID: ${admin.id}`);
  console.log(`   Клиент 1 ID: ${client1.id}`);
  console.log(`   Пицца Маргарита ID: ${margarita.id}`);
  console.log(`   Вариант Маргарита 30см ID: ${margaritaSmall.id}`);
  console.log(`   Ингредиент Моцарелла ID: ${mozzarella.id}`);
}

main()
  .catch((error) => {
    console.error("❌ Ошибка сидирования:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
