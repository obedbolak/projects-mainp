// File: src/assets/bannerData/BannerData.ts

export interface BannerItem {
  _id: number;
  coverImageUri: string;
  cornerLabelColor: string;
  cornerLabelText: string;
}

export const BannerData: BannerItem[] = [
  {
    _id: 1,
    coverImageUri:
      "https://e-e-1.myshopify.com/cdn/shop/files/banner-1.jpg?v=1613529175",
    cornerLabelColor: "#FFD300",
    cornerLabelText: "GOTY",
  },
  {
    _id: 2,
    coverImageUri:
      "https://e-e-1.myshopify.com/cdn/shop/files/banner-0014_0eb2ac16-1bfc-42b9-b768-5a719cc4764e_large.png?v=1613530586",
    cornerLabelColor: "#0080ff",
    cornerLabelText: "NEW",
  },
  {
    _id: 3,
    coverImageUri:
      "https://e-e-1.myshopify.com/cdn/shop/files/banner-0013_032da6a1-ed5b-446c-838b-a7cb52eb6606_large.png?v=1613530587",
    cornerLabelColor: "#2ECC40",
    cornerLabelText: "-75%",
  },
  {
    _id: 4,
    coverImageUri:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cornerLabelColor: "#2ECC40",
    cornerLabelText: "-20%",
  },
];
