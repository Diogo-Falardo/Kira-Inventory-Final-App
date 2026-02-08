# Items Displayer Component

### React Component

        Tech used:
        shadcn: not styled,
        tailwind

### Items displayer

        <ItemsDisplayer items={items} search={variable}>

#### ItemsDisplayer is a reusable grid component that renders a list of items.

       Input: items (array of "items"), plus optional search and filter strings.

       Behavior: it derives filteredItems by:
       - filtering by category when filter is provided
       - filtering by name when search is provided (case-insensitive)
       Output: a responsive grid of cards showing product name, price, image, and actions.

### Page.tsx

        Its only a render:
        - has the input and filter button "dropdown"
        - displays the items

## Run the project

        cd itemsDisplayer
        npm run dev
