import { useState } from "react";

import ItemsDisplayer from "./itemsDisplayer";
import { Input } from "./components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";

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

const Page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const categories: string[] = Array.from(new Set(data.map((i) => i.category)));

  return (
    <div>
      <div className="flex flex-col w-full min-h-screen justify-center items-center gap-4">
        {/* searcher and filters */}
        <div className="w-200 flex justify-between">
          <Input
            placeholder="Search bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-100"
          ></Input>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter ? `Filter: ${filter}` : "Filters"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFilter(undefined)}>
                  All categories
                </DropdownMenuItem>

                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* renderer */}
        <div className="w-200 h-200 bg-black/10">
          <ItemsDisplayer items={data} search={search} filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default Page;
