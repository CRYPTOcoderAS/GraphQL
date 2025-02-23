const data = {
  products: [
    {
      _id: "1e2c1b29-ec24-40dc-b2fc-1a3c17c3093c",
      name: "Wear Mon",
      category: "Fashion",
      price: 269.93,
      stock: 152
    },
    {
      _id: "5af13f8d-d1cc-4d7a-bc64-89cf3154077d",
      name: "Wish Arou",
      category: "Electronics",
      price: 329.87,
      stock: 92
    },
    {
      _id: "34fad6ef-d906-44ce-ae7a-44453282b0e9",
      name: "Think Type",
      category: "Books",
      price: 228.67,
      stock: 17
    },
    {
      _id: "508220fc-2f77-414e-b9d6-120be0fca340",
      name: "Play Secur",
      category: "Electronics",
      price: 19.05,
      stock: 93
    },
    {
      _id: "61d60456-49df-483e-8dde-170938cd4caa",
      name: "Garden Ele",
      category: "Home App",
      price: 452.67,
      stock: 140
    },
    {
      _id: "3f696054-b1d1-4d8f-afa3-0ff3a63ff6b8",
      name: "Alone Los",
      category: "Home App",
      price: 243.08,
      stock: 8
    },
    {
      _id: "5879d4ff-3b7c-4dc1-884d-8077f25af099",
      name: "Owner Ide",
      category: "Fashion",
      price: 437.53,
      stock: 196
    },
    {
      _id: "f5abb3ad-a6c8-482e-a393-6a4598806404",
      name: "Rate Cup",
      category: "Fashion",
      price: 417.57,
      stock: 49
    },
    {
      _id: "570f3f7a-6ba2-4019-8caa-06709bf9ea71",
      name: "World Lea",
      category: "Electronics",
      price: 324.37,
      stock: 93
    },
    {
      _id: "77826add-203f-4e5e-8dc2-a01b5968a6af",
      name: "Believe Bo",
      category: "Books",
      price: 140.14,
      stock: 81
    }
  ],

  customers: [
    {
      _id: "7895595e-7f25-47fe-a6f8-94b31bfab736",
      name: "Alan Powell",
      email: "jolsen@example.net",
      age: 26,
      location: "South Tina",
      gender: "Female"
    },
    {
      _id: "a274321b-304d-49c8-ad20-3f7c3b3073fc",
      name: "Jennifer Allison",
      email: "qfleming@example.net",
      age: 27,
      location: "East Williammouth",
      gender: "Female"
    },
    {
      _id: "e7d22fe7-bee5-4507-bcb8-8b4b999dc9fd",
      name: "Amy Gillespie",
      email: "wperez@example.net",
      age: 60,
      location: "East Emily",
      gender: "Other"
    },
    {
      _id: "45f2def4-1923-4f48-8870-924b2955d39e",
      name: "Stephanie Barber",
      email: "hwilson@example.net",
      age: 20,
      location: "Gonzalesberg",
      gender: "Other"
    },
    {
      _id: "bb46046e-73c4-4b34-a5e3-6dd9f2dc90bf",
      name: "Kristen Parker",
      email: "brian57@example.com",
      age: 27,
      location: "North Jameschester",
      gender: "Other"
    }
  ],

  orders: [
    {
      _id: "06a714db-57ec-4af4-bd23-6e01ae764f14",
      customerId: "7895595e-7f25-47fe-a6f8-94b31bfab736",
      products: [
        {
          productId: "34fad6ef-d906-44ce-ae7a-44453282b0e9",
          quantity: 1,
          priceAtPurchase: 228.67
        },
        {
          productId: "508220fc-2f77-414e-b9d6-120be0fca340",
          quantity: 3,
          priceAtPurchase: 19.05
        }
      ],
      totalAmount: 285.82,
      orderDate: new Date("2024-12-08T10:35:58.471788"),
      status: "canceled"
    },
    {
      _id: "2d188162-8b01-408d-8c80-0283aecad77a",
      customerId: "adf96a4e-6987-4731-8798-09b109ff65c3",
      products: [
        {
          productId: "34fad6ef-d906-44ce-ae7a-44453282b0e9",
          quantity: 1,
          priceAtPurchase: 228.67
        },
        {
          productId: "570f3f7a-6ba2-4019-8caa-06709bf9ea71",
          quantity: 2,
          priceAtPurchase: 324.37
        }
      ],
      totalAmount: 877.41,
      orderDate: new Date("2024-12-15T10:35:58.471788"),
      status: "completed"
    },
    {
      _id: "bdf61875-ba2b-4141-8c5f-5c03081f4040",
      customerId: "e7d22fe7-bee5-4507-bcb8-8b4b999dc9fd",
      products: [
        {
          productId: "508220fc-2f77-414e-b9d6-120be0fca340",
          quantity: 4,
          priceAtPurchase: 19.05
        }
      ],
      totalAmount: 76.2,
      orderDate: new Date("2025-01-01T10:35:58.471788"),
      status: "completed"
    }
  ]
};

module.exports = data; 