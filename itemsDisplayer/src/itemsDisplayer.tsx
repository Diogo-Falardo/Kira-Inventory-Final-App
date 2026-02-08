import { ShoppingBagIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

// type of the arrays
type TypeData = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
};

type ItemsDisplayerProps = {
  items: TypeData[];
  search?: string;
  filter?: string;
};

const ItemsDisplayer = ({ items, search, filter }: ItemsDisplayerProps) => {
  const filteredItems = items
    .filter((item) => (filter ? item.category === filter : true))
    .filter((item) =>
      search ? item.name.toLowerCase().includes(search.toLowerCase()) : true,
    );

  return (
    <div className="grid grid-cols-3 gap-4 p-4 grid-flow-row-dense">
      {filteredItems.map((i) => (
        <Card key={i.id} className="rounded-lg">
          <CardContent className="">
            {/* top */}
            <div className="flex px-2 justify-between items-start z-10">
              <h1 className="">{i.name}</h1>
              <h2 className="">{i.price}</h2>
            </div>
            {/* mid */}
            <div className="flex flex-1 items-center justify-center p-4">
              <img
                alt={i.name}
                className="max-h-full max-w-full object-contain rounded-md"
                src={i.imageUrl}
              />
            </div>
            {/* bottom */}
            <div className="px-2 flex justify-between items-center">
              <Button className="">Buy now</Button>
              <Button>
                <ShoppingBagIcon />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemsDisplayer;
