import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ItemsDisplayer from "./itemsDisplayer";

// test data

const data = [
  {
    id: "prod1",
    name: "prodName1",
    imageUrl: "https://picsum.photos/200/300",
    price: 10,
    category: "category1",
  },
  {
    id: "prod2",
    name: "prodName2",
    imageUrl: "https://picsum.photos/200/300",
    price: 20,
    category: "category2",
  },
  {
    id: "prod3",
    name: "prodName3",
    imageUrl: "https://picsum.photos/200/300",
    price: 30,
    category: "category1",
  },
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex w-full min-h-screen justify-center items-center">
      <div className="w-200 h-200 bg-black/10">
        <ItemsDisplayer items={data} />
      </div>
    </div>
  </StrictMode>,
);
