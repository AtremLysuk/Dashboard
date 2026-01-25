// prisma/seed.ts
import { OrderStatus, PaymentStatus, PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function resetSequences() {
  console.log("Сбрасываем последовательности...");

  const tables = [
    "users",
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
      // Если таблица не существует или нет последовательности, игнорируем
      console.log(`ℹ️ Пропускаем ${table}`);
    }
  }
}

async function main() {
  console.log("Начинаем seeding...");

  // 1. Очищаем базу
  console.log("Очищаем базу данных...");

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

  console.log("База очищена");

  // 2. Сбрасываем последовательности
  await resetSequences();

  // 3. Создаем админов
  const hashedPassword = await hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@pizza.com",
      name: "Главный Админ",
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@pizza.com",
      name: "Менеджер Ресторана",
      passwordHash: hashedPassword,
      role: Role.MANAGER,
    },
  });

  console.log("Админы созданы");

  // 4. Создаем категории
  const categories = await prisma.category.createMany({
    data: [
      { name: "Пиццы", slug: "pizzas", order: 1 },
      { name: "Напитки", slug: "drinks", order: 2 },
      { name: "Завтраки", slug: "breakfasts", order: 3 },
      { name: "Десерты", slug: "desserts", order: 4 },
    ],
  });

  const pizzaCategory = await prisma.category.findFirst({ where: { slug: "pizzas" } });
  const drinksCategory = await prisma.category.findFirst({ where: { slug: "drinks" } });
  const breakfastCategory = await prisma.category.findFirst({ where: { slug: "breakfasts" } });
  const dessertsCategory = await prisma.category.findFirst({ where: { slug: "desserts" } });

  console.log("Категории созданы");

  // 5. Создаем ингредиенты
  await prisma.ingredient.createMany({
    data: [
      // Для пицц
      { name: "Моцарелла", slug: "mozzarella", price: 25.0 },
      { name: "Пармезан", slug: "parmesan", price: 30.0 },
      { name: "Чеддер", slug: "cheddar", price: 28.0 },
      { name: "Голубой сыр", slug: "blue-cheese", price: 35.0 },
      { name: "Салями", slug: "salami", price: 40.0 },
      { name: "Ветчина", slug: "ham", price: 35.0 },
      { name: "Пепперони", slug: "pepperoni", price: 45.0 },
      { name: "Курица", slug: "chicken", price: 38.0 },
      { name: "Бекон", slug: "bacon", price: 42.0 },
      { name: "Говядина", slug: "beef", price: 50.0 },
      { name: "Креветки", slug: "shrimp", price: 65.0 },
      { name: "Тунец", slug: "tuna", price: 55.0 },
      { name: "Грибы", slug: "mushrooms", price: 20.0 },
      { name: "Маслины", slug: "olives", price: 25.0 },
      { name: "Помидоры", slug: "tomatoes", price: 18.0 },
      { name: "Лук", slug: "onion", price: 15.0 },
      { name: "Перец болгарский", slug: "bell-pepper", price: 22.0 },
      { name: "Ананас", slug: "pineapple", price: 28.0 },
      { name: "Шпинат", slug: "spinach", price: 20.0 },
      { name: "Базилик", slug: "basil", price: 15.0 },
      { name: "Чеснок", slug: "garlic", price: 10.0 },
      { name: "Орегано", slug: "oregano", price: 12.0 },

      // Для десертов и завтраков
      { name: "Клубника", slug: "strawberry", price: 35.0 },
      { name: "Банан", slug: "banana", price: 20.0 },
      { name: "Шоколад", slug: "chocolate", price: 30.0 },
      { name: "Карамель", slug: "caramel", price: 25.0 },
      { name: "Мёд", slug: "honey", price: 20.0 },
      { name: "Сахарная пудра", slug: "powdered-sugar", price: 15.0 },
      { name: "Ваниль", slug: "vanilla", price: 18.0 },
      { name: "Корица", slug: "cinnamon", price: 12.0 },
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

  console.log("Ингредиенты созданы");

  // 6. Создаем 5 пицц
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
        variants: {
          create: pizza.variants,
        },
      },
    });

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

  console.log("Пиццы созданы");

  // 7. Создаем 5 напитков
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
    await prisma.product.create({
      data: {
        title: drink.title,
        slug: drink.slug,
        description: drink.description,
        imageUrl: drink.imageUrl,
        categoryId: drink.categoryId,
        variants: {
          create: drink.variants,
        },
      },
    });
  }

  console.log("Напитки созданы");

  // 8. Создаем 5 завтраков
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
        variants: {
          create: breakfast.variants,
        },
      },
    });

    // Добавляем ингредиенты для завтраков
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

  console.log("Завтраки созданы");

  // 9. Создаем 5 десертов
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
        variants: {
          create: dessert.variants,
        },
      },
    });

    // Добавляем ингредиенты для десертов
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

  console.log("Десерты созданы");

  // 10. Создаем 4 клиентов
  const clients = [
    {
      token: "client-token-001",
      name: "Иван Петров",
      phone: "+380991234567",
      email: "ivan@example.com",
    },
    {
      token: "client-token-002",
      name: "Мария Сидорова",
      phone: "+380992345678",
      email: "maria@example.com",
    },
    {
      token: "client-token-003",
      name: "Алексей Коваленко",
      phone: "+380993456789",
      email: "alex@example.com",
    },
    {
      token: "client-token-004",
      name: "Елена Иванова",
      phone: "+380994567890",
      email: "elena@example.com",
    },
  ];

  const createdClients = [];
  for (const clientData of clients) {
    const client = await prisma.client.create({
      data: clientData,
    });
    createdClients.push(client);
  }

  console.log("Клиенты созданы");

  // 11. Получаем все продукты и варианты для создания заказов
  const allProducts = await prisma.product.findMany({
    include: { variants: true },
  });

  // Функция для получения продукта по slug
  const getProduct = (slug: string) => {
    return allProducts.find((p) => p.slug === slug)!;
  };

  // Функция для получения варианта по индексу
  const getVariant = (productSlug: string, variantIndex: number = 0) => {
    return getProduct(productSlug).variants[variantIndex];
  };

  // 12. Создаем 8 разных заказов
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
          variantId: getVariant("pepperoni", 1).id, // 30см
          title: "Пепперони",
          description: "Острая пицца с пепперони и сыром",
          imageUrl: "/images/productsImages/pizzas/pepperoni.png",
          price: 279,
          quantity: 1,
        },
        {
          productId: getProduct("cola").id,
          variantId: getVariant("cola", 1).id, // 0.5л
          title: "Кола",
          description: "Освежающий газированный напиток",
          imageUrl: "/images/productsImages/drinks/cola.jpg",
          price: 69,
          quantity: 1,
        },
        {
          productId: getProduct("new-york-cheesecake").id,
          variantId: getVariant("new-york-cheesecake", 0).id, // Кусок
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
          variantId: getVariant("margherita", 2).id, // 35см
          title: "Маргарита",
          description: "Классическая итальянская пицца с моцареллой и томатами",
          imageUrl: "/images/productsImages/pizzas/mixpizza.png",
          price: 299,
          quantity: 2,
        },
        {
          productId: getProduct("orange-juice").id,
          variantId: getVariant("orange-juice", 1).id, // 0.5л
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
          variantId: getVariant("meat-lovers", 2).id, // 35см
          title: "Мясная",
          description: "Для настоящих мясоедов: салями, ветчина, бекон и курица",
          imageUrl: "/images/productsImages/pizzas/meat.png",
          price: 379,
          quantity: 1,
        },
        {
          productId: getProduct("hawaiian").id,
          variantId: getVariant("hawaiian", 1).id, // 30см
          title: "Гавайская",
          description: "Пицца с ветчиной и ананасом",
          imageUrl: "/images/productsImages/pizzas/havai.png",
          price: 269,
          quantity: 1,
        },
        {
          productId: getProduct("sprite").id,
          variantId: getVariant("sprite", 1).id, // 0.5л
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
          variantId: getVariant("margherita", 0).id, // 25см
          title: "Маргарита",
          description: "Классическая итальянская пицца с моцареллой и томатами",
          imageUrl: "/images/productsImages/pizzas/mixpizza.png",
          price: 199,
          quantity: 2,
        },
        {
          productId: getProduct("still-water").id,
          variantId: getVariant("still-water", 1).id, // 1л
          title: "Вода негазированная",
          description: "Чистая питьевая вода",
          imageUrl: "/images/productsImages/drinks/water.jpg",
          price: 49,
          quantity: 1,
        },
      ],
    },

    // Заказ 5: Гостевой заказ
    {
      orderNumber: `ORD-${timestamp}-005`,
      clientId: null,
      customerName: "Анонимный клиент",
      customerPhone: "+380995678901",
      customerEmail: null,
      deliveryAddress: "ул. Новая, 33",
      deliveryNotes: "Оставить у двери",
      status: OrderStatus.COMPLETED,
      subtotal: 696,
      total: 696,
      paymentStatus: PaymentStatus.PAID,
      notes: "Оплата наличными",
      items: [
        {
          productId: getProduct("four-cheese").id,
          variantId: getVariant("four-cheese", 2).id, // 35см
          title: "Четыре сыра",
          description: "Пицца с моцареллой, пармезаном, чеддером и голубым сыром",
          imageUrl: "/images/productsImages/pizzas/becon-cheese.png",
          price: 349,
          quantity: 2,
        },
      ],
    },

    // Заказ 6: Отменен
    {
      orderNumber: `ORD-${timestamp}-006`,
      clientId: createdClients[0].id,
      customerName: "Иван Петров",
      customerPhone: "+380991234567",
      customerEmail: "ivan@example.com",
      deliveryAddress: "ул. Главная, 10, кв. 5",
      deliveryNotes: "",
      status: OrderStatus.CANCELLED,
      subtotal: 398,
      total: 398,
      paymentStatus: PaymentStatus.REFUNDED,
      notes: "Отменен клиентом",
      items: [
        {
          productId: getProduct("ham-omelette").id,
          variantId: getVariant("ham-omelette", 1).id, // Большой
          title: "Омлет с ветчиной",
          description: "Пышный омлет с ветчиной и сыром",
          imageUrl: "/images/productsImages/breakfast/omlet-classic.png",
          price: 199,
          quantity: 2,
        },
      ],
    },

    // Заказ 7: Отклонен
    {
      orderNumber: `ORD-${timestamp}-007`,
      clientId: createdClients[1].id,
      customerName: "Мария Сидорова",
      customerPhone: "+380992345678",
      customerEmail: "maria@example.com",
      deliveryAddress: "ул. Центральная, 25, кв. 12",
      deliveryNotes: "",
      status: OrderStatus.REJECTED,
      subtotal: 219,
      total: 219,
      paymentStatus: PaymentStatus.FAILED,
      notes: "Не удалось подтвердить платеж",
      items: [
        {
          productId: getProduct("hawaiian").id,
          variantId: getVariant("hawaiian", 0).id, // 25см
          title: "Гавайская",
          description: "Пицца с ветчиной и ананасом",
          imageUrl: "/images/productsImages/pizzas/havai.png",
          price: 219,
          quantity: 1,
        },
      ],
    },

    // Заказ 8: Еще один новый заказ
    {
      orderNumber: `ORD-${timestamp}-008`,
      clientId: createdClients[2].id,
      customerName: "Алексей Коваленко",
      customerPhone: "+380993456789",
      customerEmail: "alex@example.com",
      deliveryAddress: "ул. Школьная, 45",
      deliveryNotes: "Срочный заказ",
      status: OrderStatus.NEW,
      subtotal: 1177,
      total: 1177,
      paymentStatus: PaymentStatus.PENDING,
      notes: "Большой заказ на компанию",
      items: [
        {
          productId: getProduct("pepperoni").id,
          variantId: getVariant("pepperoni", 2).id, // 35см
          title: "Пепперони",
          description: "Острая пицца с пепперони и сыром",
          imageUrl: "/images/productsImages/pizzas/pepperoni.png",
          price: 329,
          quantity: 2,
        },
        {
          productId: getProduct("margherita").id,
          variantId: getVariant("margherita", 1).id, // 30см
          title: "Маргарита",
          description: "Классическая итальянская пицца с моцареллой и томатами",
          imageUrl: "/images/productsImages/pizzas/mixpizza.png",
          price: 249,
          quantity: 1,
        },
        {
          productId: getProduct("fanta").id,
          variantId: getVariant("fanta", 1).id, // 0.5л
          title: "Фанта",
          description: "Апельсиновый газированный напиток",
          imageUrl: "/images/productsImages/drinks/fanta.jpg",
          price: 69,
          quantity: 3,
        },
        {
          productId: getProduct("tiramisu").id,
          variantId: getVariant("tiramisu", 1).id, // На двоих
          title: "Тирамису",
          description: "Итальянский десерт с кофе и маскарпоне",
          imageUrl: "/images/productsImages/desserts/tiramisu.jpg",
          price: 329,
          quantity: 1,
        },
      ],
    },
  ];

  // Создаем все заказы
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
        items: {
          create: orderData.items,
        },
      },
    });
  }

  // 13. Обновляем статистику клиентов
  for (let i = 0; i < createdClients.length; i++) {
    const client = createdClients[i];
    const clientOrders = orders.filter((order) => order.clientId === client.id);
    const totalSpent = clientOrders.reduce((sum, order) => sum + Number(order.total), 0);

    await prisma.client.update({
      where: { id: client.id },
      data: {
        totalOrders: clientOrders.length,
        totalSpent: totalSpent,
        lastOrderAt: clientOrders.length > 0 ? new Date() : null,
      },
    });
  }

  console.log("✅ 8 заказов созданы");
  console.log("✅ Seeding завершен успешно!");
}

main()
  .catch((e) => {
    console.error("Ошибка при seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
