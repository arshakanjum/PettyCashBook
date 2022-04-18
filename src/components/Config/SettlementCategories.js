const SettlementCategories = [
  { value: { type: "text", label: "Vehicle Number" }, label: "Petrol" },
  {
    value: {
        type: "creatable",
        label: "Site/Client/Project",
        collection: "Projects",
    },
    label: "Materials & Labors",
  },
  {
    value: {
      type: "radio",
      value: [
        { label: "Stationery", type: "text" },
        { label: "Tools & Consumables", type: "text" },
        { label: "Vehicle Expenses", type: "text" },
        { label: "Miscellaneous", type: "text" },
      ],
    },
    label: "Other Expenses",
  },
  { value: {}, label: "Employee Benefits" },
]


export default SettlementCategories